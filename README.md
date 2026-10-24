# StockControl

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

## Estructura del proyecto

```
StockControl/
├── .github/workflows/ci.yml   # Flujo de integración continua
├── src/
│   ├── inventory.js           # Lógica del inventario
│   └── index.js               # Programa de demostración
├── test/
│   └── inventory.test.js      # Pruebas automáticas
├── .gitignore
├── package.json
└── README.md
```

## Instrucciones de ejecución

Requisito: tener instalado [Node.js](https://nodejs.org/) 18 o superior.

```bash
git clone https://github.com/Melani051/StockControl.git
cd StockControl
npm start      # ejecuta el programa
npm test       # ejecuta las pruebas automáticas
```

No requiere instalar dependencias.

## Integración continua

Cada vez que se hace `push` a la rama `main`, GitHub Actions ejecuta
`npm test`. Si alguna prueba falla, el flujo se marca en rojo.
