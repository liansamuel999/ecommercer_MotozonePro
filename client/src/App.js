import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import Footer from './components/Footer';
import Home from './components/Home';
import Productos from './components/Productos';
import Carrito from './components/Carrito';
import Login from './components/Login';
import Contacto from './components/Contacto';
import Registro from './components/Registro';
import MotosEnVivo from './components/MotosEnVivo';
import AdminPanel from './components/AdminPanel';

function App() {
// Estados principales de la aplicación
const [paginaActual, setPaginaActual] = useState('home'); // Controla qué página se muestra
const [carrito, setCarrito] = useState([]); // Productos en el carrito
const [usuario, setUsuario] = useState(null); // Usuario logueado
const [token, setToken] = useState(null); // Token JWT para requests autenticadas
const [productos, setProductos] = useState([]); // Lista de productos desde la API
const [categorias, setCategorias] = useState(['Todos']); // Categorías para filtros
const [modelos, setModelos] = useState(['Todas']); // Modelos de moto para filtros
const [loading, setLoading] = useState(true); // Estado de carga

  useEffect(() => {
    // Cargar usuario y token desde localStorage si existen
    const usuarioGuardado = localStorage.getItem('usuario');
    const tokenGuardado = localStorage.getItem('token');
    if (usuarioGuardado) {
      try {
        setUsuario(JSON.parse(usuarioGuardado));
        if (tokenGuardado) {
          setToken(tokenGuardado);
        }
      } catch (err) {
        console.error('Error cargando usuario:', err);
      }
    }

    const fetchData = async () => {
      try {
        // Cargar productos
        const prodRes = await fetch('/api/productos');
        const prodData = await prodRes.json();
        setProductos(prodData);

        // Cargar categorías
        const catRes = await fetch('/api/categorias');
        const catData = await catRes.json();
        // catData es array de {id, nombre}, extraemos solo nombres
        const catNombres = catData.map(cat => cat.nombre);
        setCategorias(['Todos', ...catNombres]);

        // Cargar modelos
        const modRes = await fetch('/api/modelos');
        const modData = await modRes.json();
        setModelos(['Todas', ...modData]);
      } catch (error) {
        console.error('Error cargando datos:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  // Agrega producto al carrito, si ya existe aumenta cantidad
const agregarAlCarrito = (producto) => {
  const existe = carrito.find(item => item.id === producto.id);
  if (existe) {
    setCarrito(carrito.map(item => 
      item.id === producto.id 
        ? { ...item, cantidad: item.cantidad + 1 } 
        : item
    ));
  } else {
    setCarrito([...carrito, { ...producto, cantidad: 1 }]);
  }
};

// Elimina producto del carrito por id
  const eliminarDelCarrito = (id) => {
    setCarrito(carrito.filter(item => item.id !== id));
  };

  // Actualiza cantidad de un producto en el carrito
  const actualizarCantidad = (id, nuevaCantidad) => {
    if (nuevaCantidad <= 0) {
      eliminarDelCarrito(id);
      return;
    }
    setCarrito(carrito.map(item =>
      item.id === id
        ? { ...item, cantidad: nuevaCantidad }
        : item
    ));
  };

  // Calcula el total del carrito sumando precio * cantidad
  const calcularTotal = () => {
    return carrito.reduce((total, item) =>
      total + (item.precio * item.cantidad), 0
    );
  };

  // Cambia de página y hace scroll al inicio
  const navegar = (pagina) => {
    setPaginaActual(pagina);
    window.scrollTo(0, 0);
  };

  // Guarda datos del usuario en estado y localStorage
  const iniciarSesion = (datos, tokenJWT) => {
    setUsuario(datos);
    setToken(tokenJWT);
    localStorage.setItem('usuario', JSON.stringify(datos));
    localStorage.setItem('token', tokenJWT);
  };

  // Elimina usuario del estado y localStorage
  const cerrarSesion = () => {
    setUsuario(null);
    setToken(null);
    localStorage.removeItem('usuario');
    localStorage.removeItem('token');
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <Header
        paginaActual={paginaActual}
        navegar={navegar}
        carrito={carrito}
        usuario={usuario}
        cerrarSesion={cerrarSesion}
        agregarAlCarrito={agregarAlCarrito}
      />
      {/*Renderizado condicional según paginaActual */}
      <main style={{ flex: 1 }}>
        {paginaActual === 'home' && <Home navegar={navegar} />}
        {paginaActual === 'productos' && (
          <Productos
            navegar={navegar}
            agregarAlCarrito={agregarAlCarrito}
            productos={productos}
            categorias={categorias}
            modelos={modelos}
            loading={loading}
          />
        )}
        {paginaActual === 'carrito' && (
          <Carrito
            carrito={carrito}
            eliminarDelCarrito={eliminarDelCarrito}
            actualizarCantidad={actualizarCantidad}
            total={calcularTotal()}
            navegar={navegar}
          />
        )}
        {paginaActual === 'login' && <Login iniciarSesion={iniciarSesion} navegar={navegar} />}
        {paginaActual === 'registro' && <Registro navegar={navegar} />}
        {paginaActual === 'contacto' && <Contacto navegar={navegar} />}
        {paginaActual === 'motos-en-vivo' && <MotosEnVivo />}
        {paginaActual === 'admin' && usuario?.is_admin && (
          <AdminPanel usuario={usuario} navegar={navegar} token={token} />
        )}
      </main>
      <Footer navegar={navegar} />
    </div>
  );
}

export default App;
