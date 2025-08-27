package com.equalpay.controller;

import com.equalpay.dto.SettlementDTO;
import com.equalpay.service.SettlementService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/settlements")
@CrossOrigin(origins = "*")
public class SettlementController {

    @Autowired
    private SettlementService settlementService;

    @GetMapping("/group/{groupId}")
    public ResponseEntity<List<SettlementDTO>> getSettlementsByGroupId(@PathVariable Long groupId) {
        List<SettlementDTO> settlements = settlementService.getSettlementsByGroupId(groupId);
        return ResponseEntity.ok(settlements);
    }

    @GetMapping("/user/{userId}")
    public ResponseEntity<List<SettlementDTO>> getSettlementsByUserId(@PathVariable Long userId) {
        List<SettlementDTO> settlements = settlementService.getSettlementsByUserId(userId);
        return ResponseEntity.ok(settlements);
    }

    @GetMapping("/{id}")
    public ResponseEntity<SettlementDTO> getSettlementById(@PathVariable Long id) {
        Optional<SettlementDTO> settlement = settlementService.getSettlementById(id);
        return settlement.map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    public ResponseEntity<SettlementDTO> recordSettlement(@Valid @RequestBody SettlementDTO settlementDTO) {
        try {
            SettlementDTO recorded = settlementService.recordSettlement(settlementDTO);
            return ResponseEntity.status(HttpStatus.CREATED).body(recorded);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().build();
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteSettlement(@PathVariable Long id) {
        try {
            settlementService.deleteSettlement(id);
            return ResponseEntity.noContent().build();
        } catch (IllegalArgumentException e) {
            return ResponseEntity.notFound().build();
        }
    }

    // Endpoints de estadísticas
    @GetMapping("/stats/group/{groupId}/total")
    public ResponseEntity<BigDecimal> getTotalSettledByGroup(@PathVariable Long groupId) {
        BigDecimal total = settlementService.getTotalSettledByGroup(groupId);
        return ResponseEntity.ok(total);
    }

    @GetMapping("/stats/user/{userId}/paid")
    public ResponseEntity<BigDecimal> getTotalPaidByUser(@PathVariable Long userId) {
        BigDecimal total = settlementService.getTotalPaidByUser(userId);
        return ResponseEntity.ok(total);
    }

    @GetMapping("/stats/user/{userId}/received")
    public ResponseEntity<BigDecimal> getTotalReceivedByUser(@PathVariable Long userId) {
        BigDecimal total = settlementService.getTotalReceivedByUser(userId);
        return ResponseEntity.ok(total);
    }
}