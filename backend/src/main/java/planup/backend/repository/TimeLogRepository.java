package planup.backend.repository;

import org.springframework.data.mongodb.repository.MongoRepository;
import planup.backend.model.TimeLog;

import java.util.Date;
import java.util.List;

public interface TimeLogRepository extends MongoRepository<TimeLog, String> {
    List<TimeLog> findByIssueId(String issueId);
    List<TimeLog> findByAuthorId(String authorId);
    List<TimeLog> findByCategory(String category);
    List<TimeLog> findByDateBetween(Date startDate, Date endDate);
} 