package planup.backend.dto;

import lombok.Data;

@Data
public class ProjectResponse {
    private String id;
    private String name;
    private String key;
    private String description;
    private String leadId;
    private String templateId;
    private String color;
}
