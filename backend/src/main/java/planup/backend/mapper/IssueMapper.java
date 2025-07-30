package planup.backend.mapper;

import planup.backend.dto.IssueRequest;
import planup.backend.dto.IssueResponse;
import planup.backend.model.Issue;

import java.time.Instant;
import java.util.Date;

public class IssueMapper {

    public static Issue toEntity(IssueRequest req) {
        Issue issue = new Issue();
        issue.setTitle(req.getTitle());
        issue.setDescription(req.getDescription());
        issue.setPriority(req.getPriority());
        issue.setType(req.getType());
        issue.setProjectId(req.getProjectId());
        issue.setAssigneeId(req.getAssigneeId());
        issue.setDueDate(req.getDueDate() != null ? Date.from(req.getDueDate()) : null);
        issue.setEstimatedHours(req.getEstimatedHours() != null ? req.getEstimatedHours().intValue() : 0);
        issue.setStoryPoints(req.getStoryPoints() != null ? req.getStoryPoints().intValue() : 0);
        issue.setLabels(req.getLabels());
        issue.setComponents(req.getComponents());
        // created/updated handled in service
        return issue;
    }

    public static IssueResponse toResponse(Issue issue) {
        IssueResponse res = new IssueResponse();
        res.setId(issue.getId());
        res.setKey(issue.getKey());
        res.setTitle(issue.getTitle());
        res.setStatus(issue.getStatus());
        res.setCreated(issue.getCreated()!=null?issue.getCreated().toInstant(): Instant.now());
        res.setUpdated(issue.getUpdated()!=null?issue.getUpdated().toInstant(): Instant.now());
        res.setPriority(issue.getPriority());
        res.setType(issue.getType());
        res.setAssigneeId(issue.getAssigneeId());
        res.setProjectId(issue.getProjectId());
        res.setLabels(issue.getLabels());
        return res;
    }
}
