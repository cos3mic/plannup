package planup.backend.model;

import lombok.*;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.util.Date;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Document(collection = "attachments")
public class Attachment {
    @Id
    private String id;
    private String issueId;
    private String name;
    private String size; // e.g., "2.3 MB"
    private String uploadedById; // User ID
    private Date uploadedAt;
    private String fileUrl; // URL to the file
    private String fileType; // MIME type
    private String description;
} 