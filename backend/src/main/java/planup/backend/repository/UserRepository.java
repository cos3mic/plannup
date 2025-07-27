package planup.backend.repository;

import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.mongodb.repository.Query;
import planup.backend.model.User;

import java.util.List;
import java.util.Optional;

public interface UserRepository extends MongoRepository<User, String> {
    Optional<User> findByClerkId(String clerkId);
    Optional<User> findByEmail(String email);
    List<User> findByOrganizationIdsContaining(String organizationId);
    List<User> findByProjectIdsContaining(String projectId);
    List<User> findByIsActiveTrue();
} 