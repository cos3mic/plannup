package planup.backend.repository;

import org.springframework.data.mongodb.repository.MongoRepository;
import planup.backend.model.Role;

import java.util.List;

public interface RoleRepository extends MongoRepository<Role, String> {
    List<Role> findByProjectId(String projectId);
    List<Role> findByOrganizationId(String organizationId);
    List<Role> findByCreatedById(String createdById);
    List<Role> findByIsDefaultTrue();
    List<Role> findByIsActiveTrue();
} 