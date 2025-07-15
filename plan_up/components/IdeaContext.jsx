import React, { createContext, useContext, useState } from 'react';

const DEMO_IDEAS = [
  {
    id: 'idea-1',
    title: 'Automated Sprint Retrospective',
    description: 'A feature to collect feedback and lessons learned during the sprint, not just at the end.',
    status: 'New',
    upvotes: 3,
    comments: [
      { id: 'c1', author: 'emmajunior8166@gmail.com', text: 'Love this! Would help us improve faster.' }
    ],
    author: 'emmajunior8166@gmail.com',
    createdAt: Date.now() - 1000000,
    promotedBy: [], // Add promotedBy array
  },
  {
    id: 'idea-2',
    title: 'Personal Focus Dashboard',
    description: 'A dashboard to help users manage their workload and avoid burnout.',
    status: 'Discussing',
    upvotes: 5,
    comments: [],
    author: 'emmajunior8166@gmail.com',
    createdAt: Date.now() - 500000,
    promotedBy: [], // Add promotedBy array
  },
];

const IdeaContext = createContext();

export function IdeaProvider({ children, userEmail }) {
  const [ideas, setIdeas] = useState(DEMO_IDEAS);

  const addIdea = (title, description) => {
    const newIdea = {
      id: `idea-${Date.now()}`,
      title,
      description,
      status: 'New',
      upvotes: 0,
      comments: [],
      author: userEmail,
      createdAt: Date.now(),
      promotedBy: [], // Add promotedBy to new ideas
    };
    setIdeas(prev => [newIdea, ...prev]);
  };

  const upvoteIdea = (id) => {
    setIdeas(prev => prev.map(idea =>
      idea.id === id ? { ...idea, upvotes: idea.upvotes + 1 } : idea
    ));
  };

  const addComment = (id, author, text) => {
    setIdeas(prev => prev.map(idea =>
      idea.id === id
        ? { ...idea, comments: [...idea.comments, { id: `c-${Date.now()}`, author, text }] }
        : idea
    ));
  };

  const updateIdeaStatus = (id, status) => {
    setIdeas(prev => prev.map(idea =>
      idea.id === id ? { ...idea, status } : idea
    ));
  };

  // For future: promote idea to project/issue
  const promoteIdea = (id) => {
    // Placeholder: could trigger modal or callback
    updateIdeaStatus(id, 'Promoted');
  };

  // Toggle promote/unpromote for the current user
  const togglePromoteIdea = (id) => {
    setIdeas(prev => prev.map(idea => {
      if (idea.id !== id) return idea;
      const hasPromoted = idea.promotedBy.includes(userEmail);
      return {
        ...idea,
        promotedBy: hasPromoted
          ? idea.promotedBy.filter(email => email !== userEmail)
          : [...idea.promotedBy, userEmail],
      };
    }));
  };

  // Update a comment by id (only if author matches)
  const updateComment = (ideaId, commentId, newText) => {
    setIdeas(prev => prev.map(idea => {
      if (idea.id !== ideaId) return idea;
      return {
        ...idea,
        comments: idea.comments.map(c =>
          c.id === commentId && c.author === userEmail
            ? { ...c, text: newText }
            : c
        ),
      };
    }));
  };

  const value = {
    ideas,
    addIdea,
    upvoteIdea,
    addComment,
    updateIdeaStatus,
    // promoteIdea, // Remove old promote
    togglePromoteIdea,
    updateComment,
  };

  return (
    <IdeaContext.Provider value={value}>
      {children}
    </IdeaContext.Provider>
  );
}

export function useIdeas() {
  return useContext(IdeaContext);
} 