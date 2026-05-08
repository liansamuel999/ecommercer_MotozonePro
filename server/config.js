const sqlite = require('sqlite');
const path = require('path');

const dbPath = path.join(__dirname, 'database', 'motozone.db');

const getDb = async () => {
  const db = await sqlite.open({
    filename: dbPath,
    driver: require('better-sqlite3')
  });
  return db;
};

module.exports = getDb;
