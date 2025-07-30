package planup.backend.controller;

import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import planup.backend.model.*;
import planup.backend.service.IssueService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.data.mongodb.core.query.Criteria;
import org.springframework.data.mongodb.core.query.Query;

import java.util.List;
import java.util.stream.Collectors;
import jakarta.validation.Valid;
import planup.backend.dto.IssueRequest;
import planup.backend.dto.IssueResponse;
import planup.backend.mapper.IssueMapper;

@RestController
@RequestMapping("/issues")
@RequiredArgsConstructor
public class IssueController {
    private final IssueService issueService;
    @Autowired
    private MongoTemplate mongoTemplate;

    @GetMapping
    public List<IssueResponse> getAllIssues() {
        return issueService.getAllIssues()
                .stream()
                .map(IssueMapper::toResponse)
                .collect(Collectors.toList());
    }

    @GetMapping("/{id}")
    public ResponseEntity<IssueResponse> getIssueById(@PathVariable String id) {
        return issueService.getIssueById(id)
                .map(IssueMapper::toResponse)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/key/{key}")
    public ResponseEntity<IssueResponse> getIssueByKey(@PathVariable String key) {
        return issueService.getIssueByKey(key)
                .map(IssueMapper::toResponse)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/project/{projectId}")
    public List<IssueResponse> getIssuesByProject(@PathVariable String projectId) {
        return issueService.getIssuesByProject(projectId)
                .stream()
                .map(IssueMapper::toResponse)
                .collect(Collectors.toList());
    }

    @GetMapping("/assignee/{assigneeId}")
    public List<IssueResponse> getIssuesByAssignee(@PathVariable String assigneeId) {
        return issueService.getIssuesByAssignee(assigneeId)
                .stream()
                .map(IssueMapper::toResponse)
                .collect(Collectors.toList());
    }

    @GetMapping("/status/{status}")
    public List<IssueResponse> getIssuesByStatus(@PathVariable String status) {
        return issueService.getIssuesByStatus(status)
                .stream()
                .map(IssueMapper::toResponse)
                .collect(Collectors.toList());
    }

    @GetMapping("/priority/{priority}")
    public List<IssueResponse> getIssuesByPriority(@PathVariable String priority) {
        return issueService.getIssuesByPriority(priority)
                .stream()
                .map(IssueMapper::toResponse)
                .collect(Collectors.toList());
    }

    @GetMapping("/type/{type}")
    public List<IssueResponse> getIssuesByType(@PathVariable String type) {
        return issueService.getIssuesByType(type)
                .stream()
                .map(IssueMapper::toResponse)
                .collect(Collectors.toList());
    }

    @GetMapping("/sprint/{sprintId}")
    public List<IssueResponse> getIssuesBySprint(@PathVariable String sprintId) {
        return issueService.getIssuesBySprint(sprintId)
                .stream()
                .map(IssueMapper::toResponse)
                .collect(Collectors.toList());
    }

    @GetMapping("/epic/{epicId}")
    public List<IssueResponse> getIssuesByEpic(@PathVariable String epicId) {
        return issueService.getIssuesByEpic(epicId)
                .stream()
                .map(IssueMapper::toResponse)
                .collect(Collectors.toList());
    }

    @PostMapping
    public IssueResponse createIssue(@Valid @RequestBody IssueRequest request) {
        Issue created = issueService.createIssue(IssueMapper.toEntity(request));
        return IssueMapper.toResponse(created);
    }

    @PutMapping("/{id}")
    public ResponseEntity<IssueResponse> updateIssue(@PathVariable String id, @Valid @RequestBody IssueRequest request) {
        return issueService.getIssueById(id)
                .map(existing -> {
                    Issue updated = issueService.updateIssue(id, IssueMapper.toEntity(request));
                    return ResponseEntity.ok(IssueMapper.toResponse(updated));
                })
                .orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteIssue(@PathVariable String id) {
        if (issueService.getIssueById(id).isPresent()) {
            issueService.deleteIssue(id);
            return ResponseEntity.ok().build();
        }
        return ResponseEntity.notFound().build();
    }

    // Comment endpoints
    @GetMapping("/{issueId}/comments")
    public List<Comment> getCommentsByIssue(@PathVariable String issueId) {
        return issueService.getCommentsByIssue(issueId);
    }

    @PostMapping("/{issueId}/comments")
    public Comment addComment(@PathVariable String issueId, @RequestBody Comment comment) {
        return issueService.addComment(issueId, comment);
    }

    @PutMapping("/comments/{commentId}")
    public ResponseEntity<Comment> updateComment(@PathVariable String commentId, @RequestBody Comment comment) {
        return ResponseEntity.ok(issueService.updateComment(commentId, comment));
    }

    @DeleteMapping("/comments/{commentId}")
    public ResponseEntity<Void> deleteComment(@PathVariable String commentId) {
        issueService.deleteComment(commentId);
        return ResponseEntity.ok().build();
    }

    // Time log endpoints
    @GetMapping("/{issueId}/timelogs")
    public List<TimeLog> getTimeLogsByIssue(@PathVariable String issueId) {
        return issueService.getTimeLogsByIssue(issueId);
    }

    @PostMapping("/{issueId}/timelogs")
    public TimeLog addTimeLog(@PathVariable String issueId, @RequestBody TimeLog timeLog) {
        return issueService.addTimeLog(issueId, timeLog);
    }

    @PutMapping("/timelogs/{timeLogId}")
    public ResponseEntity<TimeLog> updateTimeLog(@PathVariable String timeLogId, @RequestBody TimeLog timeLog) {
        return ResponseEntity.ok(issueService.updateTimeLog(timeLogId, timeLog));
    }

    @DeleteMapping("/timelogs/{timeLogId}")
    public ResponseEntity<Void> deleteTimeLog(@PathVariable String timeLogId) {
        issueService.deleteTimeLog(timeLogId);
        return ResponseEntity.ok().build();
    }

    // Attachment endpoints
    @GetMapping("/{issueId}/attachments")
    public List<Attachment> getAttachmentsByIssue(@PathVariable String issueId) {
        return issueService.getAttachmentsByIssue(issueId);
    }

    @PostMapping("/{issueId}/attachments")
    public Attachment addAttachment(@PathVariable String issueId, @RequestBody Attachment attachment) {
        return issueService.addAttachment(issueId, attachment);
    }

    @DeleteMapping("/attachments/{attachmentId}")
    public ResponseEntity<Void> deleteAttachment(@PathVariable String attachmentId) {
        issueService.deleteAttachment(attachmentId);
        return ResponseEntity.ok().build();
    }

    // Search endpoints
    @GetMapping("/search")
    public List<Issue> searchIssues(
        @RequestParam(required = false) String status,
        @RequestParam(required = false) String assignee,
        @RequestParam(required = false) String projectId,
        @RequestParam(required = false) String sprintId,
        @RequestParam(required = false) String text
    ) {
        Query query = new Query();
        if (status != null) query.addCriteria(Criteria.where("status").is(status));
        if (assignee != null) query.addCriteria(Criteria.where("assignee").is(assignee));
        if (projectId != null) query.addCriteria(Criteria.where("projectId").is(projectId));
        if (sprintId != null) query.addCriteria(Criteria.where("sprintId").is(sprintId));
        if (text != null) query.addCriteria(new Criteria().orOperator(
            Criteria.where("title").regex(text, "i"),
            Criteria.where("description").regex(text, "i")
        ));
        return mongoTemplate.find(query, Issue.class);
    }

    @GetMapping("/labels")
    public List<Issue> getIssuesByLabels(@RequestParam List<String> labels) {
        return issueService.getIssuesByLabels(labels);
    }
} 