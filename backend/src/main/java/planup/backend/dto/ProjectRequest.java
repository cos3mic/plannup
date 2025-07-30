package planup.backend.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class ProjectRequest {
    @NotBlank
    private String name;
    @NotBlank
    private String key;
    private String description;
    private String leadId;
    private String templateId;
    private String color;
}
