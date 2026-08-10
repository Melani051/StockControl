const express = require("express");
const fs = require("fs");
const path = require("path");

const router = express.Router();
const usuariosPath = path.join(__dirname, "..", "data", "usuarios.json");

function leerUsuarios() {
  const data = fs.readFileSync(usuariosPath, "utf8");
  return JSON.parse(data);
}

// Ruta de login
router.post("/login", (req, res) => {
  const usuarios = leerUsuarios();
  const { usuario, password } = req.body;

  if (!usuario || !password) {
    return res.status(400).json({ mensaje: "Usuario y contraseña son requeridos" });
  }

  const usuarioEncontrado = usuarios.find(
    (u) => u.usuario === usuario && u.password === password
  );

  if (!usuarioEncontrado) {
    return res.status(401).json({ mensaje: "Usuario o contraseña incorrectos" });
  }

  // No incluir la contraseña en la respuesta
  const { password: _, ...usuarioSinPassword } = usuarioEncontrado;

  res.json({
    mensaje: "Inicio de sesión exitoso",
    usuario: usuarioSinPassword
  });
});

// Ruta de logout (simplemente retorna un mensaje)
router.post("/logout", (req, res) => {
  res.json({ mensaje: "Sesión cerrada" });
});

module.exports = router;
