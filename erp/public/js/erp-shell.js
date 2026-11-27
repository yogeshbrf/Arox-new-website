/**
 * AROX ERP Shell Controller
 * - Desktop sidebar starts compact icon-only rail (unpinned, zero visible scrollbar)
 * - Hovering opens full sidebar with thin scrollbar; hover-off closes cleanly
 * - Clicking the top pin/layers button toggles sticky pin OR immediately collapses/hides when unpinned
 * - Mobile bottom navigation bar ("More" button opens drawer) + topbar profile dropdown
 */
(function () {
  if (typeof lucide !== 'undefined') {
    lucide.createIcons();
  }

  document.addEventListener('DOMContentLoaded', function () {
    var layout = document.querySelector('.erp-layout');
    var sidebar = document.querySelector('.erp-sidebar');
    var toggleBtn = document.getElementById('sidebar-toggle-btn') || document.getElementById('employee-sidebar-toggle-btn');
    var overlay = document.querySelector('.erp-sidebar-overlay');
    var pinKey = 'arox-sidebar-pinned';

    function syncPinState(pinned) {
      if (!sidebar) return;
      if (pinned) {
        sidebar.classList.add('sidebar-pinned');
        sidebar.classList.remove('collapsed', 'force-collapse');
        if (layout) layout.classList.add('sidebar-pinned');
      } else {
        sidebar.classList.remove('sidebar-pinned', 'collapsed');
        if (layout) layout.classList.remove('sidebar-pinned');
      }

      if (toggleBtn) {
        toggleBtn.classList.toggle('is-pinned', pinned);
        toggleBtn.setAttribute('aria-pressed', pinned ? 'true' : 'false');
        toggleBtn.setAttribute('title', pinned ? 'Unpin & Hide Sidebar' : 'Pin Sidebar Open');
      }
    }

    // Apply persisted pin state (default: unpinned / hidden compact icon rail)
    if (window.innerWidth > 768) {
      var savedPin = localStorage.getItem(pinKey) === 'true';
      syncPinState(savedPin);
    }

    // Add accessible tooltips for collapsed icon rail items
    if (sidebar) {
      sidebar.querySelectorAll('.erp-nav-item').forEach(function (item) {
        var label = item.querySelector('span');
        if (label && label.textContent && !item.getAttribute('title')) {
          item.setAttribute('title', label.textContent.trim());
        }
      });

      // Desktop hover-to-open, hover-off-to-close (only when not pinned and not just-unpinned)
      sidebar.addEventListener('mouseenter', function () {
        if (window.innerWidth > 768 && !sidebar.classList.contains('sidebar-pinned') && !sidebar.classList.contains('force-collapse')) {
          sidebar.classList.add('hover-open');
        }
      });

      sidebar.addEventListener('mouseleave', function () {
        sidebar.classList.remove('hover-open');
        sidebar.classList.remove('force-collapse');
      });
    }

    function openMobileSidebar() {
      if (!sidebar) return;
      sidebar.classList.remove('collapsed');
      sidebar.classList.add('mobile-open');
      if (overlay) overlay.classList.add('active');
      document.body.style.overflow = 'hidden';
    }

    function closeMobileSidebar() {
      if (!sidebar) return;
      sidebar.classList.remove('mobile-open');
      if (overlay) overlay.classList.remove('active');
      document.body.style.overflow = '';
    }

    if (toggleBtn && sidebar) {
      toggleBtn.addEventListener('click', function (e) {
        e.preventDefault();
        e.stopPropagation();
        if (window.innerWidth <= 768) {
          closeMobileSidebar();
          return;
        }
        var wasPinned = sidebar.classList.contains('sidebar-pinned');
        var nextPinned = !wasPinned;
        localStorage.setItem(pinKey, nextPinned ? 'true' : 'false');

        if (!nextPinned) {
          // Immediately hide/collapse expanded sidebar when unpinned even while cursor stays over toggle
          sidebar.classList.remove('hover-open');
          sidebar.classList.add('force-collapse');
        }
        syncPinState(nextPinned);
      });
    }

    // Bottom navigation "More" triggers mobile slide-over drawer
    document.querySelectorAll('[id$="-bottom-menu-btn"]').forEach(function (btn) {
      btn.addEventListener('click', function (e) {
        e.preventDefault();
        e.stopPropagation();
        openMobileSidebar();
      });
    });

    if (overlay) {
      overlay.addEventListener('click', closeMobileSidebar);
    }

    if (sidebar) {
      sidebar.querySelectorAll('.erp-nav-item').forEach(function (item) {
        item.addEventListener('click', function () {
          if (window.innerWidth <= 768) closeMobileSidebar();
        });
      });
    }

    window.addEventListener('resize', function () {
      if (window.innerWidth > 768) {
        closeMobileSidebar();
        syncPinState(localStorage.getItem(pinKey) === 'true');
      }
    });

    // Topbar profile dropdown (desktop + mobile)
    document.querySelectorAll('.erp-profile-wrapper').forEach(function (wrapper) {
      var trigger = wrapper.querySelector('.erp-profile-trigger');
      var menu = wrapper.querySelector('.erp-profile-dropdown');
      if (!trigger || !menu) return;

      trigger.addEventListener('click', function (e) {
        e.preventDefault();
        e.stopPropagation();
        var isOpen = menu.classList.toggle('open');
        trigger.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
      });
    });

    document.addEventListener('click', function (e) {
      document.querySelectorAll('.erp-profile-wrapper').forEach(function (wrapper) {
        if (!wrapper.contains(e.target)) {
          var menu = wrapper.querySelector('.erp-profile-dropdown');
          var trigger = wrapper.querySelector('.erp-profile-trigger');
          if (menu) menu.classList.remove('open');
          if (trigger) trigger.setAttribute('aria-expanded', 'false');
        }
      });
    });
  });
})();
