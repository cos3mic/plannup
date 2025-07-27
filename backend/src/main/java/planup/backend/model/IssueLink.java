package planup.backend.model;

import lombok.*;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.util.Date;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Document(collection = "issuelinks")
public class IssueLink {
    @Id
    private String id;
    private String sourceIssueId; // Source issue ID
    private String targetIssueId; // Target issue ID
    private String linkType; // blocks, is-blocked-by, duplicates, is-duplicated-by, relates-to, parent-of, child-of
    private String createdById; // User ID who created the link
    private Date createdAt;
    private boolean isActive;
} 