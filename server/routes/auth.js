const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const db = require('../config');

const router = express.Router();
const SECRET_KEY = 'mi_clave_secreta';

// Registro de usuario
router.post('/register', (req, res) => {
  const { nombre, email, password } = req.body;

  if (!nombre || !email || !password) {
    return res.status(400).json({ success: false, message: 'Todos los campos son obligatorios' });
  }

  try {
    // Verificar si el email ya existe
    const existingUser = db.prepare('SELECT id FROM usuarios WHERE email = ?').get(email);
    if (existingUser) {
      return res.status(400).json({ success: false, message: 'El email ya está registrado' });
    }

    // Hash de la contraseña
    const hashedPassword = bcrypt.hashSync(password, 10);

    // Insertar usuario
    const stmt = db.prepare('INSERT INTO usuarios (nombre, email, password) VALUES (?, ?, ?)');
    const result = stmt.run(nombre, email, hashedPassword);

    res.json({ success: true, message: 'Usuario registrado exitosamente', userId: result.lastInsertRowid });
  } catch (error) {
    console.error('Error en registro:', error);
    res.status(500).json({ success: false, message: 'Error al registrar usuario' });
  }
});

// Login de usuario
router.post('/login', (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ success: false, message: 'Email y contraseña son obligatorios' });
  }

  try {
    // Buscar usuario por email
    const user = db.prepare('SELECT * FROM usuarios WHERE email = ?').get(email);
    if (!user) {
      return res.status(401).json({ success: false, message: 'Credenciales inválidas' });
    }

    // Verificar contraseña
    const isValidPassword = bcrypt.compareSync(password, user.password);
    if (!isValidPassword) {
      return res.status(401).json({ success: false, message: 'Credenciales inválidas' });
    }

    // Generar token JWT
    const token = jwt.sign({ id: user.id, email: user.email, is_admin: user.is_admin }, SECRET_KEY, { expiresIn: '24h' });

    res.json({
      success: true,
      message: 'Login exitoso',
      token,
      user: { id: user.id, nombre: user.nombre, email: user.email, is_admin: user.is_admin }
    });
  } catch (error) {
    console.error('Error en login:', error);
    res.status(500).json({ success: false, message: 'Error en el servidor' });
  }
});

module.exports = router;