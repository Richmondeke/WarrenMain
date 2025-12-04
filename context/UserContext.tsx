import React, { createContext, useContext, useState, ReactNode } from 'react';
import { Role, Profile } from '../types';
import { MOCK_INVESTOR, MOCK_FOUNDER } from '../constants';

interface UserContextType {
  user: Profile;
  role: Role;
  switchRole: () => void;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [role, setRole] = useState<Role>(Role.INVESTOR);
  
  // Computed user based on role for simulation
  const user = role === Role.INVESTOR ? MOCK_INVESTOR : MOCK_FOUNDER;

  const switchRole = () => {
    setRole((prev) => (prev === Role.INVESTOR ? Role.FOUNDER : Role.INVESTOR));
  };

  return (
    <UserContext.Provider value={{ user, role, switchRole }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
};