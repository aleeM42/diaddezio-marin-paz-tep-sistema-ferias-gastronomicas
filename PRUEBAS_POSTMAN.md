# Guía de Pruebas del Sistema - Postman

Esta guía contiene todas las peticiones necesarias para probar el sistema completo.

## Base URL

```
http://localhost:3000
```

## Configuración Inicial

1. Importa este documento en Postman o usa las peticiones directamente
2. Guarda las respuestas de login en variables de entorno para usar los tokens

## Variables de Entorno Recomendadas

Crea las siguientes variables en Postman:
- `base_url`: `http://localhost:3000`
- `token_cliente`: (se guardará después del login)
- `token_emprendedor`: (se guardará después del login)
- `token_organizador`: (se guardará después del login)
- `puesto_id`: (se guardará después de crear un puesto)
- `producto_id`: (se guardará después de crear un producto)
- `pedido_id`: (se guardará después de crear un pedido)

---

## 1. Crear Usuarios de Prueba

### 1.1 Registrar Cliente

**POST** `{{base_url}}/auth/register`

**Headers:**
```
Content-Type: application/json
```

**Body:**
```json
{
  "email": "cliente@ejemplo.com",
  "password": "password123",
  "fullName": "Juan Pérez",
  "role": "cliente"
}
```

**Nota:** Guarda el token de la respuesta en `token_cliente`

---

### 1.2 Registrar Emprendedor

**POST** `{{base_url}}/auth/register`

**Headers:**
```
Content-Type: application/json
```

**Body:**
```json
{
  "email": "emprendedor@ejemplo.com",
  "password": "password123",
  "fullName": "María García",
  "role": "emprendedor"
}
```

**Nota:** Guarda el token de la respuesta en `token_emprendedor`

---

### 1.3 Registrar Organizador

**POST** `{{base_url}}/auth/register`

**Headers:**
```
Content-Type: application/json
```

**Body:**
```json
{
  "email": "organizador@ejemplo.com",
  "password": "password123",
  "fullName": "Carlos Rodríguez",
  "role": "organizador"
}
```

**Nota:** Guarda el token de la respuesta en `token_organizador`

---

### 1.4 Login Cliente

**POST** `{{base_url}}/auth/login`

**Headers:**
```
Content-Type: application/json
```

**Body:**
```json
{
  "email": "cliente@ejemplo.com",
  "password": "password123"
}
```

**Script de Postman (Tests tab):**
```javascript
if (pm.response.code === 200) {
    const jsonData = pm.response.json();
    pm.environment.set("token_cliente", jsonData.token);
}
```

---

### 1.5 Login Emprendedor

**POST** `{{base_url}}/auth/login`

**Headers:**
```
Content-Type: application/json
```

**Body:**
```json
{
  "email": "emprendedor@ejemplo.com",
  "password": "password123"
}
```

**Script de Postman (Tests tab):**
```javascript
if (pm.response.code === 200) {
    const jsonData = pm.response.json();
    pm.environment.set("token_emprendedor", jsonData.token);
}
```

---

### 1.6 Login Organizador

**POST** `{{base_url}}/auth/login`

**Headers:**
```
Content-Type: application/json
```

**Body:**
```json
{
  "email": "organizador@ejemplo.com",
  "password": "password123"
}
```

**Script de Postman (Tests tab):**
```javascript
if (pm.response.code === 200) {
    const jsonData = pm.response.json();
    pm.environment.set("token_organizador", jsonData.token);
}
```

---

### 1.7 Ver Perfil (Cliente)

**GET** `{{base_url}}/auth/profile`

**Headers:**
```
Authorization: Bearer {{token_cliente}}
```

---

## 2. Crear Puestos de Prueba

### 2.1 Crear Puesto (Emprendedor)

**POST** `{{base_url}}/puestos`

**Headers:**
```
Content-Type: application/json
Authorization: Bearer {{token_emprendedor}}
```

**Body:**
```json
{
  "name": "Puesto de Tacos",
  "description": "Los mejores tacos de la feria"
}
```

**Script de Postman (Tests tab):**
```javascript
if (pm.response.code === 201) {
    const jsonData = pm.response.json();
    pm.environment.set("puesto_id", jsonData.id);
}
```

---

