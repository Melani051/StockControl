// ============= GESTIÓN DE AUTENTICACIÓN =============

let productosCache = [];
let usuariosCache = [];

// Obtener usuario actual del localStorage
function obtenerUsuarioActual() {
  const usuario = localStorage.getItem('usuarioActual');
  return usuario ? JSON.parse(usuario) : null;
}

// Guardar usuario en localStorage
function guardarUsuarioActual(usuario) {
  localStorage.setItem('usuarioActual', JSON.stringify(usuario));
}

// Obtener headers de autenticación
function obtenerHeadersAutenticacion() {
  const usuario = obtenerUsuarioActual();
  if (!usuario) {
    return {};
  }

  return {
    'x-usuario-id': usuario.id.toString(),
    'x-usuario-rol': usuario.rol
  };
}

// Verificar si el usuario está autenticado
function verificarAutenticacion() {
  const usuario = obtenerUsuarioActual();
  if (!usuario) {
    // Si no está autenticado, redirigir a login
    if (window.location.pathname !== '/login.html') {
      window.location.href = '/login.html';
    }
    return false;
  }
  return true;
}

// Login
async function realizarLogin(event) {
  event.preventDefault();

  const usuario = document.getElementById('usuario').value;
  const password = document.getElementById('password').value;
  const mensajeLogin = document.getElementById('mensajeLogin');

  try {
    const response = await fetch('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ usuario, password })
    });

    const data = await response.json();

    if (!response.ok) {
      mensajeLogin.textContent = data.mensaje || 'Error en el login';
      mensajeLogin.style.color = 'red';
      return;
    }

    // Guardar usuario en localStorage
    guardarUsuarioActual(data.usuario);

    // Redirigir al dashboard
    window.location.href = '/';
  } catch (error) {
    mensajeLogin.textContent = 'Error al conectar con el servidor';
    mensajeLogin.style.color = 'red';
    console.error('Error:', error);
  }
}

// Logout
async function realizarLogout() {
  localStorage.removeItem('usuarioActual');
  await fetch('/api/auth/logout', { method: 'POST' });
  window.location.href = '/login.html';
}

// Mostrar información del usuario en el header
function mostrarInfoUsuario() {
  const usuario = obtenerUsuarioActual();
  if (!usuario) return;

  // Crear o actualizar el div de información del usuario
  let infoUsuario = document.getElementById('infoUsuario');
  if (!infoUsuario) {
    const header = document.querySelector('header');
    infoUsuario = document.createElement('div');
    infoUsuario.id = 'infoUsuario';
    infoUsuario.className = 'info-usuario';
    header.appendChild(infoUsuario);
  }

  infoUsuario.innerHTML = `
    <span>${usuario.nombre} (${usuario.rol})</span>
    <button onclick="realizarLogout()" class="btn-logout">Cerrar sesión</button>
  `;
}

