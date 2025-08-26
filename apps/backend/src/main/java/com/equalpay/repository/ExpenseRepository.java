package com.equalpay.repository;

import com.equalpay.entity.Expense;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Repository
public interface ExpenseRepository extends JpaRepository<Expense, Long> {

    // Buscar todos los gastos con fetch joins para evitar lazy loading
    @Query("SELECT DISTINCT e FROM Expense e LEFT JOIN FETCH e.group LEFT JOIN FETCH e.payer LEFT JOIN FETCH e.participants LEFT JOIN FETCH e.expenseSplits es LEFT JOIN FETCH es.user ORDER BY e.expenseDate DESC")
    List<Expense> findAllWithDetails();

    // Buscar gasto por ID con fetch joins
    @Query("SELECT e FROM Expense e LEFT JOIN FETCH e.group LEFT JOIN FETCH e.payer LEFT JOIN FETCH e.participants LEFT JOIN FETCH e.expenseSplits es LEFT JOIN FETCH es.user WHERE e.id = :id")
    Optional<Expense> findByIdWithDetails(@Param("id") Long id);

    // Gastos por grupo con fetch joins para evitar lazy loading
    @Query("SELECT e FROM Expense e LEFT JOIN FETCH e.group LEFT JOIN FETCH e.payer LEFT JOIN FETCH e.participants LEFT JOIN FETCH e.expenseSplits es LEFT JOIN FETCH es.user WHERE e.group.id = :groupId ORDER BY e.expenseDate DESC")
    List<Expense> findByGroupId(@Param("groupId") Long groupId);

    // Gastos donde el usuario es el pagador
    @Query("SELECT e FROM Expense e WHERE e.payer.id = :payerId ORDER BY e.expenseDate DESC")
    List<Expense> findByPayerId(@Param("payerId") Long payerId);

    // Gastos donde el usuario es participante
    @Query("SELECT e FROM Expense e JOIN e.participants p WHERE p.id = :userId ORDER BY e.expenseDate DESC")
    List<Expense> findByParticipantId(@Param("userId") Long userId);

    // Gastos en un rango de fechas
    @Query("SELECT e FROM Expense e WHERE e.expenseDate BETWEEN :startDate AND :endDate ORDER BY e.expenseDate DESC")
    List<Expense> findByExpenseDateBetween(@Param("startDate") LocalDateTime startDate, 
                                          @Param("endDate") LocalDateTime endDate);

    // Gastos por grupo en un rango de fechas
    @Query("SELECT e FROM Expense e WHERE e.group.id = :groupId AND e.expenseDate BETWEEN :startDate AND :endDate ORDER BY e.expenseDate DESC")
    List<Expense> findByGroupIdAndExpenseDateBetween(@Param("groupId") Long groupId,
                                                    @Param("startDate") LocalDateTime startDate,
                                                    @Param("endDate") LocalDateTime endDate);

    // Buscar gastos por descripción
    @Query("SELECT e FROM Expense e WHERE LOWER(e.description) LIKE LOWER(CONCAT('%', :description, '%')) ORDER BY e.expenseDate DESC")
    List<Expense> findByDescriptionContainingIgnoreCase(@Param("description") String description);

    // Estadísticas: Total gastado por grupo
    @Query("SELECT SUM(e.amount) FROM Expense e WHERE e.group.id = :groupId")
    BigDecimal getTotalAmountByGroupId(@Param("groupId") Long groupId);

    // Estadísticas: Total pagado por usuario
    @Query("SELECT SUM(e.amount) FROM Expense e WHERE e.payer.id = :payerId")
    BigDecimal getTotalPaidByUserId(@Param("payerId") Long payerId);

    // Estadísticas: Total que debe un usuario (suma de sus participaciones)
    @Query("SELECT SUM(es.amountOwed) FROM ExpenseSplit es WHERE es.user.id = :userId")
    BigDecimal getTotalOwedByUserId(@Param("userId") Long userId);

    // Gastos donde un usuario específico está involucrado (como pagador o participante)
    @Query("SELECT DISTINCT e FROM Expense e WHERE e.payer.id = :userId OR :userId IN (SELECT p.id FROM e.participants p) ORDER BY e.expenseDate DESC")
    List<Expense> findByUserInvolved(@Param("userId") Long userId);

    // Gastos de un grupo donde un usuario específico está involucrado
    @Query("SELECT DISTINCT e FROM Expense e WHERE e.group.id = :groupId AND (e.payer.id = :userId OR :userId IN (SELECT p.id FROM e.participants p)) ORDER BY e.expenseDate DESC")
    List<Expense> findByGroupIdAndUserInvolved(@Param("groupId") Long groupId, @Param("userId") Long userId);

    // Contar gastos por grupo
    @Query("SELECT COUNT(e) FROM Expense e WHERE e.group.id = :groupId")
    Long countByGroupId(@Param("groupId") Long groupId);

    // Último gasto de un grupo
    @Query("SELECT e FROM Expense e WHERE e.group.id = :groupId ORDER BY e.expenseDate DESC LIMIT 1")
    Expense findLatestByGroupId(@Param("groupId") Long groupId);

    // Dashboard methods
    @Query("SELECT DISTINCT e FROM Expense e LEFT JOIN FETCH e.group LEFT JOIN FETCH e.payer LEFT JOIN FETCH e.participants LEFT JOIN FETCH e.expenseSplits es LEFT JOIN FETCH es.user WHERE (e.payer.id = :userId OR :userId IN (SELECT p.id FROM e.participants p)) ORDER BY e.createdAt DESC LIMIT :limit")
    List<Expense> findRecentExpensesByUserWithDetails(@Param("userId") Long userId, @Param("limit") int limit);

    @Query("SELECT e FROM Expense e JOIN e.participants p WHERE p.id = :userId AND e.createdAt >= :since")
    List<Expense> findExpensesByParticipantIdSince(@Param("userId") Long userId, @Param("since") LocalDateTime since);

    @Query("SELECT e FROM Expense e JOIN e.participants p WHERE p.id = :userId AND e.createdAt BETWEEN :start AND :end")
    List<Expense> findExpensesByParticipantIdBetween(@Param("userId") Long userId, @Param("start") LocalDateTime start, @Param("end") LocalDateTime end);
}