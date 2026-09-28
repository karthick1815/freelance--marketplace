package com.freelance.marketplace.entity;

import jakarta.persistence.*;
import lombok.Data;
import java.math.BigDecimal;
import java.time.LocalDate;

@Entity
@Table(name = "client_profiles")
@Data
public class ClientProfile {

    @Id
    @Column(name = "client_id")
    private Integer clientId;

    @OneToOne
    @MapsId
    @JoinColumn(name = "client_id")
    private User user;

    @Column(name = "company_name", nullable = false)
    private String companyName;

    @Column(name = "industry", nullable = false)
    private String industry;

    @Column(name = "total_spent", nullable = false)
    private BigDecimal totalSpent;

    @Column(name = "member_since", nullable = false)
    private LocalDate memberSince;
}
