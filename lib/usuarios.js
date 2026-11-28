const fs = require("node:fs");
const path = require("node:path");

const usuariosPath = path.join(__dirname, "..", "data", "usuarios.json");

function esProduccion() {
  return process.env.NODE_ENV === "production";
}

function leerUsuariosArchivo() {
  return JSON.parse(fs.readFileSync(usuariosPath, "utf8"));
}

function leerUsuarios() {
  const usuarios = leerUsuariosArchivo();
  if (!esProduccion()) return usuarios;

  const administrador = {
    id: 1,
    nombre: "Administrador",
    usuario: process.env.ADMIN_USERNAME,
    rol: "Administrador"
  };
  return [administrador, ...usuarios.filter((usuario) => usuario.id >= 4)];
}

function guardarUsuarios(usuarios) {
  const paraGuardar = esProduccion()
    ? usuarios.filter((usuario) => usuario.id >= 4)
    : usuarios;
  fs.writeFileSync(usuariosPath, JSON.stringify(paraGuardar, null, 2));
}

function buscarUsuario(usuario, password) {
  if (esProduccion() &&
      usuario === process.env.ADMIN_USERNAME &&
      password === process.env.ADMIN_PASSWORD) {
    return leerUsuarios().find((u) => u.id === 1);
  }

  return leerUsuariosArchivo().find((u) =>
    (!esProduccion() || u.id >= 4) &&
    u.usuario === usuario &&
    u.password === password
  );
}

module.exports = { leerUsuarios, guardarUsuarios, buscarUsuario };
