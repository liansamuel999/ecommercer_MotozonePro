const express = require('express');
const router = express.Router();
const db = require('../config');

// GET /api/categorias - Obtener todas las categorías
router.get('/', (req, res) => {
  try {
    const stmt = db.prepare('SELECT nombre FROM categorias ORDER BY id');
    const rows = stmt.all();
    const categorias = rows.map(row => row.nombre);
    res.json(categorias);
  } catch (error) {
    console.error('Error obteniendo categorías:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

module.exports = router;