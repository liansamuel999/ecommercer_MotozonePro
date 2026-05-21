import React, { useState, useEffect } from 'react';

function AdminPanel({ usuario, navegar, token }) {
  const [productos, setProductos] = useState([]);
  const [categorias, setCategorias] = useState([]);
  const [modelos, setModelos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Estado del formulario
  const [formData, setFormData] = useState({
    id: null,
    nombre: '',
    precio: '',
    categoria_id: '',
    imagen: null,
    especificaciones: {},
    modelos_compatibles: []
  });

  const [especificacionesInput, setEspecificacionesInput] = useState('');
  const [modelosInput, setModelosInput] = useState('Universal');
  const [editando, setEditando] = useState(false);

  // Cargar datos iniciales
  useEffect(() => {
    cargarProductos();
    cargarCategorias();
    cargarModelos();
  }, []);

  const cargarProductos = async () => {
    try {
      const res = await fetch('/api/productos');
      const data = await res.json();
      setProductos(data);
    } catch (err) {
      setError('Error cargando productos');
    } finally {
      setLoading(false);
    }
  };

  const cargarCategorias = async () => {
    try {
      const res = await fetch('/api/categorias');
      const data = await res.json();
      // data ahora es array de objetos {id, nombre}
      setCategorias(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error('Error cargando categorías:', err);
      setCategorias([]);
    }
  };

  const cargarModelos = async () => {
    try {
      const res = await fetch('/api/modelos');
      const data = await res.json();
      setModelos(data);
    } catch (err) {
      console.error('Error cargando modelos');
    }
  };

  // Convertir imagen a base64 y guardar en localStorage
  const manejarImagenCambio = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData(prev => ({ ...prev, imagen: reader.result }));
      };
      reader.readAsDataURL(file);
    }
  };

  // Guardar imagen en localStorage
  const guardarImagenLocalStorage = (imagenBase64, productId) => {
    if (imagenBase64) {
      localStorage.setItem(`producto_imagen_${productId}`, imagenBase64);
    }
  };

  // Recuperar imagen desde localStorage
  const obtenerImagenLocalStorage = (productId) => {
    return localStorage.getItem(`producto_imagen_${productId}`);
  };

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const limpiarFormulario = () => {
    setFormData({
      id: null,
      nombre: '',
      precio: '',
      categoria_id: '',
      imagen: null,
      especificaciones: {},
      modelos_compatibles: []
    });
    setEspecificacionesInput('');
    setModelosInput('Universal');
    setEditando(false);
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!formData.nombre || !formData.precio || !formData.categoria_id) {
      setError('Nombre, precio y categoría son obligatorios');
      return;
    }

    try {
      const payload = {
        nombre: formData.nombre,
        precio: parseFloat(formData.precio),
        categoria_id: parseInt(formData.categoria_id),
        imagen: formData.imagen,
        especificaciones: especificacionesInput ? JSON.parse(especificacionesInput) : {},
        modelos_compatibles: modelosInput.split(',').map(m => m.trim())
      };

      let url = '/api/productos';
      let method = 'POST';

      if (editando && formData.id) {
        url = `/api/productos/${formData.id}`;
        method = 'PUT';
      }

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(payload)
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.message || 'Error procesando producto');
        return;
      }

      // Si es creación y hay imagen, guardarla en localStorage
      if (!editando && formData.imagen) {
        guardarImagenLocalStorage(formData.imagen, data.producto.id);
      } else if (editando && formData.imagen) {
        guardarImagenLocalStorage(formData.imagen, formData.id);
      }

      setSuccess(editando ? 'Producto actualizado exitosamente' : 'Producto creado exitosamente');
      cargarProductos();
      limpiarFormulario();
    } catch (err) {
      setError('Error procesando producto');
    }
  };

  const editarProducto = (producto) => {
    setFormData({
      id: producto.id,
      nombre: producto.nombre,
      precio: producto.precio,
      categoria_id: producto.categoria_id,
      imagen: obtenerImagenLocalStorage(producto.id) || null,
      especificaciones: producto.especificaciones || {},
      modelos_compatibles: producto.modelos_compatibles || []
    });
    setEspecificacionesInput(JSON.stringify(producto.especificaciones || {}, null, 2));
    setModelosInput((producto.modelos_compatibles || []).join(', '));
    setEditando(true);
    window.scrollTo(0, 0);
  };

  const eliminarProducto = async (id) => {
    if (!window.confirm('¿Estás seguro de que deseas eliminar este producto?')) return;

    try {
      const response = await fetch(`/api/productos/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.message || 'Error eliminando producto');
        return;
      }

      setSuccess('Producto eliminado exitosamente');
      cargarProductos();
    } catch (err) {
      setError('Error eliminando producto');
    }
  };

  const styles = {
    container: {
      maxWidth: '1200px',
      margin: '0 auto',
      padding: '20px',
      backgroundColor: '#f8f9fa',
      minHeight: '100vh'
    },
    header: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: '30px',
      paddingBottom: '20px',
      borderBottom: '2px solid #ff6b00'
    },
    title: {
      fontSize: '28px',
      fontWeight: 'bold',
      color: '#333'
    },
    backBtn: {
      padding: '10px 20px',
      backgroundColor: '#6c757d',
      color: 'white',
      border: 'none',
      borderRadius: '5px',
      cursor: 'pointer',
      fontSize: '14px'
    },
    alertSuccess: {
      backgroundColor: '#d4edda',
      color: '#155724',
      padding: '12px',
      borderRadius: '5px',
      marginBottom: '15px',
      border: '1px solid #c3e6cb'
    },
    alertError: {
      backgroundColor: '#f8d7da',
      color: '#721c24',
      padding: '12px',
      borderRadius: '5px',
      marginBottom: '15px',
      border: '1px solid #f5c6cb'
    },
    formSection: {
      backgroundColor: 'white',
      padding: '30px',
      borderRadius: '8px',
      boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
      marginBottom: '30px'
    },
    formTitle: {
      fontSize: '20px',
      fontWeight: 'bold',
      marginBottom: '20px',
      color: '#333'
    },
    formGroup: {
      marginBottom: '20px'
    },
    label: {
      display: 'block',
      marginBottom: '8px',
      fontWeight: '500',
      color: '#333'
    },
    input: {
      width: '100%',
      padding: '10px',
      border: '1px solid #ddd',
      borderRadius: '5px',
      fontSize: '14px',
      boxSizing: 'border-box'
    },
    textarea: {
      width: '100%',
      padding: '10px',
      border: '1px solid #ddd',
      borderRadius: '5px',
      fontSize: '14px',
      boxSizing: 'border-box',
      fontFamily: 'monospace',
      minHeight: '120px',
      resize: 'vertical'
    },
    select: {
      width: '100%',
      padding: '10px',
      border: '1px solid #ddd',
      borderRadius: '5px',
      fontSize: '14px',
      boxSizing: 'border-box'
    },
    fileInput: {
      padding: '8px',
      border: '1px solid #ddd',
      borderRadius: '5px',
      cursor: 'pointer'
    },
    buttonGroup: {
      display: 'flex',
      gap: '10px'
    },
    submitBtn: {
      flex: 1,
      padding: '12px',
      backgroundColor: '#ff6b00',
      color: 'white',
      border: 'none',
      borderRadius: '5px',
      fontWeight: 'bold',
      cursor: 'pointer',
      fontSize: '14px'
    },
    cancelBtn: {
      flex: 1,
      padding: '12px',
      backgroundColor: '#6c757d',
      color: 'white',
      border: 'none',
      borderRadius: '5px',
      fontWeight: 'bold',
      cursor: 'pointer',
      fontSize: '14px'
    },
    productsSection: {
      backgroundColor: 'white',
      padding: '30px',
      borderRadius: '8px',
      boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
    },
    table: {
      width: '100%',
      borderCollapse: 'collapse',
      marginTop: '20px'
    },
    thead: {
      backgroundColor: '#f8f9fa',
      borderBottom: '2px solid #ddd'
    },
    th: {
      padding: '12px',
      textAlign: 'left',
      fontWeight: 'bold',
      color: '#333'
    },
    td: {
      padding: '12px',
      borderBottom: '1px solid #ddd'
    },
    trHover: {
      backgroundColor: '#f8f9fa'
    },
    actionBtn: {
      padding: '6px 12px',
      marginRight: '8px',
      border: 'none',
      borderRadius: '4px',
      cursor: 'pointer',
      fontSize: '12px',
      fontWeight: '500'
    },
    editBtn: {
      backgroundColor: '#007bff',
      color: 'white'
    },
    deleteBtn: {
      backgroundColor: '#dc3545',
      color: 'white'
    },
    imagenPreview: {
      maxWidth: '100px',
      maxHeight: '100px',
      marginTop: '10px',
      borderRadius: '4px',
      border: '1px solid #ddd'
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <h1 style={styles.title}> Panel Administrativo - Gestión de Productos</h1>
        <button style={styles.backBtn} onClick={() => navegar('home')}>← Volver</button>
      </div>

      {error && <div style={styles.alertError}>{error}</div>}
      {success && <div style={styles.alertSuccess}>{success}</div>}

      {/* Formulario de Producto */}
      <div style={styles.formSection}>
        <h2 style={styles.formTitle}>{editando ? 'Editar Producto' : 'Crear Nuevo Producto'}</h2>
        <form onSubmit={handleSubmit}>
          <div style={styles.formGroup}>
            <label style={styles.label}>Nombre del Producto *</label>
            <input
              style={styles.input}
              type="text"
              name="nombre"
              value={formData.nombre}
              onChange={handleFormChange}
              placeholder="Ej: Aceite motor 10W40"
              required
            />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
            <div style={styles.formGroup}>
              <label style={styles.label}>Precio (COP) *</label>
              <input
                style={styles.input}
                type="number"
                name="precio"
                value={formData.precio}
                onChange={handleFormChange}
                placeholder="45000"
                step="1000"
                required
              />
            </div>

            <div style={styles.formGroup}>
              <label style={styles.label}>Categoría *</label>
              <select
                style={styles.select}
                name="categoria_id"
                value={formData.categoria_id}
                onChange={handleFormChange}
                required
              >
                <option value="">Seleccionar categoría</option>
                {categorias.map(cat => (
                  <option key={cat.id} value={cat.id}>{cat.nombre}</option>
                ))}
              </select>
            </div>
          </div>

          <div style={styles.formGroup}>
            <label style={styles.label}>Imagen del Producto</label>
            <input
              style={styles.fileInput}
              type="file"
              accept="image/*"
              onChange={manejarImagenCambio}
            />
            {formData.imagen && (
              <img src={formData.imagen} alt="Preview" style={styles.imagenPreview} />
            )}
            <small style={{ display: 'block', marginTop: '8px', color: '#666' }}>
              La imagen se guardará localmente en el navegador
            </small>
          </div>

          <div style={styles.formGroup}>
            <label style={styles.label}>Especificaciones (JSON)</label>
            <textarea
              style={styles.textarea}
              value={especificacionesInput}
              onChange={(e) => setEspecificacionesInput(e.target.value)}
              placeholder={'{\n  "viscosidad": "10W40",\n  "especificacion": "JASO MA2"\n}'}
            />
            <small style={{ display: 'block', marginTop: '8px', color: '#666' }}>
              Ingresa datos en formato JSON
            </small>
          </div>

          <div style={styles.formGroup}>
            <label style={styles.label}>Modelos Compatibles (separados por coma)</label>
            <input
              style={styles.input}
              type="text"
              value={modelosInput}
              onChange={(e) => setModelosInput(e.target.value)}
              placeholder="Universal, Yamaha R3, Honda CB125F"
            />
          </div>

          <div style={styles.buttonGroup}>
            <button type="submit" style={styles.submitBtn}>
              {editando ? 'Actualizar Producto' : 'Crear Producto'}
            </button>
            {editando && (
              <button type="button" style={styles.cancelBtn} onClick={limpiarFormulario}>
                Cancelar
              </button>
            )}
          </div>
        </form>
      </div>

      {/* Lista de Productos */}
      <div style={styles.productsSection}>
        <h2 style={styles.formTitle}> Productos Existentes ({productos.length})</h2>
        {loading ? (
          <p>Cargando productos...</p>
        ) : productos.length === 0 ? (
          <p style={{ color: '#666' }}>No hay productos aún. ¡Crea el primero!</p>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table style={styles.table}>
              <thead style={styles.thead}>
                <tr>
                  <th style={styles.th}>ID</th>
                  <th style={styles.th}>Nombre</th>
                  <th style={styles.th}>Precio</th>
                  <th style={styles.th}>Categoría</th>
                  <th style={styles.th}>Modelos</th>
                  <th style={styles.th}>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {productos.map(prod => (
                  <tr key={prod.id} style={styles.trHover}>
                    <td style={styles.td}>{prod.id}</td>
                    <td style={styles.td}>{prod.nombre}</td>
                    <td style={styles.td}>${prod.precio.toLocaleString('es-CO')}</td>
                    <td style={styles.td}>{prod.categoria_nombre}</td>
                    <td style={styles.td}>{(prod.modelos_compatibles || []).join(', ')}</td>
                    <td style={styles.td}>
                      <button
                        style={{ ...styles.actionBtn, ...styles.editBtn }}
                        onClick={() => editarProducto(prod)}
                      >
                       Editar
                      </button>
                      <button
                        style={{ ...styles.actionBtn, ...styles.deleteBtn }}
                        onClick={() => eliminarProducto(prod.id)}
                      >
                       Eliminar
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

export default AdminPanel;
