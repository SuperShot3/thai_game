import React, { useState, useEffect } from 'react';
import styled from 'styled-components';

interface DroppableZoneProps {
  onDrop: (e: React.DragEvent<HTMLDivElement> | { word: string }) => void;
  onWordRemove: () => void;
  word: string;
  isComplete: boolean;
  isCorrect: boolean;
  children?: React.ReactNode;
}

const DropZone = styled.div<{ 
  hasWord: boolean;
  isComplete: boolean;
  isCorrect: boolean;
  isDragOver: boolean;
}>`
  min-width: 100px;
  min-height: 50px;
  border: 2px dashed ${({ hasWord, isComplete, isCorrect, isDragOver }) => {
    if (isComplete) return isCorrect ? '#4CAF50' : '#f44336';
    if (hasWord) return 'rgba(255, 255, 255, 0.5)';
    if (isDragOver) return 'rgba(255, 255, 255, 0.8)';
    return 'rgba(255, 255, 255, 0.2)';
  }};
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 10px;
  margin: 5px;
  background: ${({ hasWord, isComplete, isCorrect, isDragOver }) => {
    if (isComplete) return isCorrect ? 'rgba(76, 175, 80, 0.1)' : 'rgba(244, 67, 54, 0.1)';
    if (hasWord) return 'rgba(255, 255, 255, 0.05)';
    if (isDragOver) return 'rgba(255, 255, 255, 0.1)';
    return 'transparent';
  }};
  transition: transform 0.1s ease, background 0.1s ease, border-color 0.1s ease;
  cursor: pointer;
  position: relative;
  will-change: transform, background, border-color;
  touch-action: none;

  &:hover {
    background: ${({ hasWord, isComplete, isDragOver }) => {
      if (isComplete) return 'rgba(255, 255, 255, 0.05)';
      if (hasWord) return 'rgba(255, 255, 255, 0.1)';
      if (isDragOver) return 'rgba(255, 255, 255, 0.15)';
      return 'rgba(255, 255, 255, 0.05)';
    }};
    transform: ${({ hasWord, isDragOver }) => hasWord ? 'none' : isDragOver ? 'scale(1.05)' : 'scale(1.02)'};
  }
`;

const WordText = styled.span<{ isComplete: boolean; isCorrect: boolean }>`
  color: ${({ isComplete, isCorrect }) => {
    if (isComplete) return isCorrect ? '#4CAF50' : '#f44336';
    return 'rgba(255, 255, 255, 0.9)';
  }};
  font-size: 1.1rem;
  transition: color 0.1s ease;
`;

const RemoveButton = styled.button`
  position: absolute;
  top: -8px;
  right: -8px;
  width: 20px;
  height: 20px;
  border-radius: 50%;
  background: #f44336;
  color: white;
  border: none;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  font-size: 14px;
  opacity: 0;
  transition: opacity 0.1s ease, background 0.1s ease;
  padding: 0;

  &:hover {
    background: #d32f2f;
  }
`;

const DroppableZone: React.FC<DroppableZoneProps> = ({
  onDrop,
  onWordRemove,
  word,
  isComplete,
  isCorrect,
  children
}) => {
  const [isDragOver, setIsDragOver] = useState(false);

  // Check for global drag data
  useEffect(() => {
    const checkDragData = () => {
      if ((window as any).__dragData && (window as any).__dragData.type === 'word') {
        setIsDragOver(true);
      } else {
        setIsDragOver(false);
      }
    };

    const interval = setInterval(checkDragData, 50);
    return () => clearInterval(interval);
  }, []);

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    e.dataTransfer.dropEffect = 'move';
  };

  const handleDragEnter = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    onDrop(e);
  };

  // Handle pointer-based drops
  const handlePointerUp = () => {
    if ((window as any).__dragData && (window as any).__dragData.type === 'word') {
      const dragData = (window as any).__dragData;
      onDrop({ word: dragData.word });
      (window as any).__dragData = null;
    }
  };

  return (
    <DropZone
      onDrop={handleDrop}
      onDragOver={handleDragOver}
      onDragEnter={handleDragEnter}
      onPointerUp={handlePointerUp}
      hasWord={!!word}
      isComplete={isComplete}
      isCorrect={isCorrect}
      isDragOver={isDragOver}
    >
      <WordText isComplete={isComplete} isCorrect={isCorrect}>
        {children}
      </WordText>
      {word && !isComplete && (
        <RemoveButton onClick={onWordRemove}>×</RemoveButton>
      )}
    </DropZone>
  );
};

export default DroppableZone; 