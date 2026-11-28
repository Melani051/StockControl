# StockControl

Aplicación web de inventario para pequeños negocios, desarrollada con Node.js, Express y archivos JSON.

## Funciones

- Inicio de sesión y permisos por rol.
- Alta, consulta, edición y eliminación de productos.
- Registro de entradas y salidas de inventario.
- Consulta de existencias y alertas de bajo stock.
- Administración de usuarios.
- Búsqueda por código de barras o ID.
- Resumen del valor del inventario en el módulo de demostración.

## Estructura

```text
StockControl/
├── .github/workflows/ci.yml
├── data/                 # Datos JSON de demostración
├── lib/                  # Acceso a usuarios
├── middleware/           # Autenticación y permisos
├── public/               # Interfaz web
├── routes/               # API Express
├── src/                  # Módulo Inventory y servidor de demostración
├── test/                 # Pruebas automatizadas
├── app.js
├── CHANGELOG.md
├── DESPLIEGUE_CONTINUO.md
├── package.json
├── package-lock.json
├── render.yaml            # Blueprint de despliegue
├── SISTEMA_AUTENTICACION.md
└── README.md
```

## Requisitos y uso local

- Node.js 20 o superior
- npm

```bash
npm ci
npm start
```

La aplicación abre en `http://localhost:3000`. Para ejecutar las pruebas:

```bash
npm test
```

## Liberación y despliegue continuo

El proyecto se prepara para publicarse como servicio web en Render mediante el archivo `render.yaml`. Render ejecuta `npm ci` y `npm start`, comprueba `/health` y despliega cambios de `main` después de que pasen las validaciones de CI.

Para crear el servicio, conecta el repositorio en Render e importa el Blueprint. Durante la configuración define `ADMIN_USERNAME` y `ADMIN_PASSWORD`; usa una contraseña de al menos 12 caracteres. Render genera `SESSION_SECRET` automáticamente. No guardes esos valores en Git.

El Blueprint usa el plan gratuito. Los servicios gratuitos pueden suspenderse después de inactividad y su sistema de archivos no es persistente: los cambios en los archivos JSON pueden perderse al reiniciarse o desplegarse el servicio. Usa únicamente datos de demostración. Para conservar datos entre reinicios se requiere una base de datos o un servicio con almacenamiento persistente.

Consulta [DESPLIEGUE_CONTINUO.md](DESPLIEGUE_CONTINUO.md) para el procedimiento y la evidencia de la liberación.
