package planup.backend.repository;

import org.springframework.data.mongodb.repository.MongoRepository;
import planup.backend.model.Project;

import java.util.List;

public interface ProjectRepository extends MongoRepository<Project, String> {
    List<Project> findByOrganizationId(String organizationId);
    List<Project> findByMemberIdsContaining(String userId);
    List<Project> findByLeadId(String leadId);
    List<Project> findByIsActiveTrue();
    List<Project> findByKey(String key);
} 