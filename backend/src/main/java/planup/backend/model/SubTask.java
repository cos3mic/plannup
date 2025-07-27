package planup.backend.model;

import lombok.*;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.util.Date;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Document(collection = "subtasks")
public class SubTask {
    @Id
    private String id;
    private String title;
    private String status; // To Do, In Progress, Done
    private boolean completed;
    private String parentIssueId; // Parent issue ID
    private String assigneeId; // User ID
    private Date createdAt;
    private Date updatedAt;
    private boolean isActive;
} 