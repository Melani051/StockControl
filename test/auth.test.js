const test = require('node:test');
const assert = require('node:assert/strict');
const {
  crearTokenAcceso,
  verificarTokenAcceso,
  verificarAutenticacion
} = require('../middleware/auth');
const { buscarUsuario } = require('../lib/usuarios');

function crearRespuesta() {
  return {
    statusCode: null,
    body: null,
    status(code) {
      this.statusCode = code;
      return this;
    },
    json(body) {
      this.body = body;
      return this;
    }
  };
}

test('firma tokens de acceso y conserva la identidad y el rol', () => {
  const token = crearTokenAcceso({ id: 7, rol: 'Administrador' });

  assert.deepEqual(verificarTokenAcceso(token).sub, '7');
  assert.equal(verificarTokenAcceso(token).rol, 'Administrador');
});

test('rechaza un token alterado', () => {
  const token = crearTokenAcceso({ id: 7, rol: 'Administrador' });
  const payload = token.split('.')[0];

  assert.equal(verificarTokenAcceso(`${payload}.firma-falsa`), null);
});

test('no acepta identidad enviada solo en encabezados editables', () => {
  const req = {
    headers: {
      'x-usuario-id': '1',
      'x-usuario-rol': 'Administrador'
    }
  };
  const res = crearRespuesta();
  let avanzo = false;

  verificarAutenticacion(req, res, () => { avanzo = true; });

  assert.equal(avanzo, false);
  assert.equal(res.statusCode, 401);
});

test('autentica solicitudes con un token firmado', () => {
  const token = crearTokenAcceso({ id: 7, rol: 'Usuario' });
  const req = { headers: { authorization: `Bearer ${token}` } };
  const res = crearRespuesta();
  let avanzo = false;

  verificarAutenticacion(req, res, () => { avanzo = true; });

  assert.equal(avanzo, true);
  assert.equal(req.usuarioId, '7');
  assert.equal(req.usuarioRol, 'Usuario');
});

test('en producción acepta el administrador configurado y bloquea cuentas de demostración', () => {
  const entornoAnterior = {
    nodeEnv: process.env.NODE_ENV,
    username: process.env.ADMIN_USERNAME,
    password: process.env.ADMIN_PASSWORD
  };

  process.env.NODE_ENV = 'production';
  process.env.ADMIN_USERNAME = 'admin-publicacion';
  process.env.ADMIN_PASSWORD = 'clave-segura-de-prueba';

  try {
    assert.equal(buscarUsuario('admin-publicacion', 'clave-segura-de-prueba').id, 1);
    assert.equal(buscarUsuario('admin', '1234'), undefined);
  } finally {
    if (entornoAnterior.nodeEnv === undefined) delete process.env.NODE_ENV;
    else process.env.NODE_ENV = entornoAnterior.nodeEnv;
    if (entornoAnterior.username === undefined) delete process.env.ADMIN_USERNAME;
    else process.env.ADMIN_USERNAME = entornoAnterior.username;
    if (entornoAnterior.password === undefined) delete process.env.ADMIN_PASSWORD;
    else process.env.ADMIN_PASSWORD = entornoAnterior.password;
  }
});
