package com.api.nature_harvest_backend.controllers;

import lombok.AllArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.net.InetAddress;

@RestController
@RequestMapping("${api.prefix}/health-check")
@AllArgsConstructor
public class HealthCheckController {
    @GetMapping("/health")
    public ResponseEntity<?> healthCheck() {
        // Perform additional health checks here
        try {
            // Get the computer name
            String computerName = InetAddress.getLocalHost().getHostName();
            return ResponseEntity.ok("ok, Computer Name: " + computerName);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("failed");
        }
    }
}
