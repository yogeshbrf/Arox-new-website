/**
 * AROX Tech — Global Rounded Semi-Filled Duotone SVG Icon System
 * Strict color preservation: uses only `currentColor` + subtle fill-opacity tonal depth.
 * Automatically upgrades all `data-lucide` icons across ERP dashboards and provides
 * `window.AroxIcons` helpers for public website pages.
 */
(function (global) {
  'use strict';

  const P = {
    // ─── Navigation & Core ───────────────────────────────────────────────────
    'home': '<path d="M4 10.4 12 3.8l8 6.6V19a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2v-8.6Z" fill="currentColor" fill-opacity="0.16"/><path d="M2.5 11 12 3.2 21.5 11"/><rect x="9.5" y="13.5" width="5" height="7.5" rx="1.2" fill="currentColor" stroke="none"/>',
    'info': '<circle cx="12" cy="12" r="9.5" fill="currentColor" fill-opacity="0.16"/><path d="M12 11.2v5.2" stroke-width="2.2"/><circle cx="12" cy="7.7" r="1.25" fill="currentColor" stroke="none"/>',
    'help-circle': '<circle cx="12" cy="12" r="9.5" fill="currentColor" fill-opacity="0.16"/><path d="M9.4 9.2a2.7 2.7 0 0 1 5.2.9c0 1.8-2.6 2.3-2.6 3.7"/><circle cx="12" cy="17.2" r="1.2" fill="currentColor" stroke="none"/>',
    'alert-circle': '<circle cx="12" cy="12" r="9.5" fill="currentColor" fill-opacity="0.18"/><path d="M12 7.5v5.3" stroke-width="2.2"/><circle cx="12" cy="16.4" r="1.25" fill="currentColor" stroke="none"/>',
    'layers': '<path d="M12 3.2 20.5 7.7 12 12.2 3.5 7.7 12 3.2Z" fill="currentColor" fill-opacity="0.32"/><path d="M3.5 12 12 16.5 20.5 12"/><path d="M3.5 16.3 12 20.8 20.5 16.3"/>',
    'graduation-cap': '<path d="M2.5 9.2 12 4.5l9.5 4.7L12 13.9 2.5 9.2Z" fill="currentColor" fill-opacity="0.34"/><path d="M6.5 11.5v4.3c0 1.8 2.5 3.2 5.5 3.2s5.5-1.4 5.5-3.2v-4.3" fill="currentColor" fill-opacity="0.16"/><path d="M20.5 9.8v5.6"/><circle cx="20.5" cy="16.4" r="1.1" fill="currentColor" stroke="none"/>',
    'briefcase': '<path d="M8.5 7V5.2A1.7 1.7 0 0 1 10.2 3.5h3.6a1.7 1.7 0 0 1 1.7 1.7V7"/><rect x="3" y="7" width="18" height="13.5" rx="3" fill="currentColor" fill-opacity="0.15"/><path d="M3 12.4h18v5.1a3 3 0 0 1-3 3H6a3 3 0 0 1-3-3v-5.1Z" fill="currentColor" fill-opacity="0.22" stroke="none"/><path d="M3 12.3h18"/><rect x="10.4" y="10.8" width="3.2" height="3" rx="0.9" fill="currentColor" stroke="none"/>',
    'phone': '<path d="M6.8 3.2h2.7a1.8 1.8 0 0 1 1.8 1.5l.4 2.4a1.8 1.8 0 0 1-.5 1.6l-1.3 1.3a13.2 13.2 0 0 0 4.1 4.1l1.3-1.3a1.8 1.8 0 0 1 1.6-.5l2.4.4a1.8 1.8 0 0 1 1.5 1.8v2.7a1.8 1.8 0 0 1-2 1.8A16.8 16.8 0 0 1 3 5.2a1.8 1.8 0 0 1 1.8-2Z" fill="currentColor" fill-opacity="0.28"/>',
    'phone-call': '<path d="M6.2 4h2.5a1.6 1.6 0 0 1 1.6 1.4l.35 2.2a1.6 1.6 0 0 1-.45 1.45L9 10.25a11.5 11.5 0 0 0 3.75 3.75l1.2-1.2a1.6 1.6 0 0 1 1.45-.45l2.2.35A1.6 1.6 0 0 1 19 14.3v2.5a1.7 1.7 0 0 1-1.85 1.7A14.8 14.8 0 0 1 4.5 5.85 1.7 1.7 0 0 1 6.2 4Z" fill="currentColor" fill-opacity="0.28"/><path d="M14.5 4.5a5 5 0 0 1 5 5"/><path d="M14.5 7.8a1.7 1.7 0 0 1 1.7 1.7"/>',
    'phone-outgoing': '<path d="M6.2 4.5h2.4a1.5 1.5 0 0 1 1.5 1.3l.3 2.1a1.5 1.5 0 0 1-.4 1.35L9 10.3a11 11 0 0 0 3.7 3.7l1.05-1a1.5 1.5 0 0 1 1.35-.4l2.1.3A1.5 1.5 0 0 1 18.5 14.4v2.4a1.6 1.6 0 0 1-1.75 1.6A14.2 14.2 0 0 1 4.6 6.25 1.6 1.6 0 0 1 6.2 4.5Z" fill="currentColor" fill-opacity="0.28"/><path d="M14.5 9.5 20 4"/><path d="M15.8 4H20v4.2"/>',
    'phone-missed': '<path d="M6.2 5.5h2.4a1.5 1.5 0 0 1 1.5 1.3l.3 2.1a1.5 1.5 0 0 1-.4 1.35L9 11.3a11 11 0 0 0 3.7 3.7l1.05-1a1.5 1.5 0 0 1 1.35-.4l2.1.3A1.5 1.5 0 0 1 18.5 15.4v2.4a1.6 1.6 0 0 1-1.75 1.6A14.2 14.2 0 0 1 4.6 7.25 1.6 1.6 0 0 1 6.2 5.5Z" fill="currentColor" fill-opacity="0.22"/><path d="m14.5 4.5 4.5 4.5"/><path d="m19 4.5-4.5 4.5"/>',

    // ─── Auth & Profile ──────────────────────────────────────────────────────
    'user': '<circle cx="12" cy="8" r="3.8" fill="currentColor" fill-opacity="0.24"/><path d="M4.8 20a7.2 7.2 0 0 1 14.4 0" fill="currentColor" fill-opacity="0.16"/>',
    'user-circle': '<circle cx="12" cy="12" r="9.5" fill="currentColor" fill-opacity="0.18"/><circle cx="12" cy="9.4" r="3" fill="currentColor" fill-opacity="0.32"/><path d="M6.8 18.8a6 6 0 0 1 10.4 0" fill="currentColor" fill-opacity="0.22"/>',
    'user-plus': '<circle cx="9.5" cy="8" r="3.5" fill="currentColor" fill-opacity="0.22"/><path d="M3.5 19.8a6 6 0 0 1 12 0" fill="currentColor" fill-opacity="0.14"/><path d="M18.5 8.5v5"/><path d="M16 11h5"/>',
    'user-check': '<circle cx="9.5" cy="8" r="3.5" fill="currentColor" fill-opacity="0.22"/><path d="M3.5 19.8a6 6 0 0 1 12 0" fill="currentColor" fill-opacity="0.14"/><path d="m15.5 11.5 2 2 4-4"/>',
    'user-cog': '<circle cx="9.5" cy="8" r="3.5" fill="currentColor" fill-opacity="0.22"/><path d="M3.5 19.8a6 6 0 0 1 12 0" fill="currentColor" fill-opacity="0.14"/><circle cx="18" cy="15.5" r="2.3" fill="currentColor" fill-opacity="0.24"/><path d="M18 11.8v1.2m0 5v1.2m3.2-3.7H20m-5.2 0h1.2m4.2-2.4-.9.9m-3.6 3.6-.9.9m5.4 0-.9-.9m-3.6-3.6-.9-.9"/>',
    'users': '<circle cx="12" cy="7.8" r="3" fill="currentColor" fill-opacity="0.34"/><path d="M6.5 19.5a5.5 5.5 0 0 1 11 0Z" fill="currentColor" fill-opacity="0.32"/><circle cx="6.2" cy="9.8" r="2.2" fill="currentColor" fill-opacity="0.2"/><path d="M2.5 19.5c0-2.1 1.6-3.8 3.7-4.1" fill="currentColor" fill-opacity="0.14"/><circle cx="17.8" cy="9.8" r="2.2" fill="currentColor" fill-opacity="0.2"/><path d="M21.5 19.5c0-2.1-1.6-3.8-3.7-4.1" fill="currentColor" fill-opacity="0.14"/>',
    'users-round': '<circle cx="12" cy="7.8" r="3" fill="currentColor" fill-opacity="0.34"/><path d="M6.5 19.5a5.5 5.5 0 0 1 11 0Z" fill="currentColor" fill-opacity="0.32"/><circle cx="6.2" cy="9.8" r="2.2" fill="currentColor" fill-opacity="0.2"/><path d="M2.5 19.5c0-2.1 1.6-3.8 3.7-4.1"/><circle cx="17.8" cy="9.8" r="2.2" fill="currentColor" fill-opacity="0.2"/><path d="M21.5 19.5c0-2.1-1.6-3.8-3.7-4.1"/>',
    'contact': '<rect x="4" y="3.5" width="16" height="17" rx="3" fill="currentColor" fill-opacity="0.14"/><circle cx="12" cy="10" r="2.6" fill="currentColor" fill-opacity="0.28"/><path d="M7.8 17.5a4.5 4.5 0 0 1 8.4 0"/><path d="M2.5 8.5h2M2.5 12.5h2M2.5 16.5h2"/>',
    'contact-2': '<rect x="3.5" y="4.5" width="17" height="15" rx="3" fill="currentColor" fill-opacity="0.14"/><circle cx="12" cy="10.2" r="2.6" fill="currentColor" fill-opacity="0.28"/><path d="M7.8 17a4.5 4.5 0 0 1 8.4 0"/><path d="M8 2.5v2M16 2.5v2"/>',
    'address-book': '<rect x="4.5" y="3.5" width="15.5" height="17" rx="3" fill="currentColor" fill-opacity="0.14"/><circle cx="12.5" cy="10" r="2.4" fill="currentColor" fill-opacity="0.28"/><path d="M8.8 16.8a4 4 0 0 1 7.4 0"/><path d="M3 8h2M3 12h2M3 16h2"/>',
    'log-out': '<path d="M10 4H6.5A2.5 2.5 0 0 0 4 6.5v11A2.5 2.5 0 0 0 6.5 20H10" fill="currentColor" fill-opacity="0.12"/><path d="M10 4H6.5A2.5 2.5 0 0 0 4 6.5v11A2.5 2.5 0 0 0 6.5 20H10"/><path d="m16 16 4.2-4L16 8"/><path d="M20 12H9.5"/>',
    'log-in': '<path d="M14 4h3.5A2.5 2.5 0 0 1 20 6.5v11a2.5 2.5 0 0 1-2.5 2.5H14" fill="currentColor" fill-opacity="0.12"/><path d="M14 4h3.5A2.5 2.5 0 0 1 20 6.5v11a2.5 2.5 0 0 1-2.5 2.5H14"/><path d="m10 16 4-4-4-4"/><path d="M14 12H3.5"/>',
    'lock': '<rect x="4.5" y="10.5" width="15" height="10" rx="3" fill="currentColor" fill-opacity="0.18"/><path d="M8 10.5V7.5a4 4 0 0 1 8 0v3"/><circle cx="12" cy="15.5" r="1.4" fill="currentColor" stroke="none"/>',
    'key': '<circle cx="8" cy="14" r="4.5" fill="currentColor" fill-opacity="0.18"/><path d="M11.3 11 19.5 3.5m0 0v3.3m0-3.3h-3.3"/><circle cx="8" cy="14" r="1.4" fill="currentColor" stroke="none"/>',
    'eye': '<path d="M2.5 12s3.5-6.5 9.5-6.5S21.5 12 21.5 12s-3.5 6.5-9.5 6.5S2.5 12 2.5 12Z" fill="currentColor" fill-opacity="0.14"/><circle cx="12" cy="12" r="3.1" fill="currentColor" fill-opacity="0.34"/>',
    'eye-off': '<path d="M4.2 6.8C2.9 8.4 2.2 10.1 2.2 12c0 0 3.6 6.5 9.8 6.5 1.9 0 3.6-.5 5-1.3"/><path d="M19.8 14.9C21.1 13.4 21.8 12 21.8 12s-3.6-6.5-9.8-6.5c-1.1 0-2.1.2-3 .5"/><circle cx="12" cy="12" r="2.7" fill="currentColor" fill-opacity="0.2"/><path d="m3 3 18 18"/>',

    // ─── Dashboards, Courses, Modules, Projects, Certificates ────────────────
    'layout-grid': '<rect x="3.5" y="3.5" width="7" height="7" rx="2" fill="currentColor" fill-opacity="0.15"/><rect x="13.5" y="3.5" width="7" height="7" rx="2" fill="currentColor" fill-opacity="0.3"/><rect x="3.5" y="13.5" width="7" height="7" rx="2" fill="currentColor" fill-opacity="0.3"/><rect x="13.5" y="13.5" width="7" height="7" rx="2" fill="currentColor" fill-opacity="0.15"/>',
    'layout-dashboard': '<rect x="3.5" y="3.5" width="7" height="7" rx="2" fill="currentColor" fill-opacity="0.28"/><rect x="13.5" y="3.5" width="7" height="7" rx="2" fill="currentColor" fill-opacity="0.14"/><rect x="3.5" y="13.5" width="7" height="7" rx="2" fill="currentColor" fill-opacity="0.14"/><rect x="13.5" y="13.5" width="7" height="7" rx="2" fill="currentColor" fill-opacity="0.28"/>',
    'book-open': '<path d="M3 5.5A2.5 2.5 0 0 1 5.5 3.5c2.7 0 5.3.9 6.5 2.2V20c-1.2-1.2-3.8-1.9-6.5-1.9H3V5.5Z" fill="currentColor" fill-opacity="0.12"/><path d="M21 5.5A2.5 2.5 0 0 0 18.5 3.5c-2.7 0-5.3.9-6.5 2.2V20c1.2-1.2 3.8-1.9 6.5-1.9H21V5.5Z" fill="currentColor" fill-opacity="0.26"/>',
    'book-marked': '<rect x="4.5" y="3" width="15" height="18" rx="2.5" fill="currentColor" fill-opacity="0.15"/><path d="M10.5 3v7l2.5-1.7L15.5 10V3" fill="currentColor" fill-opacity="0.35"/><path d="M4.5 17.5h15"/>',
    'play-circle': '<circle cx="12" cy="12" r="9.5" fill="currentColor" fill-opacity="0.16"/><path d="M10 8.5 16 12l-6 3.5V8.5Z" fill="currentColor"/>',
    'modules': '<path d="M12 3.2 19.5 7.2 12 11.2 4.5 7.2 12 3.2Z" fill="currentColor" fill-opacity="0.35"/><path d="M4.5 11.2 12 15.2l2.5-1.3"/><path d="M4.5 15.2 12 19.2l1.8-.9"/><path d="m16.2 13.5 4.8 3-4.8 3v-6Z" fill="currentColor" fill-opacity="0.28"/>',
    'laptop': '<rect x="3.5" y="4.5" width="17" height="11.5" rx="2.3" fill="currentColor" fill-opacity="0.16"/><path d="m10 8.2-2.2 2 2.2 2"/><path d="m14 8.2 2.2 2-2.2 2"/><path d="M2 18.5h20" stroke-width="2.4"/>',
    'folder-git-2': '<path d="M3 6.5a2 2 0 0 1 2-2h4.2l2 2.2H19a2 2 0 0 1 2 2v8.8a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V6.5Z" fill="currentColor" fill-opacity="0.16"/><circle cx="10" cy="11.5" r="1.4" fill="currentColor"/><circle cx="15" cy="14.5" r="1.4" fill="currentColor"/><path d="M10 12.9v2.2c0 .6.4 1 1 1h2.6"/>',
    'award': '<circle cx="12" cy="9.2" r="6" fill="currentColor" fill-opacity="0.16"/><path d="m12 6.2.9 1.8 2 .3-1.45 1.4.35 2-1.8-.95-1.8.95.35-2L9.1 8.3l2-.3.9-1.8Z" fill="currentColor"/><path d="M8.5 14.3 7.2 21l4.8-2.2 4.8 2.2-1.3-6.7"/>',
    'badge-check': '<path d="M12 2.8c1.1 0 2 .6 2.5 1.5 1-.3 2.1.1 2.7.9.9.2 1.6 1 1.7 2 .8.6 1.1 1.7.8 2.7.5.9.5 2 0 2.9.3 1 0 2.1-.8 2.7-.1 1-.8 1.8-1.7 2-.6.8-1.7 1.2-2.7.9-.5.9-1.4 1.5-2.5 1.5s-2-.6-2.5-1.5c-1 .3-2.1-.1-2.7-.9-.9-.2-1.6-1-1.7-2-.8-.6-1.1-1.7-.8-2.7-.5-.9-.5-2 0-2.9-.3-1 0-2.1.8-2.7.1-1 .8-1.8 1.7-2 .6-.8 1.7-1.2 2.7-.9.5-.9 1.4-1.5 2.5-1.5Z" fill="currentColor" fill-opacity="0.18"/><path d="m9 12.2 2 2 4.2-4.2"/>',
    'star': '<path d="m12 3.2 2.7 5.5 6.1.9-4.4 4.3 1 6.1-5.4-2.8-5.4 2.8 1-6.1L3.2 9.6l6.1-.9L12 3.2Z" fill="currentColor" fill-opacity="0.24"/>',
    'target': '<circle cx="12" cy="12" r="9" fill="currentColor" fill-opacity="0.14"/><circle cx="12" cy="12" r="5" fill="currentColor" fill-opacity="0.14"/><circle cx="12" cy="12" r="1.8" fill="currentColor"/>',

    // ─── Progress, Business & Finance ────────────────────────────────────────
    'trending-up': '<rect x="4" y="15.5" width="3.5" height="5" rx="1" fill="currentColor" fill-opacity="0.28"/><rect x="10.2" y="12.5" width="3.5" height="8" rx="1" fill="currentColor" fill-opacity="0.32"/><rect x="16.5" y="9" width="3.5" height="11.5" rx="1" fill="currentColor" fill-opacity="0.4"/><path d="M4.5 10.5 10.5 6.8l3.5 1.7L19.5 4"/><path d="M16 3.8h3.8v3.8"/>',
    'bar-chart-2': '<rect x="4.5" y="12" width="3.5" height="8.5" rx="1" fill="currentColor" fill-opacity="0.24"/><rect x="10.25" y="5" width="3.5" height="15.5" rx="1" fill="currentColor" fill-opacity="0.36"/><rect x="16" y="9.5" width="3.5" height="11" rx="1" fill="currentColor" fill-opacity="0.28"/>',
    'bar-chart-3': '<path d="M4 4v16h16"/><rect x="7.5" y="12.5" width="2.5" height="5" rx="0.8" fill="currentColor" fill-opacity="0.28"/><rect x="12" y="8" width="2.5" height="9.5" rx="0.8" fill="currentColor" fill-opacity="0.35"/><rect x="16.5" y="10.5" width="2.5" height="7" rx="0.8" fill="currentColor" fill-opacity="0.28"/>',
    'pie-chart': '<path d="M12 3a9 9 0 1 0 9 9h-9V3Z" fill="currentColor" fill-opacity="0.16"/><path d="M14.5 3.4A8.5 8.5 0 0 1 20.6 9.5h-6.1V3.4Z" fill="currentColor" fill-opacity="0.35"/>',
    'activity': '<rect x="3" y="3.5" width="18" height="17" rx="3" fill="currentColor" fill-opacity="0.12"/><path d="M5.5 12h3l2-4.5 3 9 2-4.5h3"/>',
    'wallet': '<path d="M4 7.5A2.5 2.5 0 0 1 6.5 5H18a1.5 1.5 0 0 1 0 3H5.5"/><rect x="3.5" y="7.5" width="17" height="12" rx="2.8" fill="currentColor" fill-opacity="0.2"/><path d="M15.5 11.5h5v4h-5a2 2 0 0 1 0-4Z" fill="currentColor" fill-opacity="0.24"/><circle cx="16.5" cy="13.5" r="0.9" fill="currentColor" stroke="none"/>',
    'credit-card': '<rect x="2.5" y="5" width="19" height="14" rx="2.8" fill="currentColor" fill-opacity="0.16"/><path d="M2.5 9.5h19" stroke-width="2.4"/><path d="M6 15h4.5"/>',
    'receipt': '<path d="M5 3.5h14v17l-2.3-1.5-2.3 1.5-2.4-1.5-2.3 1.5L7.4 19 5 20.5v-17Z" fill="currentColor" fill-opacity="0.16"/><path d="M8.5 9h7"/><path d="M8.5 13h5"/>',
    'dollar-sign': '<circle cx="12" cy="12" r="9.5" fill="currentColor" fill-opacity="0.14"/><path d="M12 6.5v11"/><path d="M15 9.2c0-1.1-1.3-2-3-2s-3 .9-3 2 1.3 2 3 2 3 .9 3 2.1-1.3 2.1-3 2.1-3-.9-3-2.1"/>',
    'indian-rupee': '<circle cx="12" cy="12" r="9.5" fill="currentColor" fill-opacity="0.14"/><path d="M8 7.5h8"/><path d="M8 10.8h8"/><path d="M11 7.5c2 0 3.2 1 3.2 2.8 0 1.8-1.4 3-3.5 3H8.5l5 5.2"/>',
    'percent': '<circle cx="12" cy="12" r="9.5" fill="currentColor" fill-opacity="0.14"/><path d="m16 8-8 8"/><circle cx="8.8" cy="8.8" r="1.4" fill="currentColor" stroke="none"/><circle cx="15.2" cy="15.2" r="1.4" fill="currentColor" stroke="none"/>',

    // ─── Reports, Permissions, Search, Filter, Settings, CRUD ────────────────
    'file-text': '<path d="M6 3.5h8l4.5 4.5V19a1.8 1.8 0 0 1-1.8 1.8H6A1.8 1.8 0 0 1 4.2 19V5.3A1.8 1.8 0 0 1 6 3.5Z" fill="currentColor" fill-opacity="0.15"/><path d="M14 3.5v4.5h4.5"/><path d="M8 12h7"/><path d="M8 15.5h5"/>',
    'file-bar-chart': '<path d="M6 3.5h8l4.5 4.5V19a1.8 1.8 0 0 1-1.8 1.8H6A1.8 1.8 0 0 1 4.2 19V5.3A1.8 1.8 0 0 1 6 3.5Z" fill="currentColor" fill-opacity="0.15"/><path d="M14 3.5v4.5h4.5"/><path d="M8.5 17v-2.8"/><path d="M12 17v-5"/><path d="M15.5 17v-3.8"/>',
    'file-check-2': '<path d="M6 3.5h8l4.5 4.5V19a1.8 1.8 0 0 1-1.8 1.8H6A1.8 1.8 0 0 1 4.2 19V5.3A1.8 1.8 0 0 1 6 3.5Z" fill="currentColor" fill-opacity="0.15"/><path d="M14 3.5v4.5h4.5"/><path d="m8.8 14 2 2 4.2-4.2"/>',
    'file-spreadsheet': '<path d="M6 3.5h8l4.5 4.5V19a1.8 1.8 0 0 1-1.8 1.8H6A1.8 1.8 0 0 1 4.2 19V5.3A1.8 1.8 0 0 1 6 3.5Z" fill="currentColor" fill-opacity="0.15"/><path d="M14 3.5v4.5h4.5"/><path d="M8 12h8M8 15.8h8M11.5 10.5v7"/>',
    'file-up': '<path d="M6 3.5h8l4.5 4.5V19a1.8 1.8 0 0 1-1.8 1.8H6A1.8 1.8 0 0 1 4.2 19V5.3A1.8 1.8 0 0 1 6 3.5Z" fill="currentColor" fill-opacity="0.15"/><path d="M14 3.5v4.5h4.5"/><path d="M12 17v-5.5"/><path d="m9.5 13.8 2.5-2.5 2.5 2.5"/>',
    'clipboard-check': '<rect x="5" y="4.5" width="14" height="16.5" rx="2.5" fill="currentColor" fill-opacity="0.15"/><rect x="9" y="2.8" width="6" height="3" rx="1" fill="currentColor" fill-opacity="0.3"/><path d="m9 13.2 2 2 4-4"/>',
    'clipboard-list': '<rect x="5" y="4.5" width="14" height="16.5" rx="2.5" fill="currentColor" fill-opacity="0.15"/><rect x="9" y="2.8" width="6" height="3" rx="1" fill="currentColor" fill-opacity="0.3"/><path d="M11 11.5h4.5M11 15.5h4.5"/><circle cx="8.3" cy="11.5" r="0.9" fill="currentColor" stroke="none"/><circle cx="8.3" cy="15.5" r="0.9" fill="currentColor" stroke="none"/>',
    'shield-check': '<path d="M12 2.8 4.5 6v5.5c0 4.8 3.2 8.7 7.5 9.8 4.3-1.1 7.5-5 7.5-9.8V6L12 2.8Z" fill="currentColor" fill-opacity="0.2"/><path d="m9 12 2.1 2.1 4-4.2" stroke-width="2.1"/>',
    'shield': '<path d="M12 2.8 4.5 6v5.5c0 4.8 3.2 8.7 7.5 9.8 4.3-1.1 7.5-5 7.5-9.8V6L12 2.8Z" fill="currentColor" fill-opacity="0.2"/>',
    'search': '<circle cx="10.5" cy="10.5" r="6.8" fill="currentColor" fill-opacity="0.14"/><path d="m15.6 15.6 4.9 4.9" stroke-width="2.4"/>',
    'filter': '<path d="M3.5 5h17l-6.4 7.5v5.8l-4.2 1.9v-7.7L3.5 5Z" fill="currentColor" fill-opacity="0.18"/>',
    'settings': '<path d="M12 3.2l1.6 1.5 2.2-.3.9 2.1 2 .9-.3 2.2 1.5 1.6-1.5 1.6.3 2.2-2 .9-.9 2.1-2.2-.3-1.6 1.5-1.6-1.5-2.2.3-.9-2.1-2-.9.3-2.2-1.5-1.6 1.5-1.6-.3-2.2 2-.9.9-2.1 2.2.3L12 3.2Z" fill="currentColor" fill-opacity="0.22"/><circle cx="12" cy="12" r="3" fill="currentColor" fill-opacity="0.06"/>',
    'pencil': '<path d="M15.2 4.6a2 2 0 0 1 2.8 0l1.4 1.4a2 2 0 0 1 0 2.8L8.5 19.7 3.8 20.5l.8-4.7L15.2 4.6Z" fill="currentColor" fill-opacity="0.2"/><path d="m13.5 6.3 4.2 4.2"/>',
    'edit-3': '<path d="M15.2 4.2a2 2 0 0 1 2.8 0l1.2 1.2a2 2 0 0 1 0 2.8L9 18.4l-4.5.8.8-4.5L15.2 4.2Z" fill="currentColor" fill-opacity="0.2"/><path d="M13 20h7.5"/>',
    'trash-2': '<path d="M4.5 6.5h15"/><path d="M9.5 6.5V4.4A1.2 1.2 0 0 1 10.7 3.2h2.6a1.2 1.2 0 0 1 1.2 1.2v2.1"/><path d="M6.2 6.5h11.6l-.8 12.2a2 2 0 0 1-2 1.8H9a2 2 0 0 1-2-1.8L6.2 6.5Z" fill="currentColor" fill-opacity="0.18"/><path d="M10.2 10.5v5.8"/><path d="M13.8 10.5v5.8"/>',

    // ─── Download, Upload, Notifications, Email, Message, Calendar, Time ─────
    'download': '<path d="M12 4v10.5"/><path d="m7.8 10.8 4.2 4.2 4.2-4.2"/><path d="M4 15.5v2.3A2.2 2.2 0 0 0 6.2 20h11.6a2.2 2.2 0 0 0 2.2-2.2v-2.3" fill="currentColor" fill-opacity="0.12"/>',
    'upload': '<path d="M12 15V4.5"/><path d="m7.8 8.2 4.2-4.2 4.2 4.2"/><path d="M4 15.5v2.3A2.2 2.2 0 0 0 6.2 20h11.6a2.2 2.2 0 0 0 2.2-2.2v-2.3" fill="currentColor" fill-opacity="0.12"/>',
    'bell': '<path d="M6.2 10a5.8 5.8 0 0 1 11.6 0c0 4.5 1.8 6.3 2.4 7H3.8c.6-.7 2.4-2.5 2.4-7Z" fill="currentColor" fill-opacity="0.18"/><path d="M10 19.5a2.2 2.2 0 0 0 4 0"/><circle cx="18.2" cy="5.2" r="2.2" fill="currentColor" stroke="none"/>',
    'mail': '<rect x="3" y="5" width="18" height="14" rx="2.8" fill="currentColor" fill-opacity="0.15"/><path d="m3.6 6.2 8.4 6.2 8.4-6.2"/>',
    'send': '<path d="M20.8 3.6 3.5 10.8l6.6 2.7 2.7 6.6 8-16.5Z" fill="currentColor" fill-opacity="0.22"/><path d="M10.1 13.5 20.5 3.8"/>',
    'message-square': '<path d="M4 5.5A2.5 2.5 0 0 1 6.5 3.5h11A2.5 2.5 0 0 1 20 6v8.5a2.5 2.5 0 0 1-2.5 2.5H8.8L4.5 20.5V16.8A2.5 2.5 0 0 1 4 15.5v-10Z" fill="currentColor" fill-opacity="0.16"/><circle cx="8.5" cy="10.2" r="1.1" fill="currentColor" stroke="none"/><circle cx="12" cy="10.2" r="1.1" fill="currentColor" stroke="none"/><circle cx="15.5" cy="10.2" r="1.1" fill="currentColor" stroke="none"/>',
    'message-circle': '<path d="M12 3.5a8.5 8.5 0 0 1 7.6 12.3L20.5 20l-4.2-.9A8.5 8.5 0 1 1 12 3.5Z" fill="currentColor" fill-opacity="0.16"/><circle cx="9" cy="12" r="1" fill="currentColor" stroke="none"/><circle cx="12" cy="12" r="1" fill="currentColor" stroke="none"/><circle cx="15" cy="12" r="1" fill="currentColor" stroke="none"/>',
    'message-square-check': '<path d="M4 5.5A2.5 2.5 0 0 1 6.5 3.5h11A2.5 2.5 0 0 1 20 6v8.5a2.5 2.5 0 0 1-2.5 2.5H8.8L4.5 20.5V16.8A2.5 2.5 0 0 1 4 15.5v-10Z" fill="currentColor" fill-opacity="0.16"/><path d="m9 10.5 2 2 4-4"/>',
    'calendar': '<rect x="3.5" y="4.8" width="17" height="15.7" rx="2.8" fill="currentColor" fill-opacity="0.14"/><path d="M3.5 7.6A2.8 2.8 0 0 1 6.3 4.8h11.4a2.8 2.8 0 0 1 2.8 2.8V9.5h-17V7.6Z" fill="currentColor" fill-opacity="0.32" stroke="none"/><path d="M3.5 9.5h17"/><path d="M8 2.8v3.2M16 2.8v3.2"/><circle cx="8" cy="13" r="1" fill="currentColor" stroke="none"/><circle cx="12" cy="13" r="1" fill="currentColor" stroke="none"/><circle cx="16" cy="13" r="1" fill="currentColor" stroke="none"/><circle cx="8" cy="16.8" r="1" fill="currentColor" stroke="none"/><circle cx="12" cy="16.8" r="1" fill="currentColor" stroke="none"/>',
    'calendar-days': '<rect x="3.5" y="4.8" width="17" height="15.7" rx="2.8" fill="currentColor" fill-opacity="0.14"/><path d="M3.5 7.6A2.8 2.8 0 0 1 6.3 4.8h11.4a2.8 2.8 0 0 1 2.8 2.8V9.5h-17V7.6Z" fill="currentColor" fill-opacity="0.32" stroke="none"/><path d="M3.5 9.5h17M8 2.8v3.2M16 2.8v3.2"/><circle cx="8" cy="13" r="1" fill="currentColor" stroke="none"/><circle cx="12" cy="13" r="1" fill="currentColor" stroke="none"/><circle cx="16" cy="13" r="1" fill="currentColor" stroke="none"/><circle cx="8" cy="16.8" r="1" fill="currentColor" stroke="none"/><circle cx="12" cy="16.8" r="1" fill="currentColor" stroke="none"/>',
    'calendar-check': '<rect x="3.5" y="4.8" width="17" height="15.7" rx="2.8" fill="currentColor" fill-opacity="0.14"/><path d="M3.5 9.5h17M8 2.8v3.2M16 2.8v3.2"/><path d="m9.2 14.8 2 2 3.8-4"/>',
    'calendar-check-2': '<rect x="3.5" y="4.8" width="17" height="15.7" rx="2.8" fill="currentColor" fill-opacity="0.14"/><path d="M3.5 9.5h17M8 2.8v3.2M16 2.8v3.2"/><path d="m9.2 14.8 2 2 3.8-4"/>',
    'calendar-plus': '<rect x="3.5" y="4.8" width="17" height="15.7" rx="2.8" fill="currentColor" fill-opacity="0.14"/><path d="M3.5 9.5h17M8 2.8v3.2M16 2.8v3.2"/><path d="M12 12.5v5M9.5 15h5"/>',
    'calendar-x': '<rect x="3.5" y="4.8" width="17" height="15.7" rx="2.8" fill="currentColor" fill-opacity="0.14"/><path d="M3.5 9.5h17M8 2.8v3.2M16 2.8v3.2"/><path d="m9.8 13 4.4 4.4M14.2 13l-4.4 4.4"/>',
    'calendar-x-2': '<rect x="3.5" y="4.8" width="17" height="15.7" rx="2.8" fill="currentColor" fill-opacity="0.14"/><path d="M3.5 9.5h17M8 2.8v3.2M16 2.8v3.2"/><path d="m9.8 13 4.4 4.4M14.2 13l-4.4 4.4"/>',
    'clock': '<circle cx="12" cy="12" r="9.5" fill="currentColor" fill-opacity="0.14"/><path d="M12 7v5.2l3.5 2" stroke-width="2.1"/>',
    'history': '<circle cx="12" cy="12" r="9" fill="currentColor" fill-opacity="0.12"/><path d="M3.8 8.5A8.8 8.8 0 1 1 4 15.5"/><path d="M3.5 4.8v3.8h3.8"/><path d="M12 8v4.2l3 1.8"/>',

    // ─── Services: Development, Creative, Business, Infrastructure ───────────
    'code-window': '<rect x="3" y="4.2" width="18" height="15.6" rx="2.8" fill="currentColor" fill-opacity="0.14"/><path d="M3 7A2.8 2.8 0 0 1 5.8 4.2h12.4A2.8 2.8 0 0 1 21 7v2H3V7Z" fill="currentColor" fill-opacity="0.32" stroke="none"/><path d="M3 9h18"/><path d="m9.6 12.2-2.2 2.2 2.2 2.2"/><path d="m14.4 12.2 2.2 2.2-2.2 2.2"/><path d="m12.8 11.6-1.6 5.6"/>',
    'code': '<path d="m8.5 7.5-4.8 4.5 4.8 4.5"/><path d="m15.5 7.5 4.8 4.5-4.8 4.5"/><path d="m13.2 5.5-2.4 13"/>',
    'palette': '<path d="M12 3a9 9 0 0 0 0 18c1.1 0 1.9-.8 1.9-1.8 0-.5-.2-.9-.5-1.2-.3-.4-.5-.8-.5-1.2 0-.7.6-1.2 1.3-1.2h2c2.7 0 4.8-2.2 4.8-4.9C21 6.7 17 3 12 3Z" fill="currentColor" fill-opacity="0.18"/><circle cx="7.8" cy="10.8" r="1.25" fill="currentColor" stroke="none"/><circle cx="10.5" cy="7.3" r="1.25" fill="currentColor" stroke="none"/><circle cx="14.5" cy="7.5" r="1.25" fill="currentColor" stroke="none"/><circle cx="16.8" cy="10.8" r="1.25" fill="currentColor" stroke="none"/>',
    'pen-tool': '<path d="m12 19 6.8-6.8 2.4 2.4L14.4 21.4 12 19Z" fill="currentColor" fill-opacity="0.28"/><path d="m17.5 13.5-1.4-7L3 3l3.5 13.1 7 1.4 4-4Z" fill="currentColor" fill-opacity="0.15"/><path d="m3 3 7.1 7.1"/><circle cx="11.2" cy="11.2" r="1.8" fill="currentColor" fill-opacity="0.3"/>',
    'sparkles': '<path d="m12 3 1.9 5.3L19.2 10l-5.3 1.9L12 17.2l-1.9-5.3L4.8 10l5.3-1.7L12 3Z" fill="currentColor" fill-opacity="0.24"/><path d="M19 3.5v3m-1.5-1.5h3M5.5 17v3M4 18.5h3"/>',
    'cloud': '<path d="M17.2 19H7.6A4.6 4.6 0 0 1 6.8 10 5.6 5.6 0 0 1 17.6 11a3.9 3.9 0 0 1-.4 8Z" fill="currentColor" fill-opacity="0.22"/>',
    'smartphone': '<rect x="6" y="2.5" width="12" height="19" rx="2.8" fill="currentColor" fill-opacity="0.16"/><path d="M10.5 5.5h3"/><circle cx="12" cy="18" r="1.1" fill="currentColor" stroke="none"/>',
    'megaphone': '<path d="M4.2 10.2 18.5 5.5v13L4.2 13.8a1.2 1.2 0 0 1-.8-1.1v-1.4a1.2 1.2 0 0 1 .8-1.1Z" fill="currentColor" fill-opacity="0.2"/><path d="M7.5 14.8v4.2a1.5 1.5 0 0 0 3 0v-3.5"/>',
    'headphones': '<path d="M4 14v-2a8 8 0 0 1 16 0v2"/><rect x="3.2" y="13.2" width="4" height="6.2" rx="1.6" fill="currentColor" fill-opacity="0.26"/><rect x="16.8" y="13.2" width="4" height="6.2" rx="1.6" fill="currentColor" fill-opacity="0.26"/>',
    'globe': '<circle cx="12" cy="12" r="9.5" fill="currentColor" fill-opacity="0.14"/><path d="M2.8 12h18.4"/><path d="M12 2.5a14 14 0 0 1 3.8 9.5A14 14 0 0 1 12 21.5a14 14 0 0 1-3.8-9.5A14 14 0 0 1 12 2.5Z"/>',
    'compass': '<circle cx="12" cy="12" r="9.5" fill="currentColor" fill-opacity="0.14"/><polygon points="15.8 8.2 13.7 13.7 8.2 15.8 10.3 10.3 15.8 8.2" fill="currentColor" fill-opacity="0.34"/>',
    'brain': '<path d="M12 5a3 3 0 0 0-5.8.6A3.8 3.8 0 0 0 4 9.5a3.7 3.7 0 0 0 1.4 6A3.4 3.4 0 0 0 12 18V5Z" fill="currentColor" fill-opacity="0.18"/><path d="M12 5a3 3 0 0 1 5.8.6A3.8 3.8 0 0 1 20 9.5a3.7 3.7 0 0 1-1.4 6A3.4 3.4 0 0 1 12 18V5Z" fill="currentColor" fill-opacity="0.18"/><path d="M9 10.5c1 .4 1.6 1 2 2m4-2c-1 .4-1.6 1-2 2"/>',
    'handshake': '<path d="m11 16 2.5 2.5a1.6 1.6 0 0 0 2.3-2.3l-2.5-2.5"/><path d="m4 11.5 4.2-4.2a2.5 2.5 0 0 1 3.5 0l3.8 3.8a2 2 0 0 1 0 2.8l-3.7 3.7a2.5 2.5 0 0 1-3.5 0L4 13.5v-2Z" fill="currentColor" fill-opacity="0.18"/><path d="m20 11.5-4.2-4.2a2.5 2.5 0 0 0-3.5 0"/>',

    // ─── Links, Refresh, Media, Location, Actions & Arrows ───────────────────
    'external-link': '<path d="M15 4.5h4.5V9"/><path d="m11 13 8.5-8.5"/><path d="M18.5 13v5a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V7.5a2 2 0 0 1 2-2h5" fill="currentColor" fill-opacity="0.12"/>',
    'refresh-cw': '<path d="M20 4.5v4.8h-4.8"/><path d="M4 19.5v-4.8h4.8"/><path d="M5.2 9.8A7.5 7.5 0 0 1 19 8.5"/><path d="M18.8 14.2A7.5 7.5 0 0 1 5 15.5"/>',
    'rotate-ccw': '<path d="M4 5.2v4.6h4.6"/><path d="M4.5 9.8a8 8 0 1 1-.3 4.8"/>',
    'image': '<rect x="3.5" y="4.5" width="17" height="15" rx="2.8" fill="currentColor" fill-opacity="0.14"/><circle cx="8.8" cy="9.5" r="1.4" fill="currentColor" stroke="none"/><path d="m5 17 4.2-4.2 3.2 3.1 2.8-2.8L19.5 17H5Z" fill="currentColor" fill-opacity="0.32"/>',
    'video': '<rect x="3" y="6" width="13.5" height="12" rx="2.5" fill="currentColor" fill-opacity="0.18"/><path d="m16.5 10 4.5-2.6v9.2L16.5 14v-4Z" fill="currentColor" fill-opacity="0.28"/>',
    'map-pin': '<path d="M12 21s-6.8-5.4-6.8-11a6.8 6.8 0 1 1 13.6 0c0 5.6-6.8 11-6.8 11Z" fill="currentColor" fill-opacity="0.2"/><circle cx="12" cy="10" r="2.5" fill="currentColor" fill-opacity="0.06"/>',
    'link': '<path d="M10 13.5a4.2 4.2 0 0 0 6 0l3.2-3.2a4.2 4.2 0 0 0-6-6L11.5 6"/><path d="M14 10.5a4.2 4.2 0 0 0-6 0L4.8 13.7a4.2 4.2 0 0 0 6 6l1.7-1.7"/>',
    'copy': '<rect x="8.5" y="8.5" width="11.5" height="11.5" rx="2.4" fill="currentColor" fill-opacity="0.18"/><path d="M15.5 8.5V6.4A2.4 2.4 0 0 0 13.1 4H6.4A2.4 2.4 0 0 0 4 6.4v6.7a2.4 2.4 0 0 0 2.4 2.4h2.1"/>',
    'printer': '<path d="M7 8V4.2h10V8"/><rect x="3.5" y="8" width="17" height="8" rx="2.4" fill="currentColor" fill-opacity="0.18"/><rect x="7" y="13.5" width="10" height="6.5" rx="1.2" fill="currentColor" fill-opacity="0.12"/><circle cx="17" cy="11.2" r="1" fill="currentColor" stroke="none"/>',
    'save': '<path d="M5 4h11l3 3v12a1.8 1.8 0 0 1-1.8 1.8H6.8A1.8 1.8 0 0 1 5 19V4Z" fill="currentColor" fill-opacity="0.16"/><rect x="8.5" y="4" width="6.5" height="4.5" rx="0.8" fill="currentColor" fill-opacity="0.28"/><rect x="8" y="13.5" width="8" height="7" rx="1" fill="currentColor" fill-opacity="0.12"/>',
    'qr-code': '<rect x="3.5" y="3.5" width="7" height="7" rx="1.5" fill="currentColor" fill-opacity="0.2"/><rect x="13.5" y="3.5" width="7" height="7" rx="1.5" fill="currentColor" fill-opacity="0.2"/><rect x="3.5" y="13.5" width="7" height="7" rx="1.5" fill="currentColor" fill-opacity="0.2"/><path d="M14 14h2.5v2.5H14zm3.5 3.5H20V20h-2.5zm0-3.5H20M14 20h2.5"/>',

    // ─── ERP Tables, Cards, Buildings, Tags, Tickets & Navigation Controls ───
    'building-2': '<rect x="4" y="3.5" width="10" height="17" rx="2" fill="currentColor" fill-opacity="0.18"/><path d="M14 9.5h4.2A1.8 1.8 0 0 1 20 11.3v9.2h-6" fill="currentColor" fill-opacity="0.12"/><path d="M7.5 7.8h3M7.5 11.4h3M7.5 15h3"/>',
    'building': '<rect x="4.5" y="3" width="15" height="18" rx="2.2" fill="currentColor" fill-opacity="0.16"/><path d="M8.5 7.5h2M13.5 7.5h2M8.5 11.5h2M13.5 11.5h2M10 21v-4.5h4V21"/>',
    'folder-open': '<path d="M3 7a2 2 0 0 1 2-2h4.2l2 2.2H18a2 2 0 0 1 2 2v1H5.8L3 18.5V7Z" fill="currentColor" fill-opacity="0.16"/><path d="M4.8 11.2h16l-2.4 7.5a2 2 0 0 1-1.9 1.3H3.5l1.3-8.8Z" fill="currentColor" fill-opacity="0.24"/>',
    'tag': '<path d="M4 4h7.2l8.5 8.5a2 2 0 0 1 0 2.8l-4.4 4.4a2 2 0 0 1-2.8 0L4 11.2V4Z" fill="currentColor" fill-opacity="0.18"/><circle cx="8.5" cy="8.5" r="1.3" fill="currentColor" stroke="none"/>',
    'ticket': '<path d="M3.5 6.5a2 2 0 0 1 2-2h13a2 2 0 0 1 2 2v3a2.2 2.2 0 0 0 0 4.5v3.5a2 2 0 0 1-2 2h-13a2 2 0 0 1-2-2V14a2.2 2.2 0 0 0 0-4.5v-3Z" fill="currentColor" fill-opacity="0.16"/><path d="M13.5 6v2M13.5 11v2M13.5 16v2"/>',
    'zap': '<path d="M13.2 2.8 5.2 13h6l-1.4 8.2 9-10.2h-6l.4-8.2Z" fill="currentColor" fill-opacity="0.26"/>',
    'thumbs-up': '<path d="M7.5 10.5V20H4.5A1.5 1.5 0 0 1 3 18.5v-6.5A1.5 1.5 0 0 1 4.5 10.5h3Z" fill="currentColor" fill-opacity="0.28"/><path d="M7.5 10.5 11.3 3.8a1.8 1.8 0 0 1 3 1.4l-.6 3.8h5.1a2 2 0 0 1 2 2.3l-1.1 7.2A2 2 0 0 1 17.7 20H7.5" fill="currentColor" fill-opacity="0.16"/>',
    'check': '<path d="m5 12.5 4.5 4.5 9.5-9.5" stroke-width="2.4"/>',
    'check-circle': '<circle cx="12" cy="12" r="9.5" fill="currentColor" fill-opacity="0.18"/><path d="m8.6 12.3 2.3 2.3 4.8-4.8" stroke-width="2.2"/>',
    'check-circle-2': '<circle cx="12" cy="12" r="9.5" fill="currentColor" fill-opacity="0.18"/><path d="m8.6 12.3 2.3 2.3 4.8-4.8" stroke-width="2.2"/>',
    'check-square': '<rect x="3.5" y="3.5" width="17" height="17" rx="3" fill="currentColor" fill-opacity="0.16"/><path d="m8.2 12.3 2.5 2.5 5.1-5.1" stroke-width="2.2"/>',
    'plus': '<path d="M12 5v14M5 12h14" stroke-width="2.3"/>',
    'plus-circle': '<circle cx="12" cy="12" r="9.5" fill="currentColor" fill-opacity="0.18"/><path d="M12 8.2v7.6M8.2 12h7.6" stroke-width="2.2"/>',
    'x': '<path d="M6.5 6.5 17.5 17.5M17.5 6.5l-11 11" stroke-width="2.3"/>',
    'menu': '<path d="M4 6.5h16M4 12h16M4 17.5h16" stroke-width="2.3"/>',
    'list': '<circle cx="5" cy="6.5" r="1.1" fill="currentColor" stroke="none"/><circle cx="5" cy="12" r="1.1" fill="currentColor" stroke="none"/><circle cx="5" cy="17.5" r="1.1" fill="currentColor" stroke="none"/><path d="M9 6.5h11M9 12h11M9 17.5h11"/>',
    'table': '<rect x="3.5" y="4.5" width="17" height="15" rx="2.5" fill="currentColor" fill-opacity="0.14"/><path d="M3.5 9.5h17M3.5 14.5h17M9.5 4.5v15"/>',
    'kanban': '<rect x="4" y="4" width="4.5" height="14" rx="1.3" fill="currentColor" fill-opacity="0.28"/><rect x="10.2" y="4" width="4.5" height="9" rx="1.3" fill="currentColor" fill-opacity="0.2"/><rect x="16.4" y="4" width="4.5" height="16" rx="1.3" fill="currentColor" fill-opacity="0.24"/>',
    'maximize': '<path d="M8 4H5.2A1.2 1.2 0 0 0 4 5.2V8m12-4h2.8A1.2 1.2 0 0 1 20 5.2V8M4 16v2.8A1.2 1.2 0 0 0 5.2 20H8m8 0h2.8a1.2 1.2 0 0 0 1.2-1.2V16"/>',
    'maximize-2': '<path d="M14.5 4H20v5.5M9.5 20H4v-5.5M20 4l-6.2 6.2M4 20l6.2-6.2"/>',
    'panel-left-close': '<rect x="3.5" y="4" width="17" height="16" rx="2.8" fill="currentColor" fill-opacity="0.12"/><path d="M9.5 4v16"/><path d="m15.2 9.5-2.6 2.5 2.6 2.5"/>',
    'panel-left-open': '<rect x="3.5" y="4" width="17" height="16" rx="2.8" fill="currentColor" fill-opacity="0.12"/><path d="M9.5 4v16"/><path d="m13.5 9.5 2.6 2.5-2.6 2.5"/>',
    'arrow-right': '<path d="M5 12h14"/><path d="m13 6 6 6-6 6"/>',
    'arrow-left': '<path d="M19 12H5"/><path d="m11 6-6 6 6 6"/>',
    'arrow-down': '<path d="M12 5v14"/><path d="m6 13 6 6 6-6"/>',
    'arrow-up-right': '<path d="M7 17 17 7"/><path d="M8.5 7H17v8.5"/>',
    'chevron-right': '<path d="m9.5 6.5 5.5 5.5-5.5 5.5"/>',
    'chevron-left': '<path d="m14.5 6.5-5.5 5.5 5.5 5.5"/>',
    'chevron-down': '<path d="m6.5 9.5 5.5 5.5 5.5-5.5"/>',
    'chevron-up': '<path d="m6.5 14.5 5.5-5.5 5.5 5.5"/>'
  };

  function inner(name) {
    return P[name] || P['layers'];
  }

  function svg(name, attrs) {
    attrs = attrs || {};
    const w = attrs.width || attrs.size || 20;
    const h = attrs.height || attrs.size || 20;
    const cls = attrs.class ? ` class="${attrs.class}"` : '';
    const id = attrs.id ? ` id="${attrs.id}"` : '';
    const style = attrs.style ? ` style="${attrs.style}"` : '';
    const aria = attrs.ariaHidden !== false ? ' aria-hidden="true"' : '';
    return `<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"${cls}${id}${style}${aria}>${inner(name)}</svg>`;
  }

  function hydrateNode(el) {
    if (!el || el.nodeType !== 1) return;
    const name = el.getAttribute('data-lucide');
    if (!name) return;
    if (el.tagName.toLowerCase() === 'svg' && el.getAttribute('data-arox-rendered') === name) return;

    const svgEl = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    // Preserve all original classes, styles, ids, dimensions, aria/title attrs
    Array.from(el.attributes).forEach(attr => {
      if (attr.name === 'data-arox-rendered') return;
      svgEl.setAttribute(attr.name, attr.value);
    });
    if (!svgEl.getAttribute('viewBox')) svgEl.setAttribute('viewBox', '0 0 24 24');
    svgEl.setAttribute('fill', 'none');
    svgEl.setAttribute('stroke', 'currentColor');
    svgEl.setAttribute('stroke-width', '2');
    svgEl.setAttribute('stroke-linecap', 'round');
    svgEl.setAttribute('stroke-linejoin', 'round');
    if (!svgEl.hasAttribute('aria-hidden')) svgEl.setAttribute('aria-hidden', 'true');
    svgEl.setAttribute('data-arox-rendered', name);

    // Ensure lucide CSS sizing class compatibility
    const cls = svgEl.getAttribute('class') || '';
    if (!cls.includes('lucide')) {
      svgEl.setAttribute('class', (cls ? cls + ' ' : '') + `lucide lucide-${name} arox-icon`);
    } else if (!cls.includes('arox-icon')) {
      svgEl.setAttribute('class', cls + ' arox-icon');
    }

    svgEl.innerHTML = inner(name);
    if (el.parentNode) {
      el.parentNode.replaceChild(svgEl, el);
    }
  }

  function hydrateLucide(root) {
    const scope = root && root.querySelectorAll ? root : document;
    const nodes = scope.querySelectorAll('[data-lucide]');
    for (let i = 0; i < nodes.length; i++) {
      hydrateNode(nodes[i]);
    }
  }

  function patchLucide() {
    if (global.lucide && !global.lucide.__aroxPatched) {
      global.lucide.createIcons = function (opts) {
        hydrateLucide((opts && opts.root) || document);
      };
      global.lucide.__aroxPatched = true;
    } else if (!global.lucide) {
      global.lucide = {
        createIcons: function (opts) {
          hydrateLucide((opts && opts.root) || document);
        },
        __aroxPatched: true
      };
    }
  }

  patchLucide();

  let obsScheduled = false;
  function startObserver() {
    if (typeof MutationObserver === 'undefined' || !document.body) return;
    const observer = new MutationObserver(() => {
      if (obsScheduled) return;
      obsScheduled = true;
      requestAnimationFrame(() => {
        obsScheduled = false;
        patchLucide();
        hydrateLucide(document);
      });
    });
    observer.observe(document.body, { childList: true, subtree: true, attributes: true, attributeFilter: ['data-lucide'] });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
      patchLucide();
      hydrateLucide(document);
      startObserver();
    });
  } else {
    patchLucide();
    hydrateLucide(document);
    startObserver();
  }

  global.AroxIcons = {
    paths: P,
    inner: inner,
    svg: svg,
    hydrateLucide: hydrateLucide
  };
})(window);
