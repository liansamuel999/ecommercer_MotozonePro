const express = require('express');
const router = express.Router();
const db = require('../config');

// GET /api/modelos - Obtener modelos únicos de todos los productos
router.get('/', (req, res) => {
  db.all('SELECT modelos_compatibles FROM productos', [], (err, rows) => {
    // Recorrer todos los productos
    // Parsear JSON de modelos_compatibles
    // Usar Set para obtener valores únicos
    // Devolver array ordenado
    if (err) return res.status(500).json({ error: err.message });
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
  });
});

module.exports = router;