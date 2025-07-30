package planup.backend.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class IssueLinkRequest {
    @NotBlank
    private String targetIssueId;
    @NotBlank
    private String linkType;
}
