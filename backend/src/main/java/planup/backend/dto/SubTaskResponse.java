package planup.backend.dto;

import lombok.Data;

@Data
public class SubTaskResponse {
    private String id;
    private String title;
    private String status;
    private boolean completed;
    private String assigneeId;
}
