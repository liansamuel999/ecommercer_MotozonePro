const sqlite3 = require('sqlite3').verbose();
const path = require('path');

// Conexión a SQLite usando sqlite3
const dbPath = path.join(__dirname, 'database', 'motozone.db');
const db = new sqlite3.Database(dbPath, (err) => {
  if (err) {
    console.error('Error al conectar con SQLite:', err.message);
  } else {
    console.log('Conectado a SQLite');
  }
});

module.exports = db;