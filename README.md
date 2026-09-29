# StockControl

![CI](https://github.com/Melani051/StockControl/actions/workflows/ci.yml/badge.svg)

Aplicación web de control de inventario desarrollada con **Node.js**, **Express** y archivos **JSON** como almacenamiento. Permite administrar productos, registrar movimientos de entrada y salida, y gestionar usuarios con distintos roles.

## Funcionalidades

- Inicio de sesión con roles (administrador y usuario).
- Alta, edición, búsqueda y eliminación de productos.
- Registro de movimientos de inventario.
- Administración de usuarios (solo administrador).
- Búsqueda de productos por código de barras o ID.

## Estructura del proyecto

```
StockControl/
├── app.js              # Archivo principal (servidor Express)
├── routes/             # Rutas: auth, productos, movimientos, usuarios
├── middleware/         # Autenticación y permisos
├── data/               # Archivos JSON (productos, movimientos, usuarios)
├── public/             # Interfaz web (HTML, CSS, JS)
├── test/               # Pruebas automatizadas
└── .github/workflows/  # Integración continua (GitHub Actions)
```

## Requisitos

- Node.js 20 o superior
- npm

## Instalación y uso

```bash
git clone https://github.com/Melani051/StockControl.git
cd StockControl
npm install
npm start
```

La aplicación se ejecuta en `http://localhost:3000`.

## Pruebas

```bash
npm test
```

## Integración continua

Cada `push` o `pull request` hacia `main` ejecuta el flujo definido en `.github/workflows/ci.yml`:

1. Obtener el código (checkout).
2. Preparar Node.js e instalar dependencias (`npm ci`).
3. Verificar la sintaxis de los archivos JavaScript.
4. Ejecutar las pruebas (`npm test`).
5. Mostrar el resultado.

## Documentación adicional

Consulta [SISTEMA_AUTENTICACION.md](SISTEMA_AUTENTICACION.md) para conocer cómo funciona la autenticación.