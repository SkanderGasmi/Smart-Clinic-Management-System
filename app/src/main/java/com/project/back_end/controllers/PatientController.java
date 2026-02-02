package com.project.back_end.controllers;

import com.project.back_end.models.Patient;
import com.project.back_end.models.Login;
import com.project.back_end.services.PatientService;
import com.project.back_end.services.Service_;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/patient")
public class PatientController {

    private final PatientService patientService;
    private final Service service;

    // Constructor injection
    public PatientController(PatientService patientService, Service service) {
        this.patientService = patientService;
        this.service = service;
    }

    // Get patient details using token
    @GetMapping("/{token}")
    public ResponseEntity<?> getPatient(@PathVariable String token) {
        if (!service.validateToken(token, "patient")) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(Map.of("error", "Invalid or expired token"));
        }
        Patient patient = patientService.getPatientDetails(token);
        return ResponseEntity.ok(Map.of("patient", patient));
    }

    // Create new patient (signup)
    @PostMapping()
    public ResponseEntity<?> createPatient(@RequestBody Patient patient) {
        boolean valid = service.validatePatient(patient);
        if (!valid) {
            return ResponseEntity.status(HttpStatus.CONFLICT)
                    .body(Map.of("error", "Patient with email id or phone no already exist"));
        }

        boolean created = patientService.createPatient(patient);
        if (created) {
            return ResponseEntity.status(HttpStatus.CREATED)
                    .body(Map.of("message", "Signup successful"));
        }
        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(Map.of("error", "Internal server error"));
    }

    // Patient login
    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody Login login) {
        return service.validatePatientLogin(login);
    }

    // Get all appointments for a patient
    @GetMapping("/{id}/{token}")
    public ResponseEntity<?> getPatientAppointment(@PathVariable Long id,
            @PathVariable String token) {
        if (!service.validateToken(token, "patient")) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(Map.of("error", "Invalid or expired token"));
        }
        List<?> appointments = patientService.getPatientAppointment(id);
        return ResponseEntity.ok(Map.of("appointments", appointments));
    }

    // Filter patient appointments based on condition and doctor name
    @GetMapping("/filter/{condition}/{name}/{token}")
    public ResponseEntity<?> filterPatientAppointment(@PathVariable String condition,
            @PathVariable String name,
            @PathVariable String token) {
        if (!service.validateToken(token, "patient")) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(Map.of("error", "Invalid or expired token"));
        }
        ResponseEntity<Map<String, Object>> filteredAppointments = service.filterPatient(condition, name, token);
        return filteredAppointments;
    }
}
