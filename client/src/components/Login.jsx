import React, { useState } from 'react';

function Login({ iniciarSesion, navegar }) {
  // Estado para email, contraseña y mensaje de error
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [error, setError] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    setError('');
  };

  // Envío de credenciales a la API /api/auth/login
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      const data = await response.json();
      // Si el login es exitoso, guarda usuario y token, luego redirige al home
      if (data.success) {
        iniciarSesion(data.user, data.token);
        navegar('home');
      } else {
        setError(data.message || 'Error al iniciar sesión');
      }
    } catch (err) {
      setError('Error de conexión con el servidor');
    }
  };

  return (
    <div style={{ maxWidth: '450px', margin: '50px auto', padding: '40px', backgroundColor: 'white', borderRadius: '15px', boxShadow: '0 10px 30px rgba(0,0,0,0.1)' }}>
      <h2 style={{ textAlign: 'center', marginBottom: '30px' }}>🔑 Iniciar Sesión</h2>
      {error && <div style={{ color: 'red', marginBottom: '15px' }}>{error}</div>}
      <form onSubmit={handleSubmit}>
        <input type="email" name="email" placeholder="Email" value={formData.email} onChange={handleChange} style={{ width: '100%', padding: '12px', marginBottom: '15px', border: '2px solid #e2e8f0', borderRadius: '8px' }} />
        <input type="password" name="password" placeholder="Contraseña" value={formData.password} onChange={handleChange} style={{ width: '100%', padding: '12px', marginBottom: '15px', border: '2px solid #e2e8f0', borderRadius: '8px' }} />
        <button type="submit" style={{ width: '100%', padding: '15px', backgroundColor: '#ff6b00', color: 'white', border: 'none', borderRadius: '8px', fontWeight: '700', cursor: 'pointer' }}>Ingresar</button>
      </form>
      <p style={{ textAlign: 'center', marginTop: '20px' }}>
        ¿No tienes cuenta? <span onClick={() => navegar('registro')} style={{ color: '#ff6b00', cursor: 'pointer' }}>Regístrate</span>
      </p>
    </div>
  );
}

export default Login;