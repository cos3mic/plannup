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
@Document(collection = "ideas")
public class Idea {
    @Id
    private String id;
    private String title;
    private String description;
    private String status; // New, Discussing, Approved, Rejected, Implemented
    private int upvotes;
    private String authorId; // User ID
    private Date createdAt;
    private Date updatedAt;
    private List<Comment> comments;
    private List<String> promotedByIds; // User IDs who promoted this idea
    private String organizationId;
    private String projectId;
    private boolean isActive;
} 