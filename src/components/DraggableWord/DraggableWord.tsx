import React, { useRef, useCallback, useEffect } from 'react';
import { useDragContext } from './DragContext';
import './DraggableWord.css';

interface DraggableWordProps {
  word: string;
  fontClass: string;
  correctPosition: number;
  onDragStart?: () => void;
  onDragEnd?: () => void;
  isUsed?: boolean;
}

const DraggableWord: React.FC<DraggableWordProps> = ({ 
  word, 
  fontClass,
  correctPosition,
  onDragStart, 
  onDragEnd,
  isUsed = false
}) => {
  const wordRef = useRef<HTMLDivElement>(null);
  const { startDrag, updateDrag, dragState } = useDragContext();
  const isDraggingThis = dragState?.word === word && dragState?.isDragging;

  const handlePointerDown = useCallback((e: React.PointerEvent) => {
    if (isUsed) return; // Prevent dragging used words
    
    e.preventDefault();
    e.stopPropagation();
    
    if (wordRef.current) {
      const x = e.clientX;
      const y = e.clientY;
      
      startDrag(word, fontClass, x, y, correctPosition);
      onDragStart?.();
      
      // Set pointer capture for better touch handling
      try {
        wordRef.current.setPointerCapture(e.pointerId);
      } catch (error) {
        console.warn('Pointer capture failed:', error);
        // Continue without pointer capture
      }
    }
  }, [word, fontClass, correctPosition, startDrag, onDragStart, isUsed]);

  const handlePointerMove = useCallback((e: React.PointerEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (isDraggingThis) {
      updateDrag(e.clientX, e.clientY);
    }
  }, [isDraggingThis, updateDrag]);

  const handlePointerUp = useCallback((e: React.PointerEvent) => {
    e.preventDefault();
    e.stopPropagation();
    // Only release pointer capture, do not call stopDrag or onDragEnd
    if (isDraggingThis && wordRef.current) {
      try {
        wordRef.current.releasePointerCapture(e.pointerId);
      } catch (error) {
        console.warn('Pointer release failed:', error);
      }
    }
  }, [isDraggingThis]);

  const handlePointerCancel = useCallback((e: React.PointerEvent) => {
    e.preventDefault();
    e.stopPropagation();
    // Only release pointer capture, do not call stopDrag or onDragEnd
    if (isDraggingThis && wordRef.current) {
      try {
        wordRef.current.releasePointerCapture(e.pointerId);
      } catch (error) {
        console.warn('Pointer release failed:', error);
      }
    }
  }, [isDraggingThis]);

  // Global pointer move handler for better performance
  useEffect(() => {
    const handleGlobalPointerMove = (e: PointerEvent) => {
      if (isDraggingThis) {
        updateDrag(e.clientX, e.clientY);
      }
    };
    document.addEventListener('pointermove', handleGlobalPointerMove, { passive: false });
    return () => {
      document.removeEventListener('pointermove', handleGlobalPointerMove);
    };
  }, [isDraggingThis, updateDrag]);

  return (
    <div
      ref={wordRef}
      className={`draggable-word ${fontClass} ${isDraggingThis ? 'dragging' : ''} ${isUsed ? 'used' : ''}`}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      onPointerCancel={handlePointerCancel}
      draggable={false}
      style={{
        visibility: isDraggingThis ? 'hidden' : 'visible',
      }}
    >
      {word}
    </div>
  );
};

export default DraggableWord; 