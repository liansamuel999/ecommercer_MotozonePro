const express = require('express');
const router = express.Router();
const db = require('../config');

// GET /api/categorias - Obtener todas las categorías
router.get('/', (req, res) => {
  db.all('SELECT nombre FROM categorias ORDER BY id', [], (err, rows) => {
        // Extraer solo los nombres y devolver array
    if (err) return res.status(500).json({ error: err.message });
    const categorias = rows.map(row => row.nombre);
    res.json(categorias);
  });
});

module.exports = router;