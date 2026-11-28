const crypto = require("node:crypto");

const TOKEN_LIFETIME_SECONDS = 8 * 60 * 60;
const LOCAL_SESSION_SECRET = "stockcontrol-local-development-only";

function getSessionSecret() {
  if (process.env.SESSION_SECRET) return process.env.SESSION_SECRET;
  if (process.env.NODE_ENV === "production") {
    throw new Error("SESSION_SECRET debe configurarse en producción");
  }
  return LOCAL_SESSION_SECRET;
}

function crearTokenAcceso(usuario) {
  const payload = Buffer.from(JSON.stringify({
    sub: String(usuario.id),
    rol: usuario.rol,
    exp: Math.floor(Date.now() / 1000) + TOKEN_LIFETIME_SECONDS
  })).toString("base64url");
  const signature = crypto
    .createHmac("sha256", getSessionSecret())
    .update(payload)
    .digest("base64url");

  return `${payload}.${signature}`;
}

function verificarTokenAcceso(token) {
  if (typeof token !== "string") return null;

  const [payload, signature, extra] = token.split(".");
  if (!payload || !signature || extra !== undefined) return null;

  const firmaEsperada = crypto
    .createHmac("sha256", getSessionSecret())
    .update(payload)
    .digest();
  let firmaRecibida;
  try {
    firmaRecibida = Buffer.from(signature, "base64url");
  } catch {
    return null;
  }

  if (firmaRecibida.length !== firmaEsperada.length ||
      !crypto.timingSafeEqual(firmaRecibida, firmaEsperada)) {
    return null;
  }

  try {
    const datos = JSON.parse(Buffer.from(payload, "base64url").toString("utf8"));
    if (!datos.sub || !datos.rol || datos.exp <= Math.floor(Date.now() / 1000)) {
      return null;
    }
    return datos;
  } catch {
    return null;
  }
}

function verificarAutenticacion(req, res, next) {
  const authorization = req.headers.authorization || "";
  const coincidencia = authorization.match(/^Bearer\s+(.+)$/i);
  const usuario = coincidencia ? verificarTokenAcceso(coincidencia[1]) : null;

  if (!usuario) {
    return res.status(401).json({ mensaje: "No autenticado" });
  }

  req.usuarioId = usuario.sub;
  req.usuarioRol = usuario.rol;
  next();
}

function verificarAdmin(req, res, next) {
  if (req.usuarioRol !== "Administrador") {
    return res.status(403).json({ mensaje: "No tienes permisos para realizar esta acción" });
  }
  next();
}

function verificarUsuario(req, res, next) {
  if (!req.usuarioRol) {
    return res.status(401).json({ mensaje: "No autenticado" });
  }
  next();
}

module.exports = {
  crearTokenAcceso,
  verificarTokenAcceso,
  verificarAutenticacion,
  verificarAdmin,
  verificarUsuario
};
