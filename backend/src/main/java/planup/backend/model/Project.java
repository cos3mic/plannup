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
@Document(collection = "projects")
public class Project {
    @Id
    private String id;
    private String name;
    private String key; // Project key like MAD, WRD, etc.
    private String description;
    private String color;
    private String leadId; // User ID of the project lead
    private String organizationId;
    private int progress; // 0-100
    private int issueCount;
    private List<String> memberIds; // User IDs who have access
    private List<String> componentIds; // Component IDs
    private List<String> roleIds; // Role IDs
    private List<String> workflowIds; // Workflow IDs
    private List<String> templateIds; // Template IDs
    private Date createdAt;
    private Date updatedAt;
    private boolean isActive;
    private String settings; // JSON string for project settings
    private List<String> decisionLog; // Decision log entries
} 