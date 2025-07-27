package planup.backend.repository;

import org.springframework.data.mongodb.repository.MongoRepository;
import planup.backend.model.IssueLink;

import java.util.List;

public interface IssueLinkRepository extends MongoRepository<IssueLink, String> {
    List<IssueLink> findBySourceIssueId(String sourceIssueId);
    List<IssueLink> findByTargetIssueId(String targetIssueId);
    List<IssueLink> findByLinkType(String linkType);
    List<IssueLink> findByCreatedById(String createdById);
    List<IssueLink> findByIsActiveTrue();
} 