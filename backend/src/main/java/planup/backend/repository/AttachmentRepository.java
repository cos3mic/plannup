package planup.backend.repository;

import org.springframework.data.mongodb.repository.MongoRepository;
import planup.backend.model.Attachment;

import java.util.List;

public interface AttachmentRepository extends MongoRepository<Attachment, String> {
    List<Attachment> findByIssueId(String issueId);
    List<Attachment> findByUploadedById(String uploadedById);
    List<Attachment> findByFileType(String fileType);
} 