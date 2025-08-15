package com.equalpay.service;

import com.equalpay.dto.ExpenseDTO;
import com.equalpay.dto.UserDTO;
import com.equalpay.entity.Expense;
import com.equalpay.entity.Group;
import com.equalpay.entity.User;
import com.equalpay.repository.ExpenseRepository;
import com.equalpay.repository.ExpenseSplitRepository;
import com.equalpay.repository.GroupRepository;
import com.equalpay.repository.UserRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.math.BigDecimal;
import java.util.Arrays;
import java.util.HashSet;
import java.util.Optional;
import java.util.Set;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class ExpenseServiceTest {

    @Mock
    private ExpenseRepository expenseRepository;

    @Mock
    private UserRepository userRepository;

    @Mock
    private GroupRepository groupRepository;

    @Mock
    private ExpenseSplitRepository expenseSplitRepository;

    @InjectMocks
    private ExpenseService expenseService;

    private User alice;
    private User bob;
    private Group group;
    private ExpenseDTO expenseDTO;

    @BeforeEach
    void setUp() {
        // Setup users
        alice = new User("Alice", "alice@email.com");
        alice.setId(1L);
        
        bob = new User("Bob", "bob@email.com");
        bob.setId(2L);

        // Setup group
        group = new Group("Test Group", "Test Description", alice);
        group.setId(1L);
        group.setMembers(new HashSet<>(Arrays.asList(alice, bob)));

        // Setup DTO
        expenseDTO = new ExpenseDTO();
        expenseDTO.setDescription("Test Expense");
        expenseDTO.setAmount(new BigDecimal("100.00"));
        expenseDTO.setPayerId(1L);
        expenseDTO.setGroupId(1L);
        expenseDTO.setSplitType(Expense.SplitType.EQUAL);
        
        UserDTO aliceDTO = new UserDTO(1L, "Alice", "alice@email.com", null, null);
        UserDTO bobDTO = new UserDTO(2L, "Bob", "bob@email.com", null, null);
        expenseDTO.setParticipants(Arrays.asList(aliceDTO, bobDTO));
    }

    @Test
    void createExpense_ShouldReturnExpenseDTO_WhenValidData() {
        // Given
        when(userRepository.findById(1L)).thenReturn(Optional.of(alice));
        when(groupRepository.findById(1L)).thenReturn(Optional.of(group));
        when(userRepository.findById(2L)).thenReturn(Optional.of(bob));
        
        Expense savedExpense = new Expense();
        savedExpense.setId(1L);
        savedExpense.setDescription("Test Expense");
        savedExpense.setAmount(new BigDecimal("100.00"));
        savedExpense.setPayer(alice);
        savedExpense.setGroup(group);
        savedExpense.setParticipants(new HashSet<>(Arrays.asList(alice, bob)));
        
        when(expenseRepository.save(any(Expense.class))).thenReturn(savedExpense);

        // When
        ExpenseDTO result = expenseService.createExpense(expenseDTO);

        // Then
        assertNotNull(result);
        assertEquals("Test Expense", result.getDescription());
        assertEquals(new BigDecimal("100.00"), result.getAmount());
        assertEquals(1L, result.getPayerId());
        assertEquals(1L, result.getGroupId());
        
        verify(expenseRepository).save(any(Expense.class));
    }

    @Test
    void createExpense_ShouldThrowException_WhenPayerNotFound() {
        // Given
        when(userRepository.findById(1L)).thenReturn(Optional.empty());

        // When & Then
        IllegalArgumentException exception = assertThrows(
            IllegalArgumentException.class,
            () -> expenseService.createExpense(expenseDTO)
        );
        
        assertEquals("Pagador no encontrado", exception.getMessage());
        verify(expenseRepository, never()).save(any(Expense.class));
    }

    @Test
    void createExpense_ShouldThrowException_WhenGroupNotFound() {
        // Given
        when(userRepository.findById(1L)).thenReturn(Optional.of(alice));
        when(groupRepository.findById(1L)).thenReturn(Optional.empty());

        // When & Then
        IllegalArgumentException exception = assertThrows(
            IllegalArgumentException.class,
            () -> expenseService.createExpense(expenseDTO)
        );
        
        assertEquals("Grupo no encontrado", exception.getMessage());
        verify(expenseRepository, never()).save(any(Expense.class));
    }

    @Test
    void createExpense_ShouldThrowException_WhenPayerNotGroupMember() {
        // Given
        User charlie = new User("Charlie", "charlie@email.com");
        charlie.setId(3L);
        
        // Group without charlie
        group.setMembers(new HashSet<>(Arrays.asList(alice, bob)));
        
        expenseDTO.setPayerId(3L);
        
        when(userRepository.findById(3L)).thenReturn(Optional.of(charlie));
        when(groupRepository.findById(1L)).thenReturn(Optional.of(group));

        // When & Then
        IllegalArgumentException exception = assertThrows(
            IllegalArgumentException.class,
            () -> expenseService.createExpense(expenseDTO)
        );
        
        assertEquals("El pagador debe ser miembro del grupo", exception.getMessage());
        verify(expenseRepository, never()).save(any(Expense.class));
    }
}