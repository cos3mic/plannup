package planup.backend.repository;

import org.springframework.data.mongodb.repository.MongoRepository;
import planup.backend.model.Notification;

import java.util.List;

public interface NotificationRepository extends MongoRepository<Notification, String> {
    List<Notification> findByUserId(String userId);
    List<Notification> findByUserIdAndIsReadFalse(String userId);
    List<Notification> findByProjectId(String projectId);
    List<Notification> findByOrganizationId(String organizationId);
    List<Notification> findByType(String type);
    List<Notification> findByIsActiveTrue();
} 