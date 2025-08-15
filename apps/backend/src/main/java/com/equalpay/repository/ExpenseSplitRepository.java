package com.equalpay.repository;

import com.equalpay.entity.ExpenseSplit;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.math.BigDecimal;
import java.util.List;

@Repository
public interface ExpenseSplitRepository extends JpaRepository<ExpenseSplit, Long> {

    // Divisiones por gasto
    @Query("SELECT es FROM ExpenseSplit es WHERE es.expense.id = :expenseId")
    List<ExpenseSplit> findByExpenseId(@Param("expenseId") Long expenseId);

    // Divisiones que debe un usuario específico
    @Query("SELECT es FROM ExpenseSplit es WHERE es.user.id = :userId ORDER BY es.expense.expenseDate DESC")
    List<ExpenseSplit> findByUserId(@Param("userId") Long userId);

    // Divisiones de un usuario en un grupo específico
    @Query("SELECT es FROM ExpenseSplit es WHERE es.user.id = :userId AND es.expense.group.id = :groupId ORDER BY es.expense.expenseDate DESC")
    List<ExpenseSplit> findByUserIdAndGroupId(@Param("userId") Long userId, @Param("groupId") Long groupId);

    // Total que debe un usuario
    @Query("SELECT SUM(es.amountOwed) FROM ExpenseSplit es WHERE es.user.id = :userId")
    BigDecimal getTotalAmountOwedByUserId(@Param("userId") Long userId);

    // Total que debe un usuario en un grupo específico
    @Query("SELECT SUM(es.amountOwed) FROM ExpenseSplit es WHERE es.user.id = :userId AND es.expense.group.id = :groupId")
    BigDecimal getTotalAmountOwedByUserIdAndGroupId(@Param("userId") Long userId, @Param("groupId") Long groupId);

    // Eliminar todas las divisiones de un gasto
    @Modifying
    @Query("DELETE FROM ExpenseSplit es WHERE es.expense.id = :expenseId")
    void deleteByExpenseId(@Param("expenseId") Long expenseId);

    // Verificar si existe una división para un usuario en un gasto específico
    @Query("SELECT COUNT(es) > 0 FROM ExpenseSplit es WHERE es.expense.id = :expenseId AND es.user.id = :userId")
    boolean existsByExpenseIdAndUserId(@Param("expenseId") Long expenseId, @Param("userId") Long userId);

    // Obtener la división específica de un usuario en un gasto
    @Query("SELECT es FROM ExpenseSplit es WHERE es.expense.id = :expenseId AND es.user.id = :userId")
    ExpenseSplit findByExpenseIdAndUserId(@Param("expenseId") Long expenseId, @Param("userId") Long userId);
}