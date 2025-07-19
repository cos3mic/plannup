import React, { createContext, useContext, useState, useEffect } from 'react';
import PushNotificationService from './PushNotificationService';

// Demo: Pre-populate with some dummy orgs
const DEMO_ORGS = [
  { 
    id: 'org-1', 
    name: 'Demo Org Alpha', 
    members: [
      'emmajunior8166@gmail.com',
      'john.doe@company.com',
      'alice.smith@company.com',
      'mike.johnson@company.com',
      'sarah.wilson@company.com',
      'david.brown@company.com'
    ],
    invites: [
      {
        id: 'inv-1',
        email: 'new.member@company.com',
        invitedBy: 'emmajunior8166@gmail.com',
        invitedAt: new Date('2024-01-15'),
        status: 'pending'
      }
    ]
  },
  { 
    id: 'org-2', 
    name: 'Demo Org Beta', 
    members: [
      'jane.smith@company.com',
      'robert.chen@company.com',
      'emily.davis@company.com',
      'michael.wong@company.com',
      'lisa.garcia@company.com'
    ],
    invites: []
  },
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
    const newOrg = { 
      id: `org-${Date.now()}`, 
      name, 
      members: [userEmail],
      invites: []
    };
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

  // Email invite functionality
  const sendInvite = async (orgId, email, invitedBy = userEmail) => {
    try {
      // Simulate API call to send email invite
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const newInvite = {
        id: `inv-${Date.now()}`,
        email,
        invitedBy,
        invitedAt: new Date(),
        status: 'pending'
      };

      setOrganizations(prev =>
        prev.map(org =>
          org.id === orgId
            ? { ...org, invites: [...org.invites, newInvite] }
            : org
        )
      );

      // Simulate sending email
      console.log(`Invite sent to ${email} for organization ${orgId}`);
      
      // Send push notification to invitee
      const organization = organizations.find(org => org.id === orgId);
      if (organization) {
        await PushNotificationService.sendInviteNotification(
          email,
          organization.name,
          invitedBy
        );
      }
      
      return { success: true, invite: newInvite };
    } catch (error) {
      console.error('Failed to send invite:', error);
      return { success: false, error: error.message };
    }
  };

  const acceptInvite = async (inviteId, orgId) => {
    try {
      // Simulate API call to accept invite
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setOrganizations(prev =>
        prev.map(org =>
          org.id === orgId
            ? {
                ...org,
                members: [...org.members, userEmail],
                invites: org.invites.map(invite =>
                  invite.id === inviteId
                    ? { ...invite, status: 'accepted' }
                    : invite
                )
              }
            : org
        )
      );

      setCurrentOrgId(orgId);
      return { success: true };
    } catch (error) {
      console.error('Failed to accept invite:', error);
      return { success: false, error: error.message };
    }
  };

  const declineInvite = async (inviteId, orgId) => {
    try {
      // Simulate API call to decline invite
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setOrganizations(prev =>
        prev.map(org =>
          org.id === orgId
            ? {
                ...org,
                invites: org.invites.map(invite =>
                  invite.id === inviteId
                    ? { ...invite, status: 'declined' }
                    : invite
                )
              }
            : org
        )
      );

      return { success: true };
    } catch (error) {
      console.error('Failed to decline invite:', error);
      return { success: false, error: error.message };
    }
  };

  const cancelInvite = async (inviteId, orgId) => {
    try {
      // Simulate API call to cancel invite
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setOrganizations(prev =>
        prev.map(org =>
          org.id === orgId
            ? {
                ...org,
                invites: org.invites.filter(invite => invite.id !== inviteId)
              }
            : org
        )
      );

      return { success: true };
    } catch (error) {
      console.error('Failed to cancel invite:', error);
      return { success: false, error: error.message };
    }
  };

  // Get pending invites for current user
  const getPendingInvites = () => {
    return organizations
      .flatMap(org => 
        org.invites
          .filter(invite => invite.email === userEmail && invite.status === 'pending')
          .map(invite => ({ ...invite, orgName: org.name, orgId: org.id }))
      );
  };

  const value = {
    organizations,
    myOrgs,
    currentOrg: organizations.find(org => org.id === currentOrgId) || null,
    setCurrentOrgId,
    createOrganization,
    joinOrganization,
    leaveOrganization,
    sendInvite,
    acceptInvite,
    declineInvite,
    cancelInvite,
    getPendingInvites,
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