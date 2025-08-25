import React, { createContext, useState, useContext, ReactNode } from 'react';

interface LayoutContextProps {
  isSidebarCollapsed: boolean;
  setIsSidebarCollapsed: (isCollapsed: boolean) => void;
  pageTitle: string;
  setPageTitle: (title: string) => void;
}

const LayoutContext = createContext<LayoutContextProps | undefined>(undefined);

export const LayoutProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [pageTitle, setPageTitle] = useState('Dashboard');

  return (
    <LayoutContext.Provider value={{ isSidebarCollapsed, setIsSidebarCollapsed, pageTitle, setPageTitle }}>
      {children}
    </LayoutContext.Provider>
  );
};

export const useLayout = (): LayoutContextProps => {
  const context = useContext(LayoutContext);
  if (!context) {
    throw new Error('useLayout must be used within a LayoutProvider');
  }
  return context;
}; 