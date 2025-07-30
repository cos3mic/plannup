# PlanUp REST API Specification

## Overview
This document defines the complete REST API specification for the PlanUp project management application, designed to support all frontend features identified in the React Native Expo codebase.

**Base URL**: `https://api.plannup.com/v1`
**Database**: MongoDB
**Authentication**: JWT Bearer tokens via Clerk

## Authentication & Authorization

### Authentication Scheme
- **Type**: JWT Bearer Token
- **Header**: `Authorization: Bearer <token>`
- **Provider**: Clerk
- **Token Validation**: All protected endpoints validate JWT tokens

### Authorization Levels
- **Public**: No authentication required
- **User**: Requires valid user token
- **Admin**: Requires admin role
- **Organization**: Requires organization membership

---

## 1. Authentication & User Management

### 1.1 User Profile
| Method | Path | Description | Auth | Frontend Usage |
|--------|------|-------------|------|----------------|
| GET | `/users/profile` | Get current user profile | User | Dashboard, Settings |
| PUT | `/users/profile` | Update user profile | User | Settings screen |
| GET | `/users/{userId}` | Get user by ID | User | User avatars, assignments |

**GET /users/profile**
```json
Response: {
  "id": "string",
  "email": "string",
  "firstName": "string",
  "lastName": "string",
  "fullName": "string",
  "avatar": "string",
  "timezone": "string",
  "preferences": {
    "theme": "light|dark",
    "notifications": "boolean"
  }
}
```

---

## 2. Issue Management

### 2.1 Core Issue Operations
| Method | Path | Description | Auth | Frontend Usage |
|--------|------|-------------|------|----------------|
| GET | `/issues` | List issues with filters | User | AllWork screen, Dashboard |
| POST | `/issues` | Create new issue | User | CreateIssueModal |
| GET | `/issues/{issueId}` | Get issue details | User | IssueDetailsModal |
| PUT | `/issues/{issueId}` | Update issue | User | IssueDetailsModal |
| DELETE | `/issues/{issueId}` | Delete issue | User | Issue management |

**POST /issues**
```json
Request: {
  "title": "string",
  "description": "string",
  "priority": "Low|Medium|High",
  "type": "Bug|Story|Task|Epic",
  "projectId": "string",
  "assigneeId": "string",
  "dueDate": "ISO8601",
  "estimatedHours": "number",
  "storyPoints": "number",
  "labels": ["string"],
  "components": ["string"]
}

Response: {
  "id": "string",
  "key": "string",
  "title": "string",
  "status": "To Do",
  "created": "ISO8601",
  "updated": "ISO8601"
}
```

### 2.2 Sub-tasks
| Method | Path | Description | Auth | Frontend Usage |
|--------|------|-------------|------|----------------|
| GET | `/issues/{issueId}/subtasks` | Get sub-tasks | User | SubTaskModal |
| POST | `/issues/{issueId}/subtasks` | Create sub-task | User | SubTaskModal |
| PUT | `/issues/{issueId}/subtasks/{subtaskId}` | Update sub-task | User | SubTaskModal |
| DELETE | `/issues/{issueId}/subtasks/{subtaskId}` | Delete sub-task | User | SubTaskModal |

### 2.3 Issue Links
| Method | Path | Description | Auth | Frontend Usage |
|--------|------|-------------|------|----------------|
| GET | `/issues/{issueId}/links` | Get issue links | User | IssueLinksModal |
| POST | `/issues/{issueId}/links` | Create issue link | User | IssueLinksModal |
| DELETE | `/issues/{issueId}/links/{linkId}` | Remove issue link | User | IssueLinksModal |

### 2.4 Comments
| Method | Path | Description | Auth | Frontend Usage |
|--------|------|-------------|------|----------------|
| GET | `/issues/{issueId}/comments` | Get comments | User | IssueDetailsModal |
| POST | `/issues/{issueId}/comments` | Add comment | User | IssueDetailsModal |
| PUT | `/issues/{issueId}/comments/{commentId}` | Update comment | User | IssueDetailsModal |
| DELETE | `/issues/{issueId}/comments/{commentId}` | Delete comment | User | IssueDetailsModal |

