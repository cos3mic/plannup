package planup.backend.model;

import lombok.*;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.util.Date;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Document(collection = "comments")
public class Comment {
    @Id
    private String id;
    private String issueId;
    private String authorId; // User ID
    private String content;
    private Date timestamp;
    private boolean edited;
    private Date editedAt;
    private String editedBy; // User ID who edited
} 