### 2.2 Listar Todos los Puestos

**GET** `{{base_url}}/puestos`

**Headers:**
```
Content-Type: application/json
```

---

### 2.3 Listar Puestos Activos

**GET** `{{base_url}}/puestos/activos`

**Headers:**
```
Content-Type: application/json
```

---

### 2.4 Obtener Puesto por ID

**GET** `{{base_url}}/puestos/{{puesto_id}}`

**Headers:**
```
Content-Type: application/json
```

---

### 2.5 Ver Mis Puestos (Emprendedor)

**GET** `{{base_url}}/puestos/mis-puestos`

**Headers:**
```
Authorization: Bearer {{token_emprendedor}}
```

---

## 3. Aprobar y Activar Puestos

### 3.1 Aprobar Puesto (Organizador)

**POST** `{{base_url}}/puestos/{{puesto_id}}/aprobar`

**Headers:**
```
Authorization: Bearer {{token_organizador}}
```

**Nota:** Esto cambia el estado del puesto de `pendiente` a `aprobado`

---

### 3.2 Activar Puesto (Organizador)

**POST** `{{base_url}}/puestos/{{puesto_id}}/activar`

**Headers:**
```
Authorization: Bearer {{token_organizador}}
```

**Nota:** Esto cambia el estado del puesto de `aprobado` a `activo`

---

## 4. Crear Productos

### 4.1 Crear Producto (Emprendedor)

**POST** `{{base_url}}/productos`

**Headers:**
```
Content-Type: application/json
Authorization: Bearer {{token_emprendedor}}
```

**Body:**
```json
{
  "name": "Tacos al Pastor",
  "price": 15.50,
  "category": "Comida Rápida",
  "stock": 100,
  "stallId": "{{puesto_id}}"
}
```

**Script de Postman (Tests tab):**
```javascript
if (pm.response.code === 201) {
    const jsonData = pm.response.json();
    pm.environment.set("producto_id", jsonData.id);
}
```

---

### 4.2 Crear Segundo Producto

**POST** `{{base_url}}/productos`

**Headers:**
```
Content-Type: application/json
Authorization: Bearer {{token_emprendedor}}
```

**Body:**
```json
{
  "name": "Refresco",
  "price": 8.00,
  "category": "Bebidas",
  "stock": 50,
  "stallId": "{{puesto_id}}"
}
```

---

### 4.3 Listar Todos los Productos

**GET** `{{base_url}}/productos`

**Headers:**
```
Content-Type: application/json
```

---

### 4.4 Listar Productos con Filtros

**GET** `{{base_url}}/productos?categoria=Comida Rápida&precioMin=10&precioMax=20`

**Headers:**
```
Content-Type: application/json
```

---

### 4.5 Obtener Producto por ID

**GET** `{{base_url}}/productos/{{producto_id}}`

**Headers:**
```
Content-Type: application/json
```

---

### 4.6 Listar Productos por Puesto

**GET** `{{base_url}}/productos/puesto/{{puesto_id}}`

**Headers:**
```
Content-Type: application/json
```

---

### 4.7 Actualizar Producto

**PATCH** `{{base_url}}/productos/{{producto_id}}`

**Headers:**
```
Content-Type: application/json
Authorization: Bearer {{token_emprendedor}}
```

**Body:**
```json
{
  "price": 16.00,
  "stock": 90
}
```

---

### 4.8 Eliminar Producto

**DELETE** `{{base_url}}/productos/{{producto_id}}`

**Headers:**
```
Authorization: Bearer {{token_emprendedor}}
```

---

## 5. Realizar Pedidos de Prueba

### 5.1 Crear Pedido (Cliente)

**POST** `{{base_url}}/pedidos`

**Headers:**
```
Content-Type: application/json
Authorization: Bearer {{token_cliente}}
```

**Body:**
```json
{
  "stallId": "{{puesto_id}}",
  "items": [
    {
      "productId": "{{producto_id}}",
      "quantity": 2
    }
  ]
}
```

**Script de Postman (Tests tab):**
```javascript
if (pm.response.code === 201) {
    const jsonData = pm.response.json();
    pm.environment.set("pedido_id", jsonData.id);
}
```

---

### 5.2 Ver Mis Pedidos (Cliente)

