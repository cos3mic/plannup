package planup.backend.dto;

import lombok.Data;
import java.time.Instant;
import java.util.List;

@Data
public class SprintResponse {
    private String id;
    private String name;
    private String goal;
    private Instant startDate;
    private Instant endDate;
    private String status;
    private List<String> issues;
    private Double capacity;
    private List<String> teamMembers;
}
