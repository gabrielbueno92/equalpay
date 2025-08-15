package com.equalpay.dto;

import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotNull;

import java.math.BigDecimal;

public class SplitDTO {

    @NotNull
    private Long userId;

    @NotNull  
    private String userName;

    @NotNull(message = "El monto adeudado es obligatorio")
    @DecimalMin(value = "0.00", message = "El monto debe ser mayor o igual a 0")
    private BigDecimal amountOwed;

    private BigDecimal percentage;

    public SplitDTO() {}

    public SplitDTO(Long userId, String userName, BigDecimal amountOwed) {
        this.userId = userId;
        this.userName = userName;
        this.amountOwed = amountOwed;
    }

    public SplitDTO(Long userId, String userName, BigDecimal amountOwed, BigDecimal percentage) {
        this.userId = userId;
        this.userName = userName;
        this.amountOwed = amountOwed;
        this.percentage = percentage;
    }

    // Getters y Setters
    public Long getUserId() {
        return userId;
    }

    public void setUserId(Long userId) {
        this.userId = userId;
    }

    public String getUserName() {
        return userName;
    }

    public void setUserName(String userName) {
        this.userName = userName;
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
}