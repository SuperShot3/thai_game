import React, { useRef, useCallback, useEffect } from 'react';
import { useDragContext } from './DragContext';
import './DraggableWord.css';

interface DraggableWordProps {
  word: string;
  fontClass: string;
  onDragStart?: () => void;
  onDragEnd?: () => void;
  isUsed?: boolean;
}

const DraggableWord: React.FC<DraggableWordProps> = ({ 
  word, 
  fontClass, 
  onDragStart, 
  onDragEnd,
  isUsed = false
}) => {
  const wordRef = useRef<HTMLDivElement>(null);
  const { startDrag, updateDrag, stopDrag, dragState } = useDragContext();
  const isDraggingThis = dragState?.word === word && dragState?.isDragging;

  const handlePointerDown = useCallback((e: React.PointerEvent) => {
    if (isUsed) return; // Prevent dragging used words
    
    e.preventDefault();
    e.stopPropagation();
    
    if (wordRef.current) {
      const x = e.clientX;
      const y = e.clientY;
      
      startDrag(word, fontClass, x, y);
      onDragStart?.();
      
      // Set pointer capture for better touch handling
      wordRef.current.setPointerCapture(e.pointerId);
    }
  }, [word, fontClass, startDrag, onDragStart, isUsed]);

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
    
    if (isDraggingThis) {
      // Release pointer capture
      if (wordRef.current) {
        wordRef.current.releasePointerCapture(e.pointerId);
      }
      
      stopDrag();
      onDragEnd?.();
    }
  }, [isDraggingThis, stopDrag, onDragEnd]);

  const handlePointerCancel = useCallback((e: React.PointerEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (isDraggingThis) {
      // Release pointer capture
      if (wordRef.current) {
        wordRef.current.releasePointerCapture(e.pointerId);
      }
      
      stopDrag();
      onDragEnd?.();
    }
  }, [isDraggingThis, stopDrag, onDragEnd]);

  // Global pointer move handler for better performance
  useEffect(() => {
    const handleGlobalPointerMove = (e: PointerEvent) => {
      if (isDraggingThis) {
        updateDrag(e.clientX, e.clientY);
      }
    };

    const handleGlobalPointerUp = (e: PointerEvent) => {
      if (isDraggingThis) {
        stopDrag();
        onDragEnd?.();
      }
    };

    if (isDraggingThis) {
      document.addEventListener('pointermove', handleGlobalPointerMove, { passive: false });
      document.addEventListener('pointerup', handleGlobalPointerUp, { passive: false });
    }

    return () => {
      document.removeEventListener('pointermove', handleGlobalPointerMove);
      document.removeEventListener('pointerup', handleGlobalPointerUp);
    };
  }, [isDraggingThis, updateDrag, stopDrag, onDragEnd]);

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