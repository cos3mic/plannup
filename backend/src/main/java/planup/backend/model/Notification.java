package planup.backend.model;

import lombok.*;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.util.Date;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Document(collection = "notifications")
public class Notification {
    @Id
    private String id;
    private String type; // issue_assigned, comment, status_change, mention, sprint_start, deadline
    private String title;
    private String message;
    private String userId; // User who should receive the notification
    private String projectId;
    private String issueId; // Related issue if any
    private String sprintId; // Related sprint if any
    private String organizationId;
    private Date createdAt;
    private boolean isRead;
    private String icon;
    private String color;
    private boolean isActive;
} 