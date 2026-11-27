const zlib = require('zlib');

/**
 * Pure-Node Office & PDF attachment preview extractor (.xlsx, .docx, .pptx, .pdf).
 * Uses Node's built-in zlib so localhost/offline previews work without external viewers.
 */

function decodeXmlEntities(str) {
  if (!str) return '';
  return String(str)
    .replace(/&#x([0-9a-fA-F]+);/g, (_, hex) => {
      try { return String.fromCodePoint(parseInt(hex, 16)); } catch (e) { return ''; }
    })
    .replace(/&#(\d+);/g, (_, num) => {
      try { return String.fromCodePoint(parseInt(num, 10)); } catch (e) { return ''; }
    })
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&apos;/g, "'")
    .replace(/&amp;/g, '&');
}

function extractZipEntries(buf) {
  if (!Buffer.isBuffer(buf) || buf.length < 22) {
    throw new Error('Invalid or empty archive buffer.');
  }

  let eocdOffset = -1;
  const minOffset = Math.max(0, buf.length - 65557);
  for (let i = buf.length - 22; i >= minOffset; i--) {
    if (buf.readUInt32LE(i) === 0x06054b50) {
      eocdOffset = i;
      break;
    }
  }
  if (eocdOffset === -1) {
    throw new Error('Archive directory signature not found.');
  }

  const totalEntries = buf.readUInt16LE(eocdOffset + 10);
  const cdOffset = buf.readUInt32LE(eocdOffset + 16);
  const entries = new Map();
  let pos = cdOffset;

  for (let idx = 0; idx < totalEntries && pos + 46 <= buf.length; idx++) {
    if (buf.readUInt32LE(pos) !== 0x02014b50) break;
    const method = buf.readUInt16LE(pos + 10);
    const compressedSize = buf.readUInt32LE(pos + 20);
    const nameLen = buf.readUInt16LE(pos + 28);
    const extraLen = buf.readUInt16LE(pos + 30);
    const commentLen = buf.readUInt16LE(pos + 32);
    const localOffset = buf.readUInt32LE(pos + 42);
    const name = buf.toString('utf8', pos + 46, pos + 46 + nameLen).replace(/^\/+/, '');
    pos += 46 + nameLen + extraLen + commentLen;

    if (localOffset + 30 > buf.length || buf.readUInt32LE(localOffset) !== 0x04034b50) continue;
    const lNameLen = buf.readUInt16LE(localOffset + 26);
    const lExtraLen = buf.readUInt16LE(localOffset + 28);
    const dataStart = localOffset + 30 + lNameLen + lExtraLen;
    if (dataStart + compressedSize > buf.length) continue;

    const compressed = buf.subarray(dataStart, dataStart + compressedSize);
    entries.set(name, () => {
      if (method === 0) return compressed;
      if (method === 8) return zlib.inflateRawSync(compressed);
      throw new Error(`Unsupported ZIP compression method (${method}) for ${name}`);
    });
  }

  return {
    keys: () => Array.from(entries.keys()),
    has: (key) => entries.has(key),
    getText: (key) => {
      const loader = entries.get(key);
      if (!loader) return null;
      return loader().toString('utf8');
    }
  };
}

function colLettersToIndex(letters) {
  let col = 0;
  for (let i = 0; i < letters.length; i++) {
    col = col * 26 + (letters.charCodeAt(i) - 64);
  }
  return Math.max(0, col - 1);
}

function extractInlineTextTags(xmlChunk, tagRegex) {
  let out = '';
  let m;
  while ((m = tagRegex.exec(xmlChunk)) !== null) {
    out += decodeXmlEntities(m[1]);
  }
  return out;
}

