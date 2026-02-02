package com.project.back_end.mvc;

import com.project.back_end.services.TokenService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.servlet.mvc.support.RedirectAttributes;
import java.util.Map;

@Controller
public class DashboardController {

    // 2. Autowire the shared service for token validation
    @Autowired
    private TokenService tokenService;

    // 3. Admin dashboard endpoint
    @GetMapping("/adminDashboard/{token}")
    public String adminDashboard(@PathVariable("token") String token) {
        Map<String, Object> validation = tokenService.validateToken(token, "admin");

        // If the map is empty, token is valid
        if (validation.isEmpty()) {
            return "admin/adminDashboard"; // Thymeleaf template path
        } else {
            return "redirect:/"; // Redirect to login/home page if token invalid
        }
    }

    // 4. Doctor dashboard endpoint
    @GetMapping("/doctorDashboard/{token}")
    public String doctorDashboard(@PathVariable("token") String token) {
        Map<String, Object> validation = tokenService.validateToken(token, "doctor");

        // If the map is empty, token is valid
        if (validation.isEmpty()) {
            return "doctor/doctorDashboard"; // Thymeleaf template path
        } else {
            return "redirect:/"; // Redirect to login/home page if token invalid
        }
    }
}
