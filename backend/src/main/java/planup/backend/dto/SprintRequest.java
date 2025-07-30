package planup.backend.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;
import java.time.Instant;
import java.util.List;

@Data
public class SprintRequest {
    @NotBlank
    private String name;
    private String goal;
    private Instant startDate;
    private Instant endDate;
    private String projectId;
    private Double capacity;
    private List<String> teamMembers;
}
