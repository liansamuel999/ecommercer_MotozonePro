const express = require('express');
const router = express.Router();
const db = require('../config');

// GET /api/modelos - Obtener modelos únicos de todos los productos
router.get('/', (req, res) => {
  try {
    const stmt = db.prepare('SELECT modelos_compatibles FROM productos');
    const rows = stmt.all();

    let modelosSet = new Set();
    rows.forEach(row => {
      if (!row.modelos_compatibles) return;
      try {
        const arr = JSON.parse(row.modelos_compatibles);
        if (Array.isArray(arr)) {
          arr.forEach(m => {
            if (m && typeof m === 'string') modelosSet.add(m);
          });
        }
      } catch (e) {
        console.warn('Error parseando modelos_compatibles:', row.modelos_compatibles);
      }
    });

    res.json(Array.from(modelosSet).sort());
  } catch (error) {
    console.error('Error obteniendo modelos:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

module.exports = router;

module.exports = router;