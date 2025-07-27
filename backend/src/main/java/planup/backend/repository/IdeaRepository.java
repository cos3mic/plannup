package planup.backend.repository;

import org.springframework.data.mongodb.repository.MongoRepository;
import planup.backend.model.Idea;

import java.util.List;

public interface IdeaRepository extends MongoRepository<Idea, String> {
    List<Idea> findByOrganizationId(String organizationId);
    List<Idea> findByProjectId(String projectId);
    List<Idea> findByAuthorId(String authorId);
    List<Idea> findByStatus(String status);
    List<Idea> findByIsActiveTrue();
} 