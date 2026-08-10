const express = require("express");
const path = require("path");
const productosRoutes = require("./routes/productos");
const movimientosRoutes = require("./routes/movimientos");
const usuariosRoutes = require("./routes/usuarios");
const authRoutes = require("./routes/auth");
const { verificarAutenticacion, verificarAdmin } = require("./middleware/auth");

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "public")));

// Rutas públicas (sin autenticación) - auth
app.use("/api/auth", authRoutes);

// Rutas de usuarios (requieren autenticación)
app.use("/api/usuarios", usuariosRoutes);

// Proteger rutas de productos y movimientos
app.use("/productos", verificarAutenticacion, productosRoutes);
app.use("/movimientos", verificarAutenticacion, movimientosRoutes);

// Ruta principal
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

app.listen(PORT, () => {
  console.log(`Servidor ejecutándose en http://localhost:${PORT}`);
});