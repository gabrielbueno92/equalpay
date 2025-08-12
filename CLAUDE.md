# Contexto del Proyecto EqualPay para Claude

## Resumen del Proyecto
EqualPay es una app web fullstack para gestionar gastos compartidos con foco en pagos justos e integración financiera.

**Stack tecnológico:**
- Backend: Java 17 + Spring Boot 3.2.0 + PostgreSQL
- Frontend: React + Tailwind CSS (próximo)
- Seguridad: JWT (pendiente implementar)

## Estado Actual del Desarrollo

### ✅ Completado - Semana 1
- [x] Setup básico del proyecto Maven con Spring Boot
- [x] Entidades User y Group con JPA configuradas
- [x] Repositorios JPA con queries personalizadas
- [x] Servicios con lógica de negocio y DTOs
- [x] Controladores REST completos (CRUD)
- [x] Configuración PostgreSQL con Docker
- [x] Configuración de seguridad básica (sin autenticación por ahora)
- [x] Documentación en README.md

### 🔧 Configuración Actual
**Base de datos:** PostgreSQL en Docker
```bash
docker run --name equalpay-postgres \
  -e POSTGRES_DB=equalpay_dev \
  -e POSTGRES_USER=postgres \
  -e POSTGRES_PASSWORD=postgres \
  -p 5432:5432 \
  -d postgres:13
```

**Ejecutar aplicación:**
```bash
mvn spring-boot:run -Dspring-boot.run.profiles=dev
```

**Perfil dev activo:** `create-drop` (recrea tablas en cada inicio)

### 🧪 APIs Funcionando
- ✅ POST /api/users (crear usuario)
- ✅ GET /api/users (listar usuarios)
- ✅ Todas las APIs de User y Group están implementadas

## Roadmap Pendiente

### 📋 Próximas Tareas (Semana 2-3)
- [ ] Entidad Expense (gastos) con relaciones a User y Group
- [ ] CRUD completo para Expense
- [ ] Lógica para calcular balances (quién debe a quién)
- [ ] Datos de prueba automáticos (DataLoader)

### 🔐 Autenticación (Semana 6)
- [ ] Implementar JWT
- [ ] Endpoints de login/register
- [ ] Proteger APIs con autenticación

### 🧪 Testing (Semana 7)
- [ ] Tests unitarios para servicios
- [ ] Tests de integración para APIs
- [ ] Tests de repositorio

## Estructura del Código

```
src/main/java/com/equalpay/
├── EqualPayApplication.java          # Clase principal
├── config/SecurityConfig.java        # Seguridad (sin auth por ahora)
├── controller/                       # REST controllers
├── dto/                             # Data Transfer Objects
├── entity/                          # JPA entities (User, Group)
├── repository/                      # JPA repositories
└── service/                         # Business logic
```

## Notas Importantes
1. **Docker funcionando** correctamente en macOS con Rosetta
2. **Datos persisten** mientras el contenedor Docker esté vivo
3. **Perfil dev** recrea tablas en cada inicio - cambiar a `update` para persistencia
4. **CORS habilitado** para desarrollo frontend
5. **Validaciones Bean Validation** implementadas en DTOs y entidades

## Comandos Útiles
```bash
# Ver contenedores Docker
docker ps

# Logs de PostgreSQL
docker logs equalpay-postgres

# Crear usuario de prueba
curl -X POST http://localhost:8080/api/users \
  -H "Content-Type: application/json" \
  -d '{"name": "Juan Pérez", "email": "juan@email.com"}'

# Crear grupo de prueba
curl -X POST "http://localhost:8080/api/groups?creatorId=1" \
  -H "Content-Type: application/json" \
  -d '{"name": "Viaje Bariloche", "description": "Gastos compartidos"}'
```

## Estado de la Conversación
- Usuario familiarizado con setup completo
- Docker instalado y funcionando
- Backend corriendo correctamente
- Listo para continuar con entidad Expense y cálculo de balances