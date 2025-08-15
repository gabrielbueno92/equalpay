package com.equalpay.dto;

import jakarta.validation.constraints.DecimalMax;
import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotNull;

import java.math.BigDecimal;
import java.time.LocalDateTime;

public class ExpenseSplitDTO {

    private Long id;

    @NotNull(message = "El monto adeudado es obligatorio")
    @DecimalMin(value = "0.00", message = "El monto debe ser mayor o igual a 0")
    private BigDecimal amountOwed;

    @DecimalMin(value = "0.00", message = "El porcentaje debe ser mayor o igual a 0")
    @DecimalMax(value = "100.00", message = "El porcentaje debe ser menor o igual a 100")
    private BigDecimal percentage;

    private LocalDateTime createdAt;

    // Información del gasto
    private Long expenseId;
    private String expenseDescription;

    // Información del usuario
    private Long userId;
    private UserDTO user;

    public ExpenseSplitDTO() {}

    public ExpenseSplitDTO(Long id, BigDecimal amountOwed, BigDecimal percentage, 
                          Long expenseId, String expenseDescription, UserDTO user) {
        this.id = id;
        this.amountOwed = amountOwed;
        this.percentage = percentage;
        this.expenseId = expenseId;
        this.expenseDescription = expenseDescription;
        this.user = user;
        this.userId = user != null ? user.getId() : null;
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

    public Long getExpenseId() {
        return expenseId;
    }

    public void setExpenseId(Long expenseId) {
        this.expenseId = expenseId;
    }

    public String getExpenseDescription() {
        return expenseDescription;
    }

    public void setExpenseDescription(String expenseDescription) {
        this.expenseDescription = expenseDescription;
    }

    public Long getUserId() {
        return userId;
    }

    public void setUserId(Long userId) {
        this.userId = userId;
    }

    public UserDTO getUser() {
        return user;
    }

    public void setUser(UserDTO user) {
        this.user = user;
        this.userId = user != null ? user.getId() : null;
    }
}