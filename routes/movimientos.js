const express = require("express");
const fs = require("fs");
const path = require("path");

const router = express.Router();
const productosPath = path.join(__dirname, "..", "data", "productos.json");
const movimientosPath = path.join(__dirname, "..", "data", "movimientos.json");

function leerJSON(filePath) {
  const data = fs.readFileSync(filePath, "utf8");
  return JSON.parse(data);
}

function guardarJSON(filePath, data) {
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
}

// Obtener movimientos (admin ve todos, usuarios ven solo los suyos)
router.get("/", (req, res) => {
  const movimientos = leerJSON(movimientosPath);

  // Si es usuario, filtra solo sus movimientos
  if (req.usuarioRol === "Usuario") {
    const movimientosFiltrados = movimientos.filter((m) => m.usuarioId === Number(req.usuarioId));
    return res.json(movimientosFiltrados);
  }

  // Admin ve todos
  res.json(movimientos);
});

// Registrar movimiento
router.post("/", (req, res) => {
  const productos = leerJSON(productosPath);
  const movimientos = leerJSON(movimientosPath);
  const { productoId, tipo, cantidad } = req.body;

  // Usuario solo puede registrar salidas
  if (req.usuarioRol === "Usuario" && tipo !== "salida") {
    return res.status(403).json({ mensaje: "Los usuarios solo pueden registrar salidas" });
  }

  const producto = productos.find((p) => p.id === productoId);
  if (!producto) {
    return res.status(404).json({ mensaje: "Producto no encontrado" });
  }

  if (req.usuarioRol === "Usuario" && producto.usuarioId !== Number(req.usuarioId)) {
    return res.status(403).json({ mensaje: "No tienes permiso para operar este producto" });
  }

  const cantidadNum = Number(cantidad);
  if (!Number.isFinite(cantidadNum) || cantidadNum <= 0) {
    return res.status(400).json({ mensaje: "La cantidad debe ser mayor a cero" });
  }

  if (tipo === "salida") {
    if (producto.cantidad < cantidadNum) {
      return res.status(400).json({ mensaje: "No hay suficiente stock para esta salida" });
    }
    producto.cantidad -= cantidadNum;
  } else if (tipo === "entrada") {
    producto.cantidad += cantidadNum;
  } else {
    return res.status(400).json({ mensaje: "Tipo de movimiento inválido" });
  }

  const movimiento = {
    id: Date.now().toString(),
    productoId,
    tipo,
    cantidad: cantidadNum,
    usuarioId: Number(req.usuarioId),
    fecha: new Date().toISOString()
  };

  movimientos.push(movimiento);
  guardarJSON(productosPath, productos);
  guardarJSON(movimientosPath, movimientos);
  res.status(201).json(movimiento);
});

module.exports = router;
