/**
 * AROX ERP — Triangular Sync Client
 * Real-time triangular synchronization across Admin, Employee, and Student panels.
 */

(function () {
  'use strict';

  let lastEventTimestamp = Date.now();
  let eventSource = null;
  let pollInterval = null;
  let isConnected = false;

  // Toast Notification System (available only for explicit manual calls)
  function showSyncToast(message, type = 'info') {
    let container = document.getElementById('erp-sync-toast-container');
    if (!container) {
      container = document.createElement('div');
      container.id = 'erp-sync-toast-container';
      container.style.cssText = `
        position: fixed;
        bottom: 24px;
        right: 24px;
        z-index: 999999;
        display: flex;
        flex-direction: column;
        gap: 10px;
        pointer-events: none;
        max-width: 360px;
      `;
      document.body.appendChild(container);
    }

    const toast = document.createElement('div');
    toast.style.cssText = `
      background: #0F172A;
      color: #F8FAFC;
      border: 1px solid rgba(59, 130, 246, 0.4);
      padding: 12px 18px;
      border-radius: 12px;
      font-size: 13px;
      font-weight: 500;
      box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.3), 0 0 15px rgba(59, 130, 246, 0.2);
      display: flex;
      align-items: center;
      gap: 10px;
      pointer-events: auto;
      transform: translateY(20px);
      opacity: 0;
      transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
      font-family: 'Montserrat', sans-serif;
    `;

    const icon = type === 'success' ? '✓' : (type === 'payment' ? '💳' : '⚡');
    toast.innerHTML = `
      <div style="width: 24px; height: 24px; border-radius: 50%; background: rgba(59, 130, 246, 0.2); color: #60A5FA; display: flex; align-items: center; justify-content: center; font-weight: 700; font-size: 12px; flex-shrink: 0;">
        ${icon}
      </div>
      <div style="flex: 1; line-height: 1.4;">${message}</div>
    `;

    container.appendChild(toast);

    // Slide in
    requestAnimationFrame(() => {
      toast.style.transform = 'translateY(0)';
      toast.style.opacity = '1';
    });

    // Auto dismiss after 4.5 seconds
    setTimeout(() => {
      toast.style.opacity = '0';
      toast.style.transform = 'translateY(10px)';
      setTimeout(() => toast.remove(), 300);
    }, 4500);
  }

  // Handle Incoming Event
  function handleSyncEvent(event) {
    if (!event || !event.type) return;

    // Update timestamp tracker
    if (event.timestamp) {
      lastEventTimestamp = Math.max(lastEventTimestamp, event.timestamp);
    }

    const type = String(event.type || '').trim();
    const lowerType = type.toLowerCase();
    const data = event.data || {};
    const currentPath = window.location.pathname;

    // Never push alert notifications or sync broadcasts for delete or login/logout actions
    if (!type || lowerType.endsWith(':deleted') || lowerType.includes('delete') || lowerType.includes('login') || lowerType.includes('logout') || data.deleted === true) {
      return;
    }

    // Dispatch lightweight notification ping to refresh header notification badge/dropdown silently
    if (type === 'notification:new') {
      document.dispatchEvent(new CustomEvent('erp:notification:new', { detail: data }));
      return;
    }

    // Dispatch custom DOM events for page-specific handlers
    document.dispatchEvent(new CustomEvent('erp:sync', { detail: event }));
    document.dispatchEvent(new CustomEvent(`erp:${type}`, { detail: data }));

    // Intelligent automated page updates based on context (without popping alert toasts)
    function reloadIfNotEditing(delay = 600) {
      // Check if user is actively editing in a modal
      const isModalOpen = document.querySelector('[id*="Modal"][style*="flex"], [id*="Modal"][style*="block"], .modal.show, [aria-modal="true"]');
      if (!isModalOpen) {
        setTimeout(() => window.location.reload(), delay);
      }
    }

    switch (type) {
      case 'registration:created':
        if (currentPath.includes('/internships') || currentPath.includes('/registrations') || currentPath.includes('/dashboard') || currentPath.includes('/leads') || currentPath.includes('/students')) {
          reloadIfNotEditing(600);
        }
        break;

      case 'payment:updated':
      case 'payment:verified':
      case 'payment:created':
        if (currentPath.includes('/payments') || currentPath.includes('/dashboard') || currentPath.includes('/courses') || currentPath.includes('/internships') || currentPath.includes('/registrations')) {
          reloadIfNotEditing(600);
        }
        break;

      case 'internship:updated':
      case 'registration:updated':
        if (currentPath.includes('/internships') || currentPath.includes('/courses') || currentPath.includes('/registrations') || currentPath.includes('/leads') || currentPath.includes('/dashboard')) {
          reloadIfNotEditing(600);
        }
        break;

      case 'referral:used':
      case 'referral:created':
      case 'referral:updated':
        if (currentPath.includes('/referrals') || currentPath.includes('/internships') || currentPath.includes('/dashboard')) {
          reloadIfNotEditing(600);
        }
        break;

      case 'attendance:marked':
        if (currentPath.includes('/attendance') || currentPath.includes('/dashboard') || currentPath.includes('/courses')) {
          reloadIfNotEditing(600);
        }
        break;

      case 'offline_class:updated':
      case 'course:updated':
        if (currentPath.includes('/dashboard') || currentPath.includes('/courses') || currentPath.includes('/attendance')) {
          reloadIfNotEditing(600);
        }
        break;

      case 'proof:uploaded':
      case 'proof:reviewed':
        if (currentPath.includes('/dashboard') || currentPath.includes('/tasks') || currentPath.includes('/reports')) {
          reloadIfNotEditing(600);
        }
        break;

      case 'review:created':
      case 'review:acknowledged':
      case 'review:replied':
        if (currentPath.includes('/reviews') || currentPath.includes('/dashboard')) {
          reloadIfNotEditing(600);
        }
        break;

      case 'client:updated':
      case 'client:created':
        if (currentPath.includes('/clients') || currentPath.includes('/leads') || currentPath.includes('/dashboard')) {
          reloadIfNotEditing(600);
        }
        break;

      case 'call_report:created':
      case 'call_report:updated':
        if (currentPath.includes('/call-reports') || currentPath.includes('/reports') || currentPath.includes('/performance') || currentPath.includes('/dashboard')) {
          reloadIfNotEditing(600);
        }
        break;

      case 'student:updated':
        if (currentPath.includes('/students') || currentPath.includes('/internships') || currentPath.includes('/dashboard')) {
          reloadIfNotEditing(600);
        }
        break;

      case 'task:updated':
      case 'task:created':
        if (currentPath.includes('/tasks') || currentPath.includes('/dashboard')) {
          reloadIfNotEditing(600);
        }
        break;

      default:
        break;
    }
  }

  // Connect via Server-Sent Events (SSE)
  function startSseConnection() {
    if (window.EventSource) {
      try {
        eventSource = new EventSource('/api/sync/events');

        eventSource.onopen = function () {
          isConnected = true;
          if (pollInterval) {
            clearInterval(pollInterval);
            pollInterval = null;
          }
        };

        // Standard custom sync listeners
        const eventTypes = [
          'notification:new',
          'registration:created', 'registration:updated',
          'payment:updated', 'payment:verified', 'payment:created',
          'internship:updated',
          'referral:used', 'referral:created', 'referral:updated',
          'attendance:marked', 'offline_class:updated', 'course:updated', 'proof:uploaded', 'proof:reviewed', 'review:created', 'review:acknowledged', 'review:replied',
          'client:updated', 'client:created',
          'call_report:created', 'call_report:updated', 'student:updated',
          'task:updated', 'task:created'
        ];

        eventTypes.forEach(evtName => {
          eventSource.addEventListener(evtName, function (e) {
            try {
              const parsed = JSON.parse(e.data);
              handleSyncEvent(parsed);
            } catch (err) {}
          });
        });

        // Catch-all standard onmessage
        eventSource.onmessage = function (e) {
          try {
            const parsed = JSON.parse(e.data);
            handleSyncEvent(parsed);
          } catch (err) {}
        };

        eventSource.onerror = function () {
          isConnected = false;
          if (eventSource) {
            eventSource.close();
            eventSource = null;
          }
          // Start polling fallback if SSE drops
          startPollingFallback();
          // Attempt SSE reconnection in 15 seconds
          setTimeout(startSseConnection, 15000);
        };
      } catch (err) {
        startPollingFallback();
      }
    } else {
      startPollingFallback();
    }
  }

  // Fallback: 6-10s Polling Mechanism
  function startPollingFallback() {
    if (pollInterval) return;

    pollInterval = setInterval(async () => {
      try {
        const res = await fetch(`/api/sync/status?since=${lastEventTimestamp}`);
        if (!res.ok) return;
        const result = await res.json();
        if (result.success && Array.isArray(result.events)) {
          result.events.forEach(evt => handleSyncEvent(evt));
        }
      } catch (e) {
        // network silent retry
      }
    }, 6000);
  }

  // Public triangular sync broadcaster utility for forms
  window.AroxSync = {
    triggerEvent(type, data) {
      handleSyncEvent({ type, data, timestamp: Date.now() });
    },
    toast: showSyncToast
  };

  // Auto-initiate sync client when document is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', startSseConnection);
  } else {
    startSseConnection();
  }
})();
