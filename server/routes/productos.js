const express = require('express');
const router = express.Router();
const db = require('../config');
const jwt = require('jsonwebtoken');

const SECRET_KEY = 'mi_clave_secreta';

// Middleware para verificar si es admin
const verificarAdmin = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) {
    return res.status(401).json({ success: false, message: 'Token requerido' });
  }

  try {
    const decoded = jwt.verify(token, SECRET_KEY);
    if (!decoded.is_admin) {
      return res.status(403).json({ success: false, message: 'Acceso denegado. Solo administradores' });
    }
    req.user = decoded;
    next();
  } catch (error) {
    return res.status(401).json({ success: false, message: 'Token inválido' });
  }
};

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

    // Solo productos activos (no eliminados)
    conditions.push('p.deleted_at IS NULL');

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

    console.log('📋 GET /productos - SQL:', sql, 'Params:', params);

    const stmt = db.prepare(sql);
    const rows = stmt.all(...params);

    console.log('📦 Productos encontrados:', rows.length);

    const productos = rows.map(row => ({
      ...row,
      especificaciones: JSON.parse(row.especificaciones || '{}'),
      modelos_compatibles: JSON.parse(row.modelos_compatibles || '[]')
    }));

    res.json(productos);
  } catch (error) {
    console.error('❌ Error obteniendo productos:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

// POST /api/productos - Crear nuevo producto (solo admin)
router.post('/', verificarAdmin, (req, res) => {
  const { nombre, precio, categoria_id, imagen, especificaciones, modelos_compatibles } = req.body;

  console.log('📝 POST /productos recibido:', { nombre, precio, categoria_id });

  if (!nombre || !precio || !categoria_id) {
    return res.status(400).json({ success: false, message: 'Nombre, precio y categoría son obligatorios' });
  }

  try {
    const stmt = db.prepare(`
      INSERT INTO productos (nombre, precio, categoria_id, imagen, especificaciones, modelos_compatibles, deleted_at)
      VALUES (?, ?, ?, ?, ?, ?, NULL)
    `);

    const result = stmt.run(
      nombre,
      precio,
      categoria_id,
      imagen || null,
      JSON.stringify(especificaciones || {}),
      JSON.stringify(modelos_compatibles || ['Universal'])
    );

    console.log('✅ Producto insertado con ID:', result.lastInsertRowid);

    const nuevoProducto = db.prepare(`
      SELECT p.*, c.nombre as categoria_nombre
      FROM productos p
      JOIN categorias c ON p.categoria_id = c.id
      WHERE p.id = ? AND p.deleted_at IS NULL
    `).get(result.lastInsertRowid);

    console.log('📦 Producto recuperado:', nuevoProducto);

    if (!nuevoProducto) {
      console.log('❌ No se pudo recuperar el producto');
      return res.status(500).json({ success: false, message: 'Error al recuperar producto creado' });
    }

    res.json({
      success: true,
      message: 'Producto creado exitosamente',
      producto: {
        ...nuevoProducto,
        especificaciones: JSON.parse(nuevoProducto.especificaciones || '{}'),
        modelos_compatibles: JSON.parse(nuevoProducto.modelos_compatibles || '[]')
      }
    });
  } catch (error) {
    console.error('❌ Error creando producto:', error);
    res.status(500).json({ success: false, message: 'Error al crear producto' });
  }
});

// PUT /api/productos/:id - Actualizar producto (solo admin)
router.put('/:id', verificarAdmin, (req, res) => {
  const { id } = req.params;
  const { nombre, precio, categoria_id, imagen, especificaciones, modelos_compatibles } = req.body;

  try {
    const stmt = db.prepare(`
      UPDATE productos
      SET nombre = COALESCE(?, nombre),
          precio = COALESCE(?, precio),
          categoria_id = COALESCE(?, categoria_id),
          imagen = COALESCE(?, imagen),
          especificaciones = COALESCE(?, especificaciones),
          modelos_compatibles = COALESCE(?, modelos_compatibles)
      WHERE id = ? AND deleted_at IS NULL
    `);

    stmt.run(
      nombre || null,
      precio || null,
      categoria_id || null,
      imagen || null,
      especificaciones ? JSON.stringify(especificaciones) : null,
      modelos_compatibles ? JSON.stringify(modelos_compatibles) : null,
      id
    );

    const productoActualizado = db.prepare(`
      SELECT p.*, c.nombre as categoria_nombre
      FROM productos p
      JOIN categorias c ON p.categoria_id = c.id
      WHERE p.id = ? AND p.deleted_at IS NULL
    `).get(id);

    if (!productoActualizado) {
      return res.status(404).json({ success: false, message: 'Producto no encontrado' });
    }

    res.json({
      success: true,
      message: 'Producto actualizado exitosamente',
      producto: {
        ...productoActualizado,
        especificaciones: JSON.parse(productoActualizado.especificaciones || '{}'),
        modelos_compatibles: JSON.parse(productoActualizado.modelos_compatibles || '[]')
      }
    });
  } catch (error) {
    console.error('Error actualizando producto:', error);
    res.status(500).json({ success: false, message: 'Error al actualizar producto' });
  }
});

// DELETE /api/productos/:id - Eliminar producto (soft delete - solo admin)
router.delete('/:id', verificarAdmin, (req, res) => {
  const { id } = req.params;

  try {
    // Verificar que el producto existe y no está ya eliminado
    const producto = db.prepare('SELECT id FROM productos WHERE id = ? AND deleted_at IS NULL').get(id);
    if (!producto) {
      return res.status(404).json({ success: false, message: 'Producto no encontrado' });
    }

    // Soft delete: marcar como eliminado con timestamp
    const stmt = db.prepare('UPDATE productos SET deleted_at = CURRENT_TIMESTAMP WHERE id = ?');
    stmt.run(id);

    res.json({
      success: true,
      message: 'Producto eliminado exitosamente'
    });
  } catch (error) {
    console.error('Error eliminando producto:', error);
    res.status(500).json({ success: false, message: 'Error al eliminar producto' });
  }
});

module.exports = router;