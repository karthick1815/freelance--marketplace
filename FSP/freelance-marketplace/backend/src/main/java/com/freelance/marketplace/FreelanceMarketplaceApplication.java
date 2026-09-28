package com.freelance.marketplace;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication
public class FreelanceMarketplaceApplication {
    public static void main(String[] args) {
        SpringApplication.run(FreelanceMarketplaceApplication.class, args);
        System.out.println("Freelance Marketplace API running at http://localhost:8080");
    }
}


