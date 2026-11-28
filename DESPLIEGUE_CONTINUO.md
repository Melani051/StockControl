# Liberación y despliegue continuo — StockControl

## Estado de preparación

- Versión de la primera liberación: `1.0.0` (definida en `package.json`).
- Plataforma elegida: Render, servicio web para Node.js/Express.
- Configuración declarativa: `render.yaml`.
- Validación local: `npm test` aprobó 20/20 pruebas; la sintaxis pasó en 15 archivos JavaScript.
- Comprobación local del servidor: `/health` respondió `ok`, `/version` respondió `1.0.0`, el login entregó token y encabezados falsificados recibieron `401`.
- CI remoto de estos cambios, URL pública y capturas: pendientes de subir la preparación y crear el servicio en Render.
- URL pública, primera publicación, actualización posterior y capturas: se completan después de crear el servicio en la cuenta de Render.

## Justificación de la plataforma

StockControl ejecuta un servidor Express, sirve páginas web y expone una API; por ello necesita un servicio web, no un alojamiento estático como GitHub Pages. Render puede conectar el repositorio, ejecutar `npm ci` y `npm start`, ofrecer una URL HTTPS y desplegar los commits de `main` solo cuando pasan las comprobaciones de CI.

## Configuración del servicio

El Blueprint `render.yaml` declara:

| Campo | Valor |
|---|---|
| Tipo | Web service, runtime Node.js |
| Rama | `main` |
| Build | `npm ci` |
| Inicio | `npm start` |
| Verificación de salud | `GET /health` |
| Despliegue automático | Después de pasar CI (`checksPass`) |
| Plan | Free para esta demostración |

Render proporciona `PORT` y `NODE_ENV`. El Blueprint genera `SESSION_SECRET`; al crear el servicio se deben definir `ADMIN_USERNAME` y `ADMIN_PASSWORD` como valores secretos. La contraseña debe tener al menos 12 caracteres. No se deben subir valores secretos al repositorio.

## Preparación y publicación inicial

1. Confirmar que `npm test` y la comprobación de sintaxis finalizan correctamente.
2. Subir los cambios a `main`; GitHub Actions ejecutará las validaciones.
3. En Render, crear un Blueprint desde el repositorio `Melani051/StockControl` y revisar el servicio indicado por `render.yaml`.
4. Introducir el nombre y la contraseña del administrador en los campos solicitados; permitir que Render genere `SESSION_SECRET`.
5. Crear el servicio y esperar a que el primer despliegue termine correctamente.
6. Guardar la URL `onrender.com` y comprobar `/health`, `/version`, el inicio de sesión y las funciones principales.

## Pruebas posteriores al despliegue

Registrar evidencia de estas verificaciones en la entrega PDF:

- Página de inicio de sesión y acceso al panel.
- Alta y búsqueda de un producto por ID o código de barras.
- Registro de entrada y salida; comprobar que no se permita stock negativo.
- Alertas de bajo stock y resumen de inventario.
- Restricciones de usuario y administrador; una solicitud sin token debe responder `401`.
- Página `/health` y versión publicada en `/version`.

No usar datos personales reales en la demostración.

## Actualización de versión

Después de verificar la primera publicación `1.0.0`, incrementar la versión del paquete a `1.0.1`, actualizar el registro de cambios y subir la actualización a `main`. Confirmar que CI pase, que Render despliegue el nuevo commit y que `/version` muestre `1.0.1`. Guardar capturas de CI, del historial de despliegues y de la comprobación pública.

## Limitaciones y soluciones

- `.gitignore` tenía marcadores de un conflicto de merge; se retiraron y se conservaron las reglas de exclusión útiles.
- El middleware aceptaba la identidad enviada en encabezados editables. Se cambió a tokens HMAC con vencimiento y el administrador de producción se configura mediante variables de entorno.
- El plan gratuito de Render usa un sistema de archivos efímero. Como la aplicación almacena datos en JSON, los cambios de productos, movimientos y usuarios pueden desaparecer si el servicio se suspende, reinicia o se vuelve a desplegar. Para esta publicación académica se usarán datos de demostración; conservar datos requiere una base administrada o un servicio con disco persistente.
- La primera publicación y las capturas aún están pendientes de crear el servicio en Render; este documento no presenta esa evidencia como si ya existiera.

## Beneficios esperados

El despliegue continuo vincula cada cambio aprobado por CI con una publicación reproducible. Esto reduce pasos manuales, detecta errores antes de publicar y permite verificar qué versión está activa.

## Evidencia de la entrega

| Evidencia | Registro |
|---|---|
| Ejecución de CI | Pendiente de publicar los cambios |
| Primera publicación | Pendiente de crear el servicio |
| URL pública | Pendiente de crear el servicio |
| Pruebas posteriores al despliegue | Pendientes |
| Actualización `1.0.1` | Pendiente de la primera publicación |
| Capturas para el PDF | Pendientes |