**GET** `{{base_url}}/pedidos/mis-pedidos`

**Headers:**
```
Authorization: Bearer {{token_cliente}}
```

---

### 5.3 Obtener Pedido por ID

**GET** `{{base_url}}/pedidos/{{pedido_id}}`

**Headers:**
```
Authorization: Bearer {{token_cliente}}
```

---

### 5.4 Actualizar Estado del Pedido - Preparando (Emprendedor)

**PATCH** `{{base_url}}/pedidos/{{pedido_id}}/estado`

**Headers:**
```
Content-Type: application/json
Authorization: Bearer {{token_emprendedor}}
```

**Body:**
```json
{
  "estado": "preparando"
}
```

---

### 5.5 Actualizar Estado del Pedido - Listo (Emprendedor)

**PATCH** `{{base_url}}/pedidos/{{pedido_id}}/estado`

**Headers:**
```
Content-Type: application/json
Authorization: Bearer {{token_emprendedor}}
```

**Body:**
```json
{
  "estado": "listo"
}
```

---

### 5.6 Actualizar Estado del Pedido - Entregado (Cliente)

**PATCH** `{{base_url}}/pedidos/{{pedido_id}}/estado`

**Headers:**
```
Content-Type: application/json
Authorization: Bearer {{token_cliente}}
```

**Body:**
```json
{
  "estado": "entregado"
}
```

---

### 5.7 Cancelar Pedido (Cliente)

**POST** `{{base_url}}/pedidos/{{pedido_id}}/cancelar`

**Headers:**
```
Authorization: Bearer {{token_cliente}}
```

**Nota:** Solo funciona si el pedido está en estado `pendiente` o `preparando`

---

### 5.8 Listar Todos los Pedidos (Organizador)

**GET** `{{base_url}}/pedidos`

**Headers:**
```
Authorization: Bearer {{token_organizador}}
```

---

## 6. Verificar Estadísticas

### 6.1 Obtener Estadísticas (Organizador)

**GET** `{{base_url}}/estadisticas`

**Headers:**
```
Authorization: Bearer {{token_organizador}}
```

**⚠️ IMPORTANTE - Configuración del Header en Postman:**

1. En la pestaña **Headers** de Postman, agrega:
   - **Key:** `Authorization`
   - **Value:** `Bearer {{token_organizador}}`

2. **Verificar que la variable esté definida:**
   - Haz clic en el ícono de ojo (👁️) junto a las variables de entorno
   - Verifica que `token_organizador` tenga un valor (debe ser el token que obtuviste del login del organizador)
   - Si está vacía, ejecuta primero la petición **1.6 Login Organizador** y usa el script de Postman para guardar el token

3. **Nota:** Asegúrate de que el token incluya el prefijo "Bearer " seguido de un espacio. El formato completo debe ser:
   ```
   Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
   ```

**Respuesta esperada:**
```json
{
  "totalPedidos": 1,
  "pedidosCompletados": 1,
  "totalVentas": 31.00,
  "puestosActivos": 1,
  "totalProductos": 2,
  "ventasPorPuesto": {
    "{{puesto_id}}": 31.00
  },
  "productoMasVendido": {
    "productId": "{{producto_id}}",
    "cantidadVendida": 2
  }
}
```

---

## Orden Recomendado de Ejecución

1. **Crear usuarios** (1.1, 1.2, 1.3)
2. **Login usuarios** (1.4, 1.5, 1.6)
3. **Crear puesto** (2.1)
4. **Aprobar y activar puesto** (3.1, 3.2)
5. **Crear productos** (4.1, 4.2)
6. **Crear pedido** (5.1)
7. **Actualizar estado del pedido** (5.4, 5.5, 5.6)
8. **Ver estadísticas** (6.1)

---

## Notas Importantes

- Todos los tokens expiran según la configuración JWT (por defecto 24h o según `.env`)
- Los IDs de recursos (puesto_id, producto_id, pedido_id) se guardan automáticamente con los scripts de Postman
- El estado de los pedidos debe seguir la secuencia: `pendiente` → `preparando` → `listo` → `entregado`
- Solo los puestos en estado `activo` pueden recibir pedidos
- Solo los productos con stock > 0 aparecen disponibles para pedidos

