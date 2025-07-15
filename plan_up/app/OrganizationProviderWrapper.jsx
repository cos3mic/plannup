import React from 'react';
import { useUser } from '@clerk/clerk-expo';
import { OrganizationProvider } from '../components/OrganizationContext';

export default function OrganizationProviderWrapper({ children }) {
  const { user } = useUser();
  const userEmail =
    user?.primaryEmailAddress?.emailAddress ||
    (user?.emailAddresses && user.emailAddresses[0]?.emailAddress) ||
    '';
  return (
    <OrganizationProvider userEmail={userEmail}>
      {children}
    </OrganizationProvider>
  );
} 