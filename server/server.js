const express = require('express');
const cors = require('cors');
const path = require('path');
const db = require('./config'); 

// Configuración de Express
const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors()); // Permite peticiones desde React
app.use(express.json()); // Parsear JSON en body

// Rutas
app.use('/api/auth', require('./routes/auth'));
app.use('/api/productos', require('./routes/productos'));
app.use('/api/categorias', require('./routes/categorias'));
app.use('/api/modelos', require('./routes/modelos'));
// Servir archivos estáticos del cliente React
app.use(express.static(path.join(__dirname, '../client/build')));

// Para rutas no encontradas, servir index.html (necesario para React Router)
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../client/build/index.html'));
});

// Iniciar servidor
app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});


