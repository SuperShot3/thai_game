import React, { useRef, useState, useEffect } from 'react';
import styled from 'styled-components';

interface DraggableWordProps {
  word: string;
  index: number;
  isInUse: boolean;
  fontClass: string;
}

const WordCard = styled.div<{ isInUse: boolean; isDragging: boolean }>`
  background: ${({ isInUse }) => isInUse ? 'rgba(255, 255, 255, 0.1)' : 'rgba(255, 255, 255, 0.2)'};
  border: 2px solid ${({ isInUse }) => isInUse ? 'rgba(255, 255, 255, 0.2)' : 'rgba(255, 255, 255, 0.4)'};
  border-radius: 8px;
  padding: 12px 20px;
  margin: 8px;
  cursor: grab;
  user-select: none;
  -webkit-user-select: none;
  -webkit-touch-callout: none;
  -webkit-tap-highlight-color: transparent;
  transition: transform 0.1s ease, background 0.1s ease, border-color 0.1s ease;
  opacity: ${({ isInUse, isDragging }) => isInUse ? 0.5 : isDragging ? 0.8 : 1};
  will-change: transform;
  touch-action: none;
  position: relative;
  z-index: ${({ isDragging }) => isDragging ? 1000 : 1};

  &:hover {
    background: ${({ isInUse }) => isInUse ? 'rgba(255, 255, 255, 0.15)' : 'rgba(255, 255, 255, 0.25)'};
    border-color: ${({ isInUse }) => isInUse ? 'rgba(255, 255, 255, 0.3)' : 'rgba(255, 255, 255, 0.5)'};
    transform: scale(1.05);
  }

  &:active {
    cursor: grabbing;
    transform: scale(0.98);
  }
`;

const WordText = styled.span`
  color: #fff;
  font-size: 1.1rem;
  font-weight: 500;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
`;

const DragPreview = styled.div<{ isVisible: boolean; x: number; y: number }>`
  position: fixed;
  top: ${({ y }) => y}px;
  left: ${({ x }) => x}px;
  background: rgba(255, 255, 255, 0.2);
  border: 2px solid rgba(255, 255, 255, 0.4);
  border-radius: 8px;
  padding: 12px 20px;
  color: #fff;
  font-size: 1.1rem;
  font-weight: 500;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.3);
  pointer-events: none;
  z-index: 10000;
  opacity: ${({ isVisible }) => isVisible ? 0.8 : 0};
  transform: rotate(5deg) scale(0.9);
  transition: opacity 0.1s ease;
`;

const DraggableWord: React.FC<DraggableWordProps> = ({
  word,
  index,
  isInUse,
  fontClass
}) => {
  const cardRef = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [dragStartPos, setDragStartPos] = useState({ x: 0, y: 0 });
  const [currentPos, setCurrentPos] = useState({ x: 0, y: 0 });
  const [isPointerDown, setIsPointerDown] = useState(false);

  // Handle pointer events for cross-platform drag support
  const handlePointerDown = (e: React.PointerEvent) => {
    if (isInUse) return;
    
    e.preventDefault();
    e.stopPropagation();
    
    setIsPointerDown(true);
    setDragStartPos({ x: e.clientX, y: e.clientY });
    
    // Set pointer capture for reliable tracking
    if (cardRef.current) {
      cardRef.current.setPointerCapture(e.pointerId);
    }
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (!isPointerDown || isInUse) return;
    
    e.preventDefault();
    e.stopPropagation();
    
    const deltaX = Math.abs(e.clientX - dragStartPos.x);
    const deltaY = Math.abs(e.clientY - dragStartPos.y);
    
    // Start dragging if moved more than 3px (reduced threshold for better responsiveness)
    if (!isDragging && (deltaX > 3 || deltaY > 3)) {
      setIsDragging(true);
      setCurrentPos({ x: e.clientX, y: e.clientY });
      
      // Set global drag data
      if (window) {
        (window as any).__dragData = {
          word,
          index,
          type: 'word'
        };
      }
    }
    
    if (isDragging) {
      setCurrentPos({ x: e.clientX, y: e.clientY });
    }
  };

  const handlePointerUp = (e: React.PointerEvent) => {
    if (!isPointerDown) return;
    
    e.preventDefault();
    e.stopPropagation();
    
    setIsPointerDown(false);
    
    if (isDragging) {
      setIsDragging(false);
      
      // Clear global drag data
      if (window) {
        (window as any).__dragData = null;
      }
    }
    
    // Release pointer capture
    if (cardRef.current) {
      cardRef.current.releasePointerCapture(e.pointerId);
    }
  };

  const handlePointerLeave = (e: React.PointerEvent) => {
    if (isPointerDown) {
      handlePointerUp(e);
    }
  };

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (isDragging) {
        // Clear global drag data
        if (window) {
          (window as any).__dragData = null;
        }
      }
    };
  }, [isDragging]);

  return (
    <>
      <WordCard
        ref={cardRef}
        isInUse={isInUse}
        isDragging={isDragging}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerLeave={handlePointerLeave}
        draggable={false}
      >
        <WordText className={fontClass}>{word}</WordText>
      </WordCard>
      
      <DragPreview
        isVisible={isDragging}
        x={currentPos.x - 20}
        y={currentPos.y - 20}
      >
        <span className={fontClass}>{word}</span>
      </DragPreview>
    </>
  );
};

export default DraggableWord; 