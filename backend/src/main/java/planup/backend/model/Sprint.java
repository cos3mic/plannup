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
@Document(collection = "sprints")
public class Sprint {
    @Id
    private String id;
    private String name;
    private Date startDate;
    private Date endDate;
    private String status; // active, completed, planned
    private String goal;
    private List<String> issues; // issue IDs
    private int velocity;
    private int capacity;
    private List<String> teamMembers;
} 