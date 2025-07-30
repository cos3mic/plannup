package planup.backend.dto;

import lombok.Data;
import java.time.Instant;
import java.util.List;

@Data
public class IssueResponse {
    private String id;
    private String key;
    private String title;
    private String status;
    private Instant created;
    private Instant updated;
    // optional quick fields
    private String priority;
    private String type;
    private String assigneeId;
    private String projectId;
    private List<String> labels;
}
