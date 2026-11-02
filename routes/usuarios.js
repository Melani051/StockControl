const express = require("express");
const fs = require("fs");
const path = require("path");
const { verificarAutenticacion, verificarAdmin } = require("../middleware/auth");

const router = express.Router();
const usuariosPath = path.join(__dirname, "..", "data", "usuarios.json");

function leerUsuarios() {
  const data = fs.readFileSync(usuariosPath, "utf8");
  return JSON.parse(data);
}

function guardarUsuarios(usuarios) {
  fs.writeFileSync(usuariosPath, JSON.stringify(usuarios, null, 2));
}

// Obtener todos los usuarios (solo admin)
router.get("/", verificarAutenticacion, verificarAdmin, (req, res) => {
  const usuarios = leerUsuarios();
  // No incluir contraseñas en la respuesta
  const usuariosSinPassword = usuarios.map(({ password, ...rest }) => rest);
  res.json(usuariosSinPassword);
});

// Crear nuevo usuario (solo admin)
router.post("/", verificarAutenticacion, verificarAdmin, (req, res) => {
  const usuarios = leerUsuarios();
  const { nombre, usuario, password, rol } = req.body;

  if (!nombre || !usuario || !password || !rol) {
    return res.status(400).json({ mensaje: "Todos los campos son requeridos" });
  }

  if (String(password).length < 8) {
    return res.status(400).json({ mensaje: "La contraseña debe tener al menos 8 caracteres" });
  }

  if (rol !== "Administrador" && rol !== "Usuario") {
    return res.status(400).json({ mensaje: "El rol debe ser 'Administrador' o 'Usuario'" });
  }

  // Verificar si el usuario ya existe
  if (usuarios.some((u) => u.usuario === usuario)) {
    return res.status(400).json({ mensaje: "El usuario ya existe" });
  }

  const nuevoUsuario = {
    id: Math.max(...usuarios.map((u) => u.id), 0) + 1,
    nombre,
    usuario,
    password, // En producción, esto debería estar encriptado
    rol,
    fechaRegistro: new Date().toISOString()
  };

  usuarios.push(nuevoUsuario);
  guardarUsuarios(usuarios);

  const { password: _, ...usuarioSinPassword } = nuevoUsuario;
  res.status(201).json({
    mensaje: "Usuario creado exitosamente",
    usuario: usuarioSinPassword
  });
});

// Obtener usuario por ID (solo admin puede ver otros usuarios)
router.get("/:id", verificarAutenticacion, (req, res) => {
  const usuarios = leerUsuarios();
  const usuario = usuarios.find((u) => u.id === Number(req.params.id));

  if (!usuario) {
    return res.status(404).json({ mensaje: "Usuario no encontrado" });
  }

  // Un usuario solo puede ver su propia información, o si es admin
  if (req.usuarioId !== req.params.id && req.usuarioRol !== "Administrador") {
    return res.status(403).json({ mensaje: "No tienes permiso para ver este usuario" });
  }

  const { password, ...usuarioSinPassword } = usuario;
  res.json(usuarioSinPassword);
});

// Eliminar usuario (solo admin)
router.delete("/:id", verificarAutenticacion, verificarAdmin, (req, res) => {
  const usuarios = leerUsuarios();
  const usuarioIndex = usuarios.findIndex((u) => u.id === Number(req.params.id));

  if (usuarioIndex === -1) {
    return res.status(404).json({ mensaje: "Usuario no encontrado" });
  }

  // Evitar que se elimine el último administrador
  const usuarioAEliminar = usuarios[usuarioIndex];
  if (usuarioAEliminar.rol === "Administrador") {
    const admins = usuarios.filter((u) => u.rol === "Administrador");
    if (admins.length === 1) {
      return res.status(400).json({ mensaje: "No se puede eliminar el último administrador" });
    }
  }

  usuarios.splice(usuarioIndex, 1);
  guardarUsuarios(usuarios);

  res.json({ mensaje: "Usuario eliminado exitosamente" });
});

// Actualizar usuario (solo admin puede actualizar otros, usuarios pueden actualizar su info)
router.put("/:id", verificarAutenticacion, (req, res) => {
  const usuarios = leerUsuarios();
  const usuarioIndex = usuarios.findIndex((u) => u.id === Number(req.params.id));

  if (usuarioIndex === -1) {
    return res.status(404).json({ mensaje: "Usuario no encontrado" });
  }

  // Un usuario solo puede actualizar su propia información
  if (req.usuarioId !== req.params.id && req.usuarioRol !== "Administrador") {
    return res.status(403).json({ mensaje: "No tienes permiso para actualizar este usuario" });
  }

  const { nombre, password } = req.body;

  if (nombre) {
    usuarios[usuarioIndex].nombre = nombre;
  }

  if (password !== undefined) {
    if (String(password).length < 8) {
      return res.status(400).json({ mensaje: "La contraseña debe tener al menos 8 caracteres" });
    }
    usuarios[usuarioIndex].password = password;
  }

  // Solo los administradores pueden cambiar el rol
  if (req.body.rol && req.usuarioRol === "Administrador") {
    usuarios[usuarioIndex].rol = req.body.rol;
  }

  guardarUsuarios(usuarios);

  const { password: _, ...usuarioSinPassword } = usuarios[usuarioIndex];
  res.json({
    mensaje: "Usuario actualizado exitosamente",
    usuario: usuarioSinPassword
  });
});

module.exports = router;
