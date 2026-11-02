# StockControl

<<<<<<< HEAD
Sistema básico de control de inventario por línea de comandos.

**Autora:** Melani Judith Zermeño Yáñez — Matrícula 230167 — 9°D IDGS  
**Materia:** Desarrollo Web Integral — Universidad Tecnológica de Aguascalientes

## Objetivo

Registrar productos, actualizar su stock, calcular el valor total del inventario
y detectar productos con poco stock, usando control de versiones (Git/GitHub) e
integración continua (GitHub Actions) para validar el código automáticamente.

## Herramientas utilizadas

| Herramienta | Uso |
|---|---|
| Node.js 20 | Lenguaje / entorno de ejecución |
| Git | Control de versiones |
| GitHub | Repositorio remoto |
| GitHub Actions | Integración continua |
| node:test | Pruebas automáticas (incluido en Node.js) |
| Visual Studio Code | Editor de código |
=======
![CI](https://github.com/Melani051/StockControl/actions/workflows/ci.yml/badge.svg)

Aplicación web de control de inventario desarrollada con **Node.js**, **Express** y archivos **JSON** como almacenamiento. Permite administrar productos, registrar movimientos de entrada y salida, y gestionar usuarios con distintos roles.

## Funcionalidades

- Inicio de sesión con roles (administrador y usuario).
- Alta, edición, búsqueda y eliminación de productos.
- Registro de movimientos de inventario.
- Administración de usuarios (solo administrador).
- Búsqueda de productos por código de barras o ID.
>>>>>>> 2b8984a69e78ef40e610bafbdf87f39fb6930b4e

## Estructura del proyecto

```
StockControl/
<<<<<<< HEAD
├── .github/workflows/ci.yml   # Flujo de integración continua
├── src/
│   ├── inventory.js           # Lógica del inventario
│   ├── index.js               # Programa de demostración
│   └── server.js              # Servidor web y API
├── public/
│   ├── index.html             # Interfaz web
│   ├── styles.css             # Estilos adaptables
│   └── app.js                 # Interacción con la API
├── test/
│   ├── inventory.test.js      # Pruebas de la lógica
│   └── server.test.js         # Pruebas de la API
├── .gitignore
├── package.json
└── README.md
```

## Instrucciones de ejecución

Requisito: tener instalado [Node.js](https://nodejs.org/) 18 o superior.
=======
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
>>>>>>> 2b8984a69e78ef40e610bafbdf87f39fb6930b4e

```bash
git clone https://github.com/Melani051/StockControl.git
cd StockControl
<<<<<<< HEAD
npm start      # ejecuta el programa
npm test       # ejecuta las pruebas automáticas
```

No requiere instalar dependencias.

## Interfaz web

Ejecuta `npm run web` y abre [http://localhost:3000](http://localhost:3000).
El inventario inicia con Laptop (5 unidades), Mouse (20) y Teclado (3).
La interfaz permite consultar productos, agregar artículos, buscar por nombre,
registrar entradas y salidas de existencias con los botones + y −, y ver el
valor total del inventario. Los productos con 5 unidades o menos se resaltan;
los errores de validación se muestran directamente en la página.

## Integración continua

Cada vez que se hace `push` a la rama `main`, GitHub Actions ejecuta
`npm test`. Si alguna prueba falla, el flujo se marca en rojo.
=======
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
>>>>>>> 2b8984a69e78ef40e610bafbdf87f39fb6930b4e
