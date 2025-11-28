import React, { createContext, useContext, useState, useEffect } from 'react';

type GridContextType = {
 gridSize: number;
 setGridSize: (gridSize: number) => void;
 getResponsiveGridSize: () => number;
};

const GridContext = createContext<GridContextType | undefined>(undefined);

export const GridProvider = ({ children }: { children: React.ReactNode }) => {
  const [gridSize, setGridSize] = useState(1);

  useEffect(() => {
    // Only run on client after mount
    const storedSize = localStorage.getItem('grid-size');
    setGridSize(storedSize ? JSON.parse(storedSize) : 1);
  }, []);

  useEffect(() => {
    localStorage.setItem('grid-size', gridSize.toString());
  }, [gridSize]);

  // Function to get responsive grid size based on current viewport width
  const getResponsiveGridSize = () => {
    // Safe check for SSR
    if (typeof window === 'undefined') return 1;
    
    // For small screens, use Grid2X2 (grid size 2) as default
    if (window.innerWidth <= 640) {
      return 2;
    }
    
    // Otherwise, return the selected grid size
    return gridSize;
  };

  return (
    <GridContext.Provider value={{
      gridSize,
      setGridSize,
      getResponsiveGridSize
    }}>
      {children}
    </GridContext.Provider>
  );
};

export const useGrid = () => {
  const context = useContext(GridContext);
  if (context === undefined) {
    throw new Error('useGrid must be used within a GridProvider');
  }
  return context;
};
