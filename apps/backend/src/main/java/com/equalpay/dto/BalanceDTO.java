package com.equalpay.dto;

import java.math.BigDecimal;
import java.util.List;

public class BalanceDTO {

    private Long groupId;
    private String groupName;
    private BigDecimal totalExpenses;
    private List<UserBalanceDTO> userBalances;
    private List<DebtDTO> settlements;
    private Double balance; // For simplified balance representation

    public BalanceDTO() {}

    public BalanceDTO(Long groupId, String groupName, BigDecimal totalExpenses) {
        this.groupId = groupId;
        this.groupName = groupName;
        this.totalExpenses = totalExpenses;
    }

    // Getters y Setters
    public Long getGroupId() {
        return groupId;
    }

    public void setGroupId(Long groupId) {
        this.groupId = groupId;
    }

    public String getGroupName() {
        return groupName;
    }

    public void setGroupName(String groupName) {
        this.groupName = groupName;
    }

    public BigDecimal getTotalExpenses() {
        return totalExpenses;
    }

    public void setTotalExpenses(BigDecimal totalExpenses) {
        this.totalExpenses = totalExpenses;
    }

    public List<UserBalanceDTO> getUserBalances() {
        return userBalances;
    }

    public void setUserBalances(List<UserBalanceDTO> userBalances) {
        this.userBalances = userBalances;
    }

    public List<DebtDTO> getSettlements() {
        return settlements;
    }

    public void setSettlements(List<DebtDTO> settlements) {
        this.settlements = settlements;
    }

    public Double getBalance() {
        return balance;
    }

    public void setBalance(Double balance) {
        this.balance = balance;
    }

    // DTO para balance individual de usuario
    public static class UserBalanceDTO {
        private Long userId;
        private String userName;
        private BigDecimal totalPaid;      // Lo que pagó
        private BigDecimal totalOwed;      // Lo que debe
        private BigDecimal netBalance;     // Diferencia (positivo = le deben, negativo = debe)

        public UserBalanceDTO() {}

        public UserBalanceDTO(Long userId, String userName, BigDecimal totalPaid, 
                             BigDecimal totalOwed, BigDecimal netBalance) {
            this.userId = userId;
            this.userName = userName;
            this.totalPaid = totalPaid;
            this.totalOwed = totalOwed;
            this.netBalance = netBalance;
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

        public BigDecimal getTotalPaid() {
            return totalPaid;
        }

        public void setTotalPaid(BigDecimal totalPaid) {
            this.totalPaid = totalPaid;
        }

        public BigDecimal getTotalOwed() {
            return totalOwed;
        }

        public void setTotalOwed(BigDecimal totalOwed) {
            this.totalOwed = totalOwed;
        }

        public BigDecimal getNetBalance() {
            return netBalance;
        }

        public void setNetBalance(BigDecimal netBalance) {
            this.netBalance = netBalance;
        }
    }

    // DTO para representar una deuda entre dos usuarios
    public static class DebtDTO {
        private Long debtorId;
        private String debtorName;
        private Long creditorId;
        private String creditorName;
        private BigDecimal amount;

        public DebtDTO() {}

        public DebtDTO(Long debtorId, String debtorName, Long creditorId, 
                      String creditorName, BigDecimal amount) {
            this.debtorId = debtorId;
            this.debtorName = debtorName;
            this.creditorId = creditorId;
            this.creditorName = creditorName;
            this.amount = amount;
        }

        // Getters y Setters
        public Long getDebtorId() {
            return debtorId;
        }

        public void setDebtorId(Long debtorId) {
            this.debtorId = debtorId;
        }

        public String getDebtorName() {
            return debtorName;
        }

        public void setDebtorName(String debtorName) {
            this.debtorName = debtorName;
        }

        public Long getCreditorId() {
            return creditorId;
        }

        public void setCreditorId(Long creditorId) {
            this.creditorId = creditorId;
        }

        public String getCreditorName() {
            return creditorName;
        }

        public void setCreditorName(String creditorName) {
            this.creditorName = creditorName;
        }

        public BigDecimal getAmount() {
            return amount;
        }

        public void setAmount(BigDecimal amount) {
            this.amount = amount;
        }
    }
}