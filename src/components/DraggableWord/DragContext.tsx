import React, { createContext, useContext, useState, useCallback, ReactNode } from 'react';

interface DragState {
  word: string;
  fontClass: string;
  x: number;
  y: number;
  isDragging: boolean;
  activeDropZoneId: string | null;
}

interface DropZoneInfo {
  id: string;
  rect: DOMRect;
  position: number;
}

interface DragContextType {
  dragState: DragState | null;
  startDrag: (word: string, fontClass: string, x: number, y: number) => void;
  updateDrag: (x: number, y: number) => void;
  stopDrag: () => void;
  registerDropZone: (id: string, rect: DOMRect, position: number) => void;
  unregisterDropZone: (id: string) => void;
  getActiveDropZone: () => string | null;
  dropZones: Map<string, DropZoneInfo>;
}

const DragContext = createContext<DragContextType | undefined>(undefined);

export const DragProvider = ({ children }: { children: ReactNode }) => {
  const [dragState, setDragState] = useState<DragState | null>(null);
  const [dropZones, setDropZones] = useState<Map<string, DropZoneInfo>>(new Map());

  const startDrag = useCallback((word: string, fontClass: string, x: number, y: number) => {
    setDragState({ word, fontClass, x, y, isDragging: true, activeDropZoneId: null });
  }, []);

  const updateDrag = useCallback((x: number, y: number) => {
    setDragState(prev => {
      if (!prev || !prev.isDragging) return prev;
      
      // Find the closest drop zone
      let closestZoneId: string | null = null;
      let closestDistance = Infinity;
      
      dropZones.forEach((zone, id) => {
        const zoneCenterX = zone.rect.left + zone.rect.width / 2;
        const zoneCenterY = zone.rect.top + zone.rect.height / 2;
        
        // Add 15px margin for more forgiving drop detection
        const margin = 15;
        const expandedRect = {
          left: zone.rect.left - margin,
          right: zone.rect.right + margin,
          top: zone.rect.top - margin,
          bottom: zone.rect.bottom + margin,
        };
        
        // Check if pointer is within expanded zone
        if (x >= expandedRect.left && x <= expandedRect.right && 
            y >= expandedRect.top && y <= expandedRect.bottom) {
          
          const distance = Math.sqrt(
            Math.pow(x - zoneCenterX, 2) + Math.pow(y - zoneCenterY, 2)
          );
          
          if (distance < closestDistance) {
            closestDistance = distance;
            closestZoneId = id;
          }
        }
      });
      
      return { ...prev, x, y, activeDropZoneId: closestZoneId };
    });
  }, [dropZones]);

  const stopDrag = useCallback(() => {
    setDragState(null);
  }, []);

  const registerDropZone = useCallback((id: string, rect: DOMRect, position: number) => {
    setDropZones(prev => {
      const newMap = new Map(prev);
      newMap.set(id, { id, rect, position });
      return newMap;
    });
  }, []);

  const unregisterDropZone = useCallback((id: string) => {
    setDropZones(prev => {
      const newMap = new Map(prev);
      newMap.delete(id);
      return newMap;
    });
  }, []);

  const getActiveDropZone = useCallback(() => {
    return dragState?.activeDropZoneId || null;
  }, [dragState?.activeDropZoneId]);

  return (
    <DragContext.Provider value={{ 
      dragState, 
      startDrag, 
      updateDrag, 
      stopDrag, 
      registerDropZone, 
      unregisterDropZone, 
      getActiveDropZone,
      dropZones 
    }}>
      {children}
    </DragContext.Provider>
  );
};

export const useDragContext = () => {
  const ctx = useContext(DragContext);
  if (!ctx) throw new Error('useDragContext must be used within a DragProvider');
  return ctx;
}; 