package planup.backend.model;

import lombok.*;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.util.Date;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Document(collection = "timelogs")
public class TimeLog {
    @Id
    private String id;
    private String issueId;
    private String authorId; // User ID
    private double hours;
    private String description;
    private String category; // development, testing, design, research, meeting, documentation, other
    private Date date;
    private Date createdAt;
    private Date updatedAt;
} 