package planup.backend.repository;

import org.springframework.data.mongodb.repository.MongoRepository;
import planup.backend.model.Epic;

import java.util.List;
import java.util.Optional;

public interface EpicRepository extends MongoRepository<Epic, String> {
    List<Epic> findByProjectId(String projectId);
    List<Epic> findByAssigneeId(String assigneeId);
    List<Epic> findByStatus(String status);
    List<Epic> findByIsActiveTrue();
    Optional<Epic> findByKey(String key);
    List<Epic> findByLabelsContaining(String label);
} 