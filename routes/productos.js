const express = require("express");
const fs = require("fs");
const path = require("path");
const { verificarAdmin } = require("../middleware/auth");

const router = express.Router();
const filePath = path.join(__dirname, "..", "data", "productos.json");
const usuariosPath = path.join(__dirname, "..", "data", "usuarios.json");

function leerProductos() {
  const data = fs.readFileSync(filePath, "utf8");
  return JSON.parse(data);
}

function guardarProductos(productos) {
  fs.writeFileSync(filePath, JSON.stringify(productos, null, 2));
}

function leerUsuarios() {
  const data = fs.readFileSync(usuariosPath, "utf8");
  return JSON.parse(data);
}

// Obtener todos los productos (acceso para todos los usuarios autenticados)
router.get("/", (req, res) => {
  const productos = leerProductos();

  if (req.usuarioRol === "Usuario") {
    const productosPropios = productos.filter(
      (producto) => producto.usuarioId === Number(req.usuarioId)
    );
    return res.json(productosPropios);
  }

  res.json(productos);
});

// Crear producto (solo admin)
router.post("/", verificarAdmin, (req, res) => {
  const productos = leerProductos();
  const usuarios = leerUsuarios();
  const propietarioId = req.body.usuarioId
    ? Number(req.body.usuarioId)
    : Number(req.usuarioId);

  if (req.body.usuarioId && !usuarios.some((u) => u.id === propietarioId)) {
    return res.status(400).json({ mensaje: "El usuario propietario no existe" });
  }

  const nuevoProducto = {
    id: Date.now().toString(),
    nombre: req.body.nombre,
    categoria: req.body.categoria,
    descripcion: req.body.descripcion,
    codigoBarras: req.body.codigoBarras || '',
    marca: req.body.marca || '',
    imagen: req.body.imagen || '',
    precio: Number(req.body.precio),
    cantidad: Number(req.body.cantidad),
    proveedor: req.body.proveedor,
    usuarioId: propietarioId,
    fechaRegistro: new Date().toISOString()
  };

  productos.push(nuevoProducto);
  guardarProductos(productos);
  res.status(201).json(nuevoProducto);
});

// Actualizar producto (solo admin)
router.put("/:id", verificarAdmin, (req, res) => {
  const productos = leerProductos();
  const usuarios = leerUsuarios();
  const index = productos.findIndex((p) => p.id === req.params.id);

  if (index === -1) {
    return res.status(404).json({ mensaje: "Producto no encontrado" });
  }

  const updatedProducto = {
    ...productos[index],
    ...req.body,
    precio: req.body.precio !== undefined ? Number(req.body.precio) : productos[index].precio,
    cantidad: req.body.cantidad !== undefined ? Number(req.body.cantidad) : productos[index].cantidad
  };

  if (req.body.usuarioId !== undefined) {
    const nuevoPropietarioId = Number(req.body.usuarioId);
    if (!usuarios.some((u) => u.id === nuevoPropietarioId)) {
      return res.status(400).json({ mensaje: "El usuario propietario no existe" });
    }
    updatedProducto.usuarioId = nuevoPropietarioId;
  }

  productos[index] = updatedProducto;
  guardarProductos(productos);
  res.json(productos[index]);
});

// Eliminar producto (solo admin)
router.delete("/:id", verificarAdmin, (req, res) => {
  const productos = leerProductos();
  const filtrados = productos.filter((p) => p.id !== req.params.id);

  if (filtrados.length === productos.length) {
    return res.status(404).json({ mensaje: "Producto no encontrado" });
  }

  guardarProductos(filtrados);
  res.json({ mensaje: "Producto eliminado" });
});

module.exports = router;
