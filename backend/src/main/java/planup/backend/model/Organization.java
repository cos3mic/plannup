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
@Document(collection = "organizations")
public class Organization {
    @Id
    private String id;
    private String name;
    private String description;
    private String logo;
    private String color;
    private List<String> memberIds; // User IDs who are members
    private List<Invite> invites;
    private String ownerId; // User ID of the owner
    private Date createdAt;
    private Date updatedAt;
    private boolean isActive;
    private List<String> projectIds; // Projects in this organization
    private String settings; // JSON string for organization settings
} 