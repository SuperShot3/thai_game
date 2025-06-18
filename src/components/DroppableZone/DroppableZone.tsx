import React, { useRef, useEffect, useState } from 'react';
import { useDragContext } from '../DraggableWord/DragContext';
import './DroppableZone.css';

interface DroppableZoneProps {
  position: number;
  onDrop: (word: string, position: number) => void;
  isFilled: boolean;
  filledWord?: string;
  fontClass?: string;
}

const DroppableZone: React.FC<DroppableZoneProps> = ({ 
  position, 
  onDrop, 
  isFilled, 
  filledWord, 
  fontClass 
}) => {
  const zoneRef = useRef<HTMLDivElement>(null);
  const { dragState, registerDropZone, unregisterDropZone, getActiveDropZone, cancelDrag } = useDragContext();
  const [isDragOver, setIsDragOver] = useState(false);
  const zoneId = `drop-zone-${position}`;

  // Register this drop zone with the drag context
  useEffect(() => {
    if (zoneRef.current) {
      const rect = zoneRef.current.getBoundingClientRect();
      registerDropZone(zoneId, rect, position);
      
      // Update rect on resize
      const updateRect = () => {
        if (zoneRef.current) {
          const newRect = zoneRef.current.getBoundingClientRect();
          registerDropZone(zoneId, newRect, position);
        }
      };
      
      window.addEventListener('resize', updateRect);
      return () => {
        window.removeEventListener('resize', updateRect);
        unregisterDropZone(zoneId);
      };
    }
  }, [zoneId, position, registerDropZone, unregisterDropZone]);

  // Check if this zone is the active drop zone
  useEffect(() => {
    const activeZoneId = getActiveDropZone();
    setIsDragOver(activeZoneId === zoneId);
  }, [getActiveDropZone, zoneId]);

  const handlePointerUp = (e: React.PointerEvent) => {
    e.preventDefault();
    
    if (dragState && dragState.isDragging) {
      // Use the active drop zone from context instead of relying on pointer position
      const activeZoneId = getActiveDropZone();
      
      if (activeZoneId === zoneId && !isFilled) {
        // Valid drop - word is over this zone and zone is empty
        onDrop(dragState.word, position);
      } else {
        // Invalid drop - cancel the drag
        cancelDrag();
      }
    }
  };

  const handlePointerEnter = (e: React.PointerEvent) => {
    e.preventDefault();
    // This is now handled by the drag context, but keep for fallback
  };

  const handlePointerLeave = (e: React.PointerEvent) => {
    e.preventDefault();
    // This is now handled by the drag context, but keep for fallback
  };

  return (
    <div
      ref={zoneRef}
      className={`droppable-zone ${isFilled ? 'filled' : ''} ${isDragOver ? 'drag-over' : ''}`}
      onPointerEnter={handlePointerEnter}
      onPointerLeave={handlePointerLeave}
      data-position={position}
    >
      {isFilled && filledWord && (
        <span className={`filled-word ${fontClass || ''}`}>
          {filledWord}
        </span>
      )}
    </div>
  );
};

export default DroppableZone; 