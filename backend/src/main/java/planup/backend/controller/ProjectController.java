package planup.backend.controller;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import planup.backend.dto.ProjectRequest;
import planup.backend.dto.ProjectResponse;
import planup.backend.mapper.ProjectMapper;
import planup.backend.model.Project;
import planup.backend.service.ProjectService;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/projects")
@RequiredArgsConstructor
public class ProjectController {
    private final ProjectService service;

    @GetMapping
    public List<ProjectResponse> list() {
        return service.findAll().stream()
                .map(ProjectMapper::toResponse)
                .collect(Collectors.toList());
    }

    @PostMapping
    public ProjectResponse create(@Valid @RequestBody ProjectRequest req) {
        Project saved = service.create(ProjectMapper.toEntity(req));
        return ProjectMapper.toResponse(saved);
    }

    @GetMapping("/{id}")
    public ResponseEntity<ProjectResponse> get(@PathVariable String id) {
        return service.findById(id)
                .map(ProjectMapper::toResponse)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PutMapping("/{id}")
    public ResponseEntity<ProjectResponse> update(@PathVariable String id,@Valid @RequestBody ProjectRequest req){
        return service.findById(id)
                .map(p->{
                    Project updated=service.update(id,ProjectMapper.toEntity(req));
                    return ResponseEntity.ok(ProjectMapper.toResponse(updated));
                }).orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable String id){
        if(service.delete(id)) return ResponseEntity.ok().build();
        return ResponseEntity.notFound().build();
    }

    // TODO components, roles sub routes
}
