package planup.backend.controller;

import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import planup.backend.model.Sprint;
import planup.backend.service.SprintService;
import jakarta.validation.Valid;
import org.springframework.validation.annotation.Validated;
import planup.backend.model.SprintDTO;

import java.util.List;

@RestController
@RequestMapping("/api/sprints")
@RequiredArgsConstructor
@Validated
public class SprintController {
    private final SprintService sprintService;

    @GetMapping
    public List<Sprint> getAllSprints() {
        return sprintService.getAllSprints();
    }

    @GetMapping("/{id}")
    public ResponseEntity<Sprint> getSprintById(@PathVariable String id) {
        return sprintService.getSprintById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    public Sprint createSprint(@Valid @RequestBody SprintDTO sprintDTO) {
        Sprint sprint = Sprint.builder()
                .name(sprintDTO.getName())
                .startDate(sprintDTO.getStartDate())
                .endDate(sprintDTO.getEndDate())
                .status(sprintDTO.getStatus())
                .goal(sprintDTO.getGoal())
                .issues(sprintDTO.getIssues())
                .velocity(sprintDTO.getVelocity())
                .capacity(sprintDTO.getCapacity())
                .teamMembers(sprintDTO.getTeamMembers())
                .build();
        return sprintService.createSprint(sprint);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Sprint> updateSprint(@PathVariable String id, @Valid @RequestBody SprintDTO sprintDTO) {
        if (!sprintService.getSprintById(id).isPresent()) {
            return ResponseEntity.notFound().build();
        }
        Sprint sprint = Sprint.builder()
                .id(id)
                .name(sprintDTO.getName())
                .startDate(sprintDTO.getStartDate())
                .endDate(sprintDTO.getEndDate())
                .status(sprintDTO.getStatus())
                .goal(sprintDTO.getGoal())
                .issues(sprintDTO.getIssues())
                .velocity(sprintDTO.getVelocity())
                .capacity(sprintDTO.getCapacity())
                .teamMembers(sprintDTO.getTeamMembers())
                .build();
        return ResponseEntity.ok(sprintService.updateSprint(id, sprint));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteSprint(@PathVariable String id) {
        if (!sprintService.getSprintById(id).isPresent()) {
            return ResponseEntity.notFound().build();
        }
        sprintService.deleteSprint(id);
        return ResponseEntity.noContent().build();
    }
} 