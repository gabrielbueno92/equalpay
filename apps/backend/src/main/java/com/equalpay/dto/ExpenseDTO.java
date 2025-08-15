package com.equalpay.dto;

import com.equalpay.entity.Expense;
import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

public class ExpenseDTO {

    private Long id;

    @NotBlank(message = "La descripción es obligatoria")
    @Size(min = 3, max = 200, message = "La descripción debe tener entre 3 y 200 caracteres")
    private String description;

    @NotNull(message = "El monto es obligatorio")
    @DecimalMin(value = "0.01", message = "El monto debe ser mayor a 0")
    private BigDecimal amount;

    private LocalDateTime expenseDate;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    private Expense.SplitType splitType = Expense.SplitType.EQUAL;
    private String notes;

    // Información del pagador
    private Long payerId;
    private UserDTO payer;

    // Información del grupo
    private Long groupId;
    private GroupDTO group;

    // Participantes (todos los que están en el gasto)
    private List<UserDTO> participants;

    // Divisiones (quién debe cuánto - puede ser subconjunto de participants)
    private List<SplitDTO> splits;

    // Campos calculados
    private BigDecimal amountPerParticipant;
    private int participantCount;

    public ExpenseDTO() {}

    public ExpenseDTO(Long id, String description, BigDecimal amount, LocalDateTime expenseDate,
                     Expense.SplitType splitType, String notes, UserDTO payer, GroupDTO group) {
        this.id = id;
        this.description = description;
        this.amount = amount;
        this.expenseDate = expenseDate;
        this.splitType = splitType;
        this.notes = notes;
        this.payer = payer;
        this.payerId = payer != null ? payer.getId() : null;
        this.group = group;
        this.groupId = group != null ? group.getId() : null;
    }

    // Getters y Setters
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public BigDecimal getAmount() {
        return amount;
    }

    public void setAmount(BigDecimal amount) {
        this.amount = amount;
    }

    public LocalDateTime getExpenseDate() {
        return expenseDate;
    }

    public void setExpenseDate(LocalDateTime expenseDate) {
        this.expenseDate = expenseDate;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }

    public LocalDateTime getUpdatedAt() {
        return updatedAt;
    }

    public void setUpdatedAt(LocalDateTime updatedAt) {
        this.updatedAt = updatedAt;
    }

    public Expense.SplitType getSplitType() {
        return splitType;
    }

    public void setSplitType(Expense.SplitType splitType) {
        this.splitType = splitType;
    }

    public String getNotes() {
        return notes;
    }

    public void setNotes(String notes) {
        this.notes = notes;
    }

    public Long getPayerId() {
        return payerId;
    }

    public void setPayerId(Long payerId) {
        this.payerId = payerId;
    }

    public UserDTO getPayer() {
        return payer;
    }

    public void setPayer(UserDTO payer) {
        this.payer = payer;
        this.payerId = payer != null ? payer.getId() : null;
    }

    public Long getGroupId() {
        return groupId;
    }

    public void setGroupId(Long groupId) {
        this.groupId = groupId;
    }

    public GroupDTO getGroup() {
        return group;
    }

    public void setGroup(GroupDTO group) {
        this.group = group;
        this.groupId = group != null ? group.getId() : null;
    }


    public List<UserDTO> getParticipants() {
        return participants;
    }

    public void setParticipants(List<UserDTO> participants) {
        this.participants = participants;
        this.participantCount = participants != null ? participants.size() : 0;
        
        // Calcular monto por participante si es división equitativa
        if (participants != null && !participants.isEmpty() && amount != null) {
            this.amountPerParticipant = amount.divide(
                BigDecimal.valueOf(participants.size()), 
                2, 
                java.math.RoundingMode.HALF_UP
            );
        }
    }

    public List<SplitDTO> getSplits() {
        return splits;
    }

    public void setSplits(List<SplitDTO> splits) {
        this.splits = splits;
    }

    public BigDecimal getAmountPerParticipant() {
        return amountPerParticipant;
    }

    public void setAmountPerParticipant(BigDecimal amountPerParticipant) {
        this.amountPerParticipant = amountPerParticipant;
    }

    public int getParticipantCount() {
        return participantCount;
    }

    public void setParticipantCount(int participantCount) {
        this.participantCount = participantCount;
    }
}