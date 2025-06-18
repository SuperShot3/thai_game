import React, { useRef, useState, useCallback, useEffect } from 'react';
import styled from 'styled-components';
import { useDragContext } from './DragContext';

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

const DraggableWord: React.FC<DraggableWordProps> = ({
  word,
  index,
  isInUse,
  fontClass
}) => {
  const cardRef = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [dragStartPos, setDragStartPos] = useState({ x: 0, y: 0 });
  const [isPointerDown, setIsPointerDown] = useState(false);
  const { startDrag, updateDrag, stopDrag } = useDragContext();
  
  // Use refs for better performance
  const isDraggingRef = useRef(false);
  const dragStartPosRef = useRef({ x: 0, y: 0 });
  const animationFrameRef = useRef<number>();

  // Optimized drag update using requestAnimationFrame
  const updateDragPosition = useCallback((x: number, y: number) => {
    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current);
    }
    animationFrameRef.current = requestAnimationFrame(() => {
      updateDrag(x, y);
    });
  }, [updateDrag]);

  // Handle pointer events for cross-platform drag support
  const handlePointerDown = useCallback((e: React.PointerEvent) => {
    if (isInUse) return;
    e.preventDefault();
    e.stopPropagation();
    
    setIsPointerDown(true);
    isDraggingRef.current = false;
    setDragStartPos({ x: e.clientX, y: e.clientY });
    dragStartPosRef.current = { x: e.clientX, y: e.clientY };
    
    if (cardRef.current) {
      cardRef.current.setPointerCapture(e.pointerId);
    }
  }, [isInUse]);

  const handlePointerMove = useCallback((e: React.PointerEvent) => {
    if (!isPointerDown || isInUse) return;
    e.preventDefault();
    e.stopPropagation();
    
    const deltaX = Math.abs(e.clientX - dragStartPosRef.current.x);
    const deltaY = Math.abs(e.clientY - dragStartPosRef.current.y);
    
    if (!isDraggingRef.current && (deltaX > 5 || deltaY > 5)) {
      isDraggingRef.current = true;
      setIsDragging(true);
      startDrag(word, fontClass, e.clientX, e.clientY);
    }
    
    if (isDraggingRef.current) {
      updateDragPosition(e.clientX, e.clientY);
    }
  }, [isPointerDown, isInUse, word, fontClass, startDrag, updateDragPosition]);

  const handlePointerUp = useCallback((e: React.PointerEvent) => {
    if (!isPointerDown) return;
    e.preventDefault();
    e.stopPropagation();
    
    setIsPointerDown(false);
    if (isDraggingRef.current) {
      setIsDragging(false);
      isDraggingRef.current = false;
      stopDrag();
    }
    
    if (cardRef.current) {
      cardRef.current.releasePointerCapture(e.pointerId);
    }
  }, [isPointerDown, stopDrag]);

  const handlePointerLeave = useCallback((e: React.PointerEvent) => {
    if (isPointerDown) {
      handlePointerUp(e);
    }
  }, [isPointerDown, handlePointerUp]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
      if (isDraggingRef.current) {
        stopDrag();
      }
    };
  }, [stopDrag]);

  return (
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
  );
};

export default DraggableWord; 