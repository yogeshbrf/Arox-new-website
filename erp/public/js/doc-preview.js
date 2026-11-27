/**
 * Shared in-browser document preview modal for Task Attachments & Documents
 * Supports .xlsx spreadsheets, .docx documents, .pptx slide decks, and .pdf embeds.
 */
(function () {
  function escHtml(str) {
    return String(str === undefined || str === null ? '' : str)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;');
  }

  function ensureModal() {
    let modal = document.getElementById('aroxDocPreviewModal');
    if (modal) return modal;

    modal = document.createElement('div');
    modal.id = 'aroxDocPreviewModal';
    modal.style.cssText = 'display:none;position:fixed;inset:0;background:rgba(15,23,42,0.68);z-index:99999;align-items:center;justify-content:center;padding:18px;backdrop-filter:blur(3px);';
    modal.innerHTML = `
      <div style="background:#fff;border-radius:14px;width:100%;max-width:960px;max-height:90vh;display:flex;flex-direction:column;overflow:hidden;box-shadow:0 25px 50px -12px rgba(0,0,0,0.35);">
        <div style="padding:14px 20px;border-bottom:1px solid #E2E8F0;display:flex;justify-content:space-between;align-items:center;gap:12px;background:#F8FAFC;">
          <div style="min-width:0;">
            <div id="aroxDocPreviewTitle" style="font-size:15px;font-weight:800;color:#0F172A;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;">Document Preview</div>
            <div id="aroxDocPreviewSub" style="font-size:11.5px;color:#64748B;margin-top:2px;">Loading attachment...</div>
          </div>
          <div style="display:flex;align-items:center;gap:8px;flex-shrink:0;">
            <a id="aroxDocDownloadLink" href="#" style="padding:6px 12px;border-radius:7px;background:#0F172A;color:#fff;font-size:12px;font-weight:700;text-decoration:none;display:inline-flex;align-items:center;gap:5px;">Download</a>
            <button type="button" id="aroxDocPreviewCloseBtn" style="padding:5px 10px;border:1px solid #CBD5E1;background:#fff;border-radius:7px;font-size:16px;font-weight:700;color:#475569;cursor:pointer;line-height:1;">&times;</button>
          </div>
        </div>
        <div id="aroxDocPreviewBody" style="flex:1;overflow:auto;padding:18px 20px;background:#FFFFFF;font-family:Inter,system-ui,sans-serif;"></div>
      </div>
    `;
    document.body.appendChild(modal);

    const closeModal = () => {
      modal.style.display = 'none';
      const body = document.getElementById('aroxDocPreviewBody');
      if (body) body.innerHTML = '';
    };
    document.getElementById('aroxDocPreviewCloseBtn').addEventListener('click', closeModal);
    modal.addEventListener('click', (e) => {
      if (e.target === modal) closeModal();
    });
    return modal;
  }

  function renderXlsx(preview, bodyEl) {
    const sheets = preview.sheets || [];
    if (sheets.length === 0) {
      bodyEl.innerHTML = '<div style="padding:28px;text-align:center;color:#64748B;">This Excel workbook has no visible worksheets.</div>';
      return;
    }

    const tabsHtml = sheets.length > 1
      ? `<div style="display:flex;gap:6px;flex-wrap:wrap;margin-bottom:12px;border-bottom:1px solid #E2E8F0;padding-bottom:8px;">
          ${sheets.map((s, idx) => `<button type="button" data-sheet-idx="${idx}" class="arox-xlsx-tab" style="padding:5px 12px;border-radius:6px;font-size:12px;font-weight:700;cursor:pointer;border:1px solid #CBD5E1;background:${idx === 0 ? '#0F172A' : '#F8FAFC'};color:${idx === 0 ? '#fff' : '#334155'};">${escHtml(s.name)}</button>`).join('')}
        </div>`
      : '';

    const containerHtml = sheets.map((s, idx) => {
      const rowsHtml = (s.rows && s.rows.length > 0)
        ? s.rows.map((r, rIdx) => `<tr>
            <td style="padding:6px 10px;background:#F8FAFC;color:#64748B;font-size:11px;font-weight:700;border:1px solid #E2E8F0;text-align:right;width:40px;">${rIdx + 1}</td>
            ${r.map(cell => rIdx === 0
              ? `<th style="padding:7px 10px;background:#F1F5F9;color:#0F172A;font-size:12px;font-weight:700;border:1px solid #E2E8F0;text-align:left;white-space:nowrap;">${escHtml(cell)}</th>`
              : `<td style="padding:6px 10px;color:#1E293B;font-size:12px;border:1px solid #E2E8F0;white-space:pre-wrap;">${escHtml(cell)}</td>`
            ).join('')}
          </tr>`).join('')
        : '<tr><td style="padding:20px;color:#64748B;text-align:center;">Empty sheet</td></tr>';

      return `<div data-sheet-panel="${idx}" style="display:${idx === 0 ? 'block' : 'none'};overflow:auto;">
        <table style="width:100%;border-collapse:collapse;border:1px solid #E2E8F0;">${rowsHtml}</table>
        ${s.truncated ? '<div style="font-size:11px;color:#64748B;margin-top:8px;">Showing first 250 rows. Download the file to view the full workbook.</div>' : ''}
      </div>`;
    }).join('');

    bodyEl.innerHTML = tabsHtml + containerHtml;
    bodyEl.querySelectorAll('.arox-xlsx-tab').forEach(btn => {
      btn.addEventListener('click', () => {
        const targetIdx = btn.getAttribute('data-sheet-idx');
        bodyEl.querySelectorAll('.arox-xlsx-tab').forEach(b => {
          const active = b.getAttribute('data-sheet-idx') === targetIdx;
          b.style.background = active ? '#0F172A' : '#F8FAFC';
          b.style.color = active ? '#fff' : '#334155';
        });
        bodyEl.querySelectorAll('[data-sheet-panel]').forEach(p => {
          p.style.display = p.getAttribute('data-sheet-panel') === targetIdx ? 'block' : 'none';
        });
      });
    });
  }

  function renderDocx(preview, bodyEl) {
    const blocks = preview.blocks || [];
    if (blocks.length === 0) {
      bodyEl.innerHTML = '<div style="padding:28px;text-align:center;color:#64748B;">No text content found in this Word document.</div>';
      return;
    }
    const html = blocks.map(b => {
      if (b.type === 'heading') {
        const sz = b.level === 1 ? '20px' : (b.level === 2 ? '17px' : '15px');
        return `<h3 style="margin:14px 0 6px;font-size:${sz};font-weight:800;color:#0F172A;">${escHtml(b.text)}</h3>`;
      }
      if (b.type === 'table') {
        return `<div style="overflow:auto;margin:12px 0;">
          <table style="width:100%;border-collapse:collapse;border:1px solid #CBD5E1;font-size:12.5px;">
            ${b.rows.map((r, rIdx) => `<tr>${r.map(c =>
              `<td style="padding:7px 10px;border:1px solid #E2E8F0;background:${rIdx === 0 ? '#F8FAFC' : '#fff'};font-weight:${rIdx === 0 ? '700' : '400'};color:#0F172A;white-space:pre-wrap;">${escHtml(c)}</td>`
            ).join('')}</tr>`).join('')}
          </table>
        </div>`;
      }
      return `<p style="margin:0 0 10px;font-size:13.5px;line-height:1.6;color:#1E293B;white-space:pre-wrap;">${escHtml(b.text)}</p>`;
    }).join('');
    bodyEl.innerHTML = `<div style="max-width:780px;margin:0 auto;padding:8px 4px;">${html}</div>`;
  }

  function renderPptx(preview, bodyEl) {
    const slides = preview.slides || [];
    if (slides.length === 0) {
      bodyEl.innerHTML = '<div style="padding:28px;text-align:center;color:#64748B;">No slides found in this PowerPoint deck.</div>';
      return;
    }
    bodyEl.innerHTML = `<div style="display:flex;flex-direction:column;gap:14px;">
      ${slides.map(sl => `
        <div style="border:1px solid #E2E8F0;border-radius:10px;padding:16px 20px;background:#F8FAFC;">
          <div style="font-size:11px;font-weight:800;text-transform:uppercase;color:#155EEF;margin-bottom:4px;">Slide ${sl.slideNumber}</div>
          <div style="font-size:15px;font-weight:800;color:#0F172A;margin-bottom:8px;">${escHtml(sl.title)}</div>
          ${sl.lines && sl.lines.length > 0
            ? `<ul style="margin:0;padding-left:18px;font-size:13px;color:#334155;line-height:1.55;">${sl.lines.map(l => `<li>${escHtml(l)}</li>`).join('')}</ul>`
            : ''}
        </div>
      `).join('')}
    </div>`;
  }

  window.openTaskAttachmentPreview = async function (taskId, ext, fileName) {
    const modal = ensureModal();
    const titleEl = document.getElementById('aroxDocPreviewTitle');
    const subEl = document.getElementById('aroxDocPreviewSub');
    const dlLink = document.getElementById('aroxDocDownloadLink');
    const bodyEl = document.getElementById('aroxDocPreviewBody');

    const cleanExt = String(ext || '').replace(/^\./, '').toUpperCase();
    titleEl.textContent = fileName || 'Task Document';
    subEl.textContent = cleanExt ? `${cleanExt} Document Preview` : 'Loading document...';
    dlLink.href = `/api/employee/tasks/${encodeURIComponent(taskId)}/attachment?download=1`;
    bodyEl.innerHTML = '<div style="padding:36px;text-align:center;color:#64748B;font-size:13px;">Loading document preview...</div>';
    modal.style.display = 'flex';

    try {
      const res = await fetch(`/api/employee/tasks/${encodeURIComponent(taskId)}/attachment/preview`, { credentials: 'same-origin' });
      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error((data && data.message) || 'Failed to generate preview');
      }
      const preview = data.preview || {};
      if (preview.type === 'pdf') {
        subEl.textContent = 'PDF Document Preview';
        bodyEl.innerHTML = `<iframe src="${escHtml(preview.url)}" style="width:100%;height:70vh;border:1px solid #E2E8F0;border-radius:8px;background:#F8FAFC;"></iframe>`;
      } else if (preview.type === 'xlsx') {
        subEl.textContent = `Excel Spreadsheet (${(preview.sheets || []).length} sheet${(preview.sheets || []).length === 1 ? '' : 's'})`;
        renderXlsx(preview, bodyEl);
      } else if (preview.type === 'docx') {
        subEl.textContent = 'Word Document (.docx)';
        renderDocx(preview, bodyEl);
      } else if (preview.type === 'pptx') {
        subEl.textContent = `PowerPoint Presentation (${(preview.slides || []).length} slides)`;
        renderPptx(preview, bodyEl);
      } else {
        bodyEl.innerHTML = '<div style="padding:32px;text-align:center;color:#64748B;">Preview is unavailable for this format. Please click <strong>Download</strong> above to view it locally.</div>';
      }
    } catch (err) {
      bodyEl.innerHTML = `<div style="padding:28px;text-align:center;color:#B91C1C;">Could not render preview: ${escHtml(err.message)}. You can still download the file above.</div>`;
    }
  };
})();
