package com.freelance.marketplace.entity;

import jakarta.persistence.*;
import lombok.Data;
import java.math.BigDecimal;
import java.time.LocalDate;

@Entity
@Table(name = "projects")
@Data
public class Project {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "project_id")
    private Integer projectId;

    @ManyToOne
    @JoinColumn(name = "client_id", nullable = false)
    private ClientProfile client;

    @Column(name = "title", nullable = false)
    private String title;

    @Column(name = "description")
    private String description;

    @ManyToOne
    @JoinColumn(name = "category_id", nullable = false)
    private Category category;

    @Column(name = "budget_min", nullable = false)
    private BigDecimal budgetMin;

    @Column(name = "budget_max", nullable = false)
    private BigDecimal budgetMax;

    @Enumerated(EnumType.STRING)
    @Column(name = "status", nullable = false)
    private Status status;

    @Column(name = "posted_date", nullable = false)
    private LocalDate postedDate;

    @Column(name = "deadline", nullable = false)
    private LocalDate deadline;

    public enum Status {
        open, in_progress, completed, cancelled
    }
}
