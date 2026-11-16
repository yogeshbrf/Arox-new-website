/**
 * AROX ERP — Universal Catalogue Controller
 * Provides seamless instant client-side filtering, multi-criteria filtering,
 * smart sorting, and Apple + Google Material 3 List vs Kanban (Grid) view switching.
 */

(function () {
  'use strict';

  function initCatalogue(toolbar) {
    const catalogueId = toolbar.getAttribute('data-catalogue') || 'default';
    const listView = document.querySelector(`.catalogue-list-view[data-catalogue="${catalogueId}"]`) || document.querySelector('.catalogue-list-view');
    const kanbanView = document.querySelector(`.catalogue-kanban-view[data-catalogue="${catalogueId}"]`) || document.querySelector('.catalogue-kanban-view');

    const searchInput = toolbar.querySelector('.catalogue-search-input');
    const filterSelects = Array.from(toolbar.querySelectorAll('.catalogue-select[data-filter]:not([data-filter="sort"])'));
    const sortSelect = toolbar.querySelector('.catalogue-select[data-filter="sort"]');
    const resetBtn = toolbar.querySelector('.catalogue-reset-btn');
    const countBadge = toolbar.querySelector('.catalogue-count-badge');

    const listBtn = toolbar.querySelector('.view-btn[data-view="list"]');
    const kanbanBtn = toolbar.querySelector('.view-btn[data-view="kanban"]');

    // 1. View Switching Logic with localStorage persistence
    const savedView = localStorage.getItem('arox_view_' + catalogueId) || 'list';
    setView(savedView);

    if (listBtn) {
      listBtn.addEventListener('click', () => setView('list'));
    }
    if (kanbanBtn) {
      kanbanBtn.addEventListener('click', () => setView('kanban'));
    }

    function setView(viewMode) {
      localStorage.setItem('arox_view_' + catalogueId, viewMode);
      if (viewMode === 'kanban') {
        if (listView) listView.style.display = 'none';
        if (kanbanView) kanbanView.style.display = 'grid';
        if (kanbanBtn) kanbanBtn.classList.add('active');
        if (listBtn) listBtn.classList.remove('active');
      } else {
        if (kanbanView) kanbanView.style.display = 'none';
        if (listView) listView.style.display = 'block';
        if (listBtn) listBtn.classList.add('active');
        if (kanbanBtn) kanbanBtn.classList.remove('active');
      }
      if (window.lucide) {
        try { window.lucide.createIcons(); } catch (e) {}
      }
    }

    // 2. Universal Live Filtering Logic
    function applyFilters() {
      const query = (searchInput ? searchInput.value : '').toLowerCase().trim();

      // Gather all active select filters
      const activeFilters = filterSelects.map(sel => ({
        attr: sel.getAttribute('data-filter'),
        value: sel.value.toLowerCase().trim()
      })).filter(f => f.value && f.value !== 'all');

      let listVisible = 0;
      let listTotal = 0;

      // Filter Table Rows
      if (listView) {
        const rows = listView.querySelectorAll('tbody tr:not(.empty-state-row)');
        listTotal = rows.length;

        rows.forEach(row => {
          const text = (row.getAttribute('data-search') || row.innerText || '').toLowerCase();
          const matchesQuery = !query || text.includes(query);

          const matchesAllSelects = activeFilters.every(f => {
            const attrVal = (
              row.getAttribute('data-' + f.attr) ||
              (f.attr === 'category' ? row.getAttribute('data-department') : '') ||
              ''
            ).toLowerCase();
            return attrVal === f.value || attrVal.includes(f.value);
          });

          if (matchesQuery && matchesAllSelects) {
            row.style.display = '';
            listVisible++;
          } else {
            row.style.display = 'none';
          }
        });

        const emptyRow = listView.querySelector('.empty-state-row');
        if (emptyRow) {
          emptyRow.style.display = listVisible === 0 ? '' : 'none';
        }
      }

      // Filter Kanban Cards
      let kanbanVisible = 0;
      let kanbanTotal = 0;
      if (kanbanView) {
        const cards = kanbanView.querySelectorAll('.kanban-item-card:not(.kanban-empty-state)');
        kanbanTotal = cards.length;

        cards.forEach(card => {
          const text = (card.getAttribute('data-search') || card.innerText || '').toLowerCase();
          const matchesQuery = !query || text.includes(query);

          const matchesAllSelects = activeFilters.every(f => {
            const attrVal = (
              card.getAttribute('data-' + f.attr) ||
              (f.attr === 'category' ? card.getAttribute('data-department') : '') ||
              ''
            ).toLowerCase();
            return attrVal === f.value || attrVal.includes(f.value);
          });

          if (matchesQuery && matchesAllSelects) {
            card.style.display = 'flex';
            kanbanVisible++;
          } else {
            card.style.display = 'none';
          }
        });

        const emptyCard = kanbanView.querySelector('.kanban-empty-state');
        if (emptyCard) {
          emptyCard.style.display = kanbanVisible === 0 ? 'block' : 'none';
        }
      }

      // Update Result Counter
      if (countBadge) {
        const vis = listView && listView.style.display !== 'none' ? listVisible : kanbanVisible;
        const tot = listView && listView.style.display !== 'none' ? listTotal : kanbanTotal;
        countBadge.textContent = `Showing ${vis} of ${tot || listTotal || kanbanTotal}`;
      }
    }

    // 3. Smart Multi-Type Sorting Helper
    function applySorting(criterion) {
      if (!criterion) return;

      const compareFn = (a, b) => {
        let aVal = (a.getAttribute('data-' + criterion) || a.getAttribute('data-sort') || a.innerText).trim().toLowerCase();
        let bVal = (b.getAttribute('data-' + criterion) || b.getAttribute('data-sort') || b.innerText).trim().toLowerCase();

        // Check if numeric comparison
        const aNum = parseFloat(aVal.replace(/[^0-9.-]/g, ''));
        const bNum = parseFloat(bVal.replace(/[^0-9.-]/g, ''));
        const isNumeric = !isNaN(aNum) && !isNaN(bNum) && (criterion.includes('amount') || criterion.includes('price') || criterion.includes('rating') || criterion.includes('percent'));

        if (criterion.includes('desc') || criterion === 'newest' || criterion.includes('high')) {
          if (isNumeric) return bNum - aNum;
          return bVal.localeCompare(aVal);
        } else {
          if (isNumeric) return aNum - bNum;
          return aVal.localeCompare(bVal);
        }
      };

      if (listView) {
        const tbody = listView.querySelector('tbody');
        if (tbody) {
          const rows = Array.from(tbody.querySelectorAll('tr:not(.empty-state-row)'));
          rows.sort(compareFn);
          rows.forEach(r => tbody.appendChild(r));
        }
      }

      if (kanbanView) {
        const cards = Array.from(kanbanView.querySelectorAll('.kanban-item-card:not(.kanban-empty-state)'));
        cards.sort(compareFn);
        cards.forEach(c => kanbanView.appendChild(c));
      }
    }

    // Attach Event Listeners
    if (searchInput) {
      searchInput.addEventListener('input', applyFilters);
    }

    filterSelects.forEach(sel => {
      sel.addEventListener('change', applyFilters);
    });

    if (sortSelect) {
      sortSelect.addEventListener('change', () => {
        applySorting(sortSelect.value);
        applyFilters();
      });
    }

    if (resetBtn) {
      resetBtn.addEventListener('click', () => {
        if (searchInput) searchInput.value = '';
        filterSelects.forEach(sel => { sel.value = 'all'; });
        if (sortSelect) sortSelect.selectedIndex = 0;
        applyFilters();
      });
    }

    // Initial run
    applyFilters();
  }

  // Auto-initialize all catalogue toolbars on DOM load
  document.addEventListener('DOMContentLoaded', () => {
    document.querySelectorAll('.catalogue-toolbar').forEach(initCatalogue);
  });
})();
