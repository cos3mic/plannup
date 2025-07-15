import React, { createContext, useContext, useState, useEffect } from 'react';

// Demo: Pre-populate with some dummy orgs
const DEMO_ORGS = [
  { id: 'org-1', name: 'Demo Org Alpha', members: ['emmajunior8166@gmail.com'] },
  { id: 'org-2', name: 'Demo Org Beta', members: [] },
];

const OrganizationContext = createContext();

export function OrganizationProvider({ children, userEmail }) {
  const [organizations, setOrganizations] = useState(DEMO_ORGS);
  const [currentOrgId, setCurrentOrgId] = useState(null);

  // Find orgs the user belongs to
  const myOrgs = organizations.filter(org => org.members.includes(userEmail));

  // Set default org if not set
  useEffect(() => {
    if (!currentOrgId && myOrgs.length > 0) {
      setCurrentOrgId(myOrgs[0].id);
    }
  }, [myOrgs, currentOrgId]);

  // Actions
  const createOrganization = (name) => {
    const newOrg = { id: `org-${Date.now()}`, name, members: [userEmail] };
    setOrganizations(prev => [...prev, newOrg]);
    setCurrentOrgId(newOrg.id);
  };

  const joinOrganization = (orgId) => {
    setOrganizations(prev =>
      prev.map(org =>
        org.id === orgId && !org.members.includes(userEmail)
          ? { ...org, members: [...org.members, userEmail] }
          : org
      )
    );
    setCurrentOrgId(orgId);
  };

  const leaveOrganization = (orgId) => {
    setOrganizations(prev =>
      prev.map(org =>
        org.id === orgId
          ? { ...org, members: org.members.filter(email => email !== userEmail) }
          : org
      )
    );
    setCurrentOrgId(null);
  };

  const value = {
    organizations,
    myOrgs,
    currentOrg: organizations.find(org => org.id === currentOrgId) || null,
    setCurrentOrgId,
    createOrganization,
    joinOrganization,
    leaveOrganization,
  };

  return (
    <OrganizationContext.Provider value={value}>
      {children}
    </OrganizationContext.Provider>
  );
}

export function useOrganizationCustom() {
  return useContext(OrganizationContext);
} 