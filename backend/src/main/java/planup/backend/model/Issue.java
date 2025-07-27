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
@Document(collection = "issues")
public class Issue {
    @Id
    private String id;
    private String key; // Issue key like MAD-1, WRD-2, etc.
    private String title;
    private String description;
    private String projectId;
    private String priority; // High, Medium, Low
    private String status; // To Do, In Progress, Done, etc.
    private String type; // Bug, Story, Task, etc.
    private String assigneeId; // User ID
    private String reporterId; // User ID
    private Date created;
    private Date updated;
    private Date dueDate;
    private int estimatedHours;
    private int loggedHours;
    private int storyPoints;
    private List<String> labels;
    private List<String> components;
    private String epicId;
    private String sprintId;
    private List<Comment> comments;
    private List<Attachment> attachments;
    private List<TimeLog> timeLogs;
    private List<String> decisionLog;
    private List<String> subTaskIds; // Sub-task IDs
    private List<String> linkedIssueIds; // Linked issue IDs
    private String workflowId;
    private String templateId;
    private String color;
    private boolean isActive;
} 