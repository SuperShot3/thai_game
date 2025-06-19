import React, { createContext, useContext, useState, useCallback, ReactNode, useEffect } from 'react';

interface DragState {
  word: string;
  fontClass: string;
  x: number;
  y: number;
  isDragging: boolean;
  activeDropZoneId: string | null;
  correctPosition?: number;
}

interface DropZoneInfo {
  id: string;
  rect: DOMRect;
  position: number;
  isValidPosition: boolean;
  onDrop: (word: string, position: number) => void;
  isFilled: boolean;
}

interface DragContextType {
  dragState: DragState | null;
  startDrag: (word: string, fontClass: string, x: number, y: number, correctPosition: number) => void;
  updateDrag: (x: number, y: number) => void;
  stopDrag: () => void;
  cancelDrag: () => void;
  registerDropZone: (id: string, rect: DOMRect, position: number, onDrop: (word: string, position: number) => void, isFilled: boolean) => void;
  unregisterDropZone: (id: string) => void;
  getActiveDropZone: () => string | null;
  dropZones: Map<string, DropZoneInfo>;
}

const DragContext = createContext<DragContextType | undefined>(undefined);

export const DragProvider = ({ children }: { children: ReactNode }) => {
  const [dragState, setDragState] = useState<DragState | null>(null);
  const [dropZones, setDropZones] = useState<Map<string, DropZoneInfo>>(new Map());

  const startDrag = useCallback((word: string, fontClass: string, x: number, y: number, correctPosition: number) => {
    setDragState({ word, fontClass, x, y, isDragging: true, activeDropZoneId: null, correctPosition });
  }, []);

  const updateDrag = useCallback((x: number, y: number) => {
    setDragState(prev => {
      if (!prev || !prev.isDragging) return prev;
      
      // Find the closest valid drop zone
      let closestZoneId: string | null = null;
      let closestDistance = Infinity;
      
      dropZones.forEach((zone, id) => {
        const rect = zone.rect;
        
        // Calculate distances to zone edges and center
        const horizontalDistance = x < rect.left ? rect.left - x : x > rect.right ? x - rect.right : 0;
        const verticalDistance = y < rect.top ? rect.top - y : y > rect.bottom ? y - rect.bottom : 0;
        
        // Add margins for better drop detection
        const margin = 15;
        const expandedRect = {
          left: rect.left - margin,
          right: rect.right + margin,
          top: rect.top - margin,
          bottom: rect.bottom + margin,
        };
        
        // Check if pointer is within expanded zone
        if (x >= expandedRect.left && x <= expandedRect.right && 
            y >= expandedRect.top && y <= expandedRect.bottom) {
          
          // Calculate distance
          const distance = Math.sqrt(
            Math.pow(horizontalDistance, 2) + 
            Math.pow(verticalDistance, 2)
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

  const cancelDrag = useCallback(() => {
    setDragState(null);
  }, []);

  const registerDropZone = useCallback((
    id: string, 
    rect: DOMRect, 
    position: number, 
    onDrop: (word: string, position: number) => void,
    isFilled: boolean
  ) => {
    setDropZones(prev => {
      const newMap = new Map(prev);
      newMap.set(id, { 
        id, 
        rect, 
        position,
        isValidPosition: true,
        onDrop,
        isFilled
      });
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

  // Global drop handler
  useEffect(() => {
    const handleGlobalDrop = (e: PointerEvent | TouchEvent) => {
      if (!dragState?.isDragging) return;

      const activeZoneId = dragState.activeDropZoneId;
      if (activeZoneId && dropZones.has(activeZoneId)) {
        const zone = dropZones.get(activeZoneId)!;
        
        // Only allow drop if:
        // 1. The zone is not filled
        // 2. The word's correct position matches this zone's position
        if (!zone.isFilled && dragState.correctPosition === zone.position) {
          zone.onDrop(dragState.word, zone.position);
        }
      }
      
      stopDrag();
    };

    document.addEventListener('pointerup', handleGlobalDrop);
    document.addEventListener('touchend', handleGlobalDrop);

    return () => {
      document.removeEventListener('pointerup', handleGlobalDrop);
      document.removeEventListener('touchend', handleGlobalDrop);
    };
  }, [dragState, dropZones, stopDrag]);

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