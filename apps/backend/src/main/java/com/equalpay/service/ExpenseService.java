package com.equalpay.service;

import com.equalpay.dto.ExpenseDTO;
import com.equalpay.dto.GroupDTO;
import com.equalpay.dto.SplitDTO;
import com.equalpay.dto.UserDTO;
import com.equalpay.entity.Expense;
import com.equalpay.entity.ExpenseSplit;
import com.equalpay.entity.Group;
import com.equalpay.entity.User;
import com.equalpay.repository.ExpenseRepository;
import com.equalpay.repository.ExpenseSplitRepository;
import com.equalpay.repository.GroupRepository;
import com.equalpay.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.HashSet;
import java.util.List;
import java.util.Optional;
import java.util.Set;
import java.util.stream.Collectors;

@Service
@Transactional
public class ExpenseService {

    @Autowired
    private ExpenseRepository expenseRepository;

    @Autowired
    private ExpenseSplitRepository expenseSplitRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private GroupRepository groupRepository;

    public List<ExpenseDTO> getAllExpenses() {
        return expenseRepository.findAllWithDetails()
                .stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    public Optional<ExpenseDTO> getExpenseById(Long id) {
        return expenseRepository.findByIdWithDetails(id)
                .map(this::convertToDTO);
    }

    public List<ExpenseDTO> getExpensesByGroupId(Long groupId) {
        return expenseRepository.findByGroupId(groupId)
                .stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    public List<ExpenseDTO> getExpensesByPayerId(Long payerId) {
        return expenseRepository.findByPayerId(payerId)
                .stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    public List<ExpenseDTO> getExpensesByParticipantId(Long userId) {
        return expenseRepository.findByParticipantId(userId)
                .stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    public List<ExpenseDTO> getExpensesByUserInvolved(Long userId) {
        return expenseRepository.findByUserInvolved(userId)
                .stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    public ExpenseDTO createExpense(ExpenseDTO expenseDTO) {
        // Validar que el pagador existe
        User payer = userRepository.findById(expenseDTO.getPayerId())
                .orElseThrow(() -> new IllegalArgumentException("Pagador no encontrado"));

        // Validar que el grupo existe
        Group group = groupRepository.findById(expenseDTO.getGroupId())
                .orElseThrow(() -> new IllegalArgumentException("Grupo no encontrado"));

        // Validar que el pagador es miembro del grupo
        if (!group.getMembers().contains(payer)) {
            throw new IllegalArgumentException("El pagador debe ser miembro del grupo");
        }

        // Crear la entidad Expense
        Expense expense = new Expense();
        expense.setDescription(expenseDTO.getDescription());
        expense.setAmount(expenseDTO.getAmount());
        expense.setPayer(payer);
        expense.setGroup(group);
        expense.setSplitType(expenseDTO.getSplitType());
        expense.setNotes(expenseDTO.getNotes());
        
        if (expenseDTO.getExpenseDate() != null) {
            // Validar que la fecha del gasto no sea futura
            LocalDateTime expenseDate = expenseDTO.getExpenseDate();
            LocalDateTime now = LocalDateTime.now();
            if (expenseDate.isAfter(now)) {
                throw new IllegalArgumentException("La fecha del gasto no puede ser futura");
            }
            expense.setExpenseDate(expenseDate);
        }

        // Agregar participantes (usando IDs de la lista de participants si está disponible)
        Set<User> participants = new HashSet<>();
        if (expenseDTO.getParticipants() != null && !expenseDTO.getParticipants().isEmpty()) {
            participants = expenseDTO.getParticipants().stream()
                    .map(userDTO -> userRepository.findById(userDTO.getId())
                            .orElseThrow(() -> new IllegalArgumentException("Participante con ID " + userDTO.getId() + " no encontrado")))
                    .collect(Collectors.toSet());
            
            // Validar que todos los participantes son miembros del grupo
            for (User participant : participants) {
                if (!group.getMembers().contains(participant)) {
                    throw new IllegalArgumentException("Todos los participantes deben ser miembros del grupo");
                }
            }
            
            expense.setParticipants(participants);
        } else {
            // Si no se especifican participantes, incluir a todos los miembros del grupo
            expense.setParticipants(new HashSet<>(group.getMembers()));
        }

        // Guardar el gasto
        Expense savedExpense = expenseRepository.save(expense);

        // Crear las divisiones automáticamente
        createExpenseSplits(savedExpense);

        return convertToDTO(savedExpense);
    }

    public ExpenseDTO updateExpense(Long id, ExpenseDTO expenseDTO) {
        Expense expense = expenseRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Gasto no encontrado"));

        // Actualizar campos básicos
        expense.setDescription(expenseDTO.getDescription());
        expense.setAmount(expenseDTO.getAmount());
        expense.setSplitType(expenseDTO.getSplitType());
        expense.setNotes(expenseDTO.getNotes());
        
        if (expenseDTO.getExpenseDate() != null) {
            // Validar que la fecha del gasto no sea futura
            LocalDateTime expenseDate = expenseDTO.getExpenseDate();
            LocalDateTime now = LocalDateTime.now();
            if (expenseDate.isAfter(now)) {
                throw new IllegalArgumentException("La fecha del gasto no puede ser futura");
            }
            expense.setExpenseDate(expenseDate);
        }

        // Note: Pagador (payer) no se actualiza en edición para mantener integridad
        // Si se requiere cambiar el pagador, se debe eliminar y crear un nuevo gasto

        // Actualizar participantes si se especifican
        if (expenseDTO.getParticipants() != null) {
            Set<User> participants = expenseDTO.getParticipants().stream()
                    .map(userDTO -> userRepository.findById(userDTO.getId())
                            .orElseThrow(() -> new IllegalArgumentException("Participante con ID " + userDTO.getId() + " no encontrado")))
                    .collect(Collectors.toSet());
            
            // Validar que todos los participantes son miembros del grupo
            for (User participant : participants) {
                if (!expense.getGroup().getMembers().contains(participant)) {
                    throw new IllegalArgumentException("Todos los participantes deben ser miembros del grupo");
                }
            }
            
            expense.setParticipants(participants);
        }

        // Guardar cambios
        Expense updatedExpense = expenseRepository.save(expense);

        // Recrear las divisiones con los nuevos datos
        recreateExpenseSplits(updatedExpense);

        return convertToDTO(updatedExpense);
    }

    public void deleteExpense(Long id) {
        if (!expenseRepository.existsById(id)) {
            throw new IllegalArgumentException("Gasto no encontrado");
        }
        
        // Las divisiones se eliminan automáticamente por cascade
        expenseRepository.deleteById(id);
    }

    public BigDecimal getTotalAmountByGroupId(Long groupId) {
        BigDecimal total = expenseRepository.getTotalAmountByGroupId(groupId);
        return total != null ? total : BigDecimal.ZERO;
    }

    public BigDecimal getTotalPaidByUserId(Long userId) {
        BigDecimal total = expenseRepository.getTotalPaidByUserId(userId);
        return total != null ? total : BigDecimal.ZERO;
    }

    public BigDecimal getTotalOwedByUserId(Long userId) {
        BigDecimal total = expenseRepository.getTotalOwedByUserId(userId);
        return total != null ? total : BigDecimal.ZERO;
    }

    // Método privado para crear divisiones automáticamente
    private void createExpenseSplits(Expense expense) {
        // Solo limpiar divisiones existentes si ya tiene ID (gasto existente)
        if (expense.getId() != null) {
            expenseSplitRepository.deleteByExpenseId(expense.getId());
        }

        if (expense.getParticipants().isEmpty()) {
            return;
        }

        BigDecimal amountPerParticipant;
        
        switch (expense.getSplitType()) {
            case EQUAL:
                // División equitativa
                amountPerParticipant = expense.getAmount().divide(
                    BigDecimal.valueOf(expense.getParticipants().size()), 
                    2, 
                    java.math.RoundingMode.HALF_UP
                );
                
                for (User participant : expense.getParticipants()) {
                    ExpenseSplit split = new ExpenseSplit(expense, participant, amountPerParticipant);
                    split.setPercentage(BigDecimal.valueOf(100.0 / expense.getParticipants().size()));
                    expenseSplitRepository.save(split);
                }
                break;
                
            case PERCENTAGE:
            case EXACT_AMOUNT:
                // Para estos casos, las divisiones se crearán manualmente
                // Por ahora creamos divisiones equitativas como fallback
                amountPerParticipant = expense.getAmount().divide(
                    BigDecimal.valueOf(expense.getParticipants().size()), 
                    2, 
                    java.math.RoundingMode.HALF_UP
                );
                
                for (User participant : expense.getParticipants()) {
                    ExpenseSplit split = new ExpenseSplit(expense, participant, amountPerParticipant);
                    expenseSplitRepository.save(split);
                }
                break;
        }
    }

    // Método privado para recrear divisiones
    private void recreateExpenseSplits(Expense expense) {
        createExpenseSplits(expense);
    }

    // Método de conversión a DTO
    private ExpenseDTO convertToDTO(Expense expense) {
        ExpenseDTO dto = new ExpenseDTO();
        dto.setId(expense.getId());
        dto.setDescription(expense.getDescription());
        dto.setAmount(expense.getAmount());
        dto.setExpenseDate(expense.getExpenseDate());
        dto.setCreatedAt(expense.getCreatedAt());
        dto.setUpdatedAt(expense.getUpdatedAt());
        dto.setSplitType(expense.getSplitType());
        dto.setNotes(expense.getNotes());

        // Convertir pagador
        if (expense.getPayer() != null) {
            UserDTO payerDTO = new UserDTO(
                expense.getPayer().getId(),
                expense.getPayer().getName(),
                expense.getPayer().getEmail(),
                expense.getPayer().getCreatedAt(),
                expense.getPayer().getUpdatedAt()
            );
            dto.setPayer(payerDTO);
        }

        // Convertir grupo
        if (expense.getGroup() != null) {
            GroupDTO groupDTO = new GroupDTO();
            groupDTO.setId(expense.getGroup().getId());
            groupDTO.setName(expense.getGroup().getName());
            groupDTO.setDescription(expense.getGroup().getDescription());
            dto.setGroup(groupDTO);
        }

        // Convertir participantes
        if (expense.getParticipants() != null) {
            List<UserDTO> participantsDTO = expense.getParticipants().stream()
                    .map(participant -> new UserDTO(
                        participant.getId(),
                        participant.getName(),
                        participant.getEmail(),
                        participant.getCreatedAt(),
                        participant.getUpdatedAt()
                    ))
                    .collect(Collectors.toList());
            dto.setParticipants(participantsDTO);
        }

        // Convertir divisiones (simplificado)
        if (expense.getExpenseSplits() != null && !expense.getExpenseSplits().isEmpty()) {
            List<SplitDTO> splitsDTO = expense.getExpenseSplits().stream()
                    .map(split -> new SplitDTO(
                        split.getUser().getId(),
                        split.getUser().getName(),
                        split.getAmountOwed(),
                        split.getPercentage()
                    ))
                    .collect(Collectors.toList());
            dto.setSplits(splitsDTO);
        }

        return dto;
    }
}