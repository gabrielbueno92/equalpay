package com.equalpay.dto;

import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotNull;
import java.math.BigDecimal;
import java.time.LocalDateTime;

public class SettlementDTO {
    
    private Long id;
    
    @NotNull(message = "El ID del grupo es obligatorio")
    private Long groupId;
    
    @NotNull(message = "El ID del deudor es obligatorio")
    private Long debtorId;
    private UserDTO debtor;
    
    @NotNull(message = "El ID del acreedor es obligatorio")  
    private Long creditorId;
    private UserDTO creditor;
    
    @NotNull(message = "El monto es obligatorio")
    @DecimalMin(value = "0.01", message = "El monto debe ser mayor a 0")
    private BigDecimal amount;
    
    private LocalDateTime settledAt;
    private String notes;
    private LocalDateTime createdAt;

    public SettlementDTO() {}

    public SettlementDTO(Long id, Long groupId, UserDTO debtor, UserDTO creditor, 
                        BigDecimal amount, LocalDateTime settledAt, String notes) {
        this.id = id;
        this.groupId = groupId;
        this.debtor = debtor;
        this.debtorId = debtor != null ? debtor.getId() : null;
        this.creditor = creditor;
        this.creditorId = creditor != null ? creditor.getId() : null;
        this.amount = amount;
        this.settledAt = settledAt;
        this.notes = notes;
    }

    // Getters y Setters
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Long getGroupId() {
        return groupId;
    }

    public void setGroupId(Long groupId) {
        this.groupId = groupId;
    }

    public Long getDebtorId() {
        return debtorId;
    }

    public void setDebtorId(Long debtorId) {
        this.debtorId = debtorId;
    }

    public UserDTO getDebtor() {
        return debtor;
    }

    public void setDebtor(UserDTO debtor) {
        this.debtor = debtor;
        this.debtorId = debtor != null ? debtor.getId() : null;
    }

    public Long getCreditorId() {
        return creditorId;
    }

    public void setCreditorId(Long creditorId) {
        this.creditorId = creditorId;
    }

    public UserDTO getCreditor() {
        return creditor;
    }

    public void setCreditor(UserDTO creditor) {
        this.creditor = creditor;
        this.creditorId = creditor != null ? creditor.getId() : null;
    }

    public BigDecimal getAmount() {
        return amount;
    }

    public void setAmount(BigDecimal amount) {
        this.amount = amount;
    }

    public LocalDateTime getSettledAt() {
        return settledAt;
    }

    public void setSettledAt(LocalDateTime settledAt) {
        this.settledAt = settledAt;
    }

    public String getNotes() {
        return notes;
    }

    public void setNotes(String notes) {
        this.notes = notes;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }
}