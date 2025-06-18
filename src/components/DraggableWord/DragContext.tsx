import React, { createContext, useContext, useState, useCallback, ReactNode } from 'react';

interface DragState {
  word: string;
  fontClass: string;
  x: number;
  y: number;
  isDragging: boolean;
}

interface DragContextType {
  dragState: DragState | null;
  startDrag: (word: string, fontClass: string, x: number, y: number) => void;
  updateDrag: (x: number, y: number) => void;
  stopDrag: () => void;
}

const DragContext = createContext<DragContextType | undefined>(undefined);

export const DragProvider = ({ children }: { children: ReactNode }) => {
  const [dragState, setDragState] = useState<DragState | null>(null);

  const startDrag = useCallback((word: string, fontClass: string, x: number, y: number) => {
    setDragState({ word, fontClass, x, y, isDragging: true });
  }, []);

  const updateDrag = useCallback((x: number, y: number) => {
    setDragState(prev => {
      if (!prev || !prev.isDragging) return prev;
      return { ...prev, x, y };
    });
  }, []);

  const stopDrag = useCallback(() => {
    setDragState(null);
  }, []);

  return (
    <DragContext.Provider value={{ dragState, startDrag, updateDrag, stopDrag }}>
      {children}
    </DragContext.Provider>
  );
};

export const useDragContext = () => {
  const ctx = useContext(DragContext);
  if (!ctx) throw new Error('useDragContext must be used within a DragProvider');
  return ctx;
}; 