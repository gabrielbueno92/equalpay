package com.equalpay.service;

import com.equalpay.dto.BalanceDTO;
import com.equalpay.entity.Expense;
import com.equalpay.entity.ExpenseSplit;
import com.equalpay.entity.Group;
import com.equalpay.entity.User;
import com.equalpay.repository.ExpenseRepository;
import com.equalpay.repository.ExpenseSplitRepository;
import com.equalpay.repository.GroupRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.*;
import java.util.stream.Collectors;

@Service
@Transactional(readOnly = true)
public class BalanceService {

    @Autowired
    private ExpenseRepository expenseRepository;

    @Autowired
    private ExpenseSplitRepository expenseSplitRepository;

    @Autowired
    private GroupRepository groupRepository;

    public BalanceDTO calculateGroupBalance(Long groupId) {
        Group group = groupRepository.findById(groupId)
                .orElseThrow(() -> new IllegalArgumentException("Grupo no encontrado"));

        List<Expense> expenses = expenseRepository.findByGroupId(groupId);
        
        if (expenses.isEmpty()) {
            return createEmptyBalance(group);
        }

        // Calcular total de gastos del grupo
        BigDecimal totalExpenses = expenses.stream()
                .map(Expense::getAmount)
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        // Crear mapa de balances por usuario
        Map<Long, BalanceDTO.UserBalanceDTO> userBalances = new HashMap<>();

        // Inicializar balances para todos los miembros del grupo
        for (User member : group.getMembers()) {
            userBalances.put(member.getId(), new BalanceDTO.UserBalanceDTO(
                member.getId(),
                member.getName(),
                BigDecimal.ZERO,  // totalPaid
                BigDecimal.ZERO,  // totalOwed
                BigDecimal.ZERO   // netBalance
            ));
        }

        // Calcular lo que cada usuario pagó
        for (Expense expense : expenses) {
            Long payerId = expense.getPayer().getId();
            BalanceDTO.UserBalanceDTO payerBalance = userBalances.get(payerId);
            if (payerBalance != null) {
                payerBalance.setTotalPaid(payerBalance.getTotalPaid().add(expense.getAmount()));
            }
        }

        // Calcular lo que cada usuario debe
        List<ExpenseSplit> allSplits = expenses.stream()
                .flatMap(expense -> expense.getExpenseSplits().stream())
                .collect(Collectors.toList());

        for (ExpenseSplit split : allSplits) {
            Long userId = split.getUser().getId();
            BalanceDTO.UserBalanceDTO userBalance = userBalances.get(userId);
            if (userBalance != null) {
                userBalance.setTotalOwed(userBalance.getTotalOwed().add(split.getAmountOwed()));
            }
        }

        // Calcular balance neto (lo que pagó - lo que debe)
        for (BalanceDTO.UserBalanceDTO balance : userBalances.values()) {
            BigDecimal netBalance = balance.getTotalPaid().subtract(balance.getTotalOwed());
            balance.setNetBalance(netBalance);
        }

        // Calcular las liquidaciones (quién debe a quién)
        List<BalanceDTO.DebtDTO> settlements = calculateSettlements(userBalances);

        // Crear resultado final
        BalanceDTO result = new BalanceDTO(groupId, group.getName(), totalExpenses);
        result.setUserBalances(new ArrayList<>(userBalances.values()));
        result.setSettlements(settlements);

        return result;
    }

    public List<BalanceDTO.DebtDTO> calculateUserDebts(Long userId) {
        List<ExpenseSplit> userSplits = expenseSplitRepository.findByUserId(userId);
        Map<Long, BigDecimal> debtsByGroup = new HashMap<>();
        Map<Long, String> groupNames = new HashMap<>();

        // Agrupar deudas por grupo
        for (ExpenseSplit split : userSplits) {
            Long groupId = split.getExpense().getGroup().getId();
            String groupName = split.getExpense().getGroup().getName();
            
            debtsByGroup.merge(groupId, split.getAmountOwed(), BigDecimal::add);
            groupNames.put(groupId, groupName);
        }

        // Convertir a DTOs
        return debtsByGroup.entrySet().stream()
                .map(entry -> new BalanceDTO.DebtDTO(
                    userId,
                    "", // Se llenará en el controller si es necesario
                    entry.getKey(),
                    groupNames.get(entry.getKey()),
                    entry.getValue()
                ))
                .collect(Collectors.toList());
    }

    private BalanceDTO createEmptyBalance(Group group) {
        BalanceDTO balance = new BalanceDTO(group.getId(), group.getName(), BigDecimal.ZERO);
        
        List<BalanceDTO.UserBalanceDTO> userBalances = group.getMembers().stream()
                .map(member -> new BalanceDTO.UserBalanceDTO(
                    member.getId(),
                    member.getName(),
                    BigDecimal.ZERO,
                    BigDecimal.ZERO,
                    BigDecimal.ZERO
                ))
                .collect(Collectors.toList());
        
        balance.setUserBalances(userBalances);
        balance.setSettlements(new ArrayList<>());
        
        return balance;
    }

