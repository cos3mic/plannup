package planup.backend.repository;

import org.springframework.data.mongodb.repository.MongoRepository;
import planup.backend.model.Template;

import java.util.List;

public interface TemplateRepository extends MongoRepository<Template, String> {
    List<Template> findByProjectId(String projectId);
    List<Template> findByOrganizationId(String organizationId);
    List<Template> findByCreatedById(String createdById);
    List<Template> findByIsDefaultTrue();
    List<Template> findByIsActiveTrue();
} 