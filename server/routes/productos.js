const express = require('express');
const router = express.Router();
const db = require('../config');

// GET /api/productos - Listar productos con filtros opcionales
router.get('/', (req, res) => {
  const { categoria, moto } = req.query;
    // JOIN con categorías para obtener categoria_nombre
  // Si hay filtro por categoría, agregar condición WHERE
  // Si hay filtro por moto, buscar en JSON array de modelos_compatibles
  // Parsear especificaciones y modelos_compatibles a objetos/arrays
  // Devolver array de productos
  let sql = `
    SELECT p.*, c.nombre as categoria_nombre
    FROM productos p
    JOIN categorias c ON p.categoria_id = c.id
  `;
  const params = [];
  const conditions = [];

  if (categoria && categoria !== 'Todos') {
    conditions.push('c.nombre = ?');
    params.push(categoria);
  }
  if (moto && moto !== 'Todas') {
    conditions.push(`(
      json_extract(p.modelos_compatibles, '$') LIKE ? OR
      json_extract(p.modelos_compatibles, '$') LIKE ?
    )`);
    params.push(`%"${moto}"%`, '%"Universal"%');
  }

  if (conditions.length) sql += ' WHERE ' + conditions.join(' AND ');
  sql += ' ORDER BY p.id';

  db.all(sql, params, (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    const productos = rows.map(row => ({
      ...row,
      especificaciones: JSON.parse(row.especificaciones || '{}'),
      modelos_compatibles: JSON.parse(row.modelos_compatibles || '[]')
    }));
    res.json(productos);
  });
});

module.exports = router;