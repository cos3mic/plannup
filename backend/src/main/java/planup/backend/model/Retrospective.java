package planup.backend.model;

import lombok.*;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.util.Date;
import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Document(collection = "retrospectives")
public class Retrospective {
    @Id
    private String id;
    private String type; // Went Well, To Improve, Action Item
    private String text;
    private String authorId; // User ID
    private Date createdAt;
    private boolean resolved;
    private String organizationId;
    private String projectId;
    private String sprintId;
    private boolean isActive;
} 