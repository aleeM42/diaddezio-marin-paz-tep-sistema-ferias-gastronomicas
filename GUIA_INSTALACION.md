# Guía de Instalación y Configuración

## Requisitos Previos

- Node.js v18 o superior
- Docker y Docker Compose
- PostgreSQL 14 (o usar los contenedores Docker)
- npm o yarn

## Paso 1: Clonar y Configurar el Repositorio

```bash
git clone <url-del-repositorio>
cd <nombre-del-repositorio>
```

## Paso 2: Configurar Bases de Datos

Levantar los contenedores de PostgreSQL:

```bash
docker-compose up -d
```

Esto creará 4 bases de datos PostgreSQL:
- `auth_db` en puerto 5432
- `puestos_db` en puerto 5433
- `productos_db` en puerto 5434
- `pedidos_db` en puerto 5435

## Paso 3: Configurar Variables de Entorno

Para cada servicio, copiar el archivo `.env.example` a `.env` y configurar:

### auth-service/.env
```env
DB_HOST=localhost
DB_PORT=5432
DB_USERNAME=postgres
DB_PASSWORD=postgres
DB_DATABASE=auth_service
JWT_SECRET=tu-secret-key-segura
JWT_EXPIRES_IN=24h
PORT=3001
```

### puestos-service/.env
```env
DB_HOST=localhost
DB_PORT=5433
DB_USERNAME=postgres
DB_PASSWORD=postgres
DB_DATABASE=stalls_service
AUTH_SERVICE_URL=http://localhost:3001
PORT=3002
```

### productos-service/.env
```env
DB_HOST=localhost
DB_PORT=5434
DB_USERNAME=postgres
DB_PASSWORD=postgres
DB_DATABASE=products_service
AUTH_SERVICE_URL=http://localhost:3001
PUESTOS_SERVICE_URL=http://localhost:3002
PORT=3003
```

### pedidos-service/.env
```env
DB_HOST=localhost
DB_PORT=5435
DB_USERNAME=postgres
DB_PASSWORD=postgres
DB_DATABASE=orders_service
AUTH_SERVICE_URL=http://localhost:3001
PUESTOS_SERVICE_URL=http://localhost:3002
PRODUCTOS_SERVICE_URL=http://localhost:3003
PORT=3004
```

### api-gateway/.env
```env
PORT=3000
AUTH_SERVICE_URL=http://localhost:3001
PUESTOS_SERVICE_URL=http://localhost:3002
PRODUCTOS_SERVICE_URL=http://localhost:3003
PEDIDOS_SERVICE_URL=http://localhost:3004
JWT_SECRET=tu-secret-key-segura
```

## Paso 4: Instalar Dependencias

Instalar dependencias en cada servicio:

```bash
cd auth-service && npm install
cd ../puestos-service && npm install
cd ../productos-service && npm install
cd ../pedidos-service && npm install
cd ../api-gateway && npm install
```

## Paso 5: Ejecutar los Servicios

Abrir 5 terminales y ejecutar cada servicio:

**Terminal 1 - Auth Service:**
```bash
cd auth-service
npm run start:dev
```

**Terminal 2 - Puestos Service:**
```bash
cd puestos-service
npm run start:dev
```

**Terminal 3 - Productos Service:**
```bash
cd productos-service
npm run start:dev
```

**Terminal 4 - Pedidos Service:**
```bash
cd pedidos-service
npm run start:dev
```

**Terminal 5 - API Gateway:**
```bash
cd api-gateway


```

## Paso 6: Verificar que Todo Funciona

1. El API Gateway debería estar corriendo en `http://localhost:3000`
2. Todos los servicios deberían mostrar mensajes de inicio exitoso
3. Probar el endpoint de registro:

```bash
curl -X POST http://localhost:3000/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "password123",
    "nombre": "Test",
    "apellido": "User",
    "rol": "cliente"
  }'
```

## Solución de Problemas

### Error de conexión a la base de datos
- Verificar que los contenedores Docker estén corriendo: `docker ps`
- Verificar las credenciales en el archivo `.env`
- Verificar que los puertos no estén en uso

### Error de comunicación entre servicios
- Verificar que todos los servicios estén corriendo
- Verificar las URLs en los archivos `.env`
- Verificar que el JWT_SECRET sea el mismo en auth-service y api-gateway

### Error de validación de token
- Verificar que el token JWT sea válido
- Verificar que el JWT_SECRET sea el mismo en todos los servicios que lo usan

## Próximos Pasos

### Pruebas del Sistema

Para probar el sistema completo, consulta el archivo `PRUEBAS_POSTMAN.md` que contiene todas las peticiones necesarias organizadas por funcionalidad.

**Orden recomendado de pruebas:**

1. **Crear usuarios de prueba** (cliente, emprendedor, organizador)
   - Usa el endpoint `POST /auth/register` con diferentes roles
   - Guarda los tokens de autenticación para las siguientes pruebas

2. **Crear puestos de prueba**
   - Usa el endpoint `POST /puestos` con token de emprendedor
   - Los puestos se crean en estado `pendiente`

3. **Aprobar y activar puestos**
   - Usa `POST /puestos/:id/aprobar` con token de organizador (cambia a `aprobado`)
   - Usa `POST /puestos/:id/activar` con token de organizador (cambia a `activo`)

4. **Crear productos**
   - Usa `POST /productos` con token de emprendedor
   - Los productos solo se pueden crear para puestos que pertenecen al emprendedor
   - El puesto debe estar en estado `aprobado` o `activo`

5. **Realizar pedidos de prueba**
   - Usa `POST /pedidos` con token de cliente
   - El puesto debe estar en estado `activo`
   - Los productos deben tener stock disponible

6. **Actualizar estados de pedidos**
   - Emprendedor: `pendiente` → `preparando` → `listo`
   - Cliente: `listo` → `entregado`
   - Usa `PATCH /pedidos/:id/estado` con el estado correspondiente

7. **Verificar estadísticas**
   - Usa `GET /estadisticas` con token de organizador
   - Muestra resumen de pedidos, ventas, puestos activos, etc.

**Nota:** Para importar estas pruebas en Postman, consulta el archivo `PRUEBAS_POSTMAN.md` que incluye todas las peticiones con ejemplos de body, headers y scripts para guardar variables.

