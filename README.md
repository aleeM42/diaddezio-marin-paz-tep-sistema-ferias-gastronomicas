# Sistema Distribuido para Ferias Gastronómicas

Sistema distribuido basado en microservicios para la gestión de ferias gastronómicas, desarrollado con TypeScript, NestJS y PostgreSQL.

## Arquitectura

El sistema está compuesto por 5 servicios independientes:

1. **Microservicio de Usuarios y Autenticación** (`auth-service`)
2. **Microservicio de Puestos Gastronómicos** (`puestos-service`)
3. **Microservicio de Productos y Catálogo** (`productos-service`)
4. **Microservicio de Pedidos y Ventas** (`pedidos-service`)
5. **API Gateway** (`api-gateway`)

## Stack Tecnológico

- **Lenguaje**: TypeScript
- **Framework**: NestJS
- **ORM**: TypeORM
- **Base de datos**: PostgreSQL
- **Comunicación**: RPC (TCP)
- **Autenticación**: JWT

## Estructura del Proyecto

```
.
├── auth-service/          # Microservicio de Usuarios y Autenticación
├── puestos-service/       # Microservicio de Puestos Gastronómicos
├── productos-service/     # Microservicio de Productos y Catálogo
├── pedidos-service/       # Microservicio de Pedidos y Ventas
├── api-gateway/           # API Gateway (punto único de entrada)
└── README.md
```

## Configuración

Cada microservicio tiene su propia base de datos PostgreSQL y se ejecuta de forma independiente.

### Requisitos Previos

- Node.js (v18 o superior)
- PostgreSQL (v14 o superior)
- npm o yarn

### Instalación

1. Clonar el repositorio
2. Instalar dependencias en cada servicio:
```bash
cd auth-service && npm install
cd ../puestos-service && npm install
cd ../productos-service && npm install
cd ../pedidos-service && npm install
cd ../api-gateway && npm install


### Configuración de Base de Datos

Cada servicio requiere su propia base de datos PostgreSQL. Configurar las variables de entorno en cada servicio según su `.env.example`.

## Ejecución

Cada servicio se ejecuta de forma independiente:

```bash
# Terminal 1
cd auth-service && npm run start:dev

# Terminal 2
cd puestos-service && npm run start:dev

# Terminal 3
cd productos-service && npm run start:dev

# Terminal 4
cd pedidos-service && npm run start:dev

# Terminal 5
cd api-gateway && npm run start:dev
```

## GitFlow

- **main/master**: Rama principal, solo se actualiza al final del proyecto
- **develop**: Rama de desarrollo
- **feature/[#tarea]**: Ramas de características (ej: `feature/10`)

## Roles del Sistema

- **Cliente**: Puede consultar catálogo y realizar pedidos
- **Emprendedor**: Gestiona su puesto y productos
- **Organizador**: Supervisa el evento y aprueba puestos

## Documentación

La documentación completa de endpoints y comunicación entre servicios se encuentra en cada microservicio.

