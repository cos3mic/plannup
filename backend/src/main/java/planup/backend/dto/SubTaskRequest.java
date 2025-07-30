package planup.backend.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class SubTaskRequest {
    @NotBlank
    private String title;
    private String assigneeId;
}
