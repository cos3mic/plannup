package planup.backend.model;

import lombok.*;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.util.Date;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Document(collection = "invites")
public class Invite {
    @Id
    private String id;
    private String email;
    private String invitedBy; // User ID who sent the invite
    private String organizationId;
    private Date invitedAt;
    private String status; // pending, accepted, declined
    private String role; // Role to be assigned when accepted
    private Date expiresAt;
} 