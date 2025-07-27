package planup.backend.repository;

import org.springframework.data.mongodb.repository.MongoRepository;
import planup.backend.model.Activity;

import java.util.List;

public interface ActivityRepository extends MongoRepository<Activity, String> {
    List<Activity> findByUserId(String userId);
    List<Activity> findByProjectId(String projectId);
    List<Activity> findByOrganizationId(String organizationId);
    List<Activity> findByIssueId(String issueId);
    List<Activity> findBySprintId(String sprintId);
    List<Activity> findByType(String type);
    List<Activity> findByIsActiveTrue();
} 