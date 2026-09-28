package com.freelance.marketplace.repository;

import com.freelance.marketplace.entity.Project;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface ProjectRepository extends JpaRepository<Project, Integer> {
    List<Project> findByCategory_CategoryId(Integer categoryId);
    List<Project> findByStatus(Project.Status status);
    List<Project> findByTitleContainingIgnoreCase(String keyword);
}
