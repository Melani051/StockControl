const fs = require("fs");
const path = require("path");

// Middleware para verificar que el usuario está autenticado
function verificarAutenticacion(req, res, next) {
  const usuarioId = req.headers["x-usuario-id"];
  const usuarioRol = req.headers["x-usuario-rol"];

  if (!usuarioId || !usuarioRol) {
    return res.status(401).json({ mensaje: "No autenticado" });
  }

  req.usuarioId = usuarioId;
  req.usuarioRol = usuarioRol;
  next();
}

// Middleware para verificar que el usuario es administrador
function verificarAdmin(req, res, next) {
  if (req.usuarioRol !== "Administrador") {
    return res.status(403).json({ mensaje: "No tienes permisos para realizar esta acción" });
  }
  next();
}

// Middleware para verificar que el usuario es usuario (cualquier rol puede)
function verificarUsuario(req, res, next) {
  if (!req.usuarioRol) {
    return res.status(401).json({ mensaje: "No autenticado" });
  }
  next();
}

module.exports = {
  verificarAutenticacion,
  verificarAdmin,
  verificarUsuario
};
