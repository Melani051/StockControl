const express = require("express");
const { buscarUsuario } = require("../lib/usuarios");
const { crearTokenAcceso } = require("../middleware/auth");

const router = express.Router();

// Ruta de login
router.post("/login", (req, res) => {
  const { usuario, password } = req.body;

  if (!usuario || !password) {
    return res.status(400).json({ mensaje: "Usuario y contraseña son requeridos" });
  }

  const usuarioEncontrado = buscarUsuario(usuario, password);

  if (!usuarioEncontrado) {
    return res.status(401).json({ mensaje: "Usuario o contraseña incorrectos" });
  }

  // No incluir la contraseña en la respuesta
  const { password: _, ...usuarioSinPassword } = usuarioEncontrado;

  res.json({
    mensaje: "Inicio de sesión exitoso",
    usuario: usuarioSinPassword,
    token: crearTokenAcceso(usuarioSinPassword)
  });
});

// Ruta de logout (simplemente retorna un mensaje)
router.post("/logout", (req, res) => {
  res.json({ mensaje: "Sesión cerrada" });
});

module.exports = router;
