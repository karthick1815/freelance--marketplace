package com.freelance.marketplace.controller;

import com.freelance.marketplace.entity.FreelancerProfile;
import com.freelance.marketplace.repository.FreelancerProfileRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/freelancers")
@RequiredArgsConstructor
public class FreelancerController {

    private final FreelancerProfileRepository freelancerProfileRepository;

    // GET /api/freelancers -> all freelancers, best rated first
    @GetMapping
    public List<FreelancerProfile> getAllFreelancers() {
        return freelancerProfileRepository.findAllByOrderByRatingAvgDesc();
    }

    // GET /api/freelancers/{id}
    @GetMapping("/{id}")
    public ResponseEntity<FreelancerProfile> getFreelancerById(@PathVariable Integer id) {
        return freelancerProfileRepository.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    // Registration now lives in AuthController (POST /api/auth/register/freelancer)
    // since it needs to also set a password and be consistent with client registration/login.
}
