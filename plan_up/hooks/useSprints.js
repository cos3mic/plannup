import { useState, useCallback } from 'react';

export const useSprints = () => {
  const [sprints, setSprints] = useState([
    {
      id: '1',
      name: 'Sprint 23',
      startDate: new Date('2024-01-15'),
      endDate: new Date('2024-01-29'),
      status: 'active', // active, completed, planned
      goal: 'Complete mobile app authentication and dashboard features',
      issues: ['1', '2', '4'], // issue IDs
      velocity: 85,
      capacity: 100,
      teamMembers: ['John Doe', 'Alice Smith', 'Mike Johnson', 'Sarah Wilson', 'David Brown'],
    },
    {
      id: '2',
      name: 'Sprint 22',
      startDate: new Date('2024-01-01'),
      endDate: new Date('2024-01-14'),
      status: 'completed',
      goal: 'Implement core API endpoints and database schema',
      issues: ['3', '5'],
      velocity: 92,
      capacity: 100,
      teamMembers: ['John Doe', 'Alice Smith', 'Sarah Wilson', 'David Brown', 'Jane Smith'],
    },
    {
      id: '3',
      name: 'Sprint 24',
      startDate: new Date('2024-01-30'),
      endDate: new Date('2024-02-12'),
      status: 'planned',
      goal: 'Focus on UI/UX improvements and performance optimization',
      issues: [],
      velocity: 0,
      capacity: 100,
      teamMembers: ['John Doe', 'Alice Smith', 'Mike Johnson', 'Sarah Wilson', 'David Brown', 'Jane Smith', 'Robert Chen'],
    },
  ]);

  const addSprint = useCallback((sprint) => {
    const newSprint = {
      id: Date.now().toString(),
      velocity: 0,
      issues: [],
      ...sprint,
    };
    setSprints(prev => [newSprint, ...prev]);
  }, []);

  const updateSprint = useCallback((id, updates) => {
    setSprints(prev => 
      prev.map(sprint => 
        sprint.id === id ? { ...sprint, ...updates } : sprint
      )
    );
  }, []);

  const deleteSprint = useCallback((id) => {
    setSprints(prev => prev.filter(sprint => sprint.id !== id));
  }, []);

  const addIssueToSprint = useCallback((sprintId, issueId) => {
    setSprints(prev => 
      prev.map(sprint => 
        sprint.id === sprintId 
          ? { ...sprint, issues: [...sprint.issues, issueId] }
          : sprint
      )
    );
  }, []);

  const removeIssueFromSprint = useCallback((sprintId, issueId) => {
    setSprints(prev => 
      prev.map(sprint => 
        sprint.id === sprintId 
          ? { ...sprint, issues: sprint.issues.filter(id => id !== issueId) }
          : sprint
      )
    );
  }, []);

  const getActiveSprint = useCallback(() => {
    return sprints.find(sprint => sprint.status === 'active');
  }, [sprints]);

  const getSprintById = useCallback((id) => {
    return sprints.find(sprint => sprint.id === id);
  }, [sprints]);

  return {
    sprints,
    addSprint,
    updateSprint,
    deleteSprint,
    addIssueToSprint,
    removeIssueFromSprint,
    getActiveSprint,
    getSprintById,
  };
}; 