import React, { useState } from 'react';
import ComparadorModal from './ComparadorModal'; // Ajusta la ruta si está en otra ubicación

function Productos({ productos, categorias, modelos, agregarAlCarrito }) {
  // Estados para filtros, hover, mensaje y comparador
  const [filtroCategoria, setFiltroCategoria] = useState('Todos');
  const [filtroMoto, setFiltroMoto] = useState('Todas');
  const [hoveredId, setHoveredId] = useState(null);
  const [mensaje, setMensaje] = useState(null);
  const [productosParaComparar, setProductosParaComparar] = useState([]);
  const [mostrarComparador, setMostrarComparador] = useState(false);

  // Filtrar productos
  const productosFiltrados = productos.filter(p => {
    const porCategoria = filtroCategoria === 'Todos' || p.categoria_nombre === filtroCategoria;
    const porMoto = filtroMoto === 'Todas' || 
                    p.modelos_compatibles.includes(filtroMoto) || 
                    p.modelos_compatibles.includes('Universal');
    return porCategoria && porMoto;
  });

  const formatearPrecio = (precio) => {
    return new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP', minimumFractionDigits: 0 }).format(precio);
  };

  const handleAgregar = (producto) => {
    agregarAlCarrito(producto);
    setMensaje(`${producto.nombre} agregado`);
    setTimeout(() => setMensaje(null), 3000);
  };

  // Función para agregar/quitar producto del comparador (máximo 3)
  const toggleComparar = (productoId) => {
    if (productosParaComparar.includes(productoId)) {
      setProductosParaComparar(productosParaComparar.filter(id => id !== productoId));
    } else {
      if (productosParaComparar.length >= 3) {
        alert('Solo puedes comparar hasta 3 productos');
        return;
      }
      setProductosParaComparar([...productosParaComparar, productoId]);
    }
  };

  const styles = {
    container: { maxWidth: '1200px', margin: '0 auto', padding: '40px 20px' },
    filtrosContainer: { display: 'flex', flexDirection: 'column', gap: '20px', marginBottom: '30px' },
    filtrosGrupo: { display: 'flex', gap: '10px', justifyContent: 'center', flexWrap: 'wrap' },
    filtroBoton: (activo) => ({
      padding: '10px 20px',
      border: '2px solid #ff6b00',
      backgroundColor: activo ? '#ff6b00' : 'white',
      color: activo ? 'white' : '#ff6b00',
      borderRadius: '25px',
      cursor: 'pointer',
      fontWeight: '600'
    }),
    filtrosRow: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      flexWrap: 'wrap',
      gap: '20px'
    },
    select: {
      padding: '10px 20px',
      fontSize: '16px',
      borderRadius: '25px',
      border: '2px solid #ff6b00',
      backgroundColor: 'white',
      color: '#ff6b00',
      cursor: 'pointer',
      fontWeight: '600',
      outline: 'none',
      transition: 'all 0.3s ease'
    },
    grid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '30px', marginTop: '30px' },
    card: { backgroundColor: 'white', borderRadius: '15px', overflow: 'hidden', boxShadow: '0 10px 30px rgba(0,0,0,0.1)', textAlign: 'center', position: 'relative' },
    imageContainer: { position: 'relative', overflow: 'hidden' },
    image: { width: '100%', height: '200px', objectFit: 'contain', backgroundColor: '#f7fafc', padding: '20px' },
    overlay: {
      position: 'absolute',
      bottom: 0,
      left: 0,
      right: 0,
      backgroundColor: 'rgba(0,0,0,0.7)',
      color: 'white',
      padding: '15px',
      transform: 'translateY(100%)',
      transition: 'transform 0.3s ease',
      textAlign: 'left',
      fontSize: '14px'
    },
    overlayVisible: { transform: 'translateY(0)' },
    compararBoton: (seleccionado) => ({
      marginTop: '10px',
      padding: '5px 10px',
      backgroundColor: seleccionado ? '#ff6b00' : 'white',
      color: seleccionado ? 'white' : '#ff6b00',
      border: '1px solid #ff6b00',
      borderRadius: '5px',
      cursor: 'pointer',
      fontSize: '12px'
    }),
    botonFlotante: {
      position: 'fixed',
      bottom: '20px',
      right: '20px',
      backgroundColor: '#ff6b00',
      color: 'white',
      padding: '12px 24px',
      borderRadius: '30px',
      boxShadow: '0 2px 10px rgba(0,0,0,0.2)',
      cursor: 'pointer',
      zIndex: 1000,
      fontWeight: 'bold'
    }
  };

  return (
    <div style={styles.container}>
      <h1 style={{textAlign: 'center', fontSize: '36px', marginBottom: '30px'}}>🛒 Nuestros Productos</h1>
      
      <div style={styles.filtrosContainer}>
        <div style={styles.filtrosRow}>
          <div style={styles.filtrosGrupo}>
            {categorias.map(cat => (
              <button
                key={cat}
                onClick={() => setFiltroCategoria(cat)}
                style={styles.filtroBoton(filtroCategoria === cat)}
              >
                {cat}
              </button>
            ))}
          </div>
          <div>
            <select
              value={filtroMoto}
              onChange={(e) => setFiltroMoto(e.target.value)}
              style={styles.select}
            >
              {modelos.map(mod => (
                <option key={mod} value={mod}>{mod}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      <div style={styles.grid}>
        {productosFiltrados.map(prod => (
          //Tarjeta de producto con hover para especificaciones y botones de agregar/comparar 
          <div
            key={prod.id}
            draggable
            onDragStart={(e) => {
              e.dataTransfer.effectAllowed = 'copy';
              e.dataTransfer.setData('application/json', JSON.stringify(prod));
              
              // Crear imagen de vista previa más pequeña con canvas
              const canvas = document.createElement('canvas');
              canvas.width = 50;
              canvas.height = 50;
              const ctx = canvas.getContext('2d');
              
              const img = new Image();
              img.onload = () => {
                ctx.drawImage(img, 0, 0, 50, 50);
                e.dataTransfer.setDragImage(canvas, 25, 25);
              };
              img.src = `/${prod.imagen}`;
            }}
            style={{...styles.card, cursor: 'grab'}}
            onMouseEnter={() => setHoveredId(prod.id)}
            onMouseLeave={() => setHoveredId(null)}
          >
            <div style={styles.imageContainer}>
              <img 
                src={`/${prod.imagen}`} 
                alt={prod.nombre}
                style={styles.image}
                onError={(e) => console.error('Error cargando imagen:', e.target.src)}
              />
              <div
                style={{
                  ...styles.overlay,
                  ...(hoveredId === prod.id ? styles.overlayVisible : {})
                }}
              >
                <strong>🔧 Especificaciones:</strong>
                <ul style={{ margin: '5px 0 0 0', paddingLeft: '20px' }}>
                  {Object.entries(prod.especificaciones).map(([key, value]) => (
                    <li key={key}><strong>{key}:</strong> {value}</li>
                  ))}
                </ul>
              </div>
            </div>
            <div style={{padding: '25px'}}>
              <div style={{fontSize: '12px', color: '#ff6b00', fontWeight: '700', textTransform: 'uppercase'}}>{prod.categoria_nombre}</div>
              <h3 style={{fontSize: '18px', margin: '10px 0'}}>{prod.nombre}</h3>
              <div style={{fontSize: '24px', fontWeight: '800', color: '#ff6b00', margin: '15px 0'}}>{formatearPrecio(prod.precio)}</div>
              {/* Botón para agregar al carrito */}
              <button onClick={() => handleAgregar(prod)} style={{
                width: '100%',
                padding: '12px',
                backgroundColor: '#ff6b00',
                color: 'white',
                border: 'none',
                borderRadius: '8px',
                fontWeight: '700',
                cursor: 'pointer'
              }}>🛒 Agregar</button>
              {/* Botón para comparar */}
              <button
                onClick={() => toggleComparar(prod.id)}
                style={styles.compararBoton(productosParaComparar.includes(prod.id))}
              >
                {productosParaComparar.includes(prod.id) ? '✓ En comparador' : '➕ Comparar'}
              </button>
            </div>
          </div>
        ))}
      </div>

      {mensaje && (
        <div style={{position: 'fixed', bottom: '30px', right: '30px', backgroundColor: '#c6f6d5', color: '#22543d', padding: '15px 25px', borderRadius: '10px', boxShadow: '0 4px 15px rgba(0,0,0,0.2)'}}>
          ✓ {mensaje}
        </div>
      )}

      {/* Botón flotante para abrir el comparador */}
      {productosParaComparar.length >= 2 && (
        <div style={styles.botonFlotante} onClick={() => setMostrarComparador(true)}>
          Comparar ({productosParaComparar.length} productos)
        </div>
      )}

      {/* Modal del comparador */}
      {mostrarComparador && (
        <ComparadorModal
          productos={productos}
          ids={productosParaComparar}
          onClose={() => setMostrarComparador(false)}
        />
      )}
    </div>
  );
}

export default Productos;