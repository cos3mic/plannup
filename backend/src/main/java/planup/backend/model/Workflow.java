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
@Document(collection = "workflows")
public class Workflow {
    @Id
    private String id;
    private String name;
    private String description;
    private List<String> statuses; // List of status names
    private List<WorkflowTransition> transitions;
    private String color;
    private String projectId;
    private String organizationId;
    private Date createdAt;
    private Date updatedAt;
    private boolean isActive;
    private boolean isDefault;
} 