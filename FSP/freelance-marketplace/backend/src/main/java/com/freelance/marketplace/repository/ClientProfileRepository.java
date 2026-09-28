package com.freelance.marketplace.repository;

import com.freelance.marketplace.entity.ClientProfile;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ClientProfileRepository extends JpaRepository<ClientProfile, Integer> {
}
