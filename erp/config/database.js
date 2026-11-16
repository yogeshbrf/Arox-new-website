const fs = require('fs');
const path = require('path');
const os = require('os');
const initSqlJs = require('sql.js');
const logger = require('../utils/logger');

// Local SQLite database file path for 100% persistent storage
const SEED_DB_FILE = path.resolve(__dirname, '..', 'database', 'arox.sqlite');
const IS_VERCEL = !!(process.env.VERCEL || process.env.NOW_REGION);
const DB_FILE = IS_VERCEL ? path.join(os.tmpdir(), 'arox.sqlite') : SEED_DB_FILE;

let sqlJsDb = null;
let saveDebounceTimer = null;

// Flush memory DB to disk
function saveDbToDisk() {
  if (!sqlJsDb) return;
  try {
    const data = sqlJsDb.export();
    const buffer = Buffer.from(data);
    const dir = path.dirname(DB_FILE);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    fs.writeFileSync(DB_FILE, buffer);
  } catch (err) {
    logger.error('Failed to save SQLite DB to disk:', err.message);
  }
}

function scheduleSave() {
  if (saveDebounceTimer) clearTimeout(saveDebounceTimer);
  saveDebounceTimer = setTimeout(() => {
    saveDbToDisk();
  }, 100);
}

// Helper to resolve params for sql.js
function resolveParams(args) {
  if (args.length === 0) return [];
  if (args.length === 1 && Array.isArray(args[0])) return args[0];
  if (args.length === 1 && typeof args[0] === 'object' && args[0] !== null) {
    const obj = args[0];
    const res = {};
    for (const k of Object.keys(obj)) {
      const cleanKey = k.replace(/^[:@$]/, '');
      res[':' + cleanKey] = obj[k];
      res['@' + cleanKey] = obj[k];
      res['$' + cleanKey] = obj[k];
    }
    return res;
  }
  return args;
}

class SqliteStatementWrapper {
  constructor(db, sql) {
    this.db = db;
    this.sql = sql;
  }

  run(...args) {
    const params = resolveParams(args);
    let stmt;
    try {
      stmt = this.db.prepare(this.sql);
      stmt.bind(params);
      stmt.step();
    } finally {
      if (stmt) stmt.free();
    }

    let lastInsertRowid = 0;
    try {
      const res = this.db.exec('SELECT last_insert_rowid() as id');
      if (res && res[0] && res[0].values && res[0].values[0]) {
        lastInsertRowid = res[0].values[0][0];
      }
    } catch (e) {}

    const changes = this.db.getRowsModified();
    scheduleSave();

    return { changes, lastInsertRowid };
  }

  get(...args) {
    const params = resolveParams(args);
    let stmt;
    try {
      stmt = this.db.prepare(this.sql);
      stmt.bind(params);
      if (stmt.step()) {
        return stmt.getAsObject();
      }
      return undefined;
    } finally {
      if (stmt) stmt.free();
    }
  }

  all(...args) {
    const params = resolveParams(args);
    let stmt;
    const rows = [];
    try {
      stmt = this.db.prepare(this.sql);
      stmt.bind(params);
      while (stmt.step()) {
        rows.push(stmt.getAsObject());
      }
      return rows;
    } finally {
      if (stmt) stmt.free();
    }
  }
}

class SqliteDatabaseWrapper {
  constructor(db) {
    this.db = db;
  }

  prepare(sql) {
    return new SqliteStatementWrapper(this.db, sql);
  }

  exec(sql) {
    try {
      this.db.exec(sql);
      scheduleSave();
    } catch (err) {
      logger.warn(`SQLite exec notice: ${err.message}`);
    }
  }

  pragma(str) {
    try {
      this.db.exec(`PRAGMA ${str}`);
    } catch (e) {}
  }

  transaction(fn) {
    return (...args) => {
      this.db.exec('BEGIN TRANSACTION;');
      try {
        const result = fn(...args);
        this.db.exec('COMMIT;');
        scheduleSave();
        return result;
      } catch (err) {
        this.db.exec('ROLLBACK;');
        throw err;
      }
    };
  }

  close() {
    saveDbToDisk();
  }
}

let dbInstance = null;
let initPromise = null;

async function initDb() {
  if (dbInstance) return dbInstance;
  if (initPromise) return initPromise;

  initPromise = (async () => {
    try {
      const SQL = await initSqlJs();
      let db;

      if (IS_VERCEL && !fs.existsSync(DB_FILE) && fs.existsSync(SEED_DB_FILE)) {
        try {
          fs.copyFileSync(SEED_DB_FILE, DB_FILE);
          logger.info(`✅ Seeded SQLite DB to writable serverless location: ${DB_FILE}`);
        } catch (copyErr) {
          logger.warn('Failed to copy seed database to /tmp:', copyErr.message);
        }
      }

      if (fs.existsSync(DB_FILE)) {
        try {
          const fileBuffer = fs.readFileSync(DB_FILE);
          db = new SQL.Database(fileBuffer);
          logger.info(`✅ Loaded existing database from ${DB_FILE}`);
        } catch (readErr) {
          logger.warn('Corrupt DB file, checking seed DB or creating fresh DB:', readErr.message);
          if (fs.existsSync(SEED_DB_FILE)) {
            const seedBuffer = fs.readFileSync(SEED_DB_FILE);
            db = new SQL.Database(seedBuffer);
          } else {
            db = new SQL.Database();
          }
        }
      } else {
        logger.info('Creating new SQLite database...');
        db = new SQL.Database();
      }

      sqlJsDb = db;
      dbInstance = new SqliteDatabaseWrapper(db);

      return dbInstance;
    } catch (err) {
      logger.error('Failed to initialize SQLite sql.js database:', err);
      initPromise = null;
      throw err;
    }
  })();

  return initPromise;
}

function getDb() {
  if (!dbInstance) {
    throw new Error('Database not initialized. Please call initDb() first.');
  }
  return dbInstance;
}

function closeDb() {
  if (dbInstance) {
    dbInstance.close();
  }
}

module.exports = { getDb, initDb, closeDb, saveDbToDisk };
