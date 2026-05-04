import React, { useState } from 'react';

function Header({ paginaActual, navegar, carrito, usuario, cerrarSesion, agregarAlCarrito }) {
  const [isDraggingOverCart, setIsDraggingOverCart] = useState(false);

  const handleDragOver = (e) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'copy';
    setIsDraggingOverCart(true);
  };

  const handleDragLeave = (e) => {
    // Solo cierra si sale del header completamente
    if (e.target === e.currentTarget) {
      setIsDraggingOverCart(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDraggingOverCart(false);
    try {
      const producto = JSON.parse(e.dataTransfer.getData('application/json'));
      agregarAlCarrito(producto);
      // Mostrar notificación visual
      alert(`✓ ${producto.nombre} agregado al carrito`);
    } catch (error) {
      console.error('Error al agregar producto:', error);
    }
  };

  const styles = {
    header: {
      background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 100%)',
      padding: '15px 30px',
      position: 'sticky',
      top: 0,
      zIndex: 1000,
      boxShadow: '0 4px 20px rgba(0,0,0,0.3)',
      borderBottom: '3px solid #ff6b00'
    },
    navContainer: {
      maxWidth: '1200px',
      margin: '0 auto',
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      flexWrap: 'wrap',
      gap: '15px',
      position: 'relative'
    },
    logo: {
      fontSize: '28px',
      fontWeight: '900',
      color: '#ff6b00',
      cursor: 'pointer'
    },
    nav: {
      display: 'flex',
      gap: '25px',
      alignItems: 'center',
      flexWrap: 'wrap'
    },
    navLink: {
      color: '#ffffff',
      fontWeight: '600',
      fontSize: '15px',
      padding: '8px 15px',
      borderRadius: '8px',
      cursor: 'pointer',
      textTransform: 'uppercase'
    },
    carritoIcon: {
      position: 'relative',
      cursor: 'pointer',
      fontSize: '24px'
    },
    badge: {
      position: 'absolute',
      top: '-8px',
      right: '-8px',
      backgroundColor: '#ff6b00',
      color: 'white',
      borderRadius: '50%',
      width: '22px',
      height: '22px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontSize: '12px',
      fontWeight: 'bold'
    }
  };

  return (
    <header 
      style={styles.header}
      onDragOver={(e) => {
        e.preventDefault();
        setIsDraggingOverCart(true);
      }}
      onDragLeave={(e) => {
        if (e.target.closest('[data-is-cart]')) {
          return;
        }
        setIsDraggingOverCart(false);
      }}
    >
      <div style={styles.navContainer}>
        <span onClick={() => navegar('home')} style={styles.logo}>
          🏍️ MotoZone Pro
        </span>
        <nav style={styles.nav}>
          <span onClick={() => navegar('home')} style={{...styles.navLink, backgroundColor: paginaActual === 'home' ? '#ff6b00' : 'transparent'}}>Inicio</span>
          <span onClick={() => navegar('productos')} style={{...styles.navLink, backgroundColor: paginaActual === 'productos' ? '#ff6b00' : 'transparent'}}>Productos</span>
          <span onClick={() => navegar('contacto')} style={{...styles.navLink, backgroundColor: paginaActual === 'contacto' ? '#ff6b00' : 'transparent'}}>Contacto</span>
          <div 
            data-is-cart
            style={styles.carritoIcon} 
            onClick={() => navegar('carrito')}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
          >
            🛒
            {carrito.length > 0 && (
              <span style={styles.badge}>
                {carrito.reduce((acc, item) => acc + item.cantidad, 0)}
              </span>
            )}
          </div>
          {usuario ? (
            <span style={{color: 'white'}}>👤 {usuario.nombre} <button onClick={cerrarSesion} style={{marginLeft: '10px', padding: '5px 10px', backgroundColor: '#e53e3e', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer'}}>Salir</button></span>
          ) : (
            <span onClick={() => navegar('login')} style={{...styles.navLink, backgroundColor: '#ff6b00'}}>Login</span>
          )}
        </nav>

        {/* Tooltip que aparece debajo del carrito */}
        {isDraggingOverCart && (
          <div 
            style={{
              position: 'absolute',
              top: '100%',
              right: '0',
              marginTop: '10px',
              backgroundColor: 'rgba(255, 107, 0, 0.95)',
              color: 'white',
              padding: '14px 24px',
              borderRadius: '8px',
              fontSize: '14px',
              fontWeight: '600',
              whiteSpace: 'nowrap',
              zIndex: 999,
              boxShadow: '0 4px 15px rgba(0,0,0,0.3)',
              pointerEvents: 'auto',
              border: '1px solid rgba(255, 255, 255, 0.2)',
              cursor: 'pointer'
            }}
            onDragOver={(e) => {
              e.preventDefault();
              e.dataTransfer.dropEffect = 'copy';
            }}
            onDrop={handleDrop}
          >
            ⬇️ Suelta aquí para agregar
          </div>
        )}
      </div>
    </header>
  );
}

export default Header;