// Mostrar/ocultar elementos según el rol
function controlarAccesoPorRol() {
  const usuario = obtenerUsuarioActual();
  if (!usuario) return;

  const esAdmin = usuario.rol === 'Administrador';

  // Ocultar formulario de crear producto si no es admin
  const productoForm = document.getElementById('productoForm');
  const seccionFormulario = productoForm?.closest('section');
  if (seccionFormulario) {
    seccionFormulario.style.display = esAdmin ? '' : 'none';
  }

  // Mostrar u ocultar la barra de búsqueda para usuarios no admin
  const buscador = document.getElementById('buscadorProductos');
  if (buscador) {
    buscador.style.display = esAdmin ? 'none' : 'block';
  }

  // Ocultar columnas de usuario y acciones para usuarios no admin
  document.querySelectorAll('th[data-col="usuario"], th[data-col="acciones"]').forEach((th) => {
    th.style.display = esAdmin ? '' : 'none';
  });

  // Ocultar botones de eliminar si no es admin
  if (!esAdmin) {
    const botonesEliminar = document.querySelectorAll('button[onclick*="eliminarProducto"]');
    botonesEliminar.forEach((btn) => {
      btn.style.display = 'none';
    });
  }

  // Controlar el formulario de movimientos según el rol
  const movimientoForm = document.getElementById('movimientoForm');
  if (movimientoForm) {
    const tipoSelect = document.getElementById('tipo');
    if (usuario.rol === 'Usuario') {
      // Los usuarios solo pueden registrar salidas
      if (tipoSelect) {
        tipoSelect.value = 'salida';
        tipoSelect.disabled = true;
        // Ocultar la opción de entrada
        Array.from(tipoSelect.options).forEach((opt) => {
          if (opt.value === 'entrada') opt.style.display = 'none';
        });
      }
    }
  }

  // Agregar opción de Administrar Usuarios en el nav si es admin
  if (usuario.rol === 'Administrador') {
    const nav = document.querySelector('nav');
    if (nav && !document.getElementById('enlaceUsuarios')) {
      const enlaceUsuarios = document.createElement('a');
      enlaceUsuarios.id = 'enlaceUsuarios';
      enlaceUsuarios.href = '/usuarios.html';
      enlaceUsuarios.textContent = 'Usuarios';
      nav.appendChild(enlaceUsuarios);
    }
  }
}

// ============= FUNCIONES DE DATOS CON AUTENTICACIÓN =============

async function cargarProductos() {
  const headers = {
    ...obtenerHeadersAutenticacion(),
    'Content-Type': 'application/json'
  };

  const response = await fetch('/productos', { headers });
  if (response.status === 401) {
    realizarLogout();
    return [];
  }
  return response.json();
}

async function cargarMovimientos() {
  const headers = {
    ...obtenerHeadersAutenticacion(),
    'Content-Type': 'application/json'
  };

  const response = await fetch('/movimientos', { headers });
  if (response.status === 401) {
    realizarLogout();
    return [];
  }
  return response.json();
}

async function cargarUsuarios() {
  const headers = {
    ...obtenerHeadersAutenticacion(),
    'Content-Type': 'application/json'
  };

  const response = await fetch('/api/usuarios', { headers });
  if (response.status === 401) {
    realizarLogout();
    return [];
  }

  if (!response.ok) {
    return [];
  }

  return response.json();
}

function renderDashboard(productos, movimientos) {
  const totalProductos = document.getElementById('totalProductos');
  const totalInventario = document.getElementById('totalInventario');
  const bajoStock = document.getElementById('bajoStock');
  const alertasStock = document.getElementById('alertasStock');
  const ultimosMovimientos = document.getElementById('ultimosMovimientos');

  if (!totalProductos || !totalInventario || !bajoStock || !ultimosMovimientos) return;

  const total = productos.length;
  const inventario = productos.reduce((acum, p) => acum + Number(p.cantidad), 0);
  const stockBajo = productos.filter((p) => Number(p.cantidad) < 5).length;

  totalProductos.textContent = total;
  totalInventario.textContent = inventario;
  bajoStock.textContent = stockBajo;

  // Mostrar alertas detalladas para productos con stock bajo
  if (alertasStock) {
    alertasStock.innerHTML = '';
    const bajos = productos.filter((p) => Number(p.cantidad) < 5);
    if (bajos.length) {
      bajos.forEach((p) => {
        const div = document.createElement('div');
        div.className = 'panel-card';
        div.innerHTML = `<strong class="bajo-stock">⚠ Stock bajo</strong> - ${p.nombre} (${p.cantidad})`;
        alertasStock.appendChild(div);
      });
    }
  }

  ultimosMovimientos.innerHTML = '';
  movimientos.slice(-5).reverse().forEach((mov) => {
    const producto = productos.find((p) => p.id === mov.productoId);
    const item = document.createElement('li');
    item.textContent = `${mov.tipo.toUpperCase()} - ${producto ? producto.nombre : 'Producto eliminado'}: ${mov.cantidad} (${new Date(mov.fecha).toLocaleString()})`;
    ultimosMovimientos.appendChild(item);
  });
}

