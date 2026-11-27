/**
 * Crisp Duotone SVG Icon System for AROX ERP Sidebar & Bottom Navigation
 * Matches modern rounded semi-filled duotone geometry with subtle internal shading.
 */

const DUOTONE_ICONS = {
  // Top sidebar collapse/pin button icon (stacked duotone layers from reference)
  'sidebar-layers': `
    <rect x="4" y="4" width="16" height="16" rx="4" fill="currentColor" fill-opacity="0.06" stroke="none"/>
    <path d="M12 4.5 4.5 8.5 12 12.5 19.5 8.5 12 4.5Z" fill="currentColor" fill-opacity="0.22" stroke="currentColor" stroke-width="1.85" stroke-linejoin="round"/>
    <path d="M4.5 12 12 16 19.5 12" fill="none" stroke="currentColor" stroke-width="1.85" stroke-linecap="round" stroke-linejoin="round"/>
    <path d="M4.5 15.5 12 19.5 19.5 15.5" fill="none" stroke="currentColor" stroke-width="1.85" stroke-linecap="round" stroke-linejoin="round"/>
  `,

  // Overview / Dashboard (4 rounded tiles, bottom-right tinted)
  'layout-dashboard': `
    <rect x="3.5" y="3.5" width="7" height="7" rx="2" stroke="currentColor" stroke-width="1.85"/>
    <rect x="13.5" y="3.5" width="7" height="7" rx="2" fill="currentColor" fill-opacity="0.16" stroke="currentColor" stroke-width="1.85"/>
    <rect x="3.5" y="13.5" width="7" height="7" rx="2" fill="currentColor" fill-opacity="0.16" stroke="currentColor" stroke-width="1.85"/>
    <rect x="13.5" y="13.5" width="7" height="7" rx="2" fill="currentColor" fill-opacity="0.3" stroke="currentColor" stroke-width="1.85"/>
  `,

  // Courses / Book Open (right page filled duotone)
  'book-open': `
    <path d="M2.5 6.2A2.2 2.2 0 0 1 4.7 4h4.8c1.4 0 2.5 1.1 2.5 2.5V19.5a2 2 0 0 0-2-1.5H4.5A2 2 0 0 1 2.5 16V6.2Z" fill="currentColor" fill-opacity="0.08" stroke="currentColor" stroke-width="1.85" stroke-linejoin="round"/>
    <path d="M21.5 6.2A2.2 2.2 0 0 0 19.3 4h-4.8C13.1 4 12 5.1 12 6.5V19.5a2 2 0 0 1 2-1.5h5.5a2 2 0 0 0 2-1.5V6.2Z" fill="currentColor" fill-opacity="0.22" stroke="currentColor" stroke-width="1.85" stroke-linejoin="round"/>
  `,

  // Payments / Wallet
  'wallet': `
    <rect x="3" y="6" width="18" height="13.5" rx="3" fill="currentColor" fill-opacity="0.16" stroke="currentColor" stroke-width="1.85"/>
    <path d="M4.5 6V5a2 2 0 0 1 2-2h9.8a1.7 1.7 0 0 1 1.7 1.7V6" stroke="currentColor" stroke-width="1.85" stroke-linecap="round"/>
    <path d="M15.5 11.2h5.5v3.6h-5.5a1.8 1.8 0 0 1 0-3.6Z" fill="currentColor" fill-opacity="0.28" stroke="currentColor" stroke-width="1.8"/>
    <circle cx="16.2" cy="13" r="0.9" fill="currentColor"/>
  `,

  // Attendance Calendar Check
  'calendar-check-2': `
    <rect x="3.5" y="4.5" width="17" height="16" rx="3" fill="currentColor" fill-opacity="0.16" stroke="currentColor" stroke-width="1.85"/>
    <path d="M8 2.8v3.4M16 2.8v3.4M3.5 9.2h17" stroke="currentColor" stroke-width="1.85" stroke-linecap="round"/>
    <path d="m8.8 14.5 2.2 2.2 4.3-4.3" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
  `,

  // Reviews / Star
  'star': `
    <path d="m12 3.2 2.65 5.45 6 .85-4.35 4.2 1.05 5.95L12 16.8l-5.35 2.85 1.05-5.95L3.35 9.5l6-.85L12 3.2Z" fill="currentColor" fill-opacity="0.2" stroke="currentColor" stroke-width="1.85" stroke-linejoin="round"/>
  `,

  // Settings Gear
  'settings': `
    <circle cx="12" cy="12" r="7.2" fill="currentColor" fill-opacity="0.14"/>
    <path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2Z" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linejoin="round"/>
    <circle cx="12" cy="12" r="3.2" fill="currentColor" fill-opacity="0.24" stroke="currentColor" stroke-width="1.85"/>
  `,

  // Employees / Users Round
  'users-round': `
    <circle cx="9.5" cy="7.5" r="3.5" fill="currentColor" fill-opacity="0.2" stroke="currentColor" stroke-width="1.85"/>
    <path d="M3 19.5c0-3.2 2.9-5.5 6.5-5.5s6.5 2.3 6.5 5.5" fill="currentColor" fill-opacity="0.14" stroke="currentColor" stroke-width="1.85" stroke-linecap="round"/>
    <circle cx="16.8" cy="8.5" r="2.5" stroke="currentColor" stroke-width="1.8"/>
    <path d="M17.5 14c2.1.4 3.5 2 3.5 4.3" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/>
  `,

  // Users / Students
  'users': `
    <circle cx="9" cy="7.8" r="3.3" fill="currentColor" fill-opacity="0.2" stroke="currentColor" stroke-width="1.85"/>
    <path d="M3 19.5a6 6 0 0 1 12 0" fill="currentColor" fill-opacity="0.14" stroke="currentColor" stroke-width="1.85" stroke-linecap="round"/>
    <circle cx="16.8" cy="8.8" r="2.4" stroke="currentColor" stroke-width="1.8"/>
    <path d="M16.5 14.2a4.6 4.6 0 0 1 4.5 4.8" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/>
  `,

  // Graduation Cap
  'graduation-cap': `
    <path d="M2.5 9.5 12 5l9.5 4.5L12 14 2.5 9.5Z" fill="currentColor" fill-opacity="0.22" stroke="currentColor" stroke-width="1.85" stroke-linejoin="round"/>
    <path d="M6.5 11.7v4.1c0 1.7 2.5 3.1 5.5 3.1s5.5-1.4 5.5-3.1v-4.1" fill="currentColor" fill-opacity="0.12" stroke="currentColor" stroke-width="1.85" stroke-linecap="round"/>
    <path d="M20.5 10.2v5.3" stroke="currentColor" stroke-width="1.85" stroke-linecap="round"/>
  `,

  // Tasks / Check Square
  'check-square': `
    <rect x="3.5" y="3.5" width="17" height="17" rx="4" fill="currentColor" fill-opacity="0.16" stroke="currentColor" stroke-width="1.85"/>
    <path d="m8.5 12.2 2.4 2.4 4.8-5" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
  `,

  // Building / Clients
  'building-2': `
    <rect x="4" y="3.5" width="10" height="17" rx="2" fill="currentColor" fill-opacity="0.18" stroke="currentColor" stroke-width="1.85"/>
    <path d="M14 9.5h4a2 2 0 0 1 2 2v9h-6V9.5Z" fill="currentColor" fill-opacity="0.1" stroke="currentColor" stroke-width="1.85" stroke-linejoin="round"/>
    <path d="M7.5 7.5h3M7.5 11.5h3M7.5 15.5h3" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/>
  `,

  // Reports / Bar Chart
  'bar-chart-3': `
    <rect x="3.5" y="3.5" width="17" height="17" rx="3.5" fill="currentColor" fill-opacity="0.12" stroke="currentColor" stroke-width="1.85"/>
    <path d="M8 16v-4.5M12 16V8M16 16v-6.5" stroke="currentColor" stroke-width="2.1" stroke-linecap="round"/>
  `,

  // Briefcase / Internships
  'briefcase': `
    <path d="M8.5 7V5.2A1.7 1.7 0 0 1 10.2 3.5h3.6a1.7 1.7 0 0 1 1.7 1.7V7" stroke="currentColor" stroke-width="1.85"/>
    <rect x="3" y="7" width="18" height="13" rx="3" fill="currentColor" fill-opacity="0.18" stroke="currentColor" stroke-width="1.85"/>
    <path d="M3 12.2h18" stroke="currentColor" stroke-width="1.8"/>
    <rect x="10.4" y="10.7" width="3.2" height="3" rx="0.8" fill="currentColor"/>
  `,

  // Award / Certificate
  'award': `
    <circle cx="12" cy="9.5" r="5.5" fill="currentColor" fill-opacity="0.2" stroke="currentColor" stroke-width="1.85"/>
    <path d="M8.5 14.3 7.3 21l4.7-2.2 4.7 2.2-1.2-6.7" fill="currentColor" fill-opacity="0.12" stroke="currentColor" stroke-width="1.85" stroke-linejoin="round"/>
    <circle cx="12" cy="9.5" r="2" fill="currentColor" fill-opacity="0.35"/>
  `,

  // File Text / Offer Letters
  'file-text': `
    <path d="M6.5 3.5h7.2L18 7.8v11.7a2 2 0 0 1-2 2H6.5a2 2 0 0 1-2-2v-14a2 2 0 0 1 2-2Z" fill="currentColor" fill-opacity="0.16" stroke="currentColor" stroke-width="1.85" stroke-linejoin="round"/>
    <path d="M13.5 3.5V8H18M8.5 12h7M8.5 15.5h5" stroke="currentColor" stroke-width="1.85" stroke-linecap="round"/>
  `,

  // Clipboard Check / Attendance Certs
  'clipboard-check': `
    <rect x="5" y="4.5" width="14" height="16" rx="2.5" fill="currentColor" fill-opacity="0.16" stroke="currentColor" stroke-width="1.85"/>
    <rect x="8.8" y="2.8" width="6.4" height="3.2" rx="1.2" fill="currentColor" fill-opacity="0.3" stroke="currentColor" stroke-width="1.7"/>
    <path d="m9 13.8 2 2 4-4" stroke="currentColor" stroke-width="1.95" stroke-linecap="round" stroke-linejoin="round"/>
  `,

  // Ticket / Referral
  'ticket': `
    <path d="M3.5 8.5A2 2 0 0 1 5.5 6.5h13a2 2 0 0 1 2 2v1.8a1.7 1.7 0 0 0 0 3.4v1.8a2 2 0 0 1-2 2h-13a2 2 0 0 1-2-2v-1.8a1.7 1.7 0 0 0 0-3.4V8.5Z" fill="currentColor" fill-opacity="0.18" stroke="currentColor" stroke-width="1.85"/>
    <path d="M13.5 7v2M13.5 11.2v1.6M13.5 15v2" stroke="currentColor" stroke-width="1.85" stroke-linecap="round"/>
  `,

  // User Circle / Profile
  'user-circle': `
    <circle cx="12" cy="12" r="9" fill="currentColor" fill-opacity="0.14" stroke="currentColor" stroke-width="1.85"/>
    <circle cx="12" cy="9.5" r="2.8" fill="currentColor" fill-opacity="0.25" stroke="currentColor" stroke-width="1.8"/>
    <path d="M6.8 18.2a6 6 0 0 1 10.4 0" stroke="currentColor" stroke-width="1.85" stroke-linecap="round"/>
  `,

  // Target / Pipeline
  'target': `
    <circle cx="12" cy="12" r="8.5" fill="currentColor" fill-opacity="0.14" stroke="currentColor" stroke-width="1.85"/>
    <circle cx="12" cy="12" r="4.8" fill="currentColor" fill-opacity="0.16" stroke="currentColor" stroke-width="1.8"/>
    <circle cx="12" cy="12" r="1.8" fill="currentColor"/>
  `,

  // Phone Call / Call Reports
  'phone-call': `
    <path d="M6.5 4h2.6a1.5 1.5 0 0 1 1.5 1.3l.4 2.4a1.5 1.5 0 0 1-.4 1.3l-1.3 1.3a12 12 0 0 0 4.4 4.4l1.3-1.3a1.5 1.5 0 0 1 1.3-.4l2.4.4a1.5 1.5 0 0 1 1.3 1.5v2.6a1.5 1.5 0 0 1-1.6 1.5A15.4 15.4 0 0 1 5 5.6 1.5 1.5 0 0 1 6.5 4Z" fill="currentColor" fill-opacity="0.18" stroke="currentColor" stroke-width="1.85" stroke-linejoin="round"/>
    <path d="M14.5 5.5a5 5 0 0 1 4 4M14.5 8.8a2 2 0 0 1 1.2 1.2" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/>
  `,

  // Contact Directory
  'contact-2': `
    <rect x="4" y="4.5" width="16" height="15" rx="3" fill="currentColor" fill-opacity="0.16" stroke="currentColor" stroke-width="1.85"/>
    <circle cx="12" cy="10.2" r="2.4" fill="currentColor" fill-opacity="0.25" stroke="currentColor" stroke-width="1.8"/>
    <path d="M8 16.5a4.3 4.3 0 0 1 8 0" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/>
    <path d="M8.5 3v2.5M15.5 3v2.5" stroke="currentColor" stroke-width="1.85" stroke-linecap="round"/>
  `,

  // Shield / Admin Switcher
  'shield': `
    <path d="M12 3.2 4.8 6.2v5.3c0 4.6 3 8.4 7.2 9.5 4.2-1.1 7.2-4.9 7.2-9.5V6.2L12 3.2Z" fill="currentColor" fill-opacity="0.18" stroke="currentColor" stroke-width="1.85" stroke-linejoin="round"/>
    <path d="m9.2 12 2 2 3.8-4" stroke="currentColor" stroke-width="1.95" stroke-linecap="round" stroke-linejoin="round"/>
  `,

  // Logout
  'log-out': `
    <path d="M9.5 4.5H6a2 2 0 0 0-2 2v11a2 2 0 0 0 2 2h3.5" fill="currentColor" fill-opacity="0.1" stroke="currentColor" stroke-width="1.85" stroke-linecap="round"/>
    <path d="M15.5 8.5 19.5 12l-4 3.5M19.5 12H9.5" stroke="currentColor" stroke-width="1.95" stroke-linecap="round" stroke-linejoin="round"/>
  `,

  // Bottom nav More menu icon
  'menu-more': `
    <rect x="4" y="5" width="6.5" height="6.5" rx="2" fill="currentColor" fill-opacity="0.2" stroke="currentColor" stroke-width="1.85"/>
    <rect x="13.5" y="5" width="6.5" height="6.5" rx="2" stroke="currentColor" stroke-width="1.85"/>
    <rect x="4" y="13.5" width="6.5" height="6.5" rx="2" stroke="currentColor" stroke-width="1.85"/>
    <rect x="13.5" y="13.5" width="6.5" height="6.5" rx="2" fill="currentColor" fill-opacity="0.2" stroke="currentColor" stroke-width="1.85"/>
  `
};

function getIcon(name, className = '') {
  const safeName = DUOTONE_ICONS[name] ? name : 'layout-dashboard';
  const inner = DUOTONE_ICONS[safeName];
  const cls = className ? `erp-duotone-icon ${className}` : 'erp-duotone-icon';
  return `<svg class="${cls}" data-icon="${safeName}" viewBox="0 0 24 24" width="22" height="22" fill="none" aria-hidden="true">${inner}</svg>`;
}

module.exports = { getIcon, DUOTONE_ICONS };
