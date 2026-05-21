const express = require('express');
const router = express.Router();
const db = require('../config');

// GET /api/categorias - Obtener todas las categorías
router.get('/', (req, res) => {
  try {
    const stmt = db.prepare('SELECT id, nombre FROM categorias ORDER BY id');
    const rows = stmt.all();
    res.json(rows);
  } catch (error) {
    console.error('Error obteniendo categorías:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

module.exports = router;