function parseXlsxBuffer(buf) {
  const zip = extractZipEntries(buf);
  const sharedStrings = [];

  const ssXml = zip.getText('xl/sharedStrings.xml');
  if (ssXml) {
    const siRegex = /<(?:\w+:)?si\b[^>]*>([\s\S]*?)<\/(?:\w+:)?si>/gi;
    let siMatch;
    while ((siMatch = siRegex.exec(ssXml)) !== null) {
      sharedStrings.push(extractInlineTextTags(siMatch[1], /<(?:\w+:)?t\b[^>]*>([\s\S]*?)<\/(?:\w+:)?t>/gi));
    }
  }

  // Resolve sheet names <-> file paths
  const relMap = new Map();
  const relsXml = zip.getText('xl/_rels/workbook.xml.rels');
  if (relsXml) {
    const relRegex = /<Relationship\b([^>]*)\/?>/gi;
    let rm;
    while ((rm = relRegex.exec(relsXml)) !== null) {
      const attrs = rm[1];
      const idM = /\bId="([^"]+)"/i.exec(attrs);
      const tgtM = /\bTarget="([^"]+)"/i.exec(attrs);
      if (idM && tgtM) {
        let target = tgtM[1].replace(/^\/+/, '');
        if (!target.startsWith('xl/')) target = 'xl/' + target.replace(/^\.\//, '');
        relMap.set(idM[1], target);
      }
    }
  }

  const sheetSpecs = [];
  const wbXml = zip.getText('xl/workbook.xml');
  if (wbXml) {
    const sheetRegex = /<(?:\w+:)?sheet\b([^>]*)\/?>/gi;
    let sm;
    let idx = 1;
    while ((sm = sheetRegex.exec(wbXml)) !== null) {
      const attrs = sm[1];
      const nameM = /\bname="([^"]+)"/i.exec(attrs);
      const ridM = /\b(?:r:)?id="([^"]+)"/i.exec(attrs);
      const targetPath = (ridM && relMap.get(ridM[1])) || `xl/worksheets/sheet${idx}.xml`;
      if (zip.has(targetPath)) {
        sheetSpecs.push({ name: decodeXmlEntities(nameM ? nameM[1] : `Sheet ${idx}`), path: targetPath });
      }
      idx++;
    }
  }

  if (sheetSpecs.length === 0) {
    zip.keys()
      .filter(k => /^xl\/worksheets\/sheet\d+\.xml$/i.test(k))
      .sort((a, b) => {
        const na = parseInt((a.match(/\d+/) || ['0'])[0], 10);
        const nb = parseInt((b.match(/\d+/) || ['0'])[0], 10);
        return na - nb;
      })
      .forEach((p, idx) => sheetSpecs.push({ name: `Sheet ${idx + 1}`, path: p }));
  }

  const MAX_ROWS = 250;
  const MAX_COLS = 40;
  const sheets = sheetSpecs.map(spec => {
    const xml = zip.getText(spec.path) || '';
    const rawRows = [];
    let maxCols = 0;
    let truncated = false;

    const rowRegex = /<(?:\w+:)?row\b[^>]*>([\s\S]*?)<\/(?:\w+:)?row>/gi;
    let rowM;
    while ((rowM = rowRegex.exec(xml)) !== null) {
      if (rawRows.length >= MAX_ROWS) {
        truncated = true;
        break;
      }
      const rowMap = new Map();
      const cellRegex = /<(?:\w+:)?c\b([^>]*)>([\s\S]*?)<\/(?:\w+:)?c>/gi;
      let cm;
      let fallbackCol = 0;
      while ((cm = cellRegex.exec(rowM[1])) !== null) {
        const cAttrs = cm[1];
        const cBody = cm[2];
        const refM = /\br="([A-Za-z]+)\d+"/i.exec(cAttrs);
        const colIdx = refM ? colLettersToIndex(refM[1].toUpperCase()) : fallbackCol;
        fallbackCol = colIdx + 1;
        if (colIdx >= MAX_COLS) continue;

        const typeM = /\bt="([^"]+)"/i.exec(cAttrs);
        const cellType = typeM ? typeM[1] : '';
        let val = '';

        if (cellType === 'inlineStr' || /<(?:\w+:)?is\b/i.test(cBody)) {
          val = extractInlineTextTags(cBody, /<(?:\w+:)?t\b[^>]*>([\s\S]*?)<\/(?:\w+:)?t>/gi);
        } else {
          const vMatch = /<(?:\w+:)?v\b[^>]*>([\s\S]*?)<\/(?:\w+:)?v>/i.exec(cBody);
          const rawVal = vMatch ? vMatch[1] : '';
          if (cellType === 's') {
            const ssIdx = parseInt(rawVal, 10);
            val = Number.isInteger(ssIdx) && sharedStrings[ssIdx] !== undefined ? sharedStrings[ssIdx] : '';
          } else if (cellType === 'b') {
            val = rawVal.trim() === '1' ? 'TRUE' : 'FALSE';
          } else {
            val = decodeXmlEntities(rawVal.trim());
          }
        }
        rowMap.set(colIdx, val);
        if (colIdx + 1 > maxCols) maxCols = colIdx + 1;
      }
      rawRows.push(rowMap);
    }

    const colCount = Math.min(Math.max(maxCols, 1), MAX_COLS);
    const rows = rawRows.map(rm => {
      const arr = [];
      for (let c = 0; c < colCount; c++) {
        arr.push(rm.has(c) ? rm.get(c) : '');
      }
      return arr;
    });

    return { name: spec.name, rows, truncated };
  });

  return { type: 'xlsx', sheets };
}

