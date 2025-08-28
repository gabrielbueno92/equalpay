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

## Estado del Proyecto - Sesiones COMPLETADAS

### 🎉 MVP FUNCIONAL COMPLETO - MERGEADO A MAIN
- ✅ **PR #3 `feature/settlement-system` MERGEADO** exitosamente (Sesión 27/12/2024)
- ✅ **PR #4 `feature/expense-edit-delete` MERGEADO** exitosamente (Sesión 28/08/2025)
- ✅ Backend + Frontend + PostgreSQL funcionando perfectamente
- ✅ Sistema completo de gastos, balances y liquidaciones operativo
- ✅ **Sistema de edición/eliminación de gastos completamente operativo**
- ✅ **Validaciones de fechas futuras implementadas** (backend + frontend)

### 📊 Funcionalidades MVP Implementadas y Probadas
1. **Sistema de Gastos CRUD Completo**
   - ✅ Crear gastos con división automática (`POST /api/expenses`)
   - ✅ **Editar gastos existentes** (`PUT /api/expenses/{id}`) - **NUEVO EN SESIÓN 28/08**
   - ✅ **Eliminar gastos** (`DELETE /api/expenses/{id}`) - **NUEVO EN SESIÓN 28/08**
   - ✅ Listar gastos con fetch joins completos (`GET /api/expenses`)
   - ✅ Filtros por grupo, pagador, participante (`GET /api/expenses/*`)
   - ✅ **Modal EditExpenseModal.tsx completamente funcional** - **NUEVO EN SESIÓN 28/08**
   - ✅ **Validaciones de fechas futuras** (UI + backend) - **NUEVO EN SESIÓN 28/08**

2. **Sistema de Balances Inteligente**
   - ✅ Cálculo automático de balances netos por usuario
   - ✅ Algoritmo de liquidación óptima (minimal settlements)
   - ✅ Integración con settlements para recálculo tras pagos
   - ✅ API completa de balances (`GET /api/balances/group/{id}`)

3. **Sistema de Settlements/Pagos**
   - ✅ Entidad Settlement con JPA completo
   - ✅ Registro de pagos completados (`POST /api/settlements`)
   - ✅ Historial de pagos por grupo/usuario (`GET /api/settlements/*`)
   - ✅ Actualización automática de balances tras settlements
   - ✅ Estadísticas de pagos (`GET /api/settlements/stats/*`)

4. **Sistema de Edición UX Optimizada** - **NUEVO EN SESIÓN 28/08**
   - ✅ **Campos editables**: Descripción, Monto, Fecha, Participantes, Notas
   - ✅ **Campos solo-lectura**: Grupo, Pagador (mantiene integridad de datos)
   - ✅ **Botones de editar/eliminar** con hover effects
   - ✅ **Confirmación antes de eliminar** para prevenir borrados accidentales
   - ✅ **Issues críticos resueltos**: Paid By, fecha display, participantes update
### 🔧 Cambios Técnicos Completados (523+ líneas código)
**Nuevos Archivos Creados:**
- `Settlement.java` - Entidad JPA para pagos completados
- `SettlementDTO.java` - DTO con validaciones Bean Validation
- `SettlementRepository.java` - Queries customizadas con @Query
- `SettlementService.java` - Lógica de negocio completa (144 líneas)
- `SettlementController.java` - REST endpoints completos (80 líneas)

**Archivos Modificados:**
- `BalanceService.java` - Integración con settlements para recálculo
- `ExpenseService.java` - Fix de shared collection references

**Issues Técnicos Resueltos:**
- ✅ Lazy loading con fetch joins en todos los DTOs
- ✅ Shared collection references en Hibernate
- ✅ DTO design limpio (participants vs splits separados)
- ✅ Validaciones completas en todos los endpoints
- ✅ Manejo de transacciones JPA optimizado

