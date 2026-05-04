import React from 'react';

function Home({ navegar }) {
  const styles = {
    hero: {
      background: 'linear-gradient(135deg, rgba(0,0,0,0.8) 0%, rgba(20,20,20,0.9) 100%)',
      minHeight: '80vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      textAlign: 'center',
      padding: '20px'
    },
    titulo: {
      fontSize: '56px',
      fontWeight: '900',
      marginBottom: '20px',
      color: '#ff6b00'
    },
    subtitulo: {
      fontSize: '24px',
      marginBottom: '40px',
      color: '#a0aec0'
    },
    botones: {
      display: 'flex',
      gap: '20px',
      justifyContent: 'center',
      flexWrap: 'wrap'
    },
    boton: {
      padding: '18px 40px',
      backgroundColor: '#ff6b00',
      color: 'white',
      border: 'none',
      borderRadius: '10px',
      fontSize: '18px',
      fontWeight: '700',
      cursor: 'pointer'
    },
    features: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
      gap: '30px',
      maxWidth: '1200px',
      margin: '80px auto',
      padding: '0 20px'
    },
    featureCard: {
      backgroundColor: 'white',
      padding: '40px 30px',
      borderRadius: '15px',
      textAlign: 'center',
      boxShadow: '0 10px 30px rgba(0,0,0,0.1)'
    },
    motivacion: {
      backgroundColor: '#1a1a2e',
      color: 'white',
      padding: '80px 20px',
      textAlign: 'center'
    }
  };

  return (
    <div>
      <section style={styles.hero}>
        <div>
          <h1 style={styles.titulo}>🏍️ MotoZone Pro</h1>
          <p style={styles.subtitulo}>Tu tienda de repuestos y accesorios para motos</p>
          <div style={styles.botones}>
            <button onClick={() => navegar('productos')} style={styles.boton}>Ver Catálogo</button>
            <button onClick={() => navegar('contacto')} style={{...styles.boton, backgroundColor: 'transparent', border: '2px solid #ff6b00'}}>Contáctanos</button>
          </div>
        </div>
      </section>

      <section style={styles.features}>
        <div style={styles.featureCard}>
          <div style={{fontSize: '50px', marginBottom: '20px'}}>🚚</div>
          <h3>Envío Gratis</h3>
          <p style={{color: '#718096', marginTop: '10px'}}>En compras superiores a $200.000</p>
        </div>
        <div style={styles.featureCard}>
          <div style={{fontSize: '50px', marginBottom: '20px'}}>💰</div>
          <h3>Mejores Precios</h3>
          <p style={{color: '#718096', marginTop: '10px'}}>Garantizamos los precios más competitivos</p>
        </div>
        <div style={styles.featureCard}>
          <div style={{fontSize: '50px', marginBottom: '20px'}}>🛡️</div>
          <h3>Garantía Total</h3>
          <p style={{color: '#718096', marginTop: '10px'}}>Todos nuestros productos con garantía</p>
        </div>
      </section>

      <section style={styles.motivacion}>
        <h2 style={{fontSize: '36px', marginBottom: '30px', color: '#ff6b00'}}>🔧 ¿Por Qué MotoZone Pro?</h2>
        <p style={{maxWidth: '800px', margin: '0 auto', fontSize: '18px', lineHeight: '1.8', color: '#a0aec0'}}>
          <strong>Nos motivó crear este e-commerce</strong> porque somos apasionados del mundo de las motocicletas 
          e identificamos la necesidad de encontrar repuestos de calidad a precios justos en una sola plataforma 
          digital confiable.
        </p>
      </section>
    </div>
  );
}

export default Home;