async function cargarDatos() {
  const [productos, movimientos, usuarios] = await Promise.all([
    cargarProductos(),
    cargarMovimientos(),
    cargarUsuarios()
  ]);

  productosCache = productos;
  usuariosCache = usuarios;

  renderDashboard(productos, movimientos);
  renderProductos(productos, usuarios);
  renderMovimientos(productos, movimientos);
  cargarSelectProductos(productos);
  cargarUsuariosSelect(usuarios);
}

// ID del producto en edición (null cuando se crea uno nuevo)
let productoEditandoId = null;

// Buscar información en Open Food Facts y completar campos
async function buscarInfoOpenFood() {
  const codigo = document.getElementById('codigoBarras')?.value?.trim();
  if (!codigo) return alert('Ingrese un código de barras');

  const btnBuscar = document.getElementById('buscarOpenFood');
  const textoOriginal = btnBuscar?.textContent || 'Buscar información';
  if (btnBuscar) {
    btnBuscar.disabled = true;
    btnBuscar.textContent = 'Buscando...';
  }

  try {
    const resultado = await window.buscarProductoOpenFood(codigo);
    if (!resultado || !resultado.found) {
      alert('No se encontró un producto con ese código de barras o ID.');
      return;
    }

    const p = resultado.producto;
    document.getElementById('nombre').value = p.nombre || '';
    document.getElementById('categoria').value = p.categoria || '';
    document.getElementById('descripcion').value = p.descripcion || '';
    document.getElementById('marca').value = p.marca || '';
    document.getElementById('imagen').value = p.imagen || '';
    document.getElementById('precio').value = p.precio ?? '';
    document.getElementById('cantidad').value = p.cantidad ?? '';
    document.getElementById('proveedor').value = p.proveedor || '';
    actualizarPreviewImagen();
    document.getElementById('nombre').focus();
  } finally {
    if (btnBuscar) {
      btnBuscar.disabled = false;
      btnBuscar.textContent = textoOriginal;
    }
  }
}

function actualizarPreviewImagen() {
  const url = document.getElementById('imagen')?.value?.trim();
  const img = document.getElementById('imagenPreview');
  if (!img) return;
  if (url) {
    img.src = url;
    img.style.display = 'block';
  } else {
    img.src = '';
    img.style.display = 'none';
  }
}

function filtrarProductosPorTexto(productos, texto) {
  const consulta = texto.trim().toLowerCase();
  if (!consulta) return productos;

  return productos.filter((producto) => {
    const campos = [
      producto.id,
      producto.nombre,
      producto.proveedor,
      producto.categoria,
      producto.codigoBarras
    ].filter(Boolean).map((valor) => String(valor).toLowerCase());

    return campos.some((valor) => valor.includes(consulta));
  });
}

function renderProductos(productos, usuarios = []) {
  const tabla = document.getElementById('tablaProductos');
  if (!tabla) return;

  const usuario = obtenerUsuarioActual();
  const esAdmin = usuario?.rol === 'Administrador';
  const textoBusqueda = document.getElementById('buscadorProductosInput')?.value || '';
  const productosAMostrar = filtrarProductosPorTexto(productos, textoBusqueda);

  tabla.innerHTML = '';
  productosAMostrar.forEach((producto) => {
    const fila = document.createElement('tr');
    const botonesHTML = esAdmin
      ? `<button onclick="editarProducto('${producto.id}')">Editar</button> <button onclick="eliminarProducto('${producto.id}')">Eliminar</button>`
      : '';
    const usuarioAsignado = usuarios.find((u) => u.id === Number(producto.usuarioId));
    const nombreUsuario = usuarioAsignado ? `${usuarioAsignado.nombre} (${usuarioAsignado.usuario})` : 'Sin asignar';

    fila.innerHTML = `
      <td>${producto.id}</td>
      <td>${producto.nombre}</td>
      <td>${producto.categoria}</td>
      <td>${producto.precio}</td>
      <td class="${Number(producto.cantidad) < 5 ? 'bajo-stock' : ''}">${producto.cantidad}</td>
      <td>${producto.proveedor}</td>
      ${esAdmin ? `<td>${nombreUsuario}</td><td>${botonesHTML}</td>` : ''}
    `;
    tabla.appendChild(fila);
  });
}

