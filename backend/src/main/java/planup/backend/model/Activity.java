package planup.backend.model;

import lombok.*;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.util.Date;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Document(collection = "activities")
public class Activity {
    @Id
    private String id;
    private String type; // issue_created, issue_moved, user_assigned, etc.
    private String title;
    private String description;
    private Date timestamp;
    private String icon;
    private String color;
    private String userId; // User who performed the action
    private String projectId;
    private String issueId; // Related issue if any
    private String sprintId; // Related sprint if any
    private String organizationId;
    private boolean isActive;
} 