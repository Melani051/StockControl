
# StockControl

Sistema web de control de inventario desarrollado con Node.js y Express, utilizando archivos JSON para almacenar la información.

El proyecto está orientado a pequeños negocios que necesitan organizar sus productos, controlar sus existencias y registrar movimientos de inventario.

## Objetivo

Facilitar la administración del inventario mediante una aplicación que permita registrar productos, consultar existencias, controlar entradas y salidas y gestionar usuarios.

## Funcionalidades principales

- Inicio de sesión con diferentes roles de usuario.
- Administración de productos: alta, edición, consulta y eliminación.
- Registro de entradas y salidas de inventario.
- Consulta de existencias disponibles.
- Administración de usuarios.
- Búsqueda de productos por código de barras o ID.
- Control de permisos según el tipo de usuario.

## Tecnologías y herramientas

| Tecnología | Uso |
|---|---|
| Node.js | Entorno de ejecución |
| Express | Desarrollo del servidor y API |
| JavaScript | Lenguaje de programación |
| Archivos JSON | Almacenamiento de información |
| npm | Administración de dependencias |
| node:test | Pruebas automatizadas |
| Git | Control de versiones |
| GitHub | Repositorio remoto |
| GitHub Actions | Integración continua |
| Visual Studio Code | Editor de código |

## Estructura del proyecto

```text
StockControl/
├── .github/
│   └── workflows/
│       └── ci.yml
├── data/
├── middleware/
├── public/
├── routes/
├── test/
├── .gitignore
├── app.js
├── package.json
├── package-lock.json
├── SISTEMA_AUTENTICACION.md
└── README.md
```

## Requisitos

- Node.js
- npm

## Instalación

Clonar el repositorio:

```bash
git clone https://github.com/Melani051/StockControl.git
```

Entrar a la carpeta:

```bash
cd StockControl
```

Instalar las dependencias:

```bash
npm ci
```

## Ejecución

Iniciar la aplicación:

```bash
npm start
```

Abrir en el navegador:

```text
http://localhost:3000
```

## Pruebas automatizadas

Para ejecutar las pruebas del proyecto:

```bash
npm test
```

Las pruebas permiten comprobar el funcionamiento de la lógica del inventario y de los servicios del servidor.

## Integración continua

El proyecto utiliza GitHub Actions para validar automáticamente los cambios.

El flujo se ejecuta cuando se realiza un `push` o se crea un `pull request` hacia la rama `main`.

Las actividades principales del flujo son:

1. Descargar el código del repositorio.
2. Configurar Node.js.
3. Instalar las dependencias con `npm ci`.
4. Ejecutar las pruebas mediante `npm test`.
5. Mostrar el resultado de la validación.

Cuando alguna prueba falla, GitHub Actions identifica el problema y marca la ejecución como fallida.

## Documentación adicional

Consulta el archivo `SISTEMA_AUTENTICACION.md` para obtener información adicional sobre la autenticación del sistema.

## Repositorio

https://github.com/Melani051/StockControl
