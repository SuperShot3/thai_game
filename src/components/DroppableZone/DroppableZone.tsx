import React, { useRef, useEffect, useState, useCallback } from 'react';
import { useDragContext } from '../DraggableWord/DragContext';
import './DroppableZone.css';

interface DroppableZoneProps {
  position: number;
  onDrop: (word: string, position: number) => void;
  onRemove?: (word: string, position: number) => void;
  isFilled: boolean;
  filledWord?: string;
  fontClass?: string;
}

const DroppableZone: React.FC<DroppableZoneProps> = ({ 
  position, 
  onDrop, 
  onRemove,
  isFilled, 
  filledWord, 
  fontClass 
}) => {
  const zoneRef = useRef<HTMLDivElement>(null);
  const { dragState, registerDropZone, unregisterDropZone, getActiveDropZone } = useDragContext();
  const [isDragOver, setIsDragOver] = useState(false);
  const zoneId = `drop-zone-${position}`;

  // Update drop zone registration
  const updateDropZoneRect = useCallback(() => {
    if (zoneRef.current) {
      const rect = zoneRef.current.getBoundingClientRect();
      registerDropZone(zoneId, rect, position, onDrop, isFilled);
    }
  }, [zoneId, position, registerDropZone, onDrop, isFilled]);

  // Register this drop zone with the drag context
  useEffect(() => {
    updateDropZoneRect();
    
    // Update rect on resize and scroll
    window.addEventListener('resize', updateDropZoneRect);
    window.addEventListener('scroll', updateDropZoneRect);
    
    // Update rect periodically during drag
    let intervalId: number;
    if (dragState?.isDragging) {
      intervalId = window.setInterval(updateDropZoneRect, 100);
    }
    
    return () => {
      window.removeEventListener('resize', updateDropZoneRect);
      window.removeEventListener('scroll', updateDropZoneRect);
      if (intervalId) {
        window.clearInterval(intervalId);
      }
      unregisterDropZone(zoneId);
    };
  }, [zoneId, position, registerDropZone, unregisterDropZone, updateDropZoneRect, dragState?.isDragging]);

  // Check if this zone is the active drop zone
  useEffect(() => {
    const activeZoneId = getActiveDropZone();
    setIsDragOver(activeZoneId === zoneId);
  }, [getActiveDropZone, zoneId]);

  const handlePointerEnter = (e: React.PointerEvent) => {
    e.preventDefault();
    e.stopPropagation();
    updateDropZoneRect();
  };

  const handlePointerLeave = (e: React.PointerEvent) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDoubleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (isFilled && filledWord && onRemove) {
      onRemove(filledWord, position);
    }
  };

  return (
    <div
      ref={zoneRef}
      className={`droppable-zone ${isFilled ? 'filled' : ''} ${isDragOver && dragState?.correctPosition === position ? 'drag-over' : ''}`}
      onPointerEnter={handlePointerEnter}
      onPointerLeave={handlePointerLeave}
      onPointerMove={updateDropZoneRect}
      onDoubleClick={handleDoubleClick}
      data-position={position}
      style={{
        touchAction: 'none',
        userSelect: 'none',
        WebkitUserSelect: 'none'
      }}
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