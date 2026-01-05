# Tareas Pendientes y Mejoras Futuras

## Comunicación RPC (TCP)

**Estado**: Pendiente

**Descripción**: Actualmente la comunicación entre microservicios se realiza mediante HTTP/REST. Según el enunciado, debe ser RPC (TCP).

**Opciones de implementación**:
1. **gRPC**: Usar gRPC para comunicación RPC entre servicios
2. **TCP personalizado**: Implementar un servidor TCP personalizado con protocolo propio
3. **RabbitMQ/Message Queue**: Usar colas de mensajes para comunicación asíncrona

**Recomendación**: Para una implementación rápida y funcional, HTTP es suficiente. Para cumplir estrictamente con el enunciado, implementar gRPC sería la opción más estándar.

## Mejoras Adicionales

### Seguridad
- [ ] Implementar rate limiting
- [ ] Agregar validación de CORS más estricta
- [ ] Implementar refresh tokens
- [ ] Agregar encriptación de datos sensibles

### Performance
- [ ] Implementar caché (Redis) para consultas frecuentes
- [ ] Optimizar consultas a base de datos
- [ ] Implementar paginación en listados grandes

### Testing
- [ ] Agregar tests unitarios
- [ ] Agregar tests de integración
- [ ] Agregar tests E2E

### Documentación
- [ ] Crear colección de Postman completa
- [ ] Agregar Swagger/OpenAPI
- [ ] Documentar diagramas de arquitectura

### DevOps
- [ ] Configurar CI/CD
- [ ] Agregar Dockerfiles para cada servicio
- [ ] Configurar Kubernetes para orquestación
- [ ] Implementar monitoreo y logging centralizado

### Funcionalidades Adicionales
- [ ] Sistema de notificaciones
- [ ] Dashboard en tiempo real
- [ ] Reportes exportables (PDF/Excel)
- [ ] Sistema de calificaciones y reseñas

