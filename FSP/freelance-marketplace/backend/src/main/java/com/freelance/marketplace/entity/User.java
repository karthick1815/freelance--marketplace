package com.freelance.marketplace.entity;

import com.fasterxml.jackson.annotation.JsonProperty;
import jakarta.persistence.*;
import lombok.Data;
import java.time.LocalDate;

@Entity
@Table(name = "users")
@Data
public class User {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "user_id")
    private Integer userId;

    @Column(name = "full_name", nullable = false)
    private String fullName;

    @Column(name = "email", nullable = false, unique = true)
    private String email;

    // WRITE_ONLY: the frontend can SEND a password (registration/login),
    // but it will NEVER appear in any JSON response — protects the BCrypt hash
    // even though User gets nested inside every FreelancerProfile/ClientProfile response.
    @JsonProperty(access = JsonProperty.Access.WRITE_ONLY)
    @Column(name = "password")
    private String password; // stored as a BCrypt hash, never plain text

    @Enumerated(EnumType.STRING)
    @Column(name = "role", nullable = false)
    private Role role;

    @Column(name = "country", nullable = false)
    private String country;

    @Column(name = "joined_date", nullable = false)
    private LocalDate joinedDate;

    @Column(name = "is_active", nullable = false)
    private Boolean isActive;

    public enum Role {
        client, freelancer
    }
}
