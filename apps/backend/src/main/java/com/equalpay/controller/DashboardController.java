package com.equalpay.controller;

import com.equalpay.dto.DashboardStatsDTO;
import com.equalpay.dto.RecentActivityDTO;
import com.equalpay.service.DashboardService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/dashboard")
@CrossOrigin(origins = "*")
public class DashboardController {

    @Autowired
    private DashboardService dashboardService;

    @GetMapping("/stats")
    public ResponseEntity<DashboardStatsDTO> getDashboardStats(@RequestParam Long userId) {
        try {
            DashboardStatsDTO stats = dashboardService.getDashboardStats(userId);
            return ResponseEntity.ok(stats);
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }

    @GetMapping("/activity")
    public ResponseEntity<RecentActivityDTO> getRecentActivity(
            @RequestParam Long userId, 
            @RequestParam(defaultValue = "10") int limit) {
        try {
            RecentActivityDTO activity = dashboardService.getRecentActivity(userId, limit);
            return ResponseEntity.ok(activity);
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }
}