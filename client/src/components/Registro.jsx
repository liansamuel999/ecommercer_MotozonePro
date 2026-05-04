import React, { useState } from 'react';

function Registro({ navegar }) {
  // Estado para nombre, email, contraseña, confirmación, error y éxito
  const [formData, setFormData] = useState({ nombre: '', email: '', password: '', confirmPassword: '' });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    // Validación de contraseñas coincidentes antes de enviar
    if (formData.password !== formData.confirmPassword) {
      setError('Las contraseñas no coinciden');
      return;
    }
    try {
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          nombre: formData.nombre,
          email: formData.email,
          password: formData.password
        })
      });
      const data = await response.json();
      if (data.success) {
        // Envío a /api/auth/register
// Si éxito, muestra mensaje y redirige al login después de 2 segundos
        setSuccess(true);
        setTimeout(() => navegar('login'), 2000);
      } else {
        setError(data.message);
      }
    } catch (err) {
      setError('Error de conexión');
    }
  };

  if (success) {
    return <div>Registro exitoso, redirigiendo...</div>;
  }

  return (
    <div style={{ maxWidth: '500px', margin: '40px auto', padding: '40px', backgroundColor: 'white', borderRadius: '15px' }}>
      <h2 style={{ textAlign: 'center' }}>Registro</h2>
      {error && <div style={{ color: 'red', marginBottom: '15px' }}>{error}</div>}
      <form onSubmit={handleSubmit}>
        <input type="text" name="nombre" placeholder="Nombre" value={formData.nombre} onChange={handleChange} style={{ width: '100%', marginBottom: '10px', padding: '12px' }} required />
        <input type="email" name="email" placeholder="Email" value={formData.email} onChange={handleChange} style={{ width: '100%', marginBottom: '10px', padding: '12px' }} required />
        <input type="password" name="password" placeholder="Contraseña" value={formData.password} onChange={handleChange} style={{ width: '100%', marginBottom: '10px', padding: '12px' }} required />
        <input type="password" name="confirmPassword" placeholder="Confirmar contraseña" value={formData.confirmPassword} onChange={handleChange} style={{ width: '100%', marginBottom: '20px', padding: '12px' }} required />
        <button type="submit" style={{ width: '100%', padding: '15px', backgroundColor: '#ff6b00', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer' }}>Registrarse</button>
      </form>
    </div>
  );
}

export default Registro;