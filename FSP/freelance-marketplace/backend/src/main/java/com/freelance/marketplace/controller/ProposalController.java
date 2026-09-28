package com.freelance.marketplace.controller;

import com.freelance.marketplace.entity.Proposal;
import com.freelance.marketplace.repository.ProposalRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/proposals")
@RequiredArgsConstructor
public class ProposalController {

    private final ProposalRepository proposalRepository;

    // GET /api/proposals/project/{projectId} -> all proposals submitted for a project
    @GetMapping("/project/{projectId}")
    public List<Proposal> getProposalsByProject(@PathVariable Integer projectId) {
        return proposalRepository.findByProject_ProjectId(projectId);
    }

    // GET /api/proposals/freelancer/{freelancerId} -> all proposals a freelancer submitted
    @GetMapping("/freelancer/{freelancerId}")
    public List<Proposal> getProposalsByFreelancer(@PathVariable Integer freelancerId) {
        return proposalRepository.findByFreelancer_FreelancerId(freelancerId);
    }

    // POST /api/proposals -> freelancer submits a proposal for a project
    @PostMapping
    public Proposal createProposal(@RequestBody Proposal proposal) {
        return proposalRepository.save(proposal);
    }

    // PUT /api/proposals/{id}/status -> client accepts or rejects a proposal
    // Body example: { "status": "accepted" }  or  { "status": "rejected" }
    @PutMapping("/{id}/status")
    public ResponseEntity<Proposal> updateProposalStatus(@PathVariable Integer id, @RequestBody Map<String, String> body) {
        return proposalRepository.findById(id).map(proposal -> {
            String newStatus = body.get("status");
            proposal.setStatus(Proposal.Status.valueOf(newStatus));
            return ResponseEntity.ok(proposalRepository.save(proposal));
        }).orElse(ResponseEntity.notFound().build());
    }
}
