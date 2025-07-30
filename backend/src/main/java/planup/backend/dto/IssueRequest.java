package planup.backend.dto;

import lombok.Data;
import java.time.Instant;
import java.util.List;

@Data
public class IssueRequest {
    private String title;
    private String description;
    private String priority; // Low|Medium|High
    private String type;     // Bug|Story|Task|Epic
    private String projectId;
    private String assigneeId;
    private Instant dueDate;
    private Double estimatedHours;
    private Double storyPoints;
    private List<String> labels;
    private List<String> components;
}
