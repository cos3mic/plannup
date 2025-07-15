import React, { createContext, useContext, useState } from 'react';

const DEMO_FEEDBACK = [
  {
    id: 'retro-1',
    type: 'Went Well',
    text: 'Daily standups are concise and helpful.',
    author: 'emmajunior8166@gmail.com',
    createdAt: Date.now() - 7200000,
    resolved: false,
  },
  {
    id: 'retro-2',
    type: 'To Improve',
    text: 'Sprint planning often runs over time.',
    author: 'emmajunior8166@gmail.com',
    createdAt: Date.now() - 3600000,
    resolved: false,
  },
  {
    id: 'retro-3',
    type: 'Action Item',
    text: 'Try using a timer for meetings.',
    author: 'emmajunior8166@gmail.com',
    createdAt: Date.now() - 1800000,
    resolved: false,
  },
];

const RetrospectiveContext = createContext();

export function RetrospectiveProvider({ children, userEmail }) {
  const [feedback, setFeedback] = useState(DEMO_FEEDBACK);

  const addFeedback = (type, text) => {
    const newFeedback = {
      id: `retro-${Date.now()}`,
      type,
      text,
      author: userEmail,
      createdAt: Date.now(),
      resolved: false,
    };
    setFeedback(prev => [newFeedback, ...prev]);
  };

  const editFeedback = (id, newText) => {
    setFeedback(prev => prev.map(f =>
      f.id === id && f.author === userEmail ? { ...f, text: newText } : f
    ));
  };

  const resolveFeedback = (id) => {
    setFeedback(prev => prev.map(f =>
      f.id === id ? { ...f, resolved: true } : f
    ));
  };

  const unresolveFeedback = (id) => {
    setFeedback(prev => prev.map(f =>
      f.id === id ? { ...f, resolved: false } : f
    ));
  };

  const value = {
    feedback,
    addFeedback,
    editFeedback,
    resolveFeedback,
    unresolveFeedback,
  };

  return (
    <RetrospectiveContext.Provider value={value}>
      {children}
    </RetrospectiveContext.Provider>
  );
}

export function useRetrospective() {
  return useContext(RetrospectiveContext);
} 