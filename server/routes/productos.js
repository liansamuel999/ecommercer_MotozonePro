const express = require('express');
const router = express.Router();
const db = require('../config');

// GET /api/productos - Listar productos con filtros opcionales
router.get('/', (req, res) => {
  const { categoria, moto } = req.query;

  try {
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

    const stmt = db.prepare(sql);
    const rows = stmt.all(...params);

    const productos = rows.map(row => ({
      ...row,
      especificaciones: JSON.parse(row.especificaciones || '{}'),
      modelos_compatibles: JSON.parse(row.modelos_compatibles || '[]')
    }));

    res.json(productos);
  } catch (error) {
    console.error('Error obteniendo productos:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

module.exports = router;