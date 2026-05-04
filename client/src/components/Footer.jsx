import React from 'react';

function Footer({ navegar }) {
  return (
    <footer style={{backgroundColor: '#1a1a2e', color: 'white', padding: '40px 20px 20px', marginTop: 'auto'}}>
      <div style={{maxWidth: '1200px', margin: '0 auto', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '30px', marginBottom: '30px'}}>
        <div>
          <h3 style={{color: '#ff6b00', marginBottom: '15px'}}>🏍️ MotoZone Pro</h3>
          <p style={{color: '#a0aec0'}}>Tu tienda de confianza para repuestos de motos</p>
        </div>
        <div>
          <h3 style={{color: '#ff6b00', marginBottom: '15px'}}>Enlaces</h3>
          <p onClick={() => navegar('home')} style={{color: '#a0aec0', cursor: 'pointer', marginBottom: '8px'}}>Inicio</p>
          <p onClick={() => navegar('productos')} style={{color: '#a0aec0', cursor: 'pointer', marginBottom: '8px'}}>Productos</p>
          <p onClick={() => navegar('contacto')} style={{color: '#a0aec0', cursor: 'pointer'}}>Contacto</p>
        </div>
      </div>
      <div style={{textAlign: 'center', paddingTop: '20px', borderTop: '1px solid #2d3748', color: '#718096'}}>© 2024 MotoZone Pro. Todos los derechos reservados.</div>
    </footer>
  );
}

export default Footer;