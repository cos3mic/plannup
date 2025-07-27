package planup.backend.repository;

import org.springframework.data.mongodb.repository.MongoRepository;
import planup.backend.model.Issue;

import java.util.List;
import java.util.Optional;

public interface IssueRepository extends MongoRepository<Issue, String> {
    List<Issue> findByProjectId(String projectId);
    List<Issue> findByAssigneeId(String assigneeId);
    List<Issue> findByReporterId(String reporterId);
    List<Issue> findByStatus(String status);
    List<Issue> findByPriority(String priority);
    List<Issue> findByType(String type);
    List<Issue> findBySprintId(String sprintId);
    List<Issue> findByEpicId(String epicId);
    List<Issue> findByIsActiveTrue();
    Optional<Issue> findByKey(String key);
    List<Issue> findByLabelsContaining(String label);
    List<Issue> findByComponentsContaining(String component);
} 