package planup.backend.repository;

import org.springframework.data.mongodb.repository.MongoRepository;
import planup.backend.model.SubTask;

import java.util.List;

public interface SubTaskRepository extends MongoRepository<SubTask, String> {
    List<SubTask> findByParentIssueId(String parentIssueId);
    List<SubTask> findByAssigneeId(String assigneeId);
    List<SubTask> findByStatus(String status);
    List<SubTask> findByCompletedTrue();
    List<SubTask> findByCompletedFalse();
    List<SubTask> findByIsActiveTrue();
} 