package planup.backend.repository;

import org.springframework.data.mongodb.repository.MongoRepository;
import planup.backend.model.Sprint;

public interface SprintRepository extends MongoRepository<Sprint, String> {
    // Custom query methods can be added here
} 