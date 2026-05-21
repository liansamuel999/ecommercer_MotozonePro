import React from 'react';

// Filtra los productos que están en la lista de ids seleccionados
function ComparadorModal({ productos, ids, onClose }) {
  const productosAComparar = productos.filter(p => ids.includes(p.id));
  if (productosAComparar.length === 0) return null;

  // Recolecta todas las claves de especificaciones de los productos seleccionados
  const allKeys = new Set();
  productosAComparar.forEach(p => {
    Object.keys(p.especificaciones).forEach(k => allKeys.add(k));
  });

  return (
    // Modal con fondo oscuro que centra el contenido
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'rgba(0,0,0,0.8)',
      zIndex: 2000,
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center'
    }}>
      <div style={{
        backgroundColor: 'white',
        borderRadius: '15px',
        maxWidth: '90%',
        maxHeight: '90%',
        overflow: 'auto',
        padding: '20px',
        position: 'relative'
      }}>
        <button onClick={onClose} style={{
          position: 'absolute',
          top: '10px',
          right: '10px',
          background: 'none',
          border: 'none',
          fontSize: '24px',
          cursor: 'pointer'
        }}>✖</button>
        {/*// Tabla comparativa: cabecera con imágenes y precios, cuerpo con especificaciones */}
        <h2>Comparador de Productos</h2>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr>
              <th></th>
              {productosAComparar.map(p => (
                <th key={p.id} style={{ padding: '10px', borderBottom: '1px solid #ccc' }}>
                  <img src={p.imagen?.startsWith('data:') ? p.imagen : `/${p.imagen}`} alt={p.nombre} style={{ width: '80px', height: '80px', objectFit: 'contain' }} />
                  <div>{p.nombre}</div>
                  <div style={{ color: '#ff6b00' }}>{new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP' }).format(p.precio)}</div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {Array.from(allKeys).map(key => (
              <tr key={key}>
                <td style={{ fontWeight: 'bold', padding: '8px', borderBottom: '1px solid #eee' }}>{key}</td>
                {productosAComparar.map(p => (
                  <td key={p.id} style={{ padding: '8px', borderBottom: '1px solid #eee', textAlign: 'center' }}>
                    {p.especificaciones[key] || '—'}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
export default ComparadorModal;