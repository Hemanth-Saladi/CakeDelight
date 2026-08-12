package com.cakedelight.notification.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Map;

@RestController
@RequestMapping("/api/notifications")
public class NotificationController {

    @GetMapping("/status")
    public ResponseEntity<Map<String, String>> getStatus() {

        return ResponseEntity.ok(
                Map.of(
                        "service", "notification-service",
                        "status", "active"
                )
        );
    }
}