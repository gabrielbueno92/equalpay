package com.equalpay.controller;

import com.equalpay.dto.ExpenseDTO;
import com.equalpay.service.ExpenseService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/expenses")
@CrossOrigin(origins = "*")
public class ExpenseController {

    @Autowired
    private ExpenseService expenseService;

    @GetMapping
    public ResponseEntity<List<ExpenseDTO>> getAllExpenses() {
        List<ExpenseDTO> expenses = expenseService.getAllExpenses();
        return ResponseEntity.ok(expenses);
    }

    @GetMapping("/{id}")
    public ResponseEntity<ExpenseDTO> getExpenseById(@PathVariable Long id) {
        Optional<ExpenseDTO> expense = expenseService.getExpenseById(id);
        return expense.map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/group/{groupId}")
    public ResponseEntity<List<ExpenseDTO>> getExpensesByGroupId(@PathVariable Long groupId) {
        List<ExpenseDTO> expenses = expenseService.getExpensesByGroupId(groupId);
        return ResponseEntity.ok(expenses);
    }

    @GetMapping("/payer/{payerId}")
    public ResponseEntity<List<ExpenseDTO>> getExpensesByPayerId(@PathVariable Long payerId) {
        List<ExpenseDTO> expenses = expenseService.getExpensesByPayerId(payerId);
        return ResponseEntity.ok(expenses);
    }

    @GetMapping("/participant/{userId}")
    public ResponseEntity<List<ExpenseDTO>> getExpensesByParticipantId(@PathVariable Long userId) {
        List<ExpenseDTO> expenses = expenseService.getExpensesByParticipantId(userId);
        return ResponseEntity.ok(expenses);
    }

    @GetMapping("/user/{userId}")
    public ResponseEntity<List<ExpenseDTO>> getExpensesByUserInvolved(@PathVariable Long userId) {
        List<ExpenseDTO> expenses = expenseService.getExpensesByUserInvolved(userId);
        return ResponseEntity.ok(expenses);
    }

    @PostMapping
    public ResponseEntity<ExpenseDTO> createExpense(@Valid @RequestBody ExpenseDTO expenseDTO) {
        try {
            ExpenseDTO createdExpense = expenseService.createExpense(expenseDTO);
            return ResponseEntity.status(HttpStatus.CREATED).body(createdExpense);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().build();
        }
    }

    @PutMapping("/{id}")
    public ResponseEntity<ExpenseDTO> updateExpense(@PathVariable Long id, 
                                                   @Valid @RequestBody ExpenseDTO expenseDTO) {
        try {
            ExpenseDTO updatedExpense = expenseService.updateExpense(id, expenseDTO);
            return ResponseEntity.ok(updatedExpense);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.notFound().build();
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteExpense(@PathVariable Long id) {
        try {
            expenseService.deleteExpense(id);
            return ResponseEntity.noContent().build();
        } catch (IllegalArgumentException e) {
            return ResponseEntity.notFound().build();
        }
    }

    // Endpoints de estadísticas
    @GetMapping("/stats/group/{groupId}/total")
    public ResponseEntity<BigDecimal> getTotalAmountByGroupId(@PathVariable Long groupId) {
        BigDecimal total = expenseService.getTotalAmountByGroupId(groupId);
        return ResponseEntity.ok(total);
    }

    @GetMapping("/stats/user/{userId}/paid")
    public ResponseEntity<BigDecimal> getTotalPaidByUserId(@PathVariable Long userId) {
        BigDecimal total = expenseService.getTotalPaidByUserId(userId);
        return ResponseEntity.ok(total);
    }

    @GetMapping("/stats/user/{userId}/owed")
    public ResponseEntity<BigDecimal> getTotalOwedByUserId(@PathVariable Long userId) {
        BigDecimal total = expenseService.getTotalOwedByUserId(userId);
        return ResponseEntity.ok(total);
    }
}