package com.freelance.marketplace.entity;

import jakarta.persistence.*;
import lombok.Data;
import java.math.BigDecimal;
import java.time.LocalDate;

@Entity
@Table(name = "proposals")
@Data
public class Proposal {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "proposal_id")
    private Integer proposalId;

    @ManyToOne
    @JoinColumn(name = "project_id", nullable = false)
    private Project project;

    @ManyToOne
    @JoinColumn(name = "freelancer_id", nullable = false)
    private FreelancerProfile freelancer;

    @Column(name = "bid_amount", nullable = false)
    private BigDecimal bidAmount;

    @Column(name = "delivery_days", nullable = false)
    private Integer deliveryDays;

    @Column(name = "cover_letter")
    private String coverLetter;

    @Enumerated(EnumType.STRING)
    @Column(name = "status", nullable = false)
    private Status status;

    @Column(name = "submitted_date", nullable = false)
    private LocalDate submittedDate;

    public enum Status {
        pending, accepted, rejected
    }
}
