import React, { useState } from 'react';

// Estado para los datos del formulario y mensaje de éxito
function Contacto({ navegar }) {
  const [formData, setFormData] = useState({ nombre: '', email: '', mensaje: '' });
  const [enviado, setEnviado] = useState(false);

  // Maneja el envío del formulario (simulado)
  const handleSubmit = (e) => {
    e.preventDefault();
    setEnviado(true);
    setFormData({ nombre: '', email: '', mensaje: '' });
    setTimeout(() => setEnviado(false), 5000);
  };

  const styles = {
    container: { maxWidth: '800px', margin: '0 auto', padding: '40px 20px' },
    form: { backgroundColor: 'white', padding: '40px', borderRadius: '15px', boxShadow: '0 10px 30px rgba(0,0,0,0.1)' }
  };

  return (
    <div style={styles.container}>
      <h1 style={{textAlign: 'center', marginBottom: '40px', fontSize: '36px'}}>📞 Contáctanos</h1>
      
      <div style={styles.form}>
        {/*// Muestra mensaje de éxito durante 5 segundos después de enviar*/}
        {enviado && <div style={{backgroundColor: '#c6f6d5', color: '#22543d', padding: '20px', borderRadius: '10px', marginBottom: '20px', textAlign: 'center'}}>✓ ¡Mensaje enviado!</div>}
        
        <form onSubmit={handleSubmit}>
          <input type="text" placeholder="Nombre" required value={formData.nombre} onChange={(e) => setFormData({...formData, nombre: e.target.value})} style={{width: '100%', padding: '12px', marginBottom: '15px', border: '2px solid #e2e8f0', borderRadius: '8px', fontSize: '15px', boxSizing: 'border-box'}} />
          <input type="email" placeholder="Email" required value={formData.email} onChange={(e) => setFormData({...formData, email: e.target.value})} style={{width: '100%', padding: '12px', marginBottom: '15px', border: '2px solid #e2e8f0', borderRadius: '8px', fontSize: '15px', boxSizing: 'border-box'}} />
          <textarea placeholder="Mensaje" required value={formData.mensaje} onChange={(e) => setFormData({...formData, mensaje: e.target.value})} style={{width: '100%', padding: '12px', marginBottom: '15px', border: '2px solid #e2e8f0', borderRadius: '8px', fontSize: '15px', minHeight: '120px', resize: 'vertical', boxSizing: 'border-box'}}></textarea>
          <button type="submit" style={{width: '100%', padding: '15px', backgroundColor: '#ff6b00', color: 'white', border: 'none', borderRadius: '8px', fontWeight: '700', cursor: 'pointer', fontSize: '16px'}}>📤 Enviar Mensaje</button>
        </form>
      </div>

      <div style={{display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '20px', marginTop: '40px', textAlign: 'center'}}>
        <div style={{padding: '20px', backgroundColor: 'white', borderRadius: '10px', boxShadow: '0 4px 15px rgba(0,0,0,0.1)'}}>
          <div style={{fontSize: '30px', marginBottom: '10px'}}>📧</div>
          <p>contacto@motozonepro.com</p>
        </div>
        <div style={{padding: '20px', backgroundColor: 'white', borderRadius: '10px', boxShadow: '0 4px 15px rgba(0,0,0,0.1)'}}>
          <div style={{fontSize: '30px', marginBottom: '10px'}}>📱</div>
          <p>+57 300 123 4567</p>
        </div>
        <div style={{padding: '20px', backgroundColor: 'white', borderRadius: '10px', boxShadow: '0 4px 15px rgba(0,0,0,0.1)'}}>
          <div style={{fontSize: '30px', marginBottom: '10px'}}>📍</div>
          <p>Bogotá, Colombia</p>
        </div>
      </div>
    </div>
  );
}

export default Contacto;