import React, { useState } from 'react';

function Carrito({ carrito, eliminarDelCarrito, actualizarCantidad, total, navegar, usuario }) {
  // Estado para controlar qué producto está en hover y mostrar sus especificaciones
  const [hoveredId, setHoveredId] = useState(null);

  // Formatea números a moneda colombiana (COP)
  const formatearPrecio = (precio) => {
    return new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP', minimumFractionDigits: 0 }).format(precio);
  };

  // Si el carrito está vacío, muestra mensaje y botón para ir a productos
  if (carrito.length === 0) {
    return (
      <div style={{textAlign: 'center', padding: '100px 20px'}}>
        <div style={{fontSize: '80px', marginBottom: '20px'}}>🛒</div>
        <h2 style={{fontSize: '24px', color: '#718096', marginBottom: '20px'}}>Tu carrito está vacío</h2>
        <button 
          onClick={() => navegar('productos')} 
          style={{
            padding: '15px 40px',
            backgroundColor: '#ff6b00',
            color: 'white',
            border: 'none',
            borderRadius: '10px',
            fontWeight: '700',
            cursor: 'pointer',
            fontSize: '16px'
          }}
        >
          Ver Productos
        </button>
      </div>
    );
  }

  const styles = {
    itemContainer: {
      display: 'flex',
      alignItems: 'center',
      gap: '20px',
      padding: '20px',
      backgroundColor: 'white',
      borderRadius: '10px',
      marginBottom: '15px',
      boxShadow: '0 4px 15px rgba(0,0,0,0.08)',
      position: 'relative'
    },
    overlay: {
      position: 'absolute',
      top: '0',
      left: '100%',
      marginLeft: '10px',
      backgroundColor: 'rgba(0,0,0,0.8)',
      color: 'white',
      padding: '10px',
      borderRadius: '5px',
      zIndex: 10,
      width: '220px',
      fontSize: '12px',
      pointerEvents: 'none'
    },
    image: { width: '60px', height: '60px', objectFit: 'contain' }
  };

  return (
    <div style={{maxWidth: '900px', margin: '0 auto', padding: '40px 20px'}}>
      <h1 style={{fontSize: '32px', marginBottom: '30px'}}>🛒 Tu Carrito</h1>
      
      {carrito.map(item => (
        // Contenedor de cada producto en el carrito
        <div
          key={item.id}
          style={styles.itemContainer}
          onMouseEnter={() => setHoveredId(item.id)}
          onMouseLeave={() => setHoveredId(null)}
        >
          <img 
            src={`/${item.imagen}`} 
            alt={item.nombre} 
            style={styles.image} 
            onError={(e) => { e.target.src = '/placeholder.png'; }}
          />
          <div style={{flex: 1}}>
            <h3 style={{fontSize: '18px', fontWeight: '700', marginBottom: '5px'}}>{item.nombre}</h3>
            <div style={{fontSize: '16px', color: '#ff6b00', fontWeight: '600'}}>{formatearPrecio(item.precio)}</div>
          </div>
          <div style={{display: 'flex', alignItems: 'center', gap: '10px'}}>
            <button onClick={() => actualizarCantidad(item.id, item.cantidad - 1)} style={{width: '35px', height: '35px', border: '2px solid #e2e8f0', backgroundColor: 'white', borderRadius: '8px', cursor: 'pointer', fontSize: '18px'}}>-</button>
            <span style={{fontSize: '16px', fontWeight: '700', minWidth: '30px', textAlign: 'center'}}>{item.cantidad}</span>
            <button onClick={() => actualizarCantidad(item.id, item.cantidad + 1)} style={{width: '35px', height: '35px', border: '2px solid #e2e8f0', backgroundColor: 'white', borderRadius: '8px', cursor: 'pointer', fontSize: '18px'}}>+</button>
          </div>
          <div style={{fontSize: '18px', fontWeight: '700', minWidth: '120px', textAlign: 'right'}}>{formatearPrecio(item.precio * item.cantidad)}</div>
          <button onClick={() => eliminarDelCarrito(item.id)} style={{padding: '8px 15px', backgroundColor: '#fed7d7', color: '#e53e3e', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: '600'}}>🗑️</button>

          {/*Tooltip flotante que aparece al hacer hover, mostrando especificaciones del producto*/}
          {hoveredId === item.id && item.especificaciones && (
            <div style={styles.overlay}>
              <strong>🔧 Especificaciones:</strong>
              <ul style={{ margin: '5px 0 0 0', paddingLeft: '15px' }}>
                {Object.entries(item.especificaciones).map(([key, value]) => (
                  <li key={key}><strong>{key}:</strong> {value}</li>
                ))}
              </ul>
            </div>
          )}
        </div>
      ))}

      // Resumen de compra con subtotal, envío y total
      <div style={{backgroundColor: 'white', padding: '30px', borderRadius: '15px', marginTop: '30px', boxShadow: '0 10px 30px rgba(0,0,0,0.1)'}}>
        <h2 style={{fontSize: '24px', marginBottom: '20px'}}>📋 Resumen</h2>
        <div style={{display: 'flex', justifyContent: 'space-between', marginBottom: '15px', fontSize: '18px'}}><span>Subtotal:</span><span>{formatearPrecio(total)}</span></div>
        <div style={{display: 'flex', justifyContent: 'space-between', marginBottom: '15px', fontSize: '18px'}}><span>Envío:</span><span>{total > 200000 ? 'GRATIS' : formatearPrecio(15000)}</span></div>
        <div style={{display: 'flex', justifyContent: 'space-between', paddingTop: '20px', borderTop: '2px solid #e2e8f0', fontSize: '24px', fontWeight: '800'}}><span>TOTAL:</span><span style={{color: '#ff6b00'}}>{formatearPrecio(total + (total > 200000 ? 0 : 15000))}</span></div>
        <button 
          onClick={() => alert(`¡Gracias por tu compra${usuario ? ', ' + usuario : ''}!`)} 
          style={{
            width: '100%',
            padding: '18px',
            backgroundColor: '#ff6b00',
            color: 'white',
            border: 'none',
            borderRadius: '10px',
            fontWeight: '700',
            cursor: 'pointer',
            fontSize: '18px',
            marginTop: '25px'
          }}
        >
          💳 Proceder al Pago
        </button>
      </div>
    </div>
  );
}

export default Carrito;
