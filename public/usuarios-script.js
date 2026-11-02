// Obtener usuario actual del localStorage
function obtenerUsuarioActual() {
  const usuario = localStorage.getItem('usuarioActual');
  return usuario ? JSON.parse(usuario) : null;
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

// Realizar logout
async function realizarLogout() {
  localStorage.removeItem('usuarioActual');
  await fetch('/api/auth/logout', { method: 'POST' });
  window.location.href = '/login.html';
}

// Verificar autenticación y que sea admin
function verificarAdmin() {
  const usuario = obtenerUsuarioActual();
  if (!usuario) {
    window.location.href = '/login.html';
    return false;
  }

  if (usuario.rol !== 'Administrador') {
    alert('No tienes permiso para acceder a esta página');
    window.location.href = '/';
    return false;
  }

  return true;
}

// Mostrar información del usuario
function mostrarInfoUsuario() {
  const usuario = obtenerUsuarioActual();
  if (!usuario) return;

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

// Cargar usuarios
async function cargarUsuarios() {
  const headers = obtenerHeadersAutenticacion();

  const response = await fetch('/api/usuarios', { headers });

  if (response.status === 401) {
    realizarLogout();
    return [];
  }

  if (!response.ok) {
    alert('Error al cargar los usuarios');
    return [];
  }

  return response.json();
}

// Render tabla de usuarios
function renderUsuarios(usuarios) {
  const tabla = document.getElementById('tablaUsuarios');
  tabla.innerHTML = '';

  usuarios.forEach((usuario) => {
    const fila = document.createElement('tr');
    fila.innerHTML = `
      <td>${usuario.id}</td>
      <td>${usuario.nombre}</td>
      <td>${usuario.usuario}</td>
      <td>${usuario.rol}</td>
      <td>${new Date(usuario.fechaRegistro).toLocaleString()}</td>
      <td>
        <button onclick="eliminarUsuario(${usuario.id})" class="btn-eliminar">Eliminar</button>
      </td>
    `;
    tabla.appendChild(fila);
  });
}

// Crear usuario
async function crearUsuario(event) {
  event.preventDefault();

  const form = document.getElementById('usuarioForm');
  const password = document.getElementById('password').value;

  if (password.length < 8) {
    alert('La contraseña debe tener al menos 8 caracteres.');
    return;
  }

  const headers = {
    ...obtenerHeadersAutenticacion(),
    'Content-Type': 'application/json'
  };

  const payload = {
    nombre: document.getElementById('nombre').value,
    usuario: document.getElementById('usuario').value,
    password,
    rol: document.getElementById('rol').value
  };

  const response = await fetch('/api/usuarios', {
    method: 'POST',
    headers,
    body: JSON.stringify(payload)
  });

  if (response.status === 401) {
    realizarLogout();
    return;
  }

  const data = await response.json();

  if (!response.ok) {
    alert(data.mensaje || 'Error al crear el usuario');
    return;
  }

  alert('Usuario creado exitosamente');
  form.reset();
  cargarYRenderUsuarios();
}

// Eliminar usuario
async function eliminarUsuario(id) {
  if (!confirm('¿Está seguro de que desea eliminar este usuario?')) return;

  const headers = obtenerHeadersAutenticacion();

  const response = await fetch(`/api/usuarios/${id}`, {
    method: 'DELETE',
    headers
  });

  if (response.status === 401) {
    realizarLogout();
    return;
  }

  const data = await response.json();

  if (!response.ok) {
    alert(data.mensaje || 'Error al eliminar el usuario');
    return;
  }

  alert('Usuario eliminado exitosamente');
  cargarYRenderUsuarios();
}

// Cargar y render usuarios
async function cargarYRenderUsuarios() {
  const usuarios = await cargarUsuarios();
  renderUsuarios(usuarios);
}

// Inicialización
document.addEventListener('DOMContentLoaded', () => {
  if (!verificarAdmin()) return;

  mostrarInfoUsuario();
  cargarYRenderUsuarios();

  const usuarioForm = document.getElementById('usuarioForm');
  if (usuarioForm) {
    usuarioForm.addEventListener('submit', crearUsuario);
  }
});
