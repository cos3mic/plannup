package planup.backend.dto;

import lombok.Data;

@Data
public class IssueLinkResponse {
    private String id;
    private String sourceIssueId;
    private String targetIssueId;
    private String linkType;
}
