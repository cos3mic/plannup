package planup.backend.model;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

import java.util.Date;
import java.util.List;

@Data
public class SprintDTO {
    @NotBlank
    private String name;
    @NotNull
    private Date startDate;
    @NotNull
    private Date endDate;
    @NotBlank
    private String status;
    private String goal;
    private List<String> issues;
    private int velocity;
    private int capacity;
    private List<String> teamMembers;
} 