### 🧪 Testing Manual Completado
**Flujo Completo Probado:**
1. ✅ Crear gastos: Combustible $200 (Bob), Hotel $800 (Charlie)
2. ✅ Verificar balances: Alice -$250, Bob -$50, Charlie +$550, Diana -$250
3. ✅ Registrar settlement: Diana paga $250 a Charlie
4. ✅ Verificar recálculo: Diana balance=$0, Charlie recibió pago, settlements actualizados
5. ✅ APIs de settlements: historial, estadísticas, CRUD completo

### 📋 Próximas Sesiones - Roadmap Post-MVP y Edición

#### 🎨 Próxima Prioridad (UX/UI Improvements)  
- [ ] **Mejorar experiencia de usuario**
  - [ ] Loading states en operaciones de editar/eliminar gastos
  - [ ] Notificaciones toast para éxito/error en CRUD operations
  - [ ] Validación de formularios mejorada en frontend
  - [ ] Responsive design para móviles
  - [ ] Animaciones y transiciones suaves

#### 🔐 Semana 2 (Prioridad Alta)
- [ ] **Sistema de autenticación JWT básico**
  - [ ] Entidades User con password y roles  
  - [ ] Endpoints login/register con JWT
  - [ ] Middleware de autenticación en controladores
  - [ ] Context de autenticación en frontend
  - [ ] Protección de rutas y operaciones sensibles

#### ⚡ Semana 3 (Features Adicionales)
- [ ] **Filtros y búsqueda avanzada**
  - [ ] Filtros por fecha en gastos
  - [ ] Búsqueda por descripción/monto
  - [ ] Paginación en listas largas
  - [ ] Export de datos (PDF/Excel)

#### 🧪 Semana 4 (Calidad y Deploy)
- [ ] **Testing y deployment**
  - [ ] Tests unitarios para servicios críticos
  - [ ] Tests de integración para APIs
  - [ ] CI/CD pipeline básico
  - [ ] Deploy a producción (Railway/Heroku)

### 💡 Ideas Futuras (Backlog)
- [ ] Categorización de gastos con tags
- [ ] Dashboard con gráficos y estadísticas
- [ ] Notificaciones push/email para deudas
- [ ] App móvil con React Native
- [ ] Integración con bancos/billeteras digitales

## 🚀 Estado Actual - Listo para Continuar

### ✅ Sistema Completamente Operativo
- **Backend**: Spring Boot ejecutándose en puerto 8080
- **Frontend**: React + Vite ejecutándose en puerto 5173  
- **Base de Datos**: PostgreSQL en Docker funcionando
- **Todas las APIs**: CRUD completo de expenses, groups, users, settlements
- **UI Completa**: Modales de crear/editar/eliminar gastos funcionando

### 🎯 Funcionalidades Principales Disponibles
1. **Gestión de Gastos**: Crear, editar, eliminar con validaciones
2. **División Automática**: Cálculo de splits equitativos
3. **Balances**: Cálculo automático de quién debe a quién
4. **Settlements**: Sistema de registro de pagos completados
5. **Dashboard**: Vista general de gastos y estadísticas
6. **Grupos**: Gestión de grupos de usuarios

### 🔧 Para Continuar en la Próxima Sesión
**Comandos para levantar el entorno:**
```bash
# Terminal 1 - PostgreSQL
docker start equalpay-postgres

# Terminal 2 - Backend  
cd apps/backend && mvn spring-boot:run -Dspring-boot.run.profiles=dev

# Terminal 3 - Frontend
cd apps/frontend && npm run dev
```

**URLs:**
- Frontend: http://localhost:5173
- Backend API: http://localhost:8080/api
- PostgreSQL: localhost:5432 (equalpay_dev database)

### 📝 Contexto para Claude
- **Sistema de edición de gastos completamente funcional** (PR #4 mergeado)
- Validaciones de fechas futuras implementadas (backend + frontend)
- Campos editables vs solo-lectura bien definidos con UX optimizada
- Issues críticos resueltos (Paid By, fecha display, participantes update)
- Todas las funcionalidades probadas y documentadas
- Listo para continuar con UX improvements o autenticación JWT
