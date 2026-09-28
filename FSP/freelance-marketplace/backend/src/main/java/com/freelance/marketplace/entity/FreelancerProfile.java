package com.freelance.marketplace.entity;

import jakarta.persistence.*;
import lombok.Data;
import java.math.BigDecimal;

@Entity
@Table(name = "freelancer_profiles")
@Data
public class FreelancerProfile {

    @Id
    @Column(name = "freelancer_id")
    private Integer freelancerId;

    @OneToOne
    @MapsId
    @JoinColumn(name = "freelancer_id")
    private User user;

    @Column(name = "professional_title", nullable = false)
    private String professionalTitle;

    @Column(name = "hourly_rate", nullable = false)
    private BigDecimal hourlyRate;

    @Enumerated(EnumType.STRING)
    @Column(name = "availability_status", nullable = false)
    private AvailabilityStatus availabilityStatus;

    @Column(name = "rating_avg", nullable = false)
    private BigDecimal ratingAvg;

    @Column(name = "total_earned", nullable = false)
    private BigDecimal totalEarned;

    @Column(name = "years_experience", nullable = false)
    private Integer yearsExperience;

    public enum AvailabilityStatus {
        available, busy, unavailable
    }
}
