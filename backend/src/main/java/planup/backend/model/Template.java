package planup.backend.model;

import lombok.*;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.util.Date;
import java.util.Map;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Document(collection = "templates")
public class Template {
    @Id
    private String id;
    private String name;
    private String description;
    private String icon;
    private String color;
    private Map<String, String> fields; // Template fields like title, description, type, priority, labels
    private String projectId;
    private String organizationId;
    private String createdById; // User ID who created the template
    private Date createdAt;
    private Date updatedAt;
    private boolean isActive;
    private boolean isDefault;
} 