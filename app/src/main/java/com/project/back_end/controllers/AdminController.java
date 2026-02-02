package com.project.back_end.controllers;

import com.project.back_end.models.Admin;
import com.project.back_end.services.Service_;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("${api.path}admin")
public class AdminController {

    private final Service_ service;

    // Constructor injection of Service
    public AdminController(Service_ service) {
        this.service = service;
    }

    // Admin login endpoint
    @PostMapping("/login")
    public ResponseEntity<Map<String, String>> adminLogin(@RequestBody Admin admin) {
        // Delegate login validation to the service
        return service.validateAdmin(admin);
    }
}
