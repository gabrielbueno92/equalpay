package com.equalpay.config;

import com.equalpay.entity.Expense;
import com.equalpay.entity.Group;
import com.equalpay.entity.User;
import com.equalpay.repository.ExpenseRepository;
import com.equalpay.repository.GroupRepository;
import com.equalpay.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Profile;
import org.springframework.stereotype.Component;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.HashSet;
import java.util.Set;

@Component
@Profile("dev")
public class DataLoader implements CommandLineRunner {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private GroupRepository groupRepository;

    @Autowired
    private ExpenseRepository expenseRepository;

    @Override
    public void run(String... args) throws Exception {
        // Solo cargar datos si no existen usuarios
        if (userRepository.count() == 0) {
            System.out.println("🔄 DataLoader iniciado - cargando datos de prueba...");
            try {
                loadSampleData();
            } catch (Exception e) {
                System.err.println("❌ Error en DataLoader: " + e.getMessage());
                e.printStackTrace();
                // No re-lanzar la excepción para que la app no se cierre
            }
        }
    }

    private void loadSampleData() {
        System.out.println("🔄 Cargando datos de prueba...");

        // Crear usuarios
        User alice = createUser("Alice Johnson", "alice@email.com");
        User bob = createUser("Bob Smith", "bob@email.com");
        User charlie = createUser("Charlie Brown", "charlie@email.com");
        User diana = createUser("Diana Prince", "diana@email.com");

        // Crear grupos
        Group travelGroup = createGroup("Viaje a Bariloche", "Gastos del viaje de fin de año", alice);
        Group apartmentGroup = createGroup("Departamento Compartido", "Gastos del departamento", bob);
        Group dinnerGroup = createGroup("Cenas de Amigos", "Gastos de restaurantes", charlie);

        // Agregar miembros a los grupos
        addMembersToGroup(travelGroup, alice, bob, charlie, diana);
        addMembersToGroup(apartmentGroup, bob, charlie, diana);
        addMembersToGroup(dinnerGroup, alice, bob, charlie);

        // Crear gastos para el grupo de viaje
        createExpense("Hotel en Bariloche", new BigDecimal("4800.00"), alice, travelGroup, 
                     Set.of(alice, bob, charlie, diana), "3 noches para 4 personas");
        
        createExpense("Combustible ida", new BigDecimal("1200.00"), bob, travelGroup, 
                     Set.of(alice, bob, charlie, diana), "Nafta para el viaje");
        
        createExpense("Comida en el supermercado", new BigDecimal("800.00"), charlie, travelGroup, 
                     Set.of(alice, bob, charlie, diana), "Compras para cocinar");
        
        createExpense("Actividades y excursiones", new BigDecimal("2400.00"), diana, travelGroup, 
                     Set.of(alice, bob, charlie, diana), "Cerro Catedral y navegación");

        // Crear gastos para el departamento
        createExpense("Alquiler Enero", new BigDecimal("45000.00"), bob, apartmentGroup, 
                     Set.of(bob, charlie, diana), "Alquiler mensual");
        
        createExpense("Servicios (luz, gas, agua)", new BigDecimal("8500.00"), charlie, apartmentGroup, 
                     Set.of(bob, charlie, diana), "Facturas del mes");
        
        createExpense("Internet", new BigDecimal("3200.00"), diana, apartmentGroup, 
                     Set.of(bob, charlie, diana), "Fibra óptica");

        // Crear gastos para cenas
        createExpense("Cena en La Parolaccia", new BigDecimal("12500.00"), alice, dinnerGroup, 
                     Set.of(alice, bob, charlie), "Cena italiana");
        
        createExpense("Delivery sushi", new BigDecimal("8900.00"), bob, dinnerGroup, 
                     Set.of(alice, bob, charlie), "Pedidos Ya");
        
        createExpense("Asado en casa de Charlie", new BigDecimal("4200.00"), charlie, dinnerGroup, 
                     Set.of(alice, bob, charlie), "Carne y bebidas");

        System.out.println("✅ Datos de prueba cargados exitosamente!");
        System.out.println("📊 Usuarios creados: 4");
        System.out.println("👥 Grupos creados: 3");
        System.out.println("💰 Gastos creados: 10");
        System.out.println("\n🔗 URLs de prueba:");
        System.out.println("- Usuarios: GET http://localhost:8080/api/users");
        System.out.println("- Grupos: GET http://localhost:8080/api/groups");
        System.out.println("- Gastos: GET http://localhost:8080/api/expenses");
        System.out.println("- Balance grupo viaje: GET http://localhost:8080/api/balances/group/1");
        System.out.println("- Balance grupo depto: GET http://localhost:8080/api/balances/group/2");
    }

    private User createUser(String name, String email) {
        User user = new User(name, email);
        return userRepository.save(user);
    }

    private Group createGroup(String name, String description, User creator) {
        Group group = new Group(name, description, creator);
        return groupRepository.save(group);
    }

    private void addMembersToGroup(Group group, User... users) {
        for (User user : users) {
            group.addMember(user);
        }
        groupRepository.save(group);
    }

    private Expense createExpense(String description, BigDecimal amount, User payer, 
                                Group group, Set<User> participants, String notes) {
        try {
            Expense expense = new Expense(description, amount, payer, group);
            expense.setNotes(notes);
            expense.setExpenseDate(LocalDateTime.now().minusDays((long) (Math.random() * 30)));
            expense.setParticipants(new HashSet<>(participants));
            
            Expense savedExpense = expenseRepository.save(expense);
            System.out.println("✅ Gasto creado: " + description + " - $" + amount);
            
            return savedExpense;
        } catch (Exception e) {
            System.err.println("❌ Error creando gasto: " + description + " - " + e.getMessage());
            throw e;
        }
    }
}