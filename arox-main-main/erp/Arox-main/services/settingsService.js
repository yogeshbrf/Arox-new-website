const { getDb } = require('../config/database');
const appConfig = require('../config/app');
const logger = require('../utils/logger');

// Default initial settings
const DEFAULT_SETTINGS = {
  org: {
    name: (appConfig.org && appConfig.org.name) || 'AROX Tech Pvt. Ltd.',
    tagline: 'Enterprise Training & Software Solutions',
    address: (appConfig.org && appConfig.org.address) || 'Chennai, Tamil Nadu, India',
    phone: (appConfig.org && appConfig.org.phone) || '+91 98765 43210',
    email: (appConfig.org && appConfig.org.email) || 'info@aroxtech.com',
    website: (appConfig.org && appConfig.org.website) || 'https://aroxtech.com',
    gstin: (appConfig.org && appConfig.org.gstin) || '33AABCU9603R1ZM',
    support_hours: 'Mon - Sat: 9:00 AM - 6:00 PM'
  },
  crm: {
    auto_assign_leads: true,
    overdue_alert_hours: 24,
    currency_symbol: '₹',
    default_pipeline_stage: 'new',
    notify_sales_email: 'sales@aroxtech.com'
  },
  generator: {
    signatory_name: 'R. Kavitha',
    signatory_title: 'Director of Operations',
    issuer_city: 'Salem',
    qr_verification: true,
    default_internship_duration: '3 Months'
  },
  security: {
    session_duration_days: 7,
    allow_registrations: true,
    maintenance_mode: false,
    require_email_verification: false
  },
  notifications: {
    email_on_lead: true,
    email_on_payment: true,
    email_on_review: true,
    daily_digest: true
  }
};

let cachedSettings = null;
let lastCacheTime = 0;
const CACHE_TTL_MS = 5000;

function ensureTable(db) {
  try {
    db.exec(`
      CREATE TABLE IF NOT EXISTS settings (
        key TEXT PRIMARY KEY,
        value TEXT NOT NULL,
        section TEXT NOT NULL DEFAULT 'general',
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
      );
    `);
  } catch (e) {
    logger.warn('ensureTable settings error: ' + e.message);
  }
}

function getAllSettings() {
  const now = Date.now();
  if (cachedSettings && (now - lastCacheTime < CACHE_TTL_MS)) {
    return cachedSettings;
  }

  try {
    const db = getDb();
    ensureTable(db);

    const rows = db.prepare('SELECT key, value, section FROM settings').all() || [];
    
    // Deep clone defaults
    const result = JSON.parse(JSON.stringify(DEFAULT_SETTINGS));

    rows.forEach(r => {
      let parsedValue = r.value;
      try {
        parsedValue = JSON.parse(r.value);
      } catch (e) {
        parsedValue = r.value;
      }

      if (r.section && result[r.section]) {
        result[r.section][r.key] = parsedValue;
      } else {
        if (!result[r.section]) result[r.section] = {};
        result[r.section][r.key] = parsedValue;
      }
    });

    cachedSettings = result;
    lastCacheTime = now;
    return result;
  } catch (err) {
    logger.error('Failed to load settings from DB:', err.message);
    return DEFAULT_SETTINGS;
  }
}

function getOrgSettings() {
  const all = getAllSettings();
  return all.org || DEFAULT_SETTINGS.org;
}

function updateSection(section, data, req = null) {
  const db = getDb();
  ensureTable(db);

  if (!section || typeof data !== 'object' || data === null) {
    throw new Error('Invalid section or data provided for settings update');
  }

  const upsertStmt = db.prepare(`
    INSERT INTO settings (key, value, section, updated_at)
    VALUES (?, ?, ?, CURRENT_TIMESTAMP)
    ON CONFLICT(key) DO UPDATE SET
      value = excluded.value,
      section = excluded.section,
      updated_at = CURRENT_TIMESTAMP
  `);

  for (const [key, val] of Object.entries(data)) {
    let storedVal = typeof val === 'object' ? JSON.stringify(val) : String(val);
    upsertStmt.run(key, storedVal, section);
  }

  // Invalidate cache immediately
  cachedSettings = null;
  lastCacheTime = 0;

  // Log audit if auditService exists
  try {
    const { logAudit } = require('./auditService');
    logAudit(req, {
      action: 'UPDATE',
      module: 'settings',
      entityType: 'settings_section',
      entityId: section,
      newValues: data
    });
  } catch (e) {}

  return getAllSettings();
}

module.exports = {
  getAllSettings,
  getOrgSettings,
  updateSection,
  DEFAULT_SETTINGS
};
