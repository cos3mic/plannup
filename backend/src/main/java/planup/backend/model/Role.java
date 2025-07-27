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
@Document(collection = "roles")
public class Role {
    @Id
    private String id;
    private String name;
    private String description;
    private String icon;
    private String color;
    private List<String> permissions; // List of permission strings
    private String projectId;
    private String organizationId;
    private String createdById; // User ID who created the role
    private Date createdAt;
    private Date updatedAt;
    private boolean isActive;
    private boolean isDefault;
} 