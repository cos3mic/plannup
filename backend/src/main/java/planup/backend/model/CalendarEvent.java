package planup.backend.model;

import lombok.*;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import java.util.Date;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Document(collection="calendar_events")
public class CalendarEvent {
    @Id
    private String id;
    private String title;
    private String description;
    private Date start;
    private Date end;
    private String projectId;
    private String externalId; // Google event id
}
