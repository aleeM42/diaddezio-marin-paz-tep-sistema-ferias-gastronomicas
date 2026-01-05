# Documentación del Sistema de Ferias Gastronómicas

## Arquitectura del Sistema

El sistema está compuesto por 5 servicios independientes que se comunican entre sí:

1. **Auth Service** (Puerto 3001) - Gestión de usuarios y autenticación
2. **Puestos Service** (Puerto 3002) - Gestión de puestos gastronómicos
3. **Productos Service** (Puerto 3003) - Gestión de productos y catálogo
4. **Pedidos Service** (Puerto 3004) - Gestión de pedidos y ventas
5. **API Gateway** (Puerto 3000) - Punto único de entrada

## Bases de Datos

Cada microservicio tiene su propia base de datos PostgreSQL:

- `auth_db` - Base de datos del servicio de autenticación
- `puestos_db` - Base de datos del servicio de puestos
- `productos_db` - Base de datos del servicio de productos
- `pedidos_db` - Base de datos del servicio de pedidos

## Comunicación entre Microservicios

Actualmente, la comunicación entre microservicios se realiza mediante HTTP/REST. Cada servicio valida tokens JWT llamando al servicio de autenticación.

**Nota**: Según el enunciado, la comunicación debe ser RPC (TCP). La implementación actual usa HTTP para facilitar el desarrollo, pero puede migrarse a gRPC o un servidor TCP personalizado.

### Flujos de Comunicación

1. **Productos → Puestos**: Valida que el puesto existe y pertenece al emprendedor antes de crear productos
2. **Pedidos → Auth**: Valida la identidad del cliente
3. **Pedidos → Puestos**: Valida que el puesto está activo
4. **Pedidos → Productos**: Verifica stock y descuenta inventario

## Endpoints del API Gateway

### Autenticación

- `POST /auth/register` - Registro de usuarios
- `POST /auth/login` - Inicio de sesión
- `GET /auth/profile` - Obtener perfil (requiere autenticación)
- `PUT /auth/profile` - Actualizar perfil (requiere autenticación)

### Puestos

- `GET /puestos` - Listar todos los puestos
- `GET /puestos/activos` - Listar puestos activos
- `GET /puestos/:id` - Obtener puesto por ID
- `POST /puestos` - Crear puesto (requiere rol emprendedor)
- `PATCH /puestos/:id` - Actualizar puesto (requiere rol emprendedor, solo el dueño)
- `POST /puestos/:id/aprobar` - Aprobar puesto (requiere rol organizador)
- `POST /puestos/:id/activar` - Activar puesto (requiere rol organizador)
- `DELETE /puestos/:id` - Eliminar puesto (requiere rol emprendedor, solo el dueño)
- `GET /puestos/mis-puestos` - Listar mis puestos (requiere rol emprendedor)

### Productos

- `GET /productos` - Listar productos disponibles (con filtros opcionales: categoria, puestoId, precioMin, precioMax)
- `GET /productos/:id` - Obtener producto por ID
- `GET /productos/puesto/:puestoId` - Listar productos de un puesto
- `POST /productos` - Crear producto (requiere rol emprendedor)
- `PATCH /productos/:id` - Actualizar producto (requiere rol emprendedor, solo el dueño del puesto)
- `DELETE /productos/:id` - Eliminar producto (requiere rol emprendedor, solo el dueño del puesto)

### Pedidos

- `POST /pedidos` - Crear pedido (requiere rol cliente)
- `GET /pedidos` - Listar todos los pedidos (requiere rol organizador)
- `GET /pedidos/mis-pedidos` - Listar mis pedidos (requiere rol cliente)
- `GET /pedidos/:id` - Obtener pedido por ID (requiere autenticación)
- `PATCH /pedidos/:id/estado` - Actualizar estado del pedido (requiere rol emprendedor, cliente u organizador)
- `POST /pedidos/:id/cancelar` - Cancelar pedido (requiere rol cliente)

### Estadísticas (Organizador)

- `GET /estadisticas` - Obtener estadísticas del evento (requiere rol organizador)

## Roles del Sistema

- **cliente**: Puede consultar catálogo, crear pedidos y ver su historial
- **emprendedor**: Puede gestionar su puesto y productos
- **organizador**: Puede aprobar puestos, activar puestos y ver estadísticas

## Autenticación

El sistema utiliza JWT (JSON Web Tokens) para autenticación. Los tokens deben enviarse en el header:

```
Authorization: Bearer <token>
```

## Estados del Sistema

### Estados de Puesto
- `pendiente` → `aprobado` → `activo`
- `inactivo` (en cualquier momento)

### Estados de Pedido
- `pendiente` → `preparando` → `listo` → `entregado`
- `cancelado` (desde pendiente o preparando)

## Programación Orientada a Aspectos (AOP)

El sistema implementa AOP mediante:

1. **LoggingInterceptor**: Registra todas las peticiones HTTP con:
   - Método HTTP
   - Ruta
   - Usuario
   - Timestamp
   - Resultado (éxito/error)
   - Duración

2. **HttpExceptionFilter**: Manejo global de excepciones que captura y formatea todos los errores.

## Configuración

Cada servicio tiene un archivo `.env.example` con las variables de entorno necesarias. Copiar a `.env` y configurar según el entorno.

## Ejecución

1. Levantar las bases de datos:
```bash
docker-compose up -d
```

2. Ejecutar cada servicio en una terminal separada:
```bash
# Terminal 1
cd auth-service && npm install && npm run start:dev

# Terminal 2
cd puestos-service && npm install && npm run start:dev

# Terminal 3
cd productos-service && npm install && npm run start:dev

# Terminal 4
cd pedidos-service && npm install && npm run start:dev

# Terminal 5
cd api-gateway && npm install && npm run start:dev
```

## Notas de Implementación

- Las referencias entre microservicios se hacen mediante UUIDs, sin Foreign Keys
- El stock se descuenta de forma atómica mediante transacciones
- Los productos sin stock no aparecen en el catálogo público
- Los precios y nombres de productos se guardan como snapshot en los detalles del pedido

