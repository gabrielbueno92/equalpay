package com.equalpay.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.DecimalMax;
import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotNull;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "expense_splits")
public class ExpenseSplit {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotNull(message = "El monto adeudado es obligatorio")
    @DecimalMin(value = "0.00", message = "El monto debe ser mayor o igual a 0")
    @Column(name = "amount_owed", nullable = false, precision = 10, scale = 2)
    private BigDecimal amountOwed;

    @DecimalMin(value = "0.00", message = "El porcentaje debe ser mayor o igual a 0")
    @DecimalMax(value = "100.00", message = "El porcentaje debe ser menor o igual a 100")
    @Column(precision = 5, scale = 2)
    private BigDecimal percentage;

    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;

    // Relación: Gasto al que pertenece esta división
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "expense_id", nullable = false)
    private Expense expense;

    // Relación: Usuario que debe esta parte del gasto
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    public ExpenseSplit() {}

    public ExpenseSplit(Expense expense, User user, BigDecimal amountOwed) {
        this.expense = expense;
        this.user = user;
        this.amountOwed = amountOwed;
    }

    public ExpenseSplit(Expense expense, User user, BigDecimal amountOwed, BigDecimal percentage) {
        this.expense = expense;
        this.user = user;
        this.amountOwed = amountOwed;
        this.percentage = percentage;
    }

    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
    }

    // Getters y Setters
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public BigDecimal getAmountOwed() {
        return amountOwed;
    }

    public void setAmountOwed(BigDecimal amountOwed) {
        this.amountOwed = amountOwed;
    }

    public BigDecimal getPercentage() {
        return percentage;
    }

    public void setPercentage(BigDecimal percentage) {
        this.percentage = percentage;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }

    public Expense getExpense() {
        return expense;
    }

    public void setExpense(Expense expense) {
        this.expense = expense;
    }

    public User getUser() {
        return user;
    }

    public void setUser(User user) {
        this.user = user;
    }

    @Override
    public String toString() {
        return "ExpenseSplit{" +
                "id=" + id +
                ", amountOwed=" + amountOwed +
                ", percentage=" + percentage +
                ", userId=" + (user != null ? user.getId() : null) +
                ", expenseId=" + (expense != null ? expense.getId() : null) +
                '}';
    }
}