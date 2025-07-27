package planup.backend.controller;

import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import planup.backend.model.*;
import planup.backend.service.IssueService;

import java.util.List;

@RestController
@RequestMapping("/api/issues")
@RequiredArgsConstructor
public class IssueController {
    private final IssueService issueService;

    @GetMapping
    public List<Issue> getAllIssues() {
        return issueService.getAllIssues();
    }

    @GetMapping("/{id}")
    public ResponseEntity<Issue> getIssueById(@PathVariable String id) {
        return issueService.getIssueById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/key/{key}")
    public ResponseEntity<Issue> getIssueByKey(@PathVariable String key) {
        return issueService.getIssueByKey(key)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/project/{projectId}")
    public List<Issue> getIssuesByProject(@PathVariable String projectId) {
        return issueService.getIssuesByProject(projectId);
    }

    @GetMapping("/assignee/{assigneeId}")
    public List<Issue> getIssuesByAssignee(@PathVariable String assigneeId) {
        return issueService.getIssuesByAssignee(assigneeId);
    }

    @GetMapping("/status/{status}")
    public List<Issue> getIssuesByStatus(@PathVariable String status) {
        return issueService.getIssuesByStatus(status);
    }

    @GetMapping("/priority/{priority}")
    public List<Issue> getIssuesByPriority(@PathVariable String priority) {
        return issueService.getIssuesByPriority(priority);
    }

    @GetMapping("/type/{type}")
    public List<Issue> getIssuesByType(@PathVariable String type) {
        return issueService.getIssuesByType(type);
    }

    @GetMapping("/sprint/{sprintId}")
    public List<Issue> getIssuesBySprint(@PathVariable String sprintId) {
        return issueService.getIssuesBySprint(sprintId);
    }

    @GetMapping("/epic/{epicId}")
    public List<Issue> getIssuesByEpic(@PathVariable String epicId) {
        return issueService.getIssuesByEpic(epicId);
    }

    @PostMapping
    public Issue createIssue(@RequestBody Issue issue) {
        return issueService.createIssue(issue);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Issue> updateIssue(@PathVariable String id, @RequestBody Issue issue) {
        return issueService.getIssueById(id)
                .map(existingIssue -> ResponseEntity.ok(issueService.updateIssue(id, issue)))
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
    public List<Issue> searchIssues(@RequestParam String query) {
        return issueService.searchIssues(query);
    }

    @GetMapping("/labels")
    public List<Issue> getIssuesByLabels(@RequestParam List<String> labels) {
        return issueService.getIssuesByLabels(labels);
    }
} 