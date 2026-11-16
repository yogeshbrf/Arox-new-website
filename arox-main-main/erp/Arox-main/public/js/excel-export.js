/**
 * AROX ERP — Universal Filtered Details Excel Exporter (.xlsx)
 * Adds a "Download Excel" button (without checkboxes) on all details-showing
 * pages across both Admin and Employee panels. Clicking it immediately downloads
 * the currently visible/filtered records shown on the screen.
 */
(function () {
  'use strict';

  const EXCLUDED_PATH_PREFIXES = [
    '/admin/dashboard',
    '/admin/generators',
    '/admin/profile',
    '/admin/settings',
    '/employee/dashboard',
    '/employee/performance',
    '/employee/profile',
    '/employee/settings'
  ];

  function isDetailsPage() {
    const path = (window.location.pathname || '').replace(/\/+$/, '');
    if (!path.startsWith('/admin') && !path.startsWith('/employee')) return false;

    for (let i = 0; i < EXCLUDED_PATH_PREFIXES.length; i++) {
      if (path === EXCLUDED_PATH_PREFIXES[i] || path.startsWith(EXCLUDED_PATH_PREFIXES[i] + '/')) {
        return false;
      }
    }

    // Exclude single-record detail pages like /admin/students/123 or /admin/registrations/45
    if (/^\/admin\/(students|registrations)\/\d+/.test(path)) {
      return false;
    }

    const hasToolbar = !!document.querySelector('.catalogue-toolbar');
    const hasTable = !!findPrimaryTable();
    const isKanbanLeads = path === '/admin/leads' || path === '/employee/leads';
    const isFollowUps = path === '/admin/follow-ups' || path === '/employee/follow-ups';
    return hasToolbar || hasTable || isKanbanLeads || isFollowUps;
  }

  function findPrimaryTable() {
    const listTable = document.querySelector('.catalogue-list-view table');
    if (listTable) return listTable;

    const tables = Array.from(document.querySelectorAll('.erp-content table, main table'));
    return tables.find(t => {
      // Skip tables inside hidden modals
      if (t.closest('[id*="Modal"], [id*="modal"]')) return false;
      return t.querySelector('thead th') && t.querySelector('tbody');
    }) || null;
  }

  function getPageEntityName() {
    const path = (window.location.pathname || '').replace(/\/+$/, '');
    const parts = path.split('/').filter(Boolean);
    const raw = parts[parts.length - 1] || 'Details';
    return raw
      .split('-')
      .map(w => w.charAt(0).toUpperCase() + w.slice(1))
      .join('_');
  }

  function showToast(message, type) {
    let container = document.getElementById('erp-excel-toast-container');
    if (!container) {
      container = document.createElement('div');
      container.id = 'erp-excel-toast-container';
      container.style.cssText = 'position:fixed;bottom:24px;right:24px;z-index:99999;display:flex;flex-direction:column;gap:8px;max-width:360px;';
      document.body.appendChild(container);
    }

    const toast = document.createElement('div');
    const isWarn = type === 'warn';
    const isErr = type === 'error';
    const bg = isErr ? '#DC2626' : isWarn ? '#0F172A' : '#107C41';
    toast.style.cssText = `background:${bg};color:#FFFFFF;padding:12px 16px;border-radius:10px;font-size:13px;font-weight:600;box-shadow:0 10px 25px rgba(0,0,0,0.18);display:flex;align-items:center;gap:10px;opacity:0;transform:translateY(8px);transition:all 0.22s ease;`;
    toast.textContent = message;
    container.appendChild(toast);

    requestAnimationFrame(() => {
      toast.style.opacity = '1';
      toast.style.transform = 'translateY(0)';
    });

    setTimeout(() => {
      toast.style.opacity = '0';
      toast.style.transform = 'translateY(8px)';
      setTimeout(() => toast.remove(), 240);
    }, 3200);
  }

  function extractCellText(td) {
    if (!td) return '';

    const selectEl = td.querySelector('select');
    if (selectEl && selectEl.selectedIndex >= 0) {
      return (selectEl.options[selectEl.selectedIndex].text || '').trim();
    }

    const clone = td.cloneNode(true);
    clone.querySelectorAll('svg, script, style, input, .sr-only').forEach(el => el.remove());

    clone.querySelectorAll('br').forEach(br => br.replaceWith(' | '));
    clone.querySelectorAll('div, p, li').forEach(block => {
      if (block.textContent && block.textContent.trim()) {
        block.insertAdjacentText('afterend', ' | ');
      }
    });

    let text = (clone.textContent || '')
      .replace(/[→←]/g, '')
      .replace(/\s+/g, ' ')
      .trim();
    text = text.replace(/(\s*\|\s*)+/g, ' | ').replace(/^\|\s*|\s*\|$/g, '').trim();
    return text;
  }

  function isDataRow(tr) {
    if (!tr || tr.classList.contains('empty-state-row')) return false;
    const cells = tr.querySelectorAll('td');
    if (cells.length === 1 && cells[0].hasAttribute('colspan')) return false;
    return cells.length > 0;
  }

  function isRowVisible(tr) {
    return tr.style.display !== 'none' && !tr.hidden;
  }

  function downloadAoaAsExcel(headers, rowsData) {
    const entityName = getPageEntityName();
    const dateStr = new Date().toISOString().slice(0, 10);
    const filename = `AROX_${entityName}_${dateStr}.xlsx`;
    const sheetName = entityName.slice(0, 31) || 'Details';

    if (window.XLSX && window.XLSX.utils) {
      const aoa = [headers, ...rowsData];
      const ws = window.XLSX.utils.aoa_to_sheet(aoa);

      // Auto-size columns cleanly
      ws['!cols'] = headers.map((h, cIdx) => {
        let maxLen = String(h || '').length;
        rowsData.forEach(r => {
          const val = String(r[cIdx] || '');
          if (val.length > maxLen) maxLen = val.length;
        });
        return { wch: Math.min(Math.max(maxLen + 4, 14), 50) };
      });

      const wb = window.XLSX.utils.book_new();
      window.XLSX.utils.book_append_sheet(wb, ws, sheetName);
      window.XLSX.writeFile(wb, filename);
    } else {
      const escapeCsv = (val) => '"' + String(val || '').replace(/"/g, '""') + '"';
      const csvLines = [headers.map(escapeCsv).join(',')].concat(
        rowsData.map(r => r.map(escapeCsv).join(','))
      );
      const blob = new Blob(['\uFEFF' + csvLines.join('\r\n')], { type: 'text/csv;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = filename.replace(/\.xlsx$/, '.csv');
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    }

    showToast(`Downloaded ${rowsData.length} record${rowsData.length === 1 ? '' : 's'} as Excel.`);
  }

  function exportTableToExcel(table) {
    const tbody = table.querySelector('tbody');
    if (!tbody) return false;
    const visibleRows = Array.from(tbody.querySelectorAll('tr')).filter(tr => isDataRow(tr) && isRowVisible(tr));
    if (visibleRows.length === 0) {
      showToast('No visible records to download.', 'warn');
      return true;
    }

    const headerCells = Array.from(table.querySelectorAll('thead tr th'));
    const exportColIndices = [];
    const headers = [];

    headerCells.forEach((th, idx) => {
      const label = (th.innerText || th.textContent || '').replace(/\s+/g, ' ').trim();
      const lower = label.toLowerCase();
      if (!label || lower.includes('action') || lower === 'screenshot') return;
      exportColIndices.push(idx);
      headers.push(label);
    });

    if (exportColIndices.length === 0) {
      showToast('No exportable columns found in this table.', 'error');
      return true;
    }

    const rowsData = visibleRows.map(tr => {
      const cells = Array.from(tr.querySelectorAll('td'));
      return exportColIndices.map(colIdx => extractCellText(cells[colIdx]));
    });

    downloadAoaAsExcel(headers, rowsData);
    return true;
  }

  function exportKanbanLeadsFallback() {
    const path = (window.location.pathname || '').replace(/\/+$/, '');
    if (path !== '/admin/leads' && path !== '/employee/leads') return false;

    const cards = Array.from(document.querySelectorAll('.erp-content .erp-card')).filter(card => {
      if (card.closest('form') || card.closest('.erp-grid-4')) return false;
      return !!card.querySelector('h4') && !!card.querySelector('select');
    });

    if (cards.length === 0) {
      showToast('No visible leads to download.', 'warn');
      return true;
    }

    const headers = ['Lead ID', 'Deal Title', 'Company / Contact', 'Deal Value', 'Stage', 'Meta'];
    const rowsData = cards.map(card => {
      const spans = Array.from(card.querySelectorAll('span'));
      const leadId = spans[0] ? spans[0].textContent.trim() : '';
      const badge = spans[1] ? spans[1].textContent.trim() : '';
      const title = card.querySelector('h4') ? card.querySelector('h4').textContent.trim() : '';
      const sub = card.querySelector('div[style*="color: #475569"], div[style*="color: #64748B"]')
        ? card.querySelector('div[style*="color: #475569"], div[style*="color: #64748B"]').textContent.replace(/\s+/g, ' ').trim()
        : '';
      const sel = card.querySelector('select');
      const stage = sel && sel.selectedIndex >= 0 ? sel.options[sel.selectedIndex].text.trim() : '';
      const valEl = Array.from(card.querySelectorAll('div, span')).find(el => el.textContent.trim().startsWith('₹'));
      const value = valEl ? valEl.textContent.trim() : '';
      return [leadId, title, sub, value, stage, badge];
    });

    downloadAoaAsExcel(headers, rowsData);
    return true;
  }

  function exportFollowUpsCardsFallback() {
    const path = (window.location.pathname || '').replace(/\/+$/, '');
    if (path !== '/employee/follow-ups') return false;

    const cards = Array.from(document.querySelectorAll('.erp-content .erp-card')).filter(card => {
      return !!card.querySelector('h3');
    });

    if (cards.length === 0) {
      showToast('No visible follow-ups to download.', 'warn');
      return true;
    }

    const headers = ['Follow-Up Title', 'Details'];
    const rowsData = cards.map(card => {
      const title = card.querySelector('h3') ? card.querySelector('h3').textContent.trim() : '';
      const details = extractCellText(card);
      return [title, details];
    });

    downloadAoaAsExcel(headers, rowsData);
    return true;
  }

  function createExportButton() {
    const btn = document.createElement('button');
    btn.type = 'button';
    btn.id = 'erp-excel-export-btn';
    btn.title = 'Download current filtered details as Excel (.xlsx)';
    btn.style.cssText = [
      'display:inline-flex',
      'align-items:center',
      'gap:7px',
      'height:38px',
      'padding:0 14px',
      'background:#107C41',
      'color:#FFFFFF',
      'border:1px solid #0E6B37',
      'border-radius:8px',
      'font-size:12.5px',
      'font-weight:700',
      'cursor:pointer',
      'white-space:nowrap',
      'box-shadow:0 1px 2px rgba(16,124,65,0.18)',
      'transition:background 0.15s ease'
    ].join(';');

    btn.innerHTML = '<i data-lucide="file-spreadsheet" style="width:15px;height:15px;flex-shrink:0;"></i><span class="excel-btn-label">Download Excel</span>';

    btn.addEventListener('mouseenter', () => {
      btn.style.background = '#0E6B37';
    });
    btn.addEventListener('mouseleave', () => {
      btn.style.background = '#107C41';
    });

    return btn;
  }

  function placeExportButton(btn) {
    // 1. Pages with .catalogue-toolbar
    const toolbar = document.querySelector('.catalogue-toolbar');
    if (toolbar) {
      const directBadge = Array.from(toolbar.children).find(el => el.classList.contains('catalogue-count-badge'));
      if (directBadge) {
        toolbar.insertBefore(btn, directBadge);
        return;
      }
      const nestedBadge = toolbar.querySelector('.catalogue-count-badge');
      if (nestedBadge && nestedBadge.parentNode) {
        nestedBadge.parentNode.insertBefore(btn, nestedBadge);
        return;
      }
      toolbar.appendChild(btn);
      return;
    }

    // 2. Pages with .erp-h1 header bar (e.g. /admin/reports, /admin/performance, /employee/leads, /employee/students)
    const header = document.querySelector('.erp-h1');
    if (header) {
      if (header.children.length >= 2) {
        const lastChild = header.lastElementChild;
        if (lastChild && lastChild.tagName === 'DIV' && getComputedStyle(lastChild).display === 'flex') {
          lastChild.insertBefore(btn, lastChild.firstChild);
        } else {
          const rightWrap = document.createElement('div');
          rightWrap.style.cssText = 'display:flex;align-items:center;gap:10px;flex-wrap:wrap;';
          header.replaceChild(rightWrap, lastChild);
          rightWrap.appendChild(btn);
          rightWrap.appendChild(lastChild);
        }
      } else {
        header.appendChild(btn);
      }
      return;
    }

    // 3. Pages with <h1> inside flex header (e.g. /admin/leads, /admin/follow-ups)
    const h1 = document.querySelector('.erp-content h1');
    if (h1 && h1.parentElement && h1.parentElement.parentElement) {
      const flexHeader = h1.parentElement.parentElement;
      const rightGroup = flexHeader.children.length >= 2 ? flexHeader.lastElementChild : null;
      if (rightGroup && rightGroup.tagName === 'DIV') {
        rightGroup.insertBefore(btn, rightGroup.firstChild);
      } else {
        flexHeader.appendChild(btn);
      }
      return;
    }

    // 4. Fallback right above table
    const table = findPrimaryTable();
    if (table && table.parentElement && table.parentElement.parentElement) {
      const wrap = document.createElement('div');
      wrap.style.cssText = 'display:flex;justify-content:flex-end;margin-bottom:12px;';
      wrap.appendChild(btn);
      table.parentElement.parentElement.insertBefore(wrap, table.parentElement);
    }
  }

  function initExcelExport() {
    if (!isDetailsPage()) return;
    if (document.getElementById('erp-excel-export-btn')) return;

    const table = findPrimaryTable();
    const btn = createExportButton();
    placeExportButton(btn);

    if (window.lucide) {
      try { window.lucide.createIcons(); } catch (e) {}
    }

    btn.addEventListener('click', () => {
      const currentTable = findPrimaryTable() || table;
      if (currentTable && exportTableToExcel(currentTable)) return;
      if (exportKanbanLeadsFallback()) return;
      if (exportFollowUpsCardsFallback()) return;
      showToast('No visible details found to download.', 'warn');
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initExcelExport);
  } else {
    initExcelExport();
  }
})();
