package planup.backend.service;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import planup.backend.model.*;
import planup.backend.repository.IssueRepository;
import planup.backend.repository.CommentRepository;
import planup.backend.repository.TimeLogRepository;
import planup.backend.repository.AttachmentRepository;

import java.util.Date;
import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class IssueService {
    private final IssueRepository issueRepository;
    private final CommentRepository commentRepository;
    private final TimeLogRepository timeLogRepository;
    private final AttachmentRepository attachmentRepository;

    public List<Issue> getAllIssues() {
        return issueRepository.findAll();
    }

    public Optional<Issue> getIssueById(String id) {
        return issueRepository.findById(id);
    }

    public Optional<Issue> getIssueByKey(String key) {
        return issueRepository.findByKey(key);
    }

    public List<Issue> getIssuesByProject(String projectId) {
        return issueRepository.findByProjectId(projectId);
    }

    public List<Issue> getIssuesByAssignee(String assigneeId) {
        return issueRepository.findByAssigneeId(assigneeId);
    }

    public List<Issue> getIssuesByStatus(String status) {
        return issueRepository.findByStatus(status);
    }

    public List<Issue> getIssuesByPriority(String priority) {
        return issueRepository.findByPriority(priority);
    }

    public List<Issue> getIssuesByType(String type) {
        return issueRepository.findByType(type);
    }

    public List<Issue> getIssuesBySprint(String sprintId) {
        return issueRepository.findBySprintId(sprintId);
    }

    public List<Issue> getIssuesByEpic(String epicId) {
        return issueRepository.findByEpicId(epicId);
    }

    public Issue createIssue(Issue issue) {
        issue.setCreated(new Date());
        issue.setUpdated(new Date());
        issue.setLoggedHours(0);
        issue.setComments(List.of());
        issue.setAttachments(List.of());
        issue.setTimeLogs(List.of());
        issue.setDecisionLog(List.of());
        issue.setSubTaskIds(List.of());
        issue.setLinkedIssueIds(List.of());
        return issueRepository.save(issue);
    }

    public Issue updateIssue(String id, Issue issue) {
        issue.setId(id);
        issue.setUpdated(new Date());
        return issueRepository.save(issue);
    }

    public void deleteIssue(String id) {
        issueRepository.deleteById(id);
    }

    // Comment operations
    public Comment addComment(String issueId, Comment comment) {
        comment.setIssueId(issueId);
        comment.setTimestamp(new Date());
        comment.setEdited(false);
        return commentRepository.save(comment);
    }

    public List<Comment> getCommentsByIssue(String issueId) {
        return commentRepository.findByIssueId(issueId);
    }

    public Comment updateComment(String commentId, Comment comment) {
        comment.setId(commentId);
        comment.setEditedAt(new Date());
        comment.setEdited(true);
        return commentRepository.save(comment);
    }

    public void deleteComment(String commentId) {
        commentRepository.deleteById(commentId);
    }

    // Time log operations
    public TimeLog addTimeLog(String issueId, TimeLog timeLog) {
        timeLog.setIssueId(issueId);
        timeLog.setDate(new Date());
        timeLog.setCreatedAt(new Date());
        timeLog.setUpdatedAt(new Date());
        return timeLogRepository.save(timeLog);
    }

    public List<TimeLog> getTimeLogsByIssue(String issueId) {
        return timeLogRepository.findByIssueId(issueId);
    }

    public TimeLog updateTimeLog(String timeLogId, TimeLog timeLog) {
        timeLog.setId(timeLogId);
        timeLog.setUpdatedAt(new Date());
        return timeLogRepository.save(timeLog);
    }

    public void deleteTimeLog(String timeLogId) {
        timeLogRepository.deleteById(timeLogId);
    }

    // Attachment operations
    public Attachment addAttachment(String issueId, Attachment attachment) {
        attachment.setIssueId(issueId);
        attachment.setUploadedAt(new Date());
        return attachmentRepository.save(attachment);
    }

    public List<Attachment> getAttachmentsByIssue(String issueId) {
        return attachmentRepository.findByIssueId(issueId);
    }

    public void deleteAttachment(String attachmentId) {
        attachmentRepository.deleteById(attachmentId);
    }

    // Search operations
    public List<Issue> searchIssues(String query) {
        // This would implement a more sophisticated search
        // For now, return all issues
        return issueRepository.findAll();
    }

    public List<Issue> getIssuesByLabels(List<String> labels) {
        // This would implement label-based filtering
        // For now, return all issues
        return issueRepository.findAll();
    }
} 