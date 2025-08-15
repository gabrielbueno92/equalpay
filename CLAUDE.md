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
- ✅ POST /api/expenses (crear gasto)
- ✅ GET /api/expenses (listar gastos)
- ✅ GET /api/expenses/group/{id} (gastos por grupo)
- ✅ GET /api/balances/group/{id} (balance del grupo)
- ✅ Datos de prueba automáticos al iniciar

## Roadmap Pendiente

### ✅ Completado - Semana 2-3
- [x] Entidad Expense con relaciones a User y Group
- [x] Entidad ExpenseSplit para divisiones detalladas
- [x] CRUD completo para Expense con ExpenseController
- [x] Lógica para calcular balances con BalanceService
- [x] APIs de balances con BalanceController
- [x] Datos de prueba automáticos (DataLoader)

### 📋 Próximas Tareas (Semana 4-5)
- [ ] Mejorar algoritmo de balances para casos complejos
- [ ] Agregar filtros por fecha en APIs
- [ ] Implementar notificaciones de gastos
- [ ] Optimizar queries de base de datos

### 🔐 Autenticación (Semana 6)
- [ ] Implementar JWT
- [ ] Endpoints de login/register
- [ ] Proteger APIs con autenticación

### 🧪 Testing (Semana 7)
- [ ] Tests unitarios para servicios
- [ ] Tests de integración para APIs
- [ ] Tests de repositorio

## 🌳 Workflow de Desarrollo

### Branch Strategy Adoptada
A partir de ahora utilizamos desarrollo basado en branches:

- **feature/nombre**: Nuevas funcionalidades
- **fix/descripcion**: Corrección de bugs
- **docs/tema**: Actualizaciones de documentación
- **refactor/componente**: Refactoring de código
- **test/componente**: Agregado de tests

### Ejemplo de Próximo Development
```bash
# Para JWT Authentication
git checkout -b feature/jwt-authentication
# ... desarrollar feature
git commit -m "Add JWT authentication with Spring Security"
git push origin feature/jwt-authentication
# Create PR to main
```

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
- ✅ Entidades Expense y ExpenseSplit implementadas
- ✅ Sistema de balances funcional
- ✅ APIs probadas manualmente por el usuario

### 🐛 Issues Identificados en Testing Manual
**Problemas en ExpenseDTO (POST /api/expenses response):**
1. `splitType` funciona correctamente (EQUAL/PERCENTAGE/EXACT_AMOUNT)
2. Campos `group` aparecen como null (deberían tener info del grupo)
3. Campo `expenseSplits` está vacío (deberían cargar las divisiones automáticas)

**Problemas en diseño de DTOs (GET /api/expenses):**
1. `participantIds` vacío pero `participants` lleno (redundancia)
2. Datos del usuario duplicados en `expenseSplits` y `participants`
3. Propuesta: Separar claramente participants vs splits para mayor claridad

### ✅ Fixes Completados
- [x] Arreglar carga lazy de `group` en ExpenseDTO (fetch joins implementados)
- [x] Arreglar carga lazy de `expenseSplits` en ExpenseDTO (fetch joins implementados)
- [x] Mejorar diseño de DTOs para eliminar redundancia
- [x] Separar `participants` vs `splits` en responses (nuevo SplitDTO creado)

### 📋 TODOs Pendientes para Próxima Sesión
- [ ] Probar todas las APIs con los nuevos fixes implementados
- [ ] Verificar que group y splits cargan correctamente en responses
- [ ] Probar creación de gastos con nuevo formato de DTOs
- [ ] Probar cálculos de balances completos
- [ ] Hacer commit final con todos los fixes

### 🔧 Cambios Técnicos Realizados
- Agregado fetch joins en ExpenseRepository para evitar lazy loading
- Creado SplitDTO simplificado (userId, userName, amountOwed)
- Eliminado participantIds redundante del ExpenseDTO
- Simplificado DataLoader para evitar problemas de cascading
- Actualizado ExpenseService para usar nuevos métodos con fetch joins