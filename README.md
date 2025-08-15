# EqualPay 💰

Una aplicación backend completa para gestión de gastos compartidos y cálculo automático de balances entre usuarios.

## 🚀 Características

- **Gestión de Usuarios**: Crear y administrar usuarios
- **Grupos**: Organizar usuarios en grupos para gastos compartidos
- **Gastos**: Registrar gastos con división automática (equitativa, por porcentaje, o montos exactos)
- **Balances**: Cálculo automático de deudas y liquidaciones optimizadas
- **APIs REST**: Endpoints completos para todas las operaciones

## 🛠️ Tecnologías

- **Java 17+** con Spring Boot 3.2.0
- **PostgreSQL** como base de datos
- **Spring Data JPA** para persistencia
- **Maven** para gestión de dependencias
- **Docker** para PostgreSQL

## 📋 Prerequisitos

- Java 17 o superior
- Maven 3.8+
- Docker y Docker Compose
- Git

## 🏃‍♂️ Inicio Rápido

### 1. Clonar el repositorio
```bash
git clone https://github.com/gabrielbueno92/equalpay.git
cd equalpay
```

### 2. Iniciar PostgreSQL con Docker
```bash
docker run --name equalpay-postgres \
  -e POSTGRES_PASSWORD=equalpay123 \
  -e POSTGRES_DB=equalpay_dev \
  -p 5432:5432 \
  -d postgres:13
```

### 3. Ejecutar la aplicación
```bash
mvn spring-boot:run -Dspring-boot.run.profiles=dev
```

La aplicación estará disponible en: `http://localhost:8080`

## 🗃️ Estructura del Proyecto

```
src/main/java/com/equalpay/
├── config/           # Configuraciones (DataLoader, Security)
├── controller/       # Controladores REST (User, Group, Expense, Balance)
├── dto/             # DTOs para transferencia de datos
├── entity/          # Entidades JPA (User, Group, Expense, ExpenseSplit)
├── repository/      # Repositorios de datos con fetch joins optimizados
├── service/         # Lógica de negocio y cálculos de balances
└── EqualPayApplication.java
```

## 🔧 APIs Disponibles

### Usuarios
- `GET /api/users` - Listar todos los usuarios
- `POST /api/users` - Crear nuevo usuario
- `GET /api/users/{id}` - Obtener usuario por ID
- `PUT /api/users/{id}` - Actualizar usuario
- `DELETE /api/users/{id}` - Eliminar usuario

### Grupos
- `GET /api/groups` - Listar todos los grupos
- `POST /api/groups?creatorId={id}` - Crear nuevo grupo
- `GET /api/groups/{id}` - Obtener grupo por ID
- `POST /api/groups/{groupId}/members/{userId}` - Agregar miembro
- `DELETE /api/groups/{groupId}/members/{userId}` - Quitar miembro

### Gastos
- `GET /api/expenses` - Listar todos los gastos
- `POST /api/expenses` - Crear nuevo gasto
- `GET /api/expenses/{id}` - Obtener gasto por ID
- `PUT /api/expenses/{id}` - Actualizar gasto
- `DELETE /api/expenses/{id}` - Eliminar gasto

### Balances
- `GET /api/balances/group/{groupId}` - Balance completo del grupo
- `GET /api/balances/user/{userId}/debts` - Deudas de un usuario

## Ejemplos de Uso

### Crear un usuario
```bash
curl -X POST http://localhost:8080/api/users \\
  -H "Content-Type: application/json" \\
  -d '{"name": "Juan Pérez", "email": "juan@email.com"}'
```

### Crear un grupo
```bash
curl -X POST "http://localhost:8080/api/groups?creatorId=1" \
  -H "Content-Type: application/json" \
  -d '{"name": "Viaje a Mendoza", "description": "Gastos del viaje"}'
```

### Crear un gasto
```bash
curl -X POST http://localhost:8080/api/expenses \
  -H "Content-Type: application/json" \
  -d '{
    "description": "Cena en restaurante",
    "amount": 2400.00,
    "payerId": 1,
    "groupId": 1,
    "participants": [
      {"id": 1, "name": "Juan"},
      {"id": 2, "name": "María"}
    ],
    "splitType": "EQUAL",
    "notes": "Cena de bienvenida"
  }'
```

### Ver balance del grupo
```bash
curl http://localhost:8080/api/balances/group/1
```

## 🎯 Tipos de División de Gastos

- **EQUAL**: División equitativa entre participantes
- **PERCENTAGE**: División por porcentajes (próximamente)
- **EXACT_AMOUNT**: Montos exactos por participante (próximamente)

## 🔍 Funcionalidades Avanzadas

- **Lazy Loading Optimizado**: Fetch joins para evitar N+1 queries
- **Liquidaciones Inteligentes**: Algoritmo para minimizar transacciones
- **Validaciones**: Participantes deben ser miembros del grupo
- **Datos de Prueba**: DataLoader automático en modo desarrollo

## 🤝 Contribuir

1. Fork el proyecto
2. Crea una rama para tu feature (`git checkout -b feature/nueva-funcionalidad`)
3. Commit tus cambios (`git commit -m 'Agregar nueva funcionalidad'`)
4. Push a la rama (`git push origin feature/nueva-funcionalidad`)
5. Abre un Pull Request

## 📄 Licencia

Este proyecto está bajo la Licencia MIT.

## 🐛 Reportar Issues

Si encuentras algún bug o tienes sugerencias, por favor crea un [issue](https://github.com/gabrielbueno92/equalpay/issues).

---

**Desarrollado con ❤️ usando Spring Boot**