package planup.backend.model;

import lombok.*;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Document(collection = "workflowtransitions")
public class WorkflowTransition {
    @Id
    private String id;
    private String fromStatus; // Source status
    private String toStatus; // Target status
    private String label; // Transition label like "Start Work", "Complete"
    private String workflowId;
    private boolean isActive;
} 