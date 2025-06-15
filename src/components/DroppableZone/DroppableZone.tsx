import React from 'react';
import { useDrop } from 'react-dnd';
import styled from 'styled-components';

interface DroppableZoneProps {
  index: number;
  onDrop: (word: string) => void;
  onRemove: () => void;
  word: string;
  isComplete: boolean;
  isCorrect: boolean;
  fontClass: string;
}

const DropZone = styled.div<{ isOver: boolean; isComplete: boolean; isCorrect: boolean }>`
  width: 100px;
  height: 50px;
  border: 2px dashed ${props => {
    if (props.isComplete) {
      return props.isCorrect ? '#2ecc71' : '#e74c3c';
    }
    return props.isOver ? '#3498db' : 'rgba(255, 255, 255, 0.2)';
  }};
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 5px;
  background: ${props => props.isOver ? 'rgba(52, 152, 219, 0.1)' : 'transparent'};
  transition: all 0.2s ease;
  cursor: pointer;
  position: relative;

  &:hover {
    background: rgba(255, 255, 255, 0.05);
  }

  &:active {
    transform: scale(0.98);
  }
`;

const DroppableZone: React.FC<DroppableZoneProps> = ({ 
  index, 
  onDrop, 
  onRemove,
  word, 
  isComplete, 
  isCorrect,
  fontClass 
}) => {
  const [{ isOver }, drop] = useDrop({
    accept: 'WORD',
    drop: (item: { word: string }) => onDrop(item.word),
    collect: (monitor) => ({
      isOver: monitor.isOver(),
    }),
  });

  const handleClick = () => {
    if (word && !isComplete) {
      onRemove();
    }
  };

  return (
    <DropZone
      ref={drop}
      isOver={isOver}
      isComplete={isComplete}
      isCorrect={isCorrect}
      onClick={handleClick}
    >
      <span className={`thai-word ${fontClass}`}>{word}</span>
    </DropZone>
  );
};

export default DroppableZone; 