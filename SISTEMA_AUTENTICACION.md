# 🔐 StockControl - Sistema de Autenticación y Control de Acceso

## 📋 Resumen de Cambios

Se ha implementado un sistema completo de autenticación y control de acceso basado en roles (RBAC) para el proyecto StockControl. El sistema mantiene todas las funcionalidades existentes y agrega seguridad mediante roles de usuario.

---

## 👥 Roles del Sistema

### 1. **Administrador**
El administrador tiene acceso completo a todas las funciones del sistema:

- ✅ **Iniciar/Cerrar sesión**
- ✅ **Gestión de Usuarios**: Crear, consultar, eliminar usuarios
- ✅ **Gestión de Productos**: Crear, consultar, editar, eliminar productos
- ✅ **Gestión de Movimientos**: Registrar entradas y salidas
- ✅ **Reportes**: Consultar todos los movimientos del sistema
- ✅ **Dashboard**: Ver información general del inventario

### 2. **Usuario**
El usuario tiene acceso limitado según requerimientos:

- ✅ **Iniciar/Cerrar sesión**
- ✅ **Consultar Productos**: Ver productos disponibles y cantidades
- ✅ **Registrar Salidas**: Solo puede registrar salidas de inventario
- ✅ **Mi Historial**: Consultar solo sus propios movimientos
- ✅ **Dashboard**: Ver información general del inventario

**Restricciones**:
- ❌ No puede crear usuarios
- ❌ No puede eliminar productos
- ❌ No puede registrar entradas
- ❌ No puede ver movimientos de otros usuarios

---

## 🔧 Componentes Técnicos

### Archivos Creados

#### 1. **middleware/auth.js**
Middleware Express para validar autenticación y autorización.

**Funciones**:
- `verificarAutenticacion()`: Valida que el usuario esté autenticado
- `verificarAdmin()`: Valida que el usuario sea administrador
- `verificarUsuario()`: Valida que el usuario esté autenticado (cualquier rol)

#### 2. **routes/auth.js**
Rutas para autenticación (login/logout).

**Endpoints**:
- `POST /api/auth/login`: Autentica usuario y retorna datos
- `POST /api/auth/logout`: Cierra sesión

#### 3. **public/usuarios.html**
Página de gestión de usuarios (solo para administradores).

**Funcionalidades**:
- Formulario para crear nuevos usuarios
- Tabla de usuarios existentes
- Botones para eliminar usuarios

#### 4. **public/usuarios-script.js**
Script para gestionar la página de usuarios.

**Funciones principales**:
- `cargarUsuarios()`: Obtiene lista de usuarios
- `crearUsuario()`: Crea un nuevo usuario
- `eliminarUsuario()`: Elimina un usuario

### Archivos Modificados

#### 1. **app.js**
- ✅ Agregó rutas de autenticación (`/api/auth/*`)
- ✅ Agregó rutas de usuarios (`/api/usuarios/*`)
- ✅ Protegió rutas de productos y movimientos con middleware
- ✅ Mantiene acceso público a `index.html` y `login.html`

#### 2. **routes/productos.js**
- ✅ `GET /productos`: Acceso para todos (autenticados)
- ✅ `POST /productos`: Solo administradores
- ✅ `PUT /productos/:id`: Solo administradores
- ✅ `DELETE /productos/:id`: Solo administradores

#### 3. **routes/movimientos.js**
- ✅ `GET /movimientos`: Admins ven todos; usuarios ven solo los suyos
- ✅ `POST /movimientos`: Usuarios solo pueden registrar salidas
- ✅ Agregó campo `usuarioId` a cada movimiento

#### 4. **public/script.js**
Sistema completo de autenticación del lado cliente:

**Funciones de autenticación**:
- `obtenerUsuarioActual()`: Obtiene usuario del localStorage
- `guardarUsuarioActual()`: Guarda usuario en localStorage
- `realizarLogin()`: Procesa el login
- `realizarLogout()`: Procesa el logout
- `verificarAutenticacion()`: Valida sesión activa
- `mostrarInfoUsuario()`: Muestra usuario en el header
- `controlarAccesoPorRol()`: Oculta/muestra elementos según rol

**Funciones actualizadas**:
- Todas las llamadas a API incluyen headers de autenticación
- Control de acceso en el frontend (oculta formularios/botones)
- Redirige a login si se pierde la sesión

#### 5. **public/estilos.css**
- ✅ Estilos mejorados para la página de login
- ✅ Estilos para información del usuario en el header
- ✅ Estilos para botón "Cerrar sesión"
- ✅ Diseño responsivo mejorado
- ✅ Animaciones y transiciones

#### 6. **data/movimientos.json**
- ✅ Agregó campo `usuarioId` a los movimientos existentes

---

## 🔑 Credenciales de Prueba