### 2.5 Attachments
| Method | Path | Description | Auth | Frontend Usage |
|--------|------|-------------|------|----------------|
| GET | `/issues/{issueId}/attachments` | Get attachments | User | IssueDetailsModal |
| POST | `/issues/{issueId}/attachments` | Upload attachment | User | IssueDetailsModal |
| DELETE | `/issues/{issueId}/attachments/{attachmentId}` | Delete attachment | User | IssueDetailsModal |

---

## 3. Project Management

### 3.1 Projects
| Method | Path | Description | Auth | Frontend Usage |
|--------|------|-------------|------|----------------|
| GET | `/projects` | List projects | User | Project screen, Dashboard |
| POST | `/projects` | Create project | User | CreateProjectModal |
| GET | `/projects/{projectId}` | Get project details | User | Project screen |
| PUT | `/projects/{projectId}` | Update project | User | Project management |
| DELETE | `/projects/{projectId}` | Delete project | Admin | Project management |

**POST /projects**
```json
Request: {
  "name": "string",
  "key": "string",
  "description": "string",
  "leadId": "string",
  "templateId": "string",
  "color": "string"
}
```

### 3.2 Project Components
| Method | Path | Description | Auth | Frontend Usage |
|--------|------|-------------|------|----------------|
| GET | `/projects/{projectId}/components` | Get components | User | ProjectComponentsModal |
| POST | `/projects/{projectId}/components` | Create component | User | ProjectComponentsModal |
| PUT | `/projects/{projectId}/components/{componentId}` | Update component | User | ProjectComponentsModal |

### 3.3 Project Roles
| Method | Path | Description | Auth | Frontend Usage |
|--------|------|-------------|------|----------------|
| GET | `/projects/{projectId}/roles` | Get project roles | User | ProjectRolesModal |
| POST | `/projects/{projectId}/roles` | Add user to project | User | ProjectRolesModal |
| PUT | `/projects/{projectId}/roles/{userId}` | Update user role | User | ProjectRolesModal |
| DELETE | `/projects/{projectId}/roles/{userId}` | Remove user | User | ProjectRolesModal |

---

## 4. Sprint Management

### 4.1 Sprints
| Method | Path | Description | Auth | Frontend Usage |
|--------|------|-------------|------|----------------|
| GET | `/sprints` | List sprints | User | Sprints screen, Dashboard |
| POST | `/sprints` | Create sprint | User | SprintModal |
| GET | `/sprints/{sprintId}` | Get sprint details | User | SprintModal |
| PUT | `/sprints/{sprintId}` | Update sprint | User | SprintModal |
| DELETE | `/sprints/{sprintId}` | Delete sprint | User | Sprint management |

**POST /sprints**
```json
Request: {
  "name": "string",
  "goal": "string",
  "startDate": "ISO8601",
  "endDate": "ISO8601",
  "projectId": "string",
  "capacity": "number",
  "teamMembers": ["string"]
}
```

### 4.2 Sprint Issues
| Method | Path | Description | Auth | Frontend Usage |
|--------|------|-------------|------|----------------|
| POST | `/sprints/{sprintId}/issues` | Add issue to sprint | User | Sprint planning |
| DELETE | `/sprints/{sprintId}/issues/{issueId}` | Remove issue from sprint | User | Sprint planning |

---

## 5. Time Tracking

### 5.1 Time Logs
| Method | Path | Description | Auth | Frontend Usage |
|--------|------|-------------|------|----------------|
| GET | `/issues/{issueId}/timelogs` | Get time logs | User | TimeTrackingModal |
| POST | `/issues/{issueId}/timelogs` | Log time | User | TimeTrackingModal |
| PUT | `/issues/{issueId}/timelogs/{timelogId}` | Update time log | User | TimeTrackingModal |
| DELETE | `/issues/{issueId}/timelogs/{timelogId}` | Delete time log | User | TimeTrackingModal |

**POST /issues/{issueId}/timelogs**
```json
Request: {
  "hours": "number",
  "description": "string",
  "category": "Development|Testing|Meeting|Documentation|Other",
  "date": "ISO8601"
}
```

---

## 6. Calendar Integration

### 6.1 Calendar Events
| Method | Path | Description | Auth | Frontend Usage |
|--------|------|-------------|------|----------------|
| GET | `/calendar/events` | Get calendar events | User | GoogleCalendarPicker |
| POST | `/calendar/events` | Create calendar event | User | Issue due dates |
| PUT | `/calendar/events/{eventId}` | Update calendar event | User | Calendar sync |
| DELETE | `/calendar/events/{eventId}` | Delete calendar event | User | Calendar sync |

