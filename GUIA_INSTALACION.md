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
DB_DATABASE=auth_db
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
DB_DATABASE=puestos_db
AUTH_SERVICE_URL=http://localhost:3001
PORT=3002
```

### productos-service/.env
```env
DB_HOST=localhost
DB_PORT=5434
DB_USERNAME=postgres
DB_PASSWORD=postgres
DB_DATABASE=productos_db
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
DB_DATABASE=pedidos_db
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
npm run start:dev
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

1. Crear usuarios de prueba (cliente, emprendedor, organizador)
2. Crear puestos de prueba
3. Aprobar y activar puestos
4. Crear productos
5. Realizar pedidos de prueba
6. Verificar estadísticas

