import React from 'react';
import styled from 'styled-components';

interface DraggableWordProps {
  word: string;
  index: number;
  isInUse: boolean;
  onDragStart: (index: number) => void;
  onDragEnd: () => void;
  fontClass: string;
}

const WordCard = styled.div<{ isInUse: boolean }>`
  background: ${({ isInUse }) => isInUse ? 'rgba(255, 255, 255, 0.1)' : 'rgba(255, 255, 255, 0.2)'};
  border: 2px solid ${({ isInUse }) => isInUse ? 'rgba(255, 255, 255, 0.2)' : 'rgba(255, 255, 255, 0.4)'};
  border-radius: 8px;
  padding: 12px 20px;
  margin: 8px;
  cursor: grab;
  user-select: none;
  transition: all 0.2s ease;
  opacity: ${({ isInUse }) => isInUse ? 0.5 : 1};

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
  onDragStart,
  onDragEnd,
  fontClass
}) => {
  const handleDragStart = (e: React.DragEvent) => {
    e.dataTransfer.setData('text/plain', word);
    e.dataTransfer.effectAllowed = 'move';
    onDragStart(index);
  };

  return (
    <WordCard
      draggable={true}
      onDragStart={handleDragStart}
      onDragEnd={onDragEnd}
      isInUse={isInUse}
    >
      <WordText className={fontClass}>{word}</WordText>
    </WordCard>
  );
};

export default DraggableWord; 