---

## 7. Organization Management

### 7.1 Organizations
| Method | Path | Description | Auth | Frontend Usage |
|--------|------|-------------|------|----------------|
| GET | `/organizations` | List user organizations | User | OrganizationManagement |
| POST | `/organizations` | Create organization | User | Organization creation |
| GET | `/organizations/{orgId}` | Get organization details | User | Organization settings |
| PUT | `/organizations/{orgId}` | Update organization | Admin | Organization settings |

### 7.2 Organization Invites
| Method | Path | Description | Auth | Frontend Usage |
|--------|------|-------------|------|----------------|
| GET | `/organizations/{orgId}/invites` | Get pending invites | User | PendingInvitesNotification |
| POST | `/organizations/{orgId}/invites` | Send invite | Admin | EmailInviteModal |
| PUT | `/organizations/{orgId}/invites/{inviteId}/accept` | Accept invite | User | PendingInvitesNotification |
| PUT | `/organizations/{orgId}/invites/{inviteId}/decline` | Decline invite | User | PendingInvitesNotification |

---

## 8. Ideas Management

### 8.1 Ideas
| Method | Path | Description | Auth | Frontend Usage |
|--------|------|-------------|------|----------------|
| GET | `/ideas` | List ideas | User | Ideas screen |
| POST | `/ideas` | Submit idea | User | Ideas screen |
| GET | `/ideas/{ideaId}` | Get idea details | User | Ideas screen |
| PUT | `/ideas/{ideaId}` | Update idea | User | Ideas screen |
| DELETE | `/ideas/{ideaId}` | Delete idea | User | Ideas screen |

### 8.2 Idea Interactions
| Method | Path | Description | Auth | Frontend Usage |
|--------|------|-------------|------|----------------|
| POST | `/ideas/{ideaId}/upvote` | Upvote idea | User | Ideas screen |
| POST | `/ideas/{ideaId}/comments` | Add comment to idea | User | Ideas screen |
| POST | `/ideas/{ideaId}/promote` | Promote idea to issue | User | Ideas screen |

---

## 9. Search & Filtering

### 9.1 Advanced Search
| Method | Path | Description | Auth | Frontend Usage |
|--------|------|-------------|------|----------------|
| GET | `/search/issues` | Search issues | User | AdvancedSearchModal |
| GET | `/search/projects` | Search projects | User | SearchModal |
| GET | `/search/users` | Search users | User | User assignment |

**GET /search/issues**
```
Query Parameters:
- q: string (text search)
- status: string[]
- priority: string[]
- assignee: string[]
- project: string[]
- type: string[]
- labels: string[]
- dateFrom: ISO8601
- dateTo: ISO8601
- page: number
- limit: number
```

---

## 10. Bulk Operations

### 10.1 Bulk Updates
| Method | Path | Description | Auth | Frontend Usage |
|--------|------|-------------|------|----------------|
| PUT | `/issues/bulk` | Bulk update issues | User | BulkOperationsModal |
| DELETE | `/issues/bulk` | Bulk delete issues | User | BulkOperationsModal |

**PUT /issues/bulk**
```json
Request: {
  "issueIds": ["string"],
  "updates": {
    "status": "string",
    "assignee": "string",
    "priority": "string",
    "labels": ["string"]
  }
}
```

---

## 11. Notifications

### 11.1 Push Notifications
| Method | Path | Description | Auth | Frontend Usage |
|--------|------|-------------|------|----------------|
| GET | `/notifications` | Get notifications | User | Notification screen |
| PUT | `/notifications/{notificationId}/read` | Mark as read | User | Notification screen |
| POST | `/notifications/register-device` | Register push token | User | PushNotificationService |

---

## 12. Analytics & Reports

### 12.1 Dashboard Metrics
| Method | Path | Description | Auth | Frontend Usage |
|--------|------|-------------|------|----------------|
| GET | `/analytics/dashboard` | Get dashboard metrics | User | Dashboard screen |
| GET | `/analytics/reports` | Generate reports | User | ReportsModal |
| GET | `/analytics/team-performance` | Team analytics | User | Dashboard screen |