function renderMovimientos(productos, movimientos) {
  const tabla = document.getElementById('tablaMovimientos');
  if (!tabla) return;

  tabla.innerHTML = '';
  movimientos.slice().reverse().forEach((mov) => {
    const producto = productos.find((p) => p.id === mov.productoId);
    const fila = document.createElement('tr');
    fila.innerHTML = `
      <td>${mov.id}</td>
      <td>${producto ? producto.nombre : 'Producto eliminado'}</td>
      <td>${mov.tipo}</td>
      <td>${mov.cantidad}</td>
      <td>${new Date(mov.fecha).toLocaleString()}</td>
    `;
    tabla.appendChild(fila);
  });
}

function cargarSelectProductos(productos) {
  const select = document.getElementById('productoId');
  if (!select) return;

  select.innerHTML = '';
  productos.forEach((producto) => {
    const option = document.createElement('option');
    option.value = producto.id;
    option.textContent = producto.nombre;
    select.appendChild(option);
  });
}

function cargarUsuariosSelect(usuarios = []) {
  const select = document.getElementById('usuarioId');
  if (!select) return;

  const usuarioActual = obtenerUsuarioActual();
  if (!usuarioActual || usuarioActual.rol !== 'Administrador') {
    select.parentElement.style.display = 'none';
    return;
  }

  select.parentElement.style.display = 'block';
  select.innerHTML = '<option value="">Seleccionar usuario</option>';

  usuarios.forEach((usuario) => {
    const option = document.createElement('option');
    option.value = usuario.id;
    option.textContent = `${usuario.nombre} (${usuario.usuario})`;
    select.appendChild(option);
  });

  if (usuarioActual.id) {
    select.value = usuarioActual.id.toString();
  }
}

async function guardarProducto(event) {
  event.preventDefault();
  const form = document.getElementById('productoForm');
  if (!form) return;

  const headers = {
    ...obtenerHeadersAutenticacion(),
    'Content-Type': 'application/json'
  };

  const usuarioSeleccionado = document.getElementById('usuarioId')?.value;
  const payload = {
    nombre: document.getElementById('nombre').value,
    categoria: document.getElementById('categoria').value,
    descripcion: document.getElementById('descripcion').value,
    marca: document.getElementById('marca')?.value || '',
    codigoBarras: document.getElementById('codigoBarras')?.value || '',
    imagen: document.getElementById('imagen')?.value || '',
    precio: document.getElementById('precio').value,
    cantidad: document.getElementById('cantidad').value,
    proveedor: document.getElementById('proveedor').value
  };

  if (usuarioSeleccionado) {
    payload.usuarioId = usuarioSeleccionado;
  }

  let response;
  if (productoEditandoId) {
    // Editar producto existente
    response = await fetch(`/productos/${productoEditandoId}`, {
      method: 'PUT',
      headers,
      body: JSON.stringify(payload)
    });
  } else {
    response = await fetch('/productos', {
      method: 'POST',
      headers,
      body: JSON.stringify(payload)
    });
  }

  if (response.status === 401) {
    realizarLogout();
    return;
  }

  if (response.ok) {
    form.reset();
    productoEditandoId = null;
    const submitBtn = form.querySelector('button[type="submit"]');
    if (submitBtn) submitBtn.textContent = 'Guardar producto';
    cargarDatos();
  } else {
    alert('Error al guardar el producto');
  }
}

