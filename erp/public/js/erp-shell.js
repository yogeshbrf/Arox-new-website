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
        document.querySelectorAll('.erp-notif-dropdown.open').forEach(function (d) { d.classList.remove('open'); });
        var isOpen = menu.classList.toggle('open');
        trigger.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
      });
    });

    // Targeted Role/User Unwatched Notifications dropdown (/api/notifications)
    function formatNotifTime(ts) {
      if (!ts) return '';
      try {
        return new Date(ts).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' });
      } catch (e) {
        return '';
      }
    }

    function normalizeNotifRole(role) {
      var r = String(role || '').toLowerCase().trim();
      if (['admin', 'superadmin', 'manager', 'staff', 'trainer'].indexOf(r) !== -1) return 'admin';
      return r;
    }

    document.querySelectorAll('.erp-notif-wrapper').forEach(function (wrapper) {
      var trigger = wrapper.querySelector('.erp-notif-trigger');
      var dot = wrapper.querySelector('.erp-notif-dot');
      var menu = wrapper.querySelector('.erp-notif-dropdown');
      var listEl = wrapper.querySelector('.erp-notif-list');
      var statusEl = wrapper.querySelector('.erp-notif-status');
      var markAllBtn = wrapper.querySelector('.erp-notif-mark-all');
      if (!trigger || !menu || !listEl) return;

      var panelUserId = wrapper.getAttribute('data-user-id') || '';
      var panelRole = normalizeNotifRole(wrapper.getAttribute('data-user-role') || '');
      var currentNotifications = [];

      function updateBadge(count) {
        var unread = Math.max(0, Number(count) || 0);
        if (dot) {
          dot.style.display = unread > 0 ? 'block' : 'none';
        }
        if (statusEl) {
          statusEl.textContent = unread > 0 ? (unread + ' Unwatched') : 'All caught up';
          statusEl.classList.toggle('has-unread', unread > 0);
        }
        if (markAllBtn) {
          markAllBtn.style.display = unread > 0 ? 'inline-flex' : 'none';
        }
      }

      function markWatchedAndNavigate(notif) {
        currentNotifications = currentNotifications.filter(function (n) { return n.id !== notif.id; });
        updateBadge(currentNotifications.length);
        renderList(currentNotifications);
        menu.classList.remove('open');
        trigger.setAttribute('aria-expanded', 'false');

        var target = (notif.target_url && typeof notif.target_url === 'string' && notif.target_url.charAt(0) === '/')
          ? notif.target_url
          : '';
        var markReq = fetch('/api/notifications/' + encodeURIComponent(notif.id) + '/read', {
          method: 'POST',
          keepalive: true
        }).catch(function () {});

        if (!target) return;
        var navigated = false;
        function go() {
          if (navigated) return;
          navigated = true;
          window.location.href = target;
        }
        setTimeout(go, 250);
        markReq.then(go, go);
      }

      function renderList(items) {
        currentNotifications = Array.isArray(items) ? items.slice() : [];
        if (currentNotifications.length === 0) {
          listEl.innerHTML = '<div class="erp-notif-empty">No unwatched notifications.</div>';
          return;
        }
        listEl.innerHTML = '';
        currentNotifications.forEach(function (notif) {
          var item = document.createElement('button');
          item.type = 'button';
          item.className = 'erp-notif-item';

          if (notif.title) {
            var titleDiv = document.createElement('div');
            titleDiv.className = 'erp-notif-title';
            titleDiv.textContent = notif.title;
            item.appendChild(titleDiv);
          }

          var msgDiv = document.createElement('div');
          msgDiv.className = 'erp-notif-msg';
          msgDiv.textContent = notif.message || 'New update available';
          item.appendChild(msgDiv);

          var metaParts = [];
          if (notif.actor_name) metaParts.push(notif.actor_name);
          var t = formatNotifTime(notif.created_at);
          if (t) metaParts.push(t);
          if (metaParts.length > 0) {
            var metaDiv = document.createElement('div');
            metaDiv.className = 'erp-notif-meta';
            metaDiv.textContent = metaParts.join(' · ');
            item.appendChild(metaDiv);
          }

          item.addEventListener('click', function (e) {
            e.preventDefault();
            e.stopPropagation();
            markWatchedAndNavigate(notif);
          });

          listEl.appendChild(item);
        });
      }

      function loadUnwatchedNotifications(shouldRenderList) {
        return fetch('/api/notifications')
          .then(function (r) { return r.json(); })
          .then(function (data) {
            if (!data || !data.success) return;
            var items = Array.isArray(data.notifications) ? data.notifications : [];
            var unread = typeof data.unreadCount === 'number' ? data.unreadCount : items.length;
            updateBadge(unread);
            if (shouldRenderList || menu.classList.contains('open')) {
              renderList(items);
            }
          })
          .catch(function () {
            if (menu.classList.contains('open') && currentNotifications.length === 0) {
              listEl.innerHTML = '<div class="erp-notif-empty">Unable to load notifications right now.</div>';
            }
          });
      }

      trigger.addEventListener('click', function (e) {
        e.preventDefault();
        e.stopPropagation();
        document.querySelectorAll('.erp-profile-dropdown.open').forEach(function (d) { d.classList.remove('open'); });
        var isOpen = menu.classList.toggle('open');
        trigger.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
        if (isOpen) {
          loadUnwatchedNotifications(true);
        }
      });

      if (markAllBtn) {
        markAllBtn.addEventListener('click', function (e) {
          e.preventDefault();
          e.stopPropagation();
          fetch('/api/notifications/read-all', { method: 'POST', keepalive: true })
            .then(function () {
              currentNotifications = [];
              updateBadge(0);
              renderList([]);
            })
            .catch(function () {});
        });
      }

      document.addEventListener('erp:notification:new', function (evt) {
        var detail = (evt && evt.detail) || {};
        if (detail.recipientUserId && panelUserId && String(detail.recipientUserId) !== String(panelUserId)) {
          return;
        }
        if (detail.recipientRole && panelRole && normalizeNotifRole(detail.recipientRole) !== panelRole) {
          return;
        }
        loadUnwatchedNotifications(true);
      });

      loadUnwatchedNotifications(true);
      setInterval(function () {
        loadUnwatchedNotifications(false);
      }, 15000);
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
      document.querySelectorAll('.erp-notif-wrapper').forEach(function (wrapper) {
        if (!wrapper.contains(e.target)) {
          var nMenu = wrapper.querySelector('.erp-notif-dropdown');
          var nTrigger = wrapper.querySelector('.erp-notif-trigger');
          if (nMenu) nMenu.classList.remove('open');
          if (nTrigger) nTrigger.setAttribute('aria-expanded', 'false');
        }
      });
    });
  });
})();
