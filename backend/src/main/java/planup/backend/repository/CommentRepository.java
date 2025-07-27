package planup.backend.repository;

import org.springframework.data.mongodb.repository.MongoRepository;
import planup.backend.model.Comment;

import java.util.List;

public interface CommentRepository extends MongoRepository<Comment, String> {
    List<Comment> findByIssueId(String issueId);
    List<Comment> findByAuthorId(String authorId);
    List<Comment> findByEditedTrue();
} 