import { useState, useCallback } from 'react';

export const useEpics = () => {
  const [epics, setEpics] = useState([
    {
      id: '1',
      key: 'MAD-EPIC-1',
      title: 'Mobile App Authentication & Dashboard',
      description: 'Complete implementation of user authentication system and comprehensive dashboard features for the mobile application.',
      project: 'MAD',
      status: 'In Progress',
      assignee: 'John Doe',
      created: new Date('2024-01-01T09:00:00'),
      updated: new Date('2024-01-20T14:30:00'),
      dueDate: new Date('2024-02-15'),
      storyPoints: 21,
      completedStoryPoints: 8,
      issues: ['1', '2'], // Issue IDs
      color: '#FF6B6B',
      labels: ['authentication', 'dashboard', 'mobile'],
    },
    {
      id: '2',
      key: 'WRD-EPIC-1',
      title: 'Website Redesign & UI/UX',
      description: 'Complete redesign of the website with modern UI/UX principles and improved user experience.',
      project: 'WRD',
      status: 'In Progress',
      assignee: 'Mike Johnson',
      created: new Date('2024-01-05T10:00:00'),
      updated: new Date('2024-01-15T16:45:00'),
      dueDate: new Date('2024-03-01'),
      storyPoints: 34,
      completedStoryPoints: 3,
      issues: ['3'],
      color: '#4ECDC4',
      labels: ['design', 'ui', 'ux'],
    },
    {
      id: '3',
      key: 'API-EPIC-1',
      title: 'API Development & Testing',
      description: 'Development and comprehensive testing of all API endpoints to ensure reliability and performance.',
      project: 'API',
      status: 'In Progress',
      assignee: 'Sarah Wilson',
      created: new Date('2024-01-10T11:00:00'),
      updated: new Date('2024-01-21T13:20:00'),
      dueDate: new Date('2024-02-28'),
      storyPoints: 45,
      completedStoryPoints: 13,
      issues: ['4'],
      color: '#45B7D1',
      labels: ['api', 'testing', 'performance'],
    },
    {
      id: '4',
      key: 'DBM-EPIC-1',
      title: 'Database Migration & Optimization',
      description: 'Complete database migration to support new features and optimize performance for better scalability.',
      project: 'DBM',
      status: 'To Do',
      assignee: 'David Brown',
      created: new Date('2024-01-08T08:30:00'),
      updated: new Date('2024-01-14T15:00:00'),
      dueDate: new Date('2024-03-15'),
      storyPoints: 13,
      completedStoryPoints: 0,
      issues: ['5'],
      color: '#96CEB4',
      labels: ['database', 'migration', 'optimization'],
    },
  ]);

  const addEpic = useCallback((epic) => {
    const newEpic = {
      id: Date.now().toString(),
      key: `${epic.project}-EPIC-${Date.now()}`,
      created: new Date(),
      updated: new Date(),
      completedStoryPoints: 0,
      issues: [],
      ...epic,
    };
    setEpics(prev => [newEpic, ...prev]);
  }, []);

  const updateEpic = useCallback((id, updates) => {
    setEpics(prev => 
      prev.map(epic => 
        epic.id === id 
          ? { ...epic, ...updates, updated: new Date() }
          : epic
      )
    );
  }, []);

  const deleteEpic = useCallback((id) => {
    setEpics(prev => prev.filter(epic => epic.id !== id));
  }, []);

  const addIssueToEpic = useCallback((epicId, issueId) => {
    setEpics(prev => 
      prev.map(epic => 
        epic.id === epicId 
          ? { ...epic, issues: [...epic.issues, issueId] }
          : epic
      )
    );
  }, []);

  const removeIssueFromEpic = useCallback((epicId, issueId) => {
    setEpics(prev => 
      prev.map(epic => 
        epic.id === epicId 
          ? { ...epic, issues: epic.issues.filter(id => id !== issueId) }
          : epic
      )
    );
  }, []);

  const getEpicById = useCallback((id) => {
    return epics.find(epic => epic.id === id);
  }, [epics]);

  const getEpicsByProject = useCallback((project) => {
    return epics.filter(epic => epic.project === project);
  }, [epics]);

  const getEpicsByStatus = useCallback((status) => {
    return epics.filter(epic => epic.status === status);
  }, [epics]);

  const getEpicsByAssignee = useCallback((assignee) => {
    return epics.filter(epic => epic.assignee === assignee);
  }, [epics]);

  const calculateEpicProgress = useCallback((epic) => {
    if (epic.storyPoints === 0) return 0;
    return Math.round((epic.completedStoryPoints / epic.storyPoints) * 100);
  }, []);

  return {
    epics,
    addEpic,
    updateEpic,
    deleteEpic,
    addIssueToEpic,
    removeIssueFromEpic,
    getEpicById,
    getEpicsByProject,
    getEpicsByStatus,
    getEpicsByAssignee,
    calculateEpicProgress,
  };
}; 