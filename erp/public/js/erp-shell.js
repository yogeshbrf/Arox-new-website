/**
 * AROX ERP Shell Controller
 * Unified Sidebar (auto-hidden icon rail, hover expand/collapse, click pin toggle)
 * + Mobile drawer + Mobile/Desktop topbar profile dropdown.
 */
(function () {
  if (typeof lucide !== 'undefined') {
    lucide.createIcons();
  }

  document.addEventListener('DOMContentLoaded', function () {
    var layout = document.querySelector('.erp-layout');
    var sidebar = document.querySelector('.erp-sidebar');
    var toggleBtn = document.getElementById('sidebar-toggle-btn') || document.getElementById('employee-sidebar-toggle-btn');
    var toggleIcon = document.getElementById('sidebar-toggle-icon') || document.getElementById('employee-sidebar-toggle-icon');
    var mobileToggle = document.querySelector('.erp-mobile-toggle');
    var overlay = document.querySelector('.erp-sidebar-overlay');
    var pinKey = 'arox-sidebar-pinned';

    function syncPinState(pinned) {
      if (!sidebar) return;
      if (pinned) {
        sidebar.classList.add('sidebar-pinned');
        sidebar.classList.remove('collapsed');
        if (layout) layout.classList.add('sidebar-pinned');
      } else {
        sidebar.classList.remove('sidebar-pinned');
        sidebar.classList.remove('collapsed');
        if (layout) layout.classList.remove('sidebar-pinned');
      }

      if (toggleBtn) {
        toggleBtn.classList.toggle('is-pinned', pinned);
        toggleBtn.setAttribute('aria-pressed', pinned ? 'true' : 'false');
        toggleBtn.setAttribute('title', pinned ? 'Unpin Sidebar (Auto-hide on hover)' : 'Pin Sidebar Open');
      }
      if (toggleIcon) {
        toggleIcon.setAttribute('data-lucide', pinned ? 'pin-off' : 'pin');
        if (typeof lucide !== 'undefined') lucide.createIcons();
      }
    }

    // Apply persisted pin state (default: unpinned / auto-hidden icon rail)
    if (window.innerWidth > 768) {
      var savedPin = localStorage.getItem(pinKey) === 'true';
      syncPinState(savedPin);
    }

    // Add accessible title tooltips for collapsed icon rail items
    if (sidebar) {
      sidebar.querySelectorAll('.erp-nav-item').forEach(function (item) {
        var label = item.querySelector('span');
        if (label && label.textContent && !item.getAttribute('title')) {
          item.setAttribute('title', label.textContent.trim());
        }
      });

      // Desktop hover-to-open, hover-off-to-close (only when not pinned)
      sidebar.addEventListener('mouseenter', function () {
        if (window.innerWidth > 768 && !sidebar.classList.contains('sidebar-pinned')) {
          sidebar.classList.add('hover-open');
        }
      });
      sidebar.addEventListener('mouseleave', function () {
        sidebar.classList.remove('hover-open');
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
        var nextPinned = !sidebar.classList.contains('sidebar-pinned');
        localStorage.setItem(pinKey, nextPinned ? 'true' : 'false');
        syncPinState(nextPinned);
      });
    }

    if (mobileToggle) {
      mobileToggle.addEventListener('click', function (e) {
        e.preventDefault();
        e.stopPropagation();
        openMobileSidebar();
      });
    }

    document.querySelectorAll('[id$="-bottom-menu-btn"]').forEach(function (btn) {
      btn.addEventListener('click', openMobileSidebar);
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
