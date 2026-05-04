const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const dbPath = path.join(__dirname, 'motozone.db');
const db = new sqlite3.Database(dbPath);

db.serialize(() => {
  // Crear tablas
  db.run(`
    CREATE TABLE IF NOT EXISTS categorias (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      nombre TEXT NOT NULL,
      descripcion TEXT
    )
  `);

  db.run(`
    CREATE TABLE IF NOT EXISTS productos (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      nombre TEXT NOT NULL,
      precio REAL NOT NULL,
      categoria_id INTEGER,
      imagen TEXT,
      especificaciones TEXT,
      modelos_compatibles TEXT,
      FOREIGN KEY (categoria_id) REFERENCES categorias(id)
    )
  `);

  db.run(`
    CREATE TABLE IF NOT EXISTS usuarios (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      nombre TEXT NOT NULL,
      email TEXT UNIQUE NOT NULL,
      password TEXT NOT NULL,
      fecha_registro DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);

  db.run(`
    CREATE TABLE IF NOT EXISTS pedidos (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      usuario_id INTEGER,
      fecha DATETIME DEFAULT CURRENT_TIMESTAMP,
      total REAL NOT NULL,
      estado TEXT DEFAULT 'pendiente',
      FOREIGN KEY (usuario_id) REFERENCES usuarios(id)
    )
  `);

  db.run(`
    CREATE TABLE IF NOT EXISTS detalles_pedido (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      pedido_id INTEGER,
      producto_id INTEGER,
      cantidad INTEGER,
      precio_unitario REAL,
      FOREIGN KEY (pedido_id) REFERENCES pedidos(id),
      FOREIGN KEY (producto_id) REFERENCES productos(id)
    )
  `);

  // Insertar categorías (usamos un flag para saber cuándo terminaron)
  const categorias = [
    { nombre: 'Transmisión', descripcion: 'Kits de arrastre, cadenas, piñones' },
    { nombre: 'Frenos', descripcion: 'Pastillas, discos, bombas' },
    { nombre: 'Mantenimiento', descripcion: 'Aceites, filtros, bujías' },
    { nombre: 'Seguridad', descripcion: 'Cascos, guantes, chalecos' },
    { nombre: 'Eléctrico', descripcion: 'Baterías, reguladores, luces' },
    { nombre: 'Suspensión', descripcion: 'Amortiguadores, horquillas' },
  ];

  let categoriasInsertadas = 0;
  const categoriaMap = new Map(); // para guardar {nombre: id}

  const insertCategoria = db.prepare(`
    INSERT INTO categorias (nombre, descripcion)
    VALUES (?, ?)
  `);

  categorias.forEach(cat => {
    insertCategoria.run(cat.nombre, cat.descripcion, function(err) {
      if (err) throw err;
      categoriaMap.set(cat.nombre, this.lastID);
      categoriasInsertadas++;
      if (categoriasInsertadas === categorias.length) {
        // Todas las categorías insertadas, procedemos a insertar productos
        insertarProductos();
      }
    });
  });
  insertCategoria.finalize();

  function insertarProductos() {
    const productos = [
  {
    "nombre": "Aceite motor 10W40",
    "precio": 45000,
    "categoria": "Mantenimiento",
    "imagen": "imagenes/aceite-10w40-universal.jpg",
    "especificaciones": {
      "viscosidad": "10W40",
      "especificacion": "JASO MA2"
    },
    "modelosCompatibles": ["Universal"]
  },
  {
    "nombre": "Aceite motor 20W50",
    "precio": 48000,
    "categoria": "Mantenimiento",
    "imagen": "imagenes/aceite-20w50-universal.jpg",
    "especificaciones": {
      "viscosidad": "20W50",
      "especificacion": "JASO MA"
    },
    "modelosCompatibles": ["Universal"]
  },
  {
    "nombre": "Filtro de aire Yamaha R3",
    "precio": 65000,
    "categoria": "Mantenimiento",
    "imagen": "imagenes/yamaha-r3-filtro-aire.jpg",
    "especificaciones": {
      "tipo": "Filtro de papel",
      "uso": "OEM"
    },
    "modelosCompatibles": ["Yamaha R3"]
  },
  {
    "nombre": "Bujía NGK CR8E",
    "precio": 35000,
    "categoria": "Mantenimiento",
    "imagen": "imagenes/bujia-ngk-cr8e-universal.jpg",
    "especificaciones": {
      "tipo": "Iridio",
      "rosca": "M10"
    },
    "modelosCompatibles": ["Universal"]
  },
  {
    "nombre": "Kit de arrastre Yamaha MT-07",
    "precio": 185000,
    "categoria": "Transmisión",
    "imagen": "imagenes/yamaha-mt07-kit-arrastre.jpg",
    "especificaciones": {
      "material": "Acero templado",
      "relacion": "15/42",
      "tipo": "Kit completo"
    },
    "modelosCompatibles": ["Yamaha MT-07"]
  },
  {
    "nombre": "Kit de arrastre Honda CB125F",
    "precio": 175000,
    "categoria": "Transmisión",
    "imagen": "imagenes/honda-cb125f-kit-arrastre.jpg",
    "especificaciones": {
      "material": "Acero",
      "relacion": "14/44"
    },
    "modelosCompatibles": ["Honda CB125F"]
  },
  {
    "nombre": "Cadena reforzada 520",
    "precio": 120000,
    "categoria": "Transmisión",
    "imagen": "imagenes/cadena-520-universal.jpg",
    "especificaciones": {
      "material": "Acero",
      "longitud": "120 eslabones"
    },
    "modelosCompatibles": ["Universal"]
  },
  {
    "nombre": "Pastillas de freno Honda CB190R",
    "precio": 78000,
    "categoria": "Frenos",
    "imagen": "imagenes/honda-cb190r-pastillas-freno.jpg",
    "especificaciones": {
      "material": "Sinterizadas",
      "tipo": "Delanteras"
    },
    "modelosCompatibles": ["Honda CB190R"]
  },
  {
    "nombre": "Pastillas de freno Yamaha MT-07",
    "precio": 125000,
    "categoria": "Frenos",
    "imagen": "imagenes/yamaha-mt07-pastillas-freno.jpg",
    "especificaciones": {
      "material": "Sinterizadas",
      "tipo": "Delanteras"
    },
    "modelosCompatibles": ["Yamaha MT-07"]
  },
  {
    "nombre": "Disco de freno Honda CB125F",
    "precio": 135000,
    "categoria": "Frenos",
    "imagen": "imagenes/honda-cb125f-disco-freno.jpg",
    "especificaciones": {
      "material": "Acero inoxidable",
      "diametro": "240mm"
    },
    "modelosCompatibles": ["Honda CB125F"]
  },
  {
    "nombre": "Batería 12V 9Ah",
    "precio": 210000,
    "categoria": "Eléctrico",
    "imagen": "imagenes/bateria-12v9ah-universal.jpg",
    "especificaciones": {
      "tipo": "Libre de mantenimiento",
      "voltaje": "12V"
    },
    "modelosCompatibles": ["Universal"]
  },
  {
    "nombre": "Bombillo LED H4",
    "precio": 95000,
    "categoria": "Eléctrico",
    "imagen": "imagenes/bombillo-led-h4-universal.jpg",
    "especificaciones": {
      "tipo": "LED",
      "voltaje": "12V"
    },
    "modelosCompatibles": ["Universal"]
  },
  {
    "nombre": "Regulador de voltaje Bajaj Pulsar NS200",
    "precio": 130000,
    "categoria": "Eléctrico",
    "imagen": "imagenes/bajaj-ns200-regulador.jpg",
    "especificaciones": {
      "voltaje": "12V",
      "tipo": "OEM"
    },
    "modelosCompatibles": ["Bajaj Pulsar NS200"]
  },
  {
    "nombre": "Amortiguador trasero Honda XR190L",
    "precio": 450000,
    "categoria": "Suspensión",
    "imagen": "imagenes/honda-xr190l-amortiguador.jpg",
    "especificaciones": {
      "tipo": "Monoshock",
      "ajuste": "Precarga"
    },
    "modelosCompatibles": ["Honda XR190L"]
  },
  {
    "nombre": "Retenes de horquilla Yamaha FZ-25",
    "precio": 60000,
    "categoria": "Suspensión",
    "imagen": "imagenes/yamaha-fz25-retenes-horquilla.jpg",
    "especificaciones": {
      "diametro": "41mm",
      "material": "Goma nitrílica"
    },
    "modelosCompatibles": ["Yamaha FZ-25"]
  },
  {
    "nombre": "Casco integral DOT",
    "precio": 320000,
    "categoria": "Seguridad",
    "imagen": "imagenes/casco-integral-universal.jpg",
    "especificaciones": {
      "certificacion": "DOT",
      "material": "ABS"
    },
    "modelosCompatibles": ["Universal"]
  },
  {
    "nombre": "Guantes de protección",
    "precio": 85000,
    "categoria": "Seguridad",
    "imagen": "imagenes/guantes-proteccion-universal.jpg",
    "especificaciones": {
      "material": "Cuero sintético",
      "proteccion": "Nudillos"
    },
    "modelosCompatibles": ["Universal"]
  },
  {
    "nombre": "Chaleco reflectivo",
    "precio": 35000,
    "categoria": "Seguridad",
    "imagen": "imagenes/chaleco-reflectivo-universal.jpg",
    "especificaciones": {
      "color": "Amarillo fluorescente",
      "norma": "NTC 5807"
    },
    "modelosCompatibles": ["Universal"]
  },
  {
    "nombre": "Guantes touring",
    "precio": 95000,
    "categoria": "Seguridad",
    "imagen": "imagenes/guantes-touring-universal.jpg",
    "especificaciones": {
      "material": "Textil",
      "proteccion": "Refuerzo palma"
    },
    "modelosCompatibles": ["Universal"]
  }
];

    const insertProducto = db.prepare(`
      INSERT INTO productos (nombre, precio, categoria_id, imagen, especificaciones, modelos_compatibles)
      VALUES (?, ?, ?, ?, ?, ?)
    `);

    let productosInsertados = 0;
    productos.forEach(prod => {
      const categoriaId = categoriaMap.get(prod.categoria);
      if (!categoriaId) {
        console.error(`Categoría '${prod.categoria}' no encontrada para producto '${prod.nombre}'`);
        return;
      }
      insertProducto.run(
        prod.nombre,
        prod.precio,
        categoriaId,
        prod.imagen,
        JSON.stringify(prod.especificaciones),
        JSON.stringify(prod.modelosCompatibles),
        function(err) {
          if (err) throw err;
          productosInsertados++;
          if (productosInsertados === productos.length) {
            console.log(`✅ Base de datos poblada con ${productosInsertados} productos.`);
            db.close();
          }
        }
      );
    });
    insertProducto.finalize();
  }
});