    private List<BalanceDTO.DebtDTO> calculateSettlements(Map<Long, BalanceDTO.UserBalanceDTO> userBalances) {
        List<BalanceDTO.DebtDTO> settlements = new ArrayList<>();

        // Separar deudores (balance negativo) y acreedores (balance positivo)
        List<BalanceDTO.UserBalanceDTO> debtors = userBalances.values().stream()
                .filter(balance -> balance.getNetBalance().compareTo(BigDecimal.ZERO) < 0)
                .sorted(Comparator.comparing(BalanceDTO.UserBalanceDTO::getNetBalance))
                .collect(Collectors.toList());

        List<BalanceDTO.UserBalanceDTO> creditors = userBalances.values().stream()
                .filter(balance -> balance.getNetBalance().compareTo(BigDecimal.ZERO) > 0)
                .sorted(Comparator.comparing(BalanceDTO.UserBalanceDTO::getNetBalance).reversed())
                .collect(Collectors.toList());

        // Crear copias para manipular sin afectar los originales
        Map<Long, BigDecimal> debtorBalances = debtors.stream()
                .collect(Collectors.toMap(
                    BalanceDTO.UserBalanceDTO::getUserId,
                    balance -> balance.getNetBalance().abs()
                ));

        Map<Long, BigDecimal> creditorBalances = creditors.stream()
                .collect(Collectors.toMap(
                    BalanceDTO.UserBalanceDTO::getUserId,
                    BalanceDTO.UserBalanceDTO::getNetBalance
                ));

        // Algoritmo de minimización de transacciones
        for (BalanceDTO.UserBalanceDTO debtor : debtors) {
            BigDecimal debtAmount = debtorBalances.get(debtor.getUserId());
            
            if (debtAmount.compareTo(BigDecimal.ZERO) <= 0) {
                continue;
            }

            for (BalanceDTO.UserBalanceDTO creditor : creditors) {
                BigDecimal creditAmount = creditorBalances.get(creditor.getUserId());
                
                if (creditAmount.compareTo(BigDecimal.ZERO) <= 0) {
                    continue;
                }

                // Calcular el monto a transferir
                BigDecimal transferAmount = debtAmount.min(creditAmount);
                
                if (transferAmount.compareTo(BigDecimal.ZERO) > 0) {
                    // Crear la liquidación
                    settlements.add(new BalanceDTO.DebtDTO(
                        debtor.getUserId(),
                        debtor.getUserName(),
                        creditor.getUserId(),
                        creditor.getUserName(),
                        transferAmount
                    ));

                    // Actualizar balances restantes
                    debtAmount = debtAmount.subtract(transferAmount);
                    creditAmount = creditAmount.subtract(transferAmount);
                    
                    debtorBalances.put(debtor.getUserId(), debtAmount);
                    creditorBalances.put(creditor.getUserId(), creditAmount);

                    if (debtAmount.compareTo(BigDecimal.ZERO) <= 0) {
                        break;
                    }
                }
            }
        }

        return settlements;
    }

    public BigDecimal getUserNetBalanceInGroup(Long userId, Long groupId) {
        // Lo que el usuario pagó en el grupo
        BigDecimal totalPaid = expenseRepository.findByGroupId(groupId).stream()
                .filter(expense -> expense.getPayer().getId().equals(userId))
                .map(Expense::getAmount)
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        // Lo que el usuario debe en el grupo
        BigDecimal totalOwed = expenseSplitRepository.getTotalAmountOwedByUserIdAndGroupId(userId, groupId);
        if (totalOwed == null) {
            totalOwed = BigDecimal.ZERO;
        }

        return totalPaid.subtract(totalOwed);
    }

    public List<BalanceDTO> getUserBalances(Long userId) {
        // Get all groups where user is a member
        List<Group> userGroups = groupRepository.findGroupsByUserId(userId);
        
        return userGroups.stream()
                .map(group -> {
                    BalanceDTO groupBalance = calculateGroupBalance(group.getId());
                    // Find this user's balance in the group
                    Optional<BalanceDTO.UserBalanceDTO> userBalance = groupBalance.getUserBalances().stream()
                            .filter(ub -> ub.getUserId().equals(userId))
                            .findFirst();
                    
                    if (userBalance.isPresent()) {
                        // Create a simplified BalanceDTO with just the user's balance
                        BalanceDTO result = new BalanceDTO();
                        result.setGroupId(group.getId());
                        result.setGroupName(group.getName());
                        result.setBalance(userBalance.get().getNetBalance().doubleValue());
                        return result;
                    } else {
                        // User has no balance in this group
                        BalanceDTO result = new BalanceDTO();
                        result.setGroupId(group.getId());
                        result.setGroupName(group.getName());
                        result.setBalance(0.0);
                        return result;
                    }
                })
                .collect(Collectors.toList());
    }
}