**GET /analytics/dashboard**
```json
Response: {
  "totalIssues": "number",
  "inProgress": "number",
  "completed": "number",
  "overdue": "number",
  "teamMetrics": [{
    "userId": "string",
    "name": "string",
    "issuesCompleted": "number",
    "issuesInProgress": "number",
    "productivity": "number"
  }]
}
```

---

## 13. Workflows

### 13.1 Workflow Management
| Method | Path | Description | Auth | Frontend Usage |
|--------|------|-------------|------|----------------|
| GET | `/workflows` | Get available workflows | User | WorkflowModal |
| POST | `/workflows` | Create custom workflow | User | WorkflowModal |
| PUT | `/projects/{projectId}/workflow` | Set project workflow | User | WorkflowModal |

---

## 14. Retrospectives

### 14.1 Retrospective Management
| Method | Path | Description | Auth | Frontend Usage |
|--------|------|-------------|------|----------------|
| GET | `/retrospectives` | List retrospectives | User | RetrospectiveContext |
| POST | `/retrospectives` | Create retrospective | User | RetrospectiveContext |
| POST | `/retrospectives/{retroId}/feedback` | Add feedback | User | RetrospectiveContext |

---

## Data Models (MongoDB Collections)

### User
```javascript
{
  _id: ObjectId,
  clerkId: String,
  email: String,
  firstName: String,
  lastName: String,
  avatar: String,
  timezone: String,
  preferences: {
    theme: String,
    notifications: Boolean
  },
  organizations: [ObjectId],
  createdAt: Date,
  updatedAt: Date
}
```

### Issue
```javascript
{
  _id: ObjectId,
  key: String, // AUTO-1, AUTO-2, etc.
  title: String,
  description: String,
  status: String,
  priority: String,
  type: String,
  projectId: ObjectId,
  assigneeId: ObjectId,
  reporterId: ObjectId,
  dueDate: Date,
  estimatedHours: Number,
  loggedHours: Number,
  storyPoints: Number,
  labels: [String],
  components: [String],
  epicId: ObjectId,
  sprintId: ObjectId,
  parentId: ObjectId, // for sub-tasks
  links: [{
    type: String,
    targetIssueId: ObjectId
  }],
  attachments: [{
    filename: String,
    url: String,
    uploadedBy: ObjectId,
    uploadedAt: Date
  }],
  comments: [{
    author: ObjectId,
    content: String,
    createdAt: Date
  }],
  timeLogs: [{
    userId: ObjectId,
    hours: Number,
    description: String,
    category: String,
    date: Date
  }],
  workflowId: ObjectId,
  createdAt: Date,
  updatedAt: Date
}
```

### Project
```javascript
{
  _id: ObjectId,
  name: String,
  key: String,
  description: String,
  leadId: ObjectId,
  organizationId: ObjectId,
  color: String,
  template: String,
  components: [{
    name: String,
    description: String,
    leadId: ObjectId
  }],
  members: [{
    userId: ObjectId,
    role: String
  }],
  workflowId: ObjectId,
  createdAt: Date,
  updatedAt: Date
}
```

### Sprint
```javascript
{
  _id: ObjectId,
  name: String,
  goal: String,
  startDate: Date,
  endDate: Date,
  status: String,
  projectId: ObjectId,
  capacity: Number,
  velocity: Number,
  teamMembers: [ObjectId],
  issues: [ObjectId],
  createdAt: Date,
  updatedAt: Date
}
```

## Error Handling

### Standard Error Codes
- **400 Bad Request**: Invalid request data
- **401 Unauthorized**: Invalid or missing authentication
- **403 Forbidden**: Insufficient permissions
- **404 Not Found**: Resource not found
- **409 Conflict**: Resource conflict (duplicate key, etc.)
- **422 Unprocessable Entity**: Validation errors
- **500 Internal Server Error**: Server error

### Error Response Format
```json
{
  "error": {
    "code": "string",
    "message": "string",
    "details": "object"
  }
}
```

## Pagination & Filtering

### Standard Query Parameters
- `page`: Page number (default: 1)
- `limit`: Items per page (default: 20, max: 100)
- `sort`: Sort field and direction (e.g., "created:desc")
- `filter`: JSON object with filter criteria

### Response Format
```json
{
  "data": [],
  "pagination": {
    "page": 1,
    "limit": 20,
    "total": 100,
    "pages": 5
  }
}
```