### Administrador
- **Usuario**: `admin`
- **Contraseña**: `1234`
- **Rol**: Administrador

### Usuario Regular
- **Usuario**: `usuario`
- **Contraseña**: `1234`
- **Rol**: Usuario

---

## 📱 Flujo de Uso

### Para Administradores

1. Acceder a http://localhost:3000/
2. Redirige automáticamente a login.html
3. Ingresar credenciales de admin
4. En el dashboard verá:
   - Link "Usuarios" en la navegación
   - Información del usuario en el header
   - Botón "Cerrar sesión"
5. Acceso completo a todas las secciones:
   - Productos (crear, editar, eliminar)
   - Movimientos (crear entradas y salidas)
   - Usuarios (crear y eliminar usuarios)

### Para Usuarios Regulares

1. Acceder a http://localhost:3000/
2. Redirige a login.html
3. Ingresar credenciales de usuario
4. En el dashboard verá:
   - **NO** aparece link "Usuarios"
   - Información del usuario en el header
   - Botón "Cerrar sesión"
5. Acceso limitado:
   - Productos (solo consultar)
   - Movimientos (solo registrar salidas)
   - Historial (solo sus movimientos)

---

## 🔐 Sistema de Sesión

### Método de Almacenamiento
- **Cliente**: localStorage (usuario y rol)
- **Servidor**: Headers HTTP (x-usuario-id, x-usuario-rol)

### Flujo de Autenticación

```
1. Usuario ingresa credenciales en login.html
   ↓
2. Frontend hace POST a /api/auth/login
   ↓
3. Backend valida en data/usuarios.json
   ↓
4. Si es correcto, retorna datos del usuario
   ↓
5. Frontend guarda en localStorage
   ↓
6. Redirige a dashboard (index.html)
   ↓
7. Todas las llamadas incluyen headers de autenticación
```

### Validación en Backend

Cada ruta protegida:
1. Valida presencia de headers (x-usuario-id, x-usuario-rol)
2. Valida permisos según el rol
3. Retorna 401 si no está autenticado
4. Retorna 403 si no tiene permisos

---

## 🔍 Puntos de Control de Acceso

| Funcionalidad | Público | Usuario | Administrador |
|---|---|---|---|
| Ver Dashboard | ✅ | ✅ | ✅ |
| Ver Productos | ✅ | ✅ | ✅ |
| Crear Producto | ❌ | ❌ | ✅ |
| Editar Producto | ❌ | ❌ | ✅ |
| Eliminar Producto | ❌ | ❌ | ✅ |
| Ver Movimientos | ❌ | ✅ (suyos) | ✅ (todos) |
| Registrar Entrada | ❌ | ❌ | ✅ |
| Registrar Salida | ❌ | ✅ | ✅ |
| Gestionar Usuarios | ❌ | ❌ | ✅ |
| Cerrar Sesión | ❌ | ✅ | ✅ |

---

## 🚀 Cómo Ejecutar

```bash
cd c:\Users\melan\OneDrive\Documentos\ING\StockControl
npm install
npm start
```

Luego acceder a: http://localhost:3000/

---

## ✅ Pruebas Realizadas

- ✅ Login como administrador - Exitoso
- ✅ Acceso a páginas protegidas como admin - Exitoso
- ✅ Visibilidad de opciones admin - Exitoso
- ✅ Login como usuario regular - Exitoso
- ✅ Restricciones de usuario regular - Exitoso
- ✅ Intento de acceso no autorizado - Exitoso (alerta y redirección)
- ✅ Logout - Exitoso
- ✅ Redireccionamiento a login sin sesión - Exitoso

---

## 📝 Notas Importantes

### Seguridad en Producción
⚠️ **IMPORTANTE**: 

- Las contraseñas están guardadas en texto plano (solo para demo)
- En producción, usar bcrypt para encriptar contraseñas
- Usar cookies con HttpOnly y Secure
- Implementar JWT para mejor gestión de sesiones
- Usar HTTPS obligatoriamente
- Implementar CSRF protection

### Persistencia de Datos
- Los datos se guardan en archivos JSON en la carpeta `data/`
- En producción, usar una base de datos (MongoDB, PostgreSQL, etc.)
- Hacer backups regulares de los datos

### Próximas Mejoras Sugeridas
1. Encriptación de contraseñas con bcrypt
2. Implementación de JWT
3. Base de datos relacional
4. Recuperación de contraseña
5. Cambio de contraseña
6. Auditoría de acciones
7. Límites de intentos de login
8. Expiración de sesiones

---

## 📞 Soporte

Para más información sobre la estructura del proyecto, consulte los archivos específicos:
- Rutas: `routes/`
- Middleware: `middleware/`
- Frontend: `public/`
- Datos: `data/`

¡Sistema implementado exitosamente! ✨
