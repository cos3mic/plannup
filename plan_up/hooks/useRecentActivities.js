import { useState, useCallback } from 'react';

export const useRecentActivities = () => {
  const [activities, setActivities] = useState([
    {
      id: '1',
      type: 'issue_created',
      title: 'New issue "Mobile app testing" created',
      description: 'Issue created with high priority',
      timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 hours ago
      icon: 'create',
      color: '#FF6B6B',
    },
    {
      id: '2',
      type: 'issue_moved',
      title: 'Issue "Fix login bug" moved to Done',
      description: 'Issue status updated to completed',
      timestamp: new Date(Date.now() - 4 * 60 * 60 * 1000), // 4 hours ago
      icon: 'checkmark-circle',
      color: '#4CAF50',
    },
    {
      id: '3',
      type: 'user_assigned',
      title: 'John Doe assigned to "Dashboard redesign"',
      description: 'User assignment updated',
      timestamp: new Date(Date.now() - 6 * 60 * 60 * 1000), // 6 hours ago
      icon: 'person-add',
      color: '#2196F3',
    },
  ]);

  const addActivity = useCallback((activity) => {
    const newActivity = {
      id: Date.now().toString(),
      timestamp: new Date(),
      ...activity,
    };
    setActivities(prev => [newActivity, ...prev.slice(0, 9)]); // Keep only 10 most recent
  }, []);

  const updateActivity = useCallback((id, updates) => {
    setActivities(prev => 
      prev.map(activity => 
        activity.id === id ? { ...activity, ...updates } : activity
      )
    );
  }, []);

  const deleteActivity = useCallback((id) => {
    setActivities(prev => prev.filter(activity => activity.id !== id));
  }, []);

  return {
    activities,
    addActivity,
    updateActivity,
    deleteActivity,
  };
}; 