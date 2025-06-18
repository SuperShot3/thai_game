import React from 'react';
import styled from 'styled-components';

interface DroppableZoneProps {
  onDrop: (e: React.DragEvent<HTMLDivElement>) => void;
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
}>`
  min-width: 100px;
  min-height: 50px;
  border: 2px dashed ${({ hasWord, isComplete, isCorrect }) => {
    if (isComplete) return isCorrect ? '#4CAF50' : '#f44336';
    if (hasWord) return 'rgba(255, 255, 255, 0.5)';
    return 'rgba(255, 255, 255, 0.2)';
  }};
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 10px;
  margin: 5px;
  background: ${({ hasWord, isComplete, isCorrect }) => {
    if (isComplete) return isCorrect ? 'rgba(76, 175, 80, 0.1)' : 'rgba(244, 67, 54, 0.1)';
    if (hasWord) return 'rgba(255, 255, 255, 0.05)';
    return 'transparent';
  }};
  transition: transform 0.1s ease, background 0.1s ease, border-color 0.1s ease;
  cursor: pointer;
  position: relative;
  will-change: transform, background, border-color;
  touch-action: none;

  &:hover {
    background: ${({ hasWord, isComplete }) => {
      if (isComplete) return 'rgba(255, 255, 255, 0.05)';
      if (hasWord) return 'rgba(255, 255, 255, 0.1)';
      return 'rgba(255, 255, 255, 0.05)';
    }};
    transform: ${({ hasWord }) => hasWord ? 'none' : 'scale(1.02)'};
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

  return (
    <DropZone
      onDrop={handleDrop}
      onDragOver={handleDragOver}
      onDragEnter={handleDragEnter}
      hasWord={!!word}
      isComplete={isComplete}
      isCorrect={isCorrect}
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