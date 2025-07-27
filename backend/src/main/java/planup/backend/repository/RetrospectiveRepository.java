package planup.backend.repository;

import org.springframework.data.mongodb.repository.MongoRepository;
import planup.backend.model.Retrospective;

import java.util.List;

public interface RetrospectiveRepository extends MongoRepository<Retrospective, String> {
    List<Retrospective> findByOrganizationId(String organizationId);
    List<Retrospective> findByProjectId(String projectId);
    List<Retrospective> findBySprintId(String sprintId);
    List<Retrospective> findByAuthorId(String authorId);
    List<Retrospective> findByType(String type);
    List<Retrospective> findByResolvedFalse();
    List<Retrospective> findByIsActiveTrue();
} 