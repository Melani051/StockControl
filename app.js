const express = require("express");
const path = require("path");
const { version } = require("./package.json");
const productosRoutes = require("./routes/productos");
const movimientosRoutes = require("./routes/movimientos");
const usuariosRoutes = require("./routes/usuarios");
const authRoutes = require("./routes/auth");
const { verificarAutenticacion, verificarAdmin } = require("./middleware/auth");

const app = express();
const PORT = process.env.PORT || 3000;

if (process.env.NODE_ENV === "production") {
  const variablesRequeridas = ["SESSION_SECRET", "ADMIN_USERNAME", "ADMIN_PASSWORD"];
  const faltantes = variablesRequeridas.filter((nombre) => !process.env[nombre]);
  if (faltantes.length) {
    throw new Error(`Faltan variables de entorno requeridas: ${faltantes.join(", ")}`);
  }
  if (process.env.ADMIN_PASSWORD.length < 12) {
    throw new Error("ADMIN_PASSWORD debe tener al menos 12 caracteres en producción");
  }
}

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

app.get("/health", (_req, res) => {
  res.json({ estado: "ok" });
});

app.get("/version", (_req, res) => {
  res.json({ version });
});

// Ruta principal
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

app.listen(PORT, () => {
  console.log(`Servidor ejecutándose en http://localhost:${PORT}`);
});
