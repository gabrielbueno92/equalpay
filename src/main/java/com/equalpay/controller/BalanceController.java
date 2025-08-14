package com.equalpay.controller;

import com.equalpay.dto.BalanceDTO;
import com.equalpay.service.BalanceService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.util.List;

@RestController
@RequestMapping("/api/balances")
@CrossOrigin(origins = "*")
public class BalanceController {

    @Autowired
    private BalanceService balanceService;

    @GetMapping("/group/{groupId}")
    public ResponseEntity<BalanceDTO> getGroupBalance(@PathVariable Long groupId) {
        try {
            BalanceDTO balance = balanceService.calculateGroupBalance(groupId);
            return ResponseEntity.ok(balance);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.notFound().build();
        }
    }

    @GetMapping("/user/{userId}/debts")
    public ResponseEntity<List<BalanceDTO.DebtDTO>> getUserDebts(@PathVariable Long userId) {
        List<BalanceDTO.DebtDTO> debts = balanceService.calculateUserDebts(userId);
        return ResponseEntity.ok(debts);
    }

    @GetMapping("/user/{userId}/group/{groupId}/net-balance")
    public ResponseEntity<BigDecimal> getUserNetBalanceInGroup(@PathVariable Long userId, 
                                                              @PathVariable Long groupId) {
        BigDecimal netBalance = balanceService.getUserNetBalanceInGroup(userId, groupId);
        return ResponseEntity.ok(netBalance);
    }
}