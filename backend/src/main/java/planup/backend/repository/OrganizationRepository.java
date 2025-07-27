package planup.backend.repository;

import org.springframework.data.mongodb.repository.MongoRepository;
import planup.backend.model.Organization;

import java.util.List;

public interface OrganizationRepository extends MongoRepository<Organization, String> {
    List<Organization> findByMemberIdsContaining(String userId);
    List<Organization> findByOwnerId(String ownerId);
    List<Organization> findByIsActiveTrue();
} 