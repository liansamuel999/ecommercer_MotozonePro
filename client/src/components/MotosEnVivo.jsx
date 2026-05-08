import React, { useState, useEffect } from 'react';

function MotosEnVivo() {
  const [modelos, setModelos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const CACHE_KEY = 'motos_modelos_v6';
  const CACHE_DURATION = 5 * 60 * 1000; // 5 minutos en ms

  const fetchModelos = async () => {
    setLoading(true);
    setError(null);
    try {
      // Verificar cache
      const cached = localStorage.getItem(CACHE_KEY);
      if (cached) {
        const { data, timestamp } = JSON.parse(cached);
        if (Date.now() - timestamp < CACHE_DURATION) {
          setModelos(data);
          setLoading(false);
          return;
        }
      }

      // Fetch modelos desde API de NHTSA
      const response = await fetch('https://vpic.nhtsa.dot.gov/api/vehicles/getmodelsformake/motorcycle?format=json');
      if (!response.ok) {
        throw new Error('Error al cargar modelos');
      }
      const data = await response.json();
      const modelosLimitados = data.Results.slice(0, 20);

      // Agregar precios ficticios y descripciones
      const modelosConDatos = modelosLimitados.map((modelo, index) => ({
        ...modelo,
        precio: Math.floor(Math.random() * 15000) + 5000,
        descripcion: `La ${modelo.Model_Name} es un modelo de motocicleta confiable y potente, perfecto para aventuras en carretera.`
      }));

      setModelos(modelosConDatos);

      // Guardar en cache
      localStorage.setItem(CACHE_KEY, JSON.stringify({ data: modelosConDatos, timestamp: Date.now() }));
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchModelos();
  }, []);

  const retry = () => {
    fetchModelos();
  };

  const styles = {
    container: { maxWidth: '1200px', margin: '0 auto', padding: '40px 20px' },
    title: { textAlign: 'center', marginBottom: '40px', fontSize: '36px' },
    grid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', gap: '20px' },
    card: { backgroundColor: 'white', borderRadius: '10px', boxShadow: '0 4px 15px rgba(0,0,0,0.1)', padding: '20px', display: 'flex', flexDirection: 'column', alignItems: 'center' },
    cardTitle: { fontSize: '18px', fontWeight: 'bold', marginBottom: '10px', textAlign: 'center' },
    descripcion: { fontSize: '14px', color: '#666', marginBottom: '10px', textAlign: 'center' },
    precio: { fontSize: '16px', color: '#ff6b00', fontWeight: 'bold', marginBottom: '10px' },
    link: { color: '#ff6b00', textDecoration: 'none', fontWeight: 'bold', padding: '8px 16px', border: '2px solid #ff6b00', borderRadius: '5px' },
    loading: { textAlign: 'center', padding: '40px' },
    error: { textAlign: 'center', padding: '40px', color: 'red' },
    retryBtn: { padding: '10px 20px', backgroundColor: '#ff6b00', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer' }
  };

  if (loading) {
    return (
      <div style={styles.container}>
        <h1 style={styles.title}>🏍️ Modelos de Motocicletas</h1>
        <div style={styles.loading}>Cargando modelos...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div style={styles.container}>
        <h1 style={styles.title}>🏍️ Modelos de Motocicletas</h1>
        <div style={styles.error}>
          <p>Error: {error}</p>
          <button style={styles.retryBtn} onClick={retry}>Reintentar</button>
        </div>
      </div>
    );
  }

  return (
    <div style={styles.container}>
      <h1 style={styles.title}>🏍️ Modelos de Motocicletas</h1>
      <p style={{ textAlign: 'center', marginBottom: '20px', color: '#666' }}>
        Última actualización: {new Date().toLocaleString()}
      </p>
      <div style={styles.grid}>
        {modelos.map((modelo, index) => (
          <div key={index} style={styles.card}>
            <h3 style={styles.cardTitle}>{modelo.Model_Name}</h3>
            <p style={styles.descripcion}>{modelo.descripcion}</p>
            <p style={styles.precio}>${modelo.precio.toLocaleString()}</p>
            <a href={`https://www.google.com/search?q=${encodeURIComponent(modelo.Model_Name + ' motorcycle')}`} target="_blank" rel="noopener noreferrer" style={styles.link}>Ver más</a>
          </div>
        ))}
      </div>
    </div>
  );
}

export default MotosEnVivo;