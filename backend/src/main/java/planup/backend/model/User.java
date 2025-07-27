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
@Document(collection = "users")
public class User {
    @Id
    private String id;
    private String clerkId; // Clerk user ID
    private String email;
    private String firstName;
    private String lastName;
    private String fullName;
    private String avatar;
    private Date createdAt;
    private Date updatedAt;
    private boolean isActive;
    private List<String> organizationIds; // Organizations user belongs to
    private List<String> projectIds; // Projects user has access to
    private String role; // admin, developer, reporter, viewer
    private List<String> permissions;
    private String timezone;
    private String locale;
} 