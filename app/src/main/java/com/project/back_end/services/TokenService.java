package com.project.back_end.services;

import java.util.Date;

import javax.crypto.SecretKey;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import com.project.back_end.models.Doctor;
import com.project.back_end.repo.AdminRepository;
import com.project.back_end.repo.DoctorRepository;
import com.project.back_end.repo.PatientRepository;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.JwtException;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;
import jakarta.annotation.PostConstruct;

@Component
public class TokenService {

    private final AdminRepository adminRepository;
    private final DoctorRepository doctorRepository;
    private final PatientRepository patientRepository;

    @Value("${jwt.secret}")
    private String jwtSecret;

    private SecretKey signingKey;

    public TokenService(AdminRepository adminRepository,
            DoctorRepository doctorRepository,
            PatientRepository patientRepository) {
        this.adminRepository = adminRepository;
        this.doctorRepository = doctorRepository;
        this.patientRepository = patientRepository;
    }

    @PostConstruct
    private void init() {
        this.signingKey = Keys.hmacShaKeyFor(jwtSecret.getBytes());
    }

    // Generate JWT for Doctor object
    public String generateToken(Doctor doctor) {
        return generateToken(doctor.getEmail());
    }

    // Generate JWT for identifier (Admin username or Patient email)
    public String generateToken(String identifier) {
        Date now = new Date();
        Date expiryDate = new Date(now.getTime() + 7L * 24 * 60 * 60 * 1000); // 7 days

        return Jwts.builder()
                .subject(identifier) // modern builder-style
                .issuedAt(now)
                .expiration(expiryDate)
                .signWith(signingKey)
                .compact();
    }

    
    // Extract identifier (subject) from JWT
    public String extractIdentifier(String token) {
        try {
            Claims claims = Jwts.parser()
                    .verifyWith(signingKey)
                    .build()
                    .parseSignedClaims(token)
                    .getPayload();
            return claims.getSubject();
        } 

        catch (io.jsonwebtoken.ExpiredJwtException | 
             io.jsonwebtoken.MalformedJwtException | 
             io.jsonwebtoken.security.SignatureException |
             SecurityException e) {
        // token is invalid, expired, or signature is incorrect
        return null;
        } 
        catch (JwtException e) {
            // general JWT parsing exception
            return null;
        }
    }

 
    // Validate token for a specific role
    public boolean validateToken(String token, String role) {
        try {
            String identifier = extractIdentifier(token);
            if (identifier == null)
                return false;

            switch (role.toLowerCase()) {
                case "admin":
                    return adminRepository.existsByUsername(identifier);
                case "doctor":
                    return doctorRepository.existsByEmail(identifier);
                case "patient":
                    return patientRepository.existsByEmail(identifier);
                default:
                    return false;
            }
        } catch (Exception e) {
            return false;
        }
    }

    public Long extractDoctorId(String token) {
        String identifier = extractIdentifier(token);
        Doctor doctor = doctorRepository.findByEmail(identifier);
        return doctor != null ? doctor.getId() : null;
    }
}
