# EqualPay 💰

A complete backend application for shared expense management and automatic balance calculation between users.

## 🚀 Features

- **User Management**: Create and manage users
- **Groups**: Organize users into groups for shared expenses
- **Expenses**: Record expenses with automatic splitting (equal, percentage, or exact amounts)
- **Balances**: Automatic debt calculation and optimized settlements
- **REST APIs**: Complete endpoints for all operations

## 🛠️ Technologies

- **Java 17+** with Spring Boot 3.2.0
- **PostgreSQL** as database
- **Spring Data JPA** for persistence
- **Maven** for dependency management
- **Docker** for PostgreSQL

## 📋 Prerequisites

- Java 17 or higher
- Maven 3.8+
- Docker and Docker Compose
- Git

## 🏃‍♂️ Quick Start

### 1. Clone the repository
```bash
git clone https://github.com/gabrielbueno92/equalpay.git
cd equalpay
```

### 2. Start PostgreSQL with Docker
```bash
docker run --name equalpay-postgres \
  -e POSTGRES_PASSWORD=your_secure_password \
  -e POSTGRES_DB=equalpay_dev \
  -p 5432:5432 \
  -d postgres:13
```

### 3. Update database configuration
Update the password in `src/main/resources/application-dev.yml`:
```yaml
spring:
  datasource:
    password: your_secure_password  # Replace with your actual password
```

### 4. Run the application
```bash
mvn spring-boot:run -Dspring-boot.run.profiles=dev
```

The application will be available at: `http://localhost:8080`

## 🗃️ Project Structure

```
src/main/java/com/equalpay/
├── config/           # Configurations (DataLoader, Security)
├── controller/       # REST Controllers (User, Group, Expense, Balance)
├── dto/             # DTOs for data transfer
├── entity/          # JPA Entities (User, Group, Expense, ExpenseSplit)
├── repository/      # Data repositories with optimized fetch joins
├── service/         # Business logic and balance calculations
└── EqualPayApplication.java
```

## 🔧 Available APIs

### Users
- `GET /api/users` - List all users
- `POST /api/users` - Create new user
- `GET /api/users/{id}` - Get user by ID
- `PUT /api/users/{id}` - Update user
- `DELETE /api/users/{id}` - Delete user

### Groups
- `GET /api/groups` - List all groups
- `POST /api/groups?creatorId={id}` - Create new group
- `GET /api/groups/{id}` - Get group by ID
- `POST /api/groups/{groupId}/members/{userId}` - Add member
- `DELETE /api/groups/{groupId}/members/{userId}` - Remove member

### Expenses
- `GET /api/expenses` - List all expenses
- `POST /api/expenses` - Create new expense
- `GET /api/expenses/{id}` - Get expense by ID
- `PUT /api/expenses/{id}` - Update expense
- `DELETE /api/expenses/{id}` - Delete expense

### Balances
- `GET /api/balances/group/{groupId}` - Complete group balance
- `GET /api/balances/user/{userId}/debts` - User debts

## 📝 Usage Examples

### Create a user
```bash
curl -X POST http://localhost:8080/api/users \\
  -H "Content-Type: application/json" \\
  -d '{"name": "John Doe", "email": "john@email.com"}'
```

### Create a group
```bash
curl -X POST "http://localhost:8080/api/groups?creatorId=1" \
  -H "Content-Type: application/json" \
  -d '{"name": "Trip to Paris", "description": "Travel expenses"}'
```

### Create an expense
```bash
curl -X POST http://localhost:8080/api/expenses \
  -H "Content-Type: application/json" \
  -d '{
    "description": "Dinner at restaurant",
    "amount": 120.00,
    "payerId": 1,
    "groupId": 1,
    "participants": [
      {"id": 1, "name": "John"},
      {"id": 2, "name": "Alice"}
    ],
    "splitType": "EQUAL",
    "notes": "Welcome dinner"
  }'
```

### View group balance
```bash
curl http://localhost:8080/api/balances/group/1
```

## 🎯 Expense Split Types

- **EQUAL**: Equal division among participants
- **PERCENTAGE**: Division by percentages (coming soon)
- **EXACT_AMOUNT**: Exact amounts per participant (coming soon)

## 🔍 Advanced Features

- **Optimized Lazy Loading**: Fetch joins to avoid N+1 queries
- **Smart Settlements**: Algorithm to minimize transactions
- **Validations**: Participants must be group members
- **Test Data**: Automatic DataLoader in development mode

## 🤝 Contributing

### Development Workflow
We follow a branch-based workflow for organized development:

#### Branch Naming Convention
- `feature/feature-name` - New features (e.g., `feature/jwt-authentication`)
- `fix/issue-description` - Bug fixes (e.g., `fix/lazy-loading-expenses`)
- `docs/topic` - Documentation updates (e.g., `docs/api-examples`)
- `refactor/component` - Code refactoring (e.g., `refactor/user-service`)
- `test/component` - Test additions (e.g., `test/expense-controller`)

#### Contribution Steps
1. Fork the project
2. Create your feature branch (`git checkout -b feature/new-feature`)
3. Make your changes with clear, atomic commits
4. Write or update tests for your changes
5. Update documentation if needed
6. Push to your branch (`git push origin feature/new-feature`)
7. Open a Pull Request to `main`

#### Example Workflow
```bash
# Start new feature
git checkout main
git pull origin main
git checkout -b feature/expense-categories

# Work on your feature
git add .
git commit -m "Add category entity and repository"
git commit -m "Implement category assignment to expenses"
git commit -m "Add category filtering endpoints"

# Push and create PR
git push origin feature/expense-categories
# Then create PR via GitHub UI
```

## 📄 License

This project is under the MIT License.

## 🐛 Report Issues

If you find any bugs or have suggestions, please create an [issue](https://github.com/gabrielbueno92/equalpay/issues).

---

**Built with ❤️ using Spring Boot**