import { useState, useCallback } from 'react';

export const useIssues = () => {
  const [issues, setIssues] = useState([
    {
      id: '1',
      key: 'MAD-1',
      title: 'Fix login authentication bug',
      description: 'Users are experiencing authentication failures when logging in with valid credentials. Need to investigate and fix the authentication flow.',
      project: 'MAD',
      priority: 'High',
      status: 'In Progress',
      type: 'Bug',
      assignee: 'John Doe',
      reporter: 'Alice Smith',
      created: new Date('2024-01-15T10:30:00'),
      updated: new Date('2024-01-20T14:45:00'),
      dueDate: new Date('2024-01-25'),
      estimatedHours: 8,
      loggedHours: 4,
      storyPoints: 5,
      labels: ['authentication', 'critical'],
      components: ['frontend', 'backend'],
      epic: 'MAD-EPIC-1',
      sprint: '1',
      comments: [
        {
          id: '1',
          author: 'John Doe',
          content: 'Started investigating the authentication flow. Found potential issue in token validation.',
          timestamp: new Date('2024-01-18T09:15:00'),
        },
        {
          id: '2',
          author: 'Alice Smith',
          content: 'Can you also check if this affects the mobile app?',
          timestamp: new Date('2024-01-18T11:30:00'),
        },
      ],
      attachments: [
        {
          id: '1',
          name: 'auth_error_log.png',
          size: '2.3 MB',
          uploadedBy: 'John Doe',
          uploadedAt: new Date('2024-01-18T09:20:00'),
        },
      ],
      timeLogs: [
        {
          id: '1',
          author: 'John Doe',
          hours: 2,
          description: 'Initial investigation and debugging',
          date: new Date('2024-01-18'),
        },
        {
          id: '2',
          author: 'John Doe',
          hours: 2,
          description: 'Fixed token validation logic',
          date: new Date('2024-01-19'),
        },
      ],
      decisionLog: [], // Add decisionLog
    },
    {
      id: '2',
      key: 'MAD-2',
      title: 'Implement user dashboard',
      description: 'Create a comprehensive user dashboard that displays user profile, recent activities, and quick actions.',
      project: 'MAD',
      priority: 'Medium',
      status: 'To Do',
      type: 'Story',
      assignee: 'Alice Smith',
      reporter: 'Mike Johnson',
      created: new Date('2024-01-10T08:00:00'),
      updated: new Date('2024-01-15T16:20:00'),
      dueDate: new Date('2024-02-01'),
      estimatedHours: 16,
      loggedHours: 0,
      storyPoints: 8,
      labels: ['dashboard', 'ui'],
      components: ['frontend'],
      epic: 'MAD-EPIC-1',
      sprint: '1',
      comments: [],
      attachments: [],
      timeLogs: [],
      decisionLog: [],
    },
    {
      id: '3',
      key: 'WRD-1',
      title: 'Design mobile app icons',
      description: 'Create a set of custom icons for the mobile application following the new design system.',
      project: 'WRD',
      priority: 'Low',
      status: 'Done',
      type: 'Task',
      assignee: 'Mike Johnson',
      reporter: 'Sarah Wilson',
      created: new Date('2024-01-05T14:00:00'),
      updated: new Date('2024-01-12T17:30:00'),
      dueDate: new Date('2024-01-15'),
      estimatedHours: 12,
      loggedHours: 12,
      storyPoints: 3,
      labels: ['design', 'icons'],
      components: ['design'],
      epic: 'WRD-EPIC-1',
      sprint: '2',
      comments: [
        {
          id: '3',
          author: 'Mike Johnson',
          content: 'Completed all icons. Ready for review.',
          timestamp: new Date('2024-01-12T17:00:00'),
        },
      ],
      attachments: [
        {
          id: '2',
          name: 'app_icons.zip',
          size: '5.1 MB',
          uploadedBy: 'Mike Johnson',
          uploadedAt: new Date('2024-01-12T17:25:00'),
        },
      ],
      timeLogs: [
        {
          id: '3',
          author: 'Mike Johnson',
          hours: 12,
          description: 'Design and export all app icons',
          date: new Date('2024-01-12'),
        },
      ],
      decisionLog: [],
    },
    {
      id: '4',
      key: 'API-1',
      title: 'API endpoint testing',
      description: 'Comprehensive testing of all API endpoints to ensure reliability and performance.',
      project: 'API',
      priority: 'High',
      status: 'In Progress',
      type: 'Bug',
      assignee: 'Sarah Wilson',
      reporter: 'David Brown',
      created: new Date('2024-01-16T11:00:00'),
      updated: new Date('2024-01-21T13:15:00'),
      dueDate: new Date('2024-01-28'),
      estimatedHours: 20,
      loggedHours: 8,
      storyPoints: 13,
      labels: ['testing', 'api'],
      components: ['backend', 'testing'],
      epic: 'API-EPIC-1',
      sprint: '1',
      comments: [
        {
          id: '4',
          author: 'Sarah Wilson',
          content: 'Found several performance issues in the user endpoints.',
          timestamp: new Date('2024-01-20T10:00:00'),
        },
      ],
      attachments: [],
      timeLogs: [
        {
          id: '4',
          author: 'Sarah Wilson',
          hours: 8,
          description: 'API testing and performance analysis',
          date: new Date('2024-01-20'),
        },
      ],
      decisionLog: [],
    },
    {
      id: '5',
      key: 'DBM-1',
      title: 'Database schema update',
      description: 'Update the database schema to support new user features and improve performance.',
      project: 'DBM',
      priority: 'Medium',
      status: 'To Do',
      type: 'Story',
      assignee: 'David Brown',
      reporter: 'John Doe',
      created: new Date('2024-01-08T09:30:00'),
      updated: new Date('2024-01-14T15:45:00'),
      dueDate: new Date('2024-02-05'),
      estimatedHours: 24,
      loggedHours: 0,
      storyPoints: 13,
      labels: ['database', 'migration'],
      components: ['backend', 'database'],
      epic: 'DBM-EPIC-1',
      sprint: '2',
      comments: [],
      attachments: [],
      timeLogs: [],
      decisionLog: [],
    },
  ]);

  const addIssue = useCallback((issue) => {
    const newIssue = {
      id: Date.now().toString(),
      key: `${issue.project}-${Date.now()}`,
      created: new Date(),
      updated: new Date(),
      loggedHours: 0,
      comments: [],
      attachments: [],
      timeLogs: [],
      decisionLog: [], // Add decisionLog
      ...issue,
    };
    setIssues(prev => [newIssue, ...prev]);
  }, []);

  const updateIssue = useCallback((id, updates) => {
    setIssues(prev => 
      prev.map(issue => 
        issue.id === id 
          ? { ...issue, ...updates, updated: new Date() }
          : issue
      )
    );
  }, []);

  const deleteIssue = useCallback((id) => {
    setIssues(prev => prev.filter(issue => issue.id !== id));
  }, []);

  const addComment = useCallback((issueId, comment) => {
    const newComment = {
      id: Date.now().toString(),
      timestamp: new Date(),
      ...comment,
    };
    setIssues(prev => 
      prev.map(issue => 
        issue.id === issueId 
          ? { 
              ...issue, 
              comments: [...issue.comments, newComment],
              updated: new Date()
            }
          : issue
      )
    );
  }, []);

  const addTimeLog = useCallback((issueId, timeLog) => {
    const newTimeLog = {
      id: Date.now().toString(),
      date: new Date(),
      ...timeLog,
    };
    setIssues(prev => 
      prev.map(issue => 
        issue.id === issueId 
          ? { 
              ...issue, 
              timeLogs: [...issue.timeLogs, newTimeLog],
              loggedHours: issue.loggedHours + timeLog.hours,
              updated: new Date()
            }
          : issue
      )
    );
  }, []);

  const addAttachment = useCallback((issueId, attachment) => {
    const newAttachment = {
      id: Date.now().toString(),
      uploadedAt: new Date(),
      ...attachment,
    };
    setIssues(prev => 
      prev.map(issue => 
        issue.id === issueId 
          ? { 
              ...issue, 
              attachments: [...issue.attachments, newAttachment],
              updated: new Date()
            }
          : issue
      )
    );
  }, []);

  // Add a decision log entry to an issue
  const addDecisionLogToIssue = useCallback((issueId, entry) => {
    setIssues(prevIssues => prevIssues.map(issue =>
      issue.id === issueId
        ? {
            ...issue,
            decisionLog: [
              ...issue.decisionLog,
              {
                id: `log-${Date.now()}`,
                ...entry,
                createdAt: Date.now(),
              },
            ],
          }
        : issue
    ));
  }, []);

  const getIssueById = useCallback((id) => {
    return issues.find(issue => issue.id === id);
  }, [issues]);

  const getIssuesBySprint = useCallback((sprintId) => {
    return issues.filter(issue => issue.sprint === sprintId);
  }, [issues]);

  const getIssuesByProject = useCallback((project) => {
    return issues.filter(issue => issue.project === project);
  }, [issues]);

  const getIssuesByAssignee = useCallback((assignee) => {
    return issues.filter(issue => issue.assignee === assignee);
  }, [issues]);

  const getIssuesByStatus = useCallback((status) => {
    return issues.filter(issue => issue.status === status);
  }, [issues]);

  const searchIssues = useCallback((query) => {
    const lowercaseQuery = query.toLowerCase();
    return issues.filter(issue => 
      issue.title.toLowerCase().includes(lowercaseQuery) ||
      issue.description.toLowerCase().includes(lowercaseQuery) ||
      issue.key.toLowerCase().includes(lowercaseQuery) ||
      issue.assignee.toLowerCase().includes(lowercaseQuery)
    );
  }, [issues]);

  return {
    issues,
    addIssue,
    updateIssue,
    deleteIssue,
    addComment,
    addTimeLog,
    addAttachment,
    addDecisionLogToIssue,
    getIssueById,
    getIssuesBySprint,
    getIssuesByProject,
    getIssuesByAssignee,
    getIssuesByStatus,
    searchIssues,
  };
}; 