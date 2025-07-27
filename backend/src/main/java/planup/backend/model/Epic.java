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
@Document(collection = "epics")
public class Epic {
    @Id
    private String id;
    private String key; // Epic key like MAD-EPIC-1
    private String title;
    private String description;
    private String projectId;
    private String status; // To Do, In Progress, Done
    private String assigneeId; // User ID
    private Date created;
    private Date updated;
    private Date dueDate;
    private int storyPoints;
    private int completedStoryPoints;
    private List<String> issueIds; // Issue IDs
    private String color;
    private List<String> labels;
    private boolean isActive;
} 