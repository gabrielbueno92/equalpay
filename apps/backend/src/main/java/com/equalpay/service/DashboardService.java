package com.equalpay.service;

import com.equalpay.dto.DashboardStatsDTO;
import com.equalpay.dto.RecentActivityDTO;
import com.equalpay.entity.Expense;
import com.equalpay.repository.ExpenseRepository;
import com.equalpay.repository.GroupRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class DashboardService {

    @Autowired
    private ExpenseRepository expenseRepository;

    @Autowired
    private GroupRepository groupRepository;

    @Autowired
    private BalanceService balanceService;

    public DashboardStatsDTO getDashboardStats(Long userId) {
        // Calculate total spent (all expenses where user is a participant)
        Double totalSpent = calculateTotalSpentByUser(userId);
        
        // Get active groups count
        Integer activeGroups = getActiveGroupsCount(userId);
        
        // Calculate net balance (what user owes or is owed)
        Double netBalance = calculateNetBalance(userId);
        
        // Calculate monthly changes
        DashboardStatsDTO.MonthlyChangeDTO monthlyChange = calculateMonthlyChanges(userId);
        
        return new DashboardStatsDTO(totalSpent, activeGroups, netBalance, monthlyChange);
    }

    public RecentActivityDTO getRecentActivity(Long userId, int limit) {
        // Get recent expenses where user is involved (as payer or participant)
        List<Expense> recentExpenses = expenseRepository.findRecentExpensesByUserWithDetails(userId);
        
        List<RecentActivityDTO.RecentExpenseDTO> expenseList = recentExpenses.stream()
            .limit(limit) // Apply limit in Java
            .<RecentActivityDTO.RecentExpenseDTO>map(expense -> new RecentActivityDTO.RecentExpenseDTO(
                expense.getId(),
                expense.getDescription(),
                expense.getAmount().doubleValue(),
                expense.getNotes() != null ? expense.getNotes() : "General", // Using notes as category for now
                expense.getGroup().getName(),
                expense.getPayer().getName(),
                expense.getCreatedAt()
            ))
            .collect(Collectors.toList());
        
        // For now, return empty settlements list as we don't have settlement tracking yet
        List<RecentActivityDTO.RecentSettlementDTO> settlements = List.of();
        
        return new RecentActivityDTO(expenseList, settlements);
    }

    private Double calculateTotalSpentByUser(Long userId) {
        List<Expense> expenses = expenseRepository.findByParticipantId(userId);
        return expenses.stream()
            .mapToDouble(expense -> {
                // Calculate user's share of each expense
                return expense.getAmount().divide(BigDecimal.valueOf(expense.getExpenseSplits().size())).doubleValue();
            })
            .sum();
    }

    private Integer getActiveGroupsCount(Long userId) {
        return groupRepository.countActiveGroupsByUserId(userId).intValue();
    }

    private Double calculateNetBalance(Long userId) {
        try {
            // Get all balances for the user across all groups
            List<com.equalpay.dto.BalanceDTO> userBalances = balanceService.getUserBalances(userId);
            
            // Calculate net balance from all groups
            double totalBalance = 0.0;
            for (com.equalpay.dto.BalanceDTO balance : userBalances) {
                totalBalance += balance.getBalance();
            }
            return totalBalance;
        } catch (Exception e) {
            // If balance calculation fails, return 0
            return 0.0;
        }
    }

    private DashboardStatsDTO.MonthlyChangeDTO calculateMonthlyChanges(Long userId) {
        LocalDateTime oneMonthAgo = LocalDateTime.now().minusMonths(1);
        
        // Calculate changes compared to last month
        Double currentMonthSpent = calculateTotalSpentByUserSince(userId, oneMonthAgo);
        Double previousMonthSpent = calculateTotalSpentByUserBetween(userId, oneMonthAgo.minusMonths(1), oneMonthAgo);
        
        Double spentChange = previousMonthSpent > 0 ? 
            ((currentMonthSpent - previousMonthSpent) / previousMonthSpent) * 100 : 0.0;
        
        // For simplicity, assume groups and balance changes are minimal for now
        Integer groupsChange = 0;
        Double balanceChange = 0.0;
        
        return new DashboardStatsDTO.MonthlyChangeDTO(spentChange, groupsChange, balanceChange);
    }

    private Double calculateTotalSpentByUserSince(Long userId, LocalDateTime since) {
        List<Expense> expenses = expenseRepository.findExpensesByParticipantIdSince(userId, since);
        return expenses.stream()
            .mapToDouble(expense -> expense.getAmount().divide(BigDecimal.valueOf(expense.getExpenseSplits().size())).doubleValue())
            .sum();
    }

    private Double calculateTotalSpentByUserBetween(Long userId, LocalDateTime start, LocalDateTime end) {
        List<Expense> expenses = expenseRepository.findExpensesByParticipantIdBetween(userId, start, end);
        return expenses.stream()
            .mapToDouble(expense -> expense.getAmount().divide(BigDecimal.valueOf(expense.getExpenseSplits().size())).doubleValue())
            .sum();
    }
}