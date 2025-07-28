package planup.backend.model;

import lombok.Data;
import lombok.Builder;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import java.util.Date;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Document(collection = "components")
public class Component {
    @Id
    private String id;
    private String name;
    private String description;
    private String icon;
    private String color;
    private String leadId; // User ID of the component lead
    private String projectId;
    private String organizationId;
    private int issueCount;
    private Date createdAt;
    private Date updatedAt;
    private boolean isActive;
} 