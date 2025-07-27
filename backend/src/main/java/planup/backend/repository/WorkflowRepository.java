package planup.backend.repository;

import org.springframework.data.mongodb.repository.MongoRepository;
import planup.backend.model.Workflow;

import java.util.List;

public interface WorkflowRepository extends MongoRepository<Workflow, String> {
    List<Workflow> findByProjectId(String projectId);
    List<Workflow> findByOrganizationId(String organizationId);
    List<Workflow> findByIsDefaultTrue();
    List<Workflow> findByIsActiveTrue();
} 