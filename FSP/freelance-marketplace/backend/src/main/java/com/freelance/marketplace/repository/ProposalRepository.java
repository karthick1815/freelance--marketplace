package com.freelance.marketplace.repository;

import com.freelance.marketplace.entity.Proposal;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface ProposalRepository extends JpaRepository<Proposal, Integer> {
    List<Proposal> findByProject_ProjectId(Integer projectId);
    List<Proposal> findByFreelancer_FreelancerId(Integer freelancerId);
}
