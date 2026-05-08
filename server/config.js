const Database = require('better-sqlite3');
const path = require('path');

// Conexión a SQLite usando better-sqlite3
const dbPath = path.join(__dirname, 'database', 'motozone.db');
const db = new Database(dbPath);

db.pragma('journal_mode = WAL');

console.log('Conectado a SQLite');

module.exports = db;