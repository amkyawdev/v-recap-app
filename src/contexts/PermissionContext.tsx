import React, { createContext, useContext, useState, ReactNode } from 'react';

interface PermissionContextType {
  hasPermission: boolean;
  folderName: string;
  requestPermissions: () => Promise<boolean>;
  checkSystemPermission: () => Promise<boolean>;
  setFolderName: (name: string) => void;
}

const PermissionContext = createContext<PermissionContextType | undefined>(undefined);

export const PermissionProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [hasPermission, setHasPermission] = useState(false);
  const [folderName, setFolderNameState] = useState('');

  const requestPermissions = async (): Promise<boolean> => {
    try {
      // Simulate permission request
      await new Promise(resolve => setTimeout(resolve, 500));
      setHasPermission(true);
      return true;
    } catch (error) {
      console.error('Permission request failed:', error);
      return false;
    }
  };

  const checkSystemPermission = async (): Promise<boolean> => {
    return true; // In real app, check actual system permissions
  };

  const setFolderName = (name: string) => {
    setFolderNameState(name);
    localStorage.setItem('recap_folder', name);
  };

  return (
    <PermissionContext.Provider value={{
      hasPermission,
      folderName,
      requestPermissions,
      checkSystemPermission,
      setFolderName
    }}>
      {children}
    </PermissionContext.Provider>
  );
};

export const usePermissions = () => {
  const context = useContext(PermissionContext);
  if (!context) {
    throw new Error('usePermissions must be used within a PermissionProvider');
  }
  return context;
};