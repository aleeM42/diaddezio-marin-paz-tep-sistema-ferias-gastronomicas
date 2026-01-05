# Resumen de Cambios - Ajuste a Modelos de Base de Datos

## Cambios Realizados

### 1. Entidades Actualizadas

#### Auth Service
- **Tabla**: `usuarios` → `users`
- **Campos**:
  - `password` → `passwordHash` (columna: `password_hash`)
  - `nombre`, `apellido` → `fullName` (columna: `full_name`)
  - `rol` → `role`
  - Eliminado campo `activo`
- **Nuevo**: Entidad `ApiLog` para logging

#### Puestos Service
- **Tabla**: `puestos` → `stalls`
- **Campos**:
  - `nombre` → `name`
  - `descripcion` → `description`
  - `emprendedorId` → `ownerId` (columna: `owner_id`)
  - `estado` → `status`
  - Eliminado campo `activo` y `ubicacion`
  - Eliminado estado `inactivo`
- **Nuevo**: Entidad `ApiLog` para logging

#### Productos Service
- **Tabla**: `productos` → `products`
- **Campos**:
  - `nombre` → `name`
  - `precio` → `price`
  - `categoria` → `category`
  - `puestoId` → `stallId` (columna: `stall_id`)
  - `disponible` → `isAvailable` (columna: `is_available`)
  - Eliminado campo `descripcion` y `activo`
- **Nuevo**: Entidad `ApiLog` para logging

#### Pedidos Service
- **Tabla**: `pedidos` → `orders`
- **Tabla**: `detalles_pedido` → `order_items`
- **Campos de Pedido**:
  - `clienteId` → `customerId` (columna: `customer_id`)
  - `puestoId` → `stallId` (columna: `stall_id`)
  - `estado` → `status`
  - Eliminado estado `cancelado`
- **Campos de DetallePedido**:
  - `pedidoId` → `orderId` (columna: `order_id`)
  - `productoId` → `productId` (columna: `product_id`)
  - `cantidad` → `quantity`
  - `precioUnitario` → `unitPrice` (columna: `unit_price`)
  - Eliminado campos `nombreProducto` y `subtotal`
- **Nuevo**: Entidad `ApiLog` para logging

### 2. DTOs Actualizados

Todos los DTOs han sido actualizados para usar los nuevos nombres de campos en inglés y coincidir con las entidades.

### 3. Servicios Actualizados

Todos los servicios han sido actualizados para:
- Usar los nuevos nombres de campos
- Eliminar referencias a campos eliminados
- Ajustar validaciones según el nuevo modelo

### 4. Bases de Datos

- **Nombres actualizados**:
  - `auth_db` → `auth_service`
  - `puestos_db` → `stalls_service`
  - `productos_db` → `products_service`
  - `pedidos_db` → `orders_service`

### 5. Scripts de Inicialización

Se crearon scripts para inicializar las bases de datos:
- `scripts/init-databases.sh` (Linux/Mac)
- `scripts/init-databases.ps1` (Windows PowerShell)

### 6. Docker Compose

Actualizado con los nombres correctos de las bases de datos.

## Notas Importantes

1. **Estados de Puesto**: Solo incluye `pendiente`, `aprobado`, `activo` (sin `inactivo`)
2. **Estados de Pedido**: Solo incluye `pendiente`, `preparando`, `listo`, `entregado` (sin `cancelado`)
3. **Eliminación de Pedidos**: Al cancelar un pedido, se elimina en lugar de cambiar estado
4. **Campos Snapshot**: Los detalles de pedido ya no guardan nombre del producto, solo `productId`, `quantity` y `unitPrice`

## Próximos Pasos

1. Ejecutar los scripts de inicialización de bases de datos
2. Verificar que todas las entidades coinciden con el modelo SQL
3. Probar los endpoints del API Gateway
4. Verificar la comunicación entre microservicios

