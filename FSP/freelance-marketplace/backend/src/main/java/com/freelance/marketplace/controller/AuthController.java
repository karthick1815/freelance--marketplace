package com.freelance.marketplace.controller;

import com.freelance.marketplace.entity.*;
import com.freelance.marketplace.security.JwtUtil;
import com.freelance.marketplace.repository.*;
import lombok.Data;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.Map;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthController {

    private final UserRepository userRepository;
    private final ClientProfileRepository clientProfileRepository;
    private final FreelancerProfileRepository freelancerProfileRepository;
    private final JwtUtil jwtUtil;
    private final BCryptPasswordEncoder passwordEncoder = new BCryptPasswordEncoder();

    // ---------- Register as a CLIENT ----------
    // Creates a "users" row (role=client) + a "client_profiles" row, in one transaction.
    @PostMapping("/register/client")
    @Transactional
    public ResponseEntity<?> registerClient(@RequestBody ClientRegisterRequest req) {
        if (userRepository.findByEmail(req.getEmail()).isPresent()) {
            return ResponseEntity.badRequest().body(Map.of("error", "That email is already registered."));
        }

        User user = new User();
        user.setFullName(req.getFullName());
        user.setEmail(req.getEmail());
        user.setPassword(passwordEncoder.encode(req.getPassword()));
        user.setRole(User.Role.client);
        user.setCountry(req.getCountry());
        user.setJoinedDate(LocalDate.now());
        user.setIsActive(true);
        User savedUser = userRepository.save(user);

        ClientProfile profile = new ClientProfile();
        profile.setUser(savedUser); // @MapsId -> client_id reuses the new user_id
        profile.setCompanyName(req.getCompanyName());
        profile.setIndustry(req.getIndustry());
        profile.setTotalSpent(BigDecimal.ZERO);
        profile.setMemberSince(LocalDate.now());
        clientProfileRepository.save(profile);

        return ResponseEntity.ok(Map.of(
                "userId", savedUser.getUserId(),
                "fullName", savedUser.getFullName(),
                "email", savedUser.getEmail(),
                "role", "client"
        ));
    }

    // ---------- Register as a FREELANCER ----------
    // Creates a "users" row (role=freelancer) + a "freelancer_profiles" row, in one transaction.
    @PostMapping("/register/freelancer")
    @Transactional
    public ResponseEntity<?> registerFreelancer(@RequestBody FreelancerRegisterRequest req) {
        if (userRepository.findByEmail(req.getEmail()).isPresent()) {
            return ResponseEntity.badRequest().body(Map.of("error", "That email is already registered."));
        }

        User user = new User();
        user.setFullName(req.getFullName());
        user.setEmail(req.getEmail());
        user.setPassword(passwordEncoder.encode(req.getPassword()));
        user.setRole(User.Role.freelancer);
        user.setCountry(req.getCountry());
        user.setJoinedDate(LocalDate.now());
        user.setIsActive(true);
        User savedUser = userRepository.save(user);

        FreelancerProfile profile = new FreelancerProfile();
        profile.setUser(savedUser); // @MapsId -> freelancer_id reuses the new user_id
        profile.setProfessionalTitle(req.getProfessionalTitle());
        profile.setHourlyRate(req.getHourlyRate());
        profile.setAvailabilityStatus(
                req.getAvailabilityStatus() != null
                        ? FreelancerProfile.AvailabilityStatus.valueOf(req.getAvailabilityStatus())
                        : FreelancerProfile.AvailabilityStatus.available
        );
        profile.setRatingAvg(BigDecimal.ZERO);
        profile.setTotalEarned(BigDecimal.ZERO);
        profile.setYearsExperience(req.getYearsExperience() != null ? req.getYearsExperience() : 0);
        freelancerProfileRepository.save(profile);

        return ResponseEntity.ok(Map.of(
                "userId", savedUser.getUserId(),
                "fullName", savedUser.getFullName(),
                "email", savedUser.getEmail(),
                "role", "freelancer"
        ));
    }

 // ---------- Login (works for either role) ----------
    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody LoginRequest req) {
        return userRepository.findByEmail(req.getEmail())
                .filter(u -> u.getPassword() != null
                        && passwordEncoder.matches(req.getPassword(), u.getPassword()))
                .map(u -> {
                    String token = jwtUtil.generateToken(
                            u.getUserId(),
                            u.getRole().name()
                    );

                    return ResponseEntity.ok(Map.of(
                            "token", token,
                            "userId", u.getUserId(),
                            "fullName", u.getFullName(),
                            "email", u.getEmail(),
                            "role", u.getRole().name()
                    ));
                })
                .orElse(
                        ResponseEntity.status(401)
                                .body(Map.of("error", "Invalid email or password."))
                );
    }

    // ---- Request DTOs ----

    @Data
    public static class ClientRegisterRequest {
        private String fullName;
        private String email;
        private String password;
        private String country;
        private String companyName;
        private String industry;
    }

    @Data
    public static class FreelancerRegisterRequest {
        private String fullName;
        private String email;
        private String password;
        private String country;
        private String professionalTitle;
        private BigDecimal hourlyRate;
        private Integer yearsExperience;
        private String availabilityStatus;
    }

    @Data
    public static class LoginRequest {
        private String email;
        private String password;
    }
}
