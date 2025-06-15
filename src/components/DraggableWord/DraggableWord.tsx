import React, { useEffect } from 'react';
import { useDrag } from 'react-dnd';
import styled from 'styled-components';

interface DraggableWordProps {
  word: string;
  index: number;
  isInUse: boolean;
  onDragStart: () => void;
  onDragEnd: () => void;
  fontClass: string;
}

interface DragItem {
  word: string;
  index: number;
}

const WordCard = styled.div<{ isDragging: boolean; isInUse: boolean }>`
  padding: 12px 20px;
  background: ${props => props.isInUse ? 'rgba(255, 255, 255, 0.05)' : 'rgba(255, 255, 255, 0.15)'};
  border: 2px solid ${props => props.isDragging ? '#4CAF50' : 'rgba(255, 255, 255, 0.2)'};
  border-radius: 10px;
  cursor: ${props => props.isInUse ? 'not-allowed' : 'grab'};
  opacity: ${props => props.isInUse ? 0.5 : 1};
  transition: all 0.2s ease;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);

  &:hover {
    background: ${props => props.isInUse ? 'rgba(255, 255, 255, 0.05)' : 'rgba(255, 255, 255, 0.2)'};
    transform: ${props => props.isInUse ? 'none' : 'translateY(-2px)'};
    box-shadow: ${props => props.isInUse ? '0 2px 4px rgba(0, 0, 0, 0.2)' : '0 4px 8px rgba(0, 0, 0, 0.3)'};
  }

  &:active {
    cursor: ${props => props.isInUse ? 'not-allowed' : 'grabbing'};
    transform: ${props => props.isInUse ? 'none' : 'translateY(0)'};
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
  }
`;

const DraggableWord: React.FC<DraggableWordProps> = ({ 
  word, 
  index, 
  isInUse, 
  onDragStart, 
  onDragEnd,
  fontClass 
}) => {
  const [{ isDragging }, drag] = useDrag<DragItem, unknown, { isDragging: boolean }>({
    type: 'WORD',
    item: { word, index },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
    canDrag: !isInUse,
  });

  useEffect(() => {
    if (isDragging) {
      onDragStart();
    } else {
      onDragEnd();
    }
  }, [isDragging, onDragStart, onDragEnd]);

  return (
    <WordCard
      ref={drag}
      isDragging={isDragging}
      isInUse={isInUse}
    >
      <span className={`thai-word ${fontClass}`}>{word}</span>
    </WordCard>
  );
};

export default DraggableWord; 