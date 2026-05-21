const express = require('express');
const cors = require('cors');
const path = require('path');
const db = require('./config'); 

// Configuración de Express
const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors()); // Permite peticiones desde React
app.use(express.json({ limit: '50mb' })); // Parsear JSON en body con límite mayor para imágenes
app.use(express.urlencoded({ limit: '50mb', extended: true })); // Para formularios grandes

// Desactivar caché en desarrollo para que el preview siempre cargue la versión actual
if (process.env.NODE_ENV !== 'production') {
  app.use((req, res, next) => {
    res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
    res.setHeader('Pragma', 'no-cache');
    res.setHeader('Expires', '0');
    next();
  });
}

// Rutas
app.use('/api/auth', require('./routes/auth'));
app.use('/api/productos', require('./routes/productos'));
app.use('/api/categorias', require('./routes/categorias'));
app.use('/api/modelos', require('./routes/modelos'));
// Servir archivos estáticos del cliente React
app.use(express.static(path.join(__dirname, '../client/build')));

// Para rutas no encontradas, servir index.html (necesario para React Router)
app.get(/.*/, (req, res) => {
  res.sendFile(path.join(__dirname, '../client/build/index.html'));
});

// Iniciar servidor
app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