function extractParagraphText(pXml) {
  const tokenRegex = /<w:(?:t\b[^>]*>([\s\S]*?)<\/w:t>|(tab|br)\b[^>]*\/?>)/gi;
  let text = '';
  let m;
  while ((m = tokenRegex.exec(pXml)) !== null) {
    if (m[1] !== undefined) text += decodeXmlEntities(m[1]);
    else if (m[2] === 'tab') text += '  ';
    else if (m[2] === 'br') text += '\n';
  }
  return text.trim();
}

function parseDocxBuffer(buf) {
  const zip = extractZipEntries(buf);
  const docXml = zip.getText('word/document.xml');
  if (!docXml) throw new Error('word/document.xml not found inside DOCX archive.');

  const bodyMatch = /<w:body\b[^>]*>([\s\S]*?)<\/w:body>/i.exec(docXml);
  const bodyXml = bodyMatch ? bodyMatch[1] : docXml;

  // Walk top-level <w:tbl> and <w:p> blocks cleanly without duplicating table paragraphs
  const blocks = [];
  let cursor = 0;
  while (cursor < bodyXml.length) {
    const nextTbl = bodyXml.indexOf('<w:tbl', cursor);
    const nextP = bodyXml.indexOf('<w:p', cursor);

    if (nextTbl === -1 && nextP === -1) break;

    if (nextTbl !== -1 && (nextP === -1 || nextTbl < nextP)) {
      // Find matching </w:tbl> accounting for potential nested tables
      let depth = 0;
      let scan = nextTbl;
      let tblEnd = -1;
      const tblTagRe = /<\/?w:tbl(?:\s|>)/gi;
      tblTagRe.lastIndex = scan;
      let tm;
      while ((tm = tblTagRe.exec(bodyXml)) !== null) {
        if (tm[0].startsWith('</')) {
          depth--;
          if (depth === 0) {
            tblEnd = tm.index + '</w:tbl>'.length;
            break;
          }
        } else {
          depth++;
        }
      }
      if (tblEnd === -1) break;
      const tblXml = bodyXml.slice(nextTbl, tblEnd);
      const rows = [];
      const trRe = /<w:tr\b[^>]*>([\s\S]*?)<\/w:tr>/gi;
      let trM;
      while ((trM = trRe.exec(tblXml)) !== null) {
        const cells = [];
        const tcRe = /<w:tc\b[^>]*>([\s\S]*?)<\/w:tc>/gi;
        let tcM;
        while ((tcM = tcRe.exec(trM[1])) !== null) {
          const cellParas = [];
          const cpRe = /<w:p(?:\s[^>]*)?>([\s\S]*?)<\/w:p>/gi;
          let cpM;
          while ((cpM = cpRe.exec(tcM[1])) !== null) {
            const pt = extractParagraphText(cpM[1]);
            if (pt) cellParas.push(pt);
          }
          cells.push(cellParas.join('\n'));
        }
        if (cells.length > 0) rows.push(cells);
      }
      if (rows.length > 0) blocks.push({ type: 'table', rows });
      cursor = tblEnd;
    } else {
      // Verify it's actually <w:p> or <w:p ...> and not <w:pPr> etc.
      const charAfter = bodyXml[nextP + 4];
      if (charAfter !== '>' && charAfter !== ' ' && charAfter !== '\t' && charAfter !== '\r' && charAfter !== '\n') {
        cursor = nextP + 4;
        continue;
      }
      const pEnd = bodyXml.indexOf('</w:p>', nextP);
      if (pEnd === -1) break;
      const pXml = bodyXml.slice(nextP, pEnd + 6);
      const styleM = /<w:pStyle\b[^>]*w:val="([^"]+)"/i.exec(pXml);
      const styleVal = styleM ? styleM[1] : '';
      const text = extractParagraphText(pXml);
      if (text) {
        let headingLevel = 0;
        if (/^(Heading(\d+)|Title)$/i.test(styleVal)) {
          headingLevel = /^Title$/i.test(styleVal) ? 1 : Math.min(4, parseInt((styleVal.match(/\d+/) || ['2'])[0], 10));
        }
        blocks.push(headingLevel > 0 ? { type: 'heading', level: headingLevel, text } : { type: 'paragraph', text });
      }
      cursor = pEnd + 6;
    }
  }

  return { type: 'docx', blocks };
}

