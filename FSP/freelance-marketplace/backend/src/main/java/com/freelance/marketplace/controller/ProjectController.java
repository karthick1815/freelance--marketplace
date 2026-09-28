package com.freelance.marketplace.controller;

import com.freelance.marketplace.entity.ClientProfile;
import com.freelance.marketplace.entity.Project;
import com.freelance.marketplace.repository.ClientProfileRepository;
import com.freelance.marketplace.repository.ProjectRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/projects")
@RequiredArgsConstructor
public class ProjectController {

    private final ProjectRepository projectRepository;
    private final ClientProfileRepository clientProfileRepository;

    // GET /api/projects -> all projects (public, no login required)
    @GetMapping
    public List<Project> getAllProjects() {
        return projectRepository.findAll();
    }

    // GET /api/projects/{id}
    @GetMapping("/{id}")
    public ResponseEntity<Project> getProjectById(@PathVariable Integer id) {
        return projectRepository.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/category/{categoryId}")
    public List<Project> getProjectsByCategory(@PathVariable Integer categoryId) {
        return projectRepository.findByCategory_CategoryId(categoryId);
    }

    @GetMapping("/status/{status}")
    public List<Project> getProjectsByStatus(@PathVariable Project.Status status) {
        return projectRepository.findByStatus(status);
    }

    @GetMapping("/search")
    public List<Project> searchProjects(@RequestParam String keyword) {
        return projectRepository.findByTitleContainingIgnoreCase(keyword);
    }

    // POST /api/projects -> requires a logged-in CLIENT (enforced by SecurityConfig).
    // The client is taken from the authenticated token, NOT from the request body,
    // so nobody can post a project pretending to be a different client.
    @PostMapping
    public ResponseEntity<?> createProject(@RequestBody Project project, Authentication authentication) {
        Integer clientId = Integer.parseInt(authentication.getName());

        ClientProfile client = clientProfileRepository.findById(clientId).orElse(null);

        if (client == null) {
            return ResponseEntity.status(404)
                    .body(Map.of("error", "Client profile not found for this account."));
        }

        project.setClient(client);
        project.setPostedDate(LocalDate.now());

        Project savedProject = projectRepository.save(project);

        return ResponseEntity.ok(savedProject);
    }

    // PUT /api/projects/{id} -> only the CLIENT who owns this project may edit it
    @PutMapping("/{id}")
    public ResponseEntity<?> updateProject(@PathVariable Integer id, @RequestBody Project updated, Authentication authentication) {
        Integer requesterId = Integer.parseInt(authentication.getName());

        return projectRepository.findById(id).map(existing -> {
            if (!existing.getClient().getClientId().equals(requesterId)) {
                return ResponseEntity.status(403).body(Map.of("error", "You can only edit your own projects."));
            }
            existing.setTitle(updated.getTitle());
            existing.setDescription(updated.getDescription());
            existing.setBudgetMin(updated.getBudgetMin());
            existing.setBudgetMax(updated.getBudgetMax());
            existing.setStatus(updated.getStatus());
            existing.setDeadline(updated.getDeadline());
            return ResponseEntity.ok(projectRepository.save(existing));
        }).orElse(ResponseEntity.notFound().build());
    }

    // DELETE /api/projects/{id} -> only the CLIENT who owns this project may delete it
    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteProject(@PathVariable Integer id, Authentication authentication) {
        Integer requesterId = Integer.parseInt(authentication.getName());

        return projectRepository.findById(id).map(existing -> {
            if (!existing.getClient().getClientId().equals(requesterId)) {
                return ResponseEntity.status(403).body(Map.of("error", "You can only delete your own projects."));
            }
            projectRepository.deleteById(id);
            return ResponseEntity.noContent().build();
        }).orElse(ResponseEntity.notFound().build());
    }
}
