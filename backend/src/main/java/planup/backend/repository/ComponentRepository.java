package planup.backend.repository;

import org.springframework.data.mongodb.repository.MongoRepository;
import planup.backend.model.Component;

import java.util.List;

public interface ComponentRepository extends MongoRepository<Component, String> {
    List<Component> findByProjectId(String projectId);
    List<Component> findByOrganizationId(String organizationId);
    List<Component> findByLeadId(String leadId);
    List<Component> findByIsActiveTrue();
} 