function parsePptxBuffer(buf) {
  const zip = extractZipEntries(buf);
  const slideKeys = zip.keys()
    .filter(k => /^ppt\/slides\/slide\d+\.xml$/i.test(k))
    .sort((a, b) => {
      const na = parseInt((a.match(/\d+/) || ['0'])[0], 10);
      const nb = parseInt((b.match(/\d+/) || ['0'])[0], 10);
      return na - nb;
    });

  const slides = slideKeys.map((key, idx) => {
    const xml = zip.getText(key) || '';
    const lines = [];
    const pRe = /<a:p\b[^>]*>([\s\S]*?)<\/a:p>/gi;
    let pm;
    while ((pm = pRe.exec(xml)) !== null) {
      const text = extractInlineTextTags(pm[1], /<a:t\b[^>]*>([\s\S]*?)<\/a:t>/gi).trim();
      if (text) lines.push(text);
    }
    const slideNumber = parseInt((key.match(/\d+/) || [String(idx + 1)])[0], 10);
    return {
      slideNumber,
      title: lines[0] || `Slide ${slideNumber}`,
      lines: lines.slice(1)
    };
  });

  return { type: 'pptx', slides };
}

function buildDocumentPreview(fileBuffer, ext, originalName, rawUrl) {
  const cleanExt = String(ext || '').toLowerCase().replace(/^\./, '');
  if (cleanExt === 'pdf') {
    return { type: 'pdf', url: rawUrl, originalName };
  }
  if (cleanExt === 'xlsx') {
    return { ...parseXlsxBuffer(fileBuffer), originalName };
  }
  if (cleanExt === 'docx') {
    return { ...parseDocxBuffer(fileBuffer), originalName };
  }
  if (cleanExt === 'pptx') {
    return { ...parsePptxBuffer(fileBuffer), originalName };
  }
  return { type: 'unsupported', originalName, ext: cleanExt };
}

module.exports = {
  buildDocumentPreview,
  parseXlsxBuffer,
  parseDocxBuffer,
  parsePptxBuffer
};