// Cargar producto en el formulario para edición
async function editarProducto(id) {
  const productos = await cargarProductos();
  const producto = productos.find((p) => p.id === id);
  if (!producto) return alert('Producto no encontrado');

  document.getElementById('nombre').value = producto.nombre || '';
  document.getElementById('categoria').value = producto.categoria || '';
  document.getElementById('descripcion').value = producto.descripcion || '';
  document.getElementById('precio').value = producto.precio || '';
  document.getElementById('cantidad').value = producto.cantidad || '';
  document.getElementById('proveedor').value = producto.proveedor || '';
  document.getElementById('usuarioId').value = producto.usuarioId || '';
  document.getElementById('marca').value = producto.marca || '';
  document.getElementById('codigoBarras').value = producto.codigoBarras || '';
  document.getElementById('imagen').value = producto.imagen || '';
  actualizarPreviewImagen();

  productoEditandoId = id;
  const form = document.getElementById('productoForm');
  const submitBtn = form.querySelector('button[type="submit"]');
  if (submitBtn) submitBtn.textContent = 'Guardar cambios';
  // Llevar foco al formulario
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

async function guardarMovimiento(event) {
  event.preventDefault();
  const form = document.getElementById('movimientoForm');
  if (!form) return;

  const headers = {
    ...obtenerHeadersAutenticacion(),
    'Content-Type': 'application/json'
  };

  const payload = {
    productoId: document.getElementById('productoId').value,
    tipo: document.getElementById('tipo').value,
    cantidad: document.getElementById('cantidadMovimiento').value
  };

  const response = await fetch('/movimientos', {
    method: 'POST',
    headers,
    body: JSON.stringify(payload)
  });

  if (response.status === 401) {
    realizarLogout();
    return;
  }

  if (response.ok) {
    form.reset();
    cargarDatos();
  } else {
    const data = await response.json();
    alert(data.mensaje || 'Error al guardar el movimiento');
  }
}

async function eliminarProducto(id) {
  if (!confirm('¿Está seguro de que desea eliminar este producto?')) return;

  const headers = obtenerHeadersAutenticacion();
  const response = await fetch(`/productos/${id}`, {
    method: 'DELETE',
    headers
  });

  if (response.status === 401) {
    realizarLogout();
    return;
  }

  if (response.ok) {
    cargarDatos();
  } else {
    alert('Error al eliminar el producto');
  }
}

// ============= INICIALIZACIÓN =============

document.addEventListener('DOMContentLoaded', () => {
  // Si está en la página de login, registrar el manejador del formulario
  const loginForm = document.getElementById('loginForm');
  if (loginForm) {
    loginForm.addEventListener('submit', realizarLogin);
    return;
  }

  // Para otras páginas, verificar autenticación
  if (!verificarAutenticacion()) return;

  // Mostrar información del usuario
  mostrarInfoUsuario();

  // Controlar acceso por rol
  controlarAccesoPorRol();

  // Cargar datos
  cargarDatos();

  // Registrar listeners de formularios
  const productoForm = document.getElementById('productoForm');
  const movimientoForm = document.getElementById('movimientoForm');

  if (productoForm) productoForm.addEventListener('submit', guardarProducto);
  if (movimientoForm) movimientoForm.addEventListener('submit', guardarMovimiento);

  // Botón Buscar información (Open Food Facts)
  const btnBuscar = document.getElementById('buscarOpenFood');
  if (btnBuscar) btnBuscar.addEventListener('click', buscarInfoOpenFood);

  // Búsqueda de productos para usuarios no administradores
  const buscadorInput = document.getElementById('buscadorProductosInput');
  if (buscadorInput) {
    buscadorInput.addEventListener('input', () => {
      renderProductos(productosCache, usuariosCache);
    });
  }

  // Preview de imagen cuando cambia el input de URL
  const imagenInput = document.getElementById('imagen');
  if (imagenInput) imagenInput.addEventListener('input', actualizarPreviewImagen);
});
