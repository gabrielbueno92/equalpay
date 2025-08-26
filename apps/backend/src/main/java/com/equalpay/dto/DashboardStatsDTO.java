package com.equalpay.dto;

public class DashboardStatsDTO {
    private Double totalSpent;
    private Integer activeGroups;
    private Double netBalance;
    private MonthlyChangeDTO monthlyChange;

    public DashboardStatsDTO() {}

    public DashboardStatsDTO(Double totalSpent, Integer activeGroups, Double netBalance, MonthlyChangeDTO monthlyChange) {
        this.totalSpent = totalSpent;
        this.activeGroups = activeGroups;
        this.netBalance = netBalance;
        this.monthlyChange = monthlyChange;
    }

    public Double getTotalSpent() {
        return totalSpent;
    }

    public void setTotalSpent(Double totalSpent) {
        this.totalSpent = totalSpent;
    }

    public Integer getActiveGroups() {
        return activeGroups;
    }

    public void setActiveGroups(Integer activeGroups) {
        this.activeGroups = activeGroups;
    }

    public Double getNetBalance() {
        return netBalance;
    }

    public void setNetBalance(Double netBalance) {
        this.netBalance = netBalance;
    }

    public MonthlyChangeDTO getMonthlyChange() {
        return monthlyChange;
    }

    public void setMonthlyChange(MonthlyChangeDTO monthlyChange) {
        this.monthlyChange = monthlyChange;
    }

    public static class MonthlyChangeDTO {
        private Double totalSpent;
        private Integer activeGroups;
        private Double netBalance;

        public MonthlyChangeDTO() {}

        public MonthlyChangeDTO(Double totalSpent, Integer activeGroups, Double netBalance) {
            this.totalSpent = totalSpent;
            this.activeGroups = activeGroups;
            this.netBalance = netBalance;
        }

        public Double getTotalSpent() {
            return totalSpent;
        }

        public void setTotalSpent(Double totalSpent) {
            this.totalSpent = totalSpent;
        }

        public Integer getActiveGroups() {
            return activeGroups;
        }

        public void setActiveGroups(Integer activeGroups) {
            this.activeGroups = activeGroups;
        }

        public Double getNetBalance() {
            return netBalance;
        }

        public void setNetBalance(Double netBalance) {
            this.netBalance = netBalance;
        }
    }
}