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
  cancelDrag: () => void;
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
      
      // Find the closest drop zone with improved detection
      let closestZoneId: string | null = null;
      let closestDistance = Infinity;
      
      dropZones.forEach((zone, id) => {
        const rect = zone.rect;
        
        // Calculate distances to zone edges and center
        const horizontalDistance = x < rect.left ? rect.left - x : x > rect.right ? x - rect.right : 0;
        const verticalDistance = y < rect.top ? rect.top - y : y > rect.bottom ? y - rect.bottom : 0;
        
        // Add more forgiving margins for middle zones
        const margin = zone.position === 1 ? 25 : 15; // Larger margin for middle position
        const expandedRect = {
          left: rect.left - margin,
          right: rect.right + margin,
          top: rect.top - margin,
          bottom: rect.bottom + margin,
        };
        
        // Check if pointer is within expanded zone
        if (x >= expandedRect.left && x <= expandedRect.right && 
            y >= expandedRect.top && y <= expandedRect.bottom) {
          
          // Calculate weighted distance (give preference to vertical alignment)
          const distance = Math.sqrt(
            Math.pow(horizontalDistance * 1.5, 2) + // Weight horizontal distance more
            Math.pow(verticalDistance, 2)
          );
          
          // Give slight preference to middle zone when distances are close
          const adjustedDistance = zone.position === 1 ? distance * 0.9 : distance;
          
          if (adjustedDistance < closestDistance) {
            closestDistance = adjustedDistance;
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

  const cancelDrag = useCallback(() => {
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
      cancelDrag,
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