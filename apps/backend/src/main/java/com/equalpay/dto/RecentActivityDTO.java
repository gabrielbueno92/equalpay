package com.equalpay.dto;

import java.time.LocalDateTime;
import java.util.List;

public class RecentActivityDTO {
    private List<RecentExpenseDTO> expenses;
    private List<RecentSettlementDTO> settlements;

    public RecentActivityDTO() {}

    public RecentActivityDTO(List<RecentExpenseDTO> expenses, List<RecentSettlementDTO> settlements) {
        this.expenses = expenses;
        this.settlements = settlements;
    }

    public List<RecentExpenseDTO> getExpenses() {
        return expenses;
    }

    public void setExpenses(List<RecentExpenseDTO> expenses) {
        this.expenses = expenses;
    }

    public List<RecentSettlementDTO> getSettlements() {
        return settlements;
    }

    public void setSettlements(List<RecentSettlementDTO> settlements) {
        this.settlements = settlements;
    }

    public static class RecentExpenseDTO {
        private Long id;
        private String description;
        private Double amount;
        private String category;
        private String groupName;
        private String paidByName;
        private LocalDateTime createdAt;

        public RecentExpenseDTO() {}

        public RecentExpenseDTO(Long id, String description, Double amount, String category, 
                              String groupName, String paidByName, LocalDateTime createdAt) {
            this.id = id;
            this.description = description;
            this.amount = amount;
            this.category = category;
            this.groupName = groupName;
            this.paidByName = paidByName;
            this.createdAt = createdAt;
        }

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

        public Double getAmount() {
            return amount;
        }

        public void setAmount(Double amount) {
            this.amount = amount;
        }

        public String getCategory() {
            return category;
        }

        public void setCategory(String category) {
            this.category = category;
        }

        public String getGroupName() {
            return groupName;
        }

        public void setGroupName(String groupName) {
            this.groupName = groupName;
        }

        public String getPaidByName() {
            return paidByName;
        }

        public void setPaidByName(String paidByName) {
            this.paidByName = paidByName;
        }

        public LocalDateTime getCreatedAt() {
            return createdAt;
        }

        public void setCreatedAt(LocalDateTime createdAt) {
            this.createdAt = createdAt;
        }
    }

    public static class RecentSettlementDTO {
        private Long id;
        private String fromUserName;
        private String toUserName;
        private Double amount;
        private LocalDateTime settledAt;

        public RecentSettlementDTO() {}

        public RecentSettlementDTO(Long id, String fromUserName, String toUserName, 
                                 Double amount, LocalDateTime settledAt) {
            this.id = id;
            this.fromUserName = fromUserName;
            this.toUserName = toUserName;
            this.amount = amount;
            this.settledAt = settledAt;
        }

        public Long getId() {
            return id;
        }

        public void setId(Long id) {
            this.id = id;
        }

        public String getFromUserName() {
            return fromUserName;
        }

        public void setFromUserName(String fromUserName) {
            this.fromUserName = fromUserName;
        }

        public String getToUserName() {
            return toUserName;
        }

        public void setToUserName(String toUserName) {
            this.toUserName = toUserName;
        }

        public Double getAmount() {
            return amount;
        }

        public void setAmount(Double amount) {
            this.amount = amount;
        }

        public LocalDateTime getSettledAt() {
            return settledAt;
        }

        public void setSettledAt(LocalDateTime settledAt) {
            this.settledAt = settledAt;
        }
    }
}