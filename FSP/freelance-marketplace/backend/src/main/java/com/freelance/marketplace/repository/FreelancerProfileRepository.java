package com.freelance.marketplace.repository;

import com.freelance.marketplace.entity.FreelancerProfile;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface FreelancerProfileRepository extends JpaRepository<FreelancerProfile, Integer> {
    List<FreelancerProfile> findAllByOrderByRatingAvgDesc();
}
