import React from 'react';
import styled from 'styled-components';
import { useDragContext } from './DragContext';

const DragPreview = styled.div<{ x: number; y: number; isVisible: boolean }>`
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

const DragLayer: React.FC = () => {
  const { dragState } = useDragContext();
  if (!dragState || !dragState.isDragging) return null;
  return (
    <DragPreview
      x={dragState.x - 20}
      y={dragState.y - 20}
      isVisible={dragState.isDragging}
    >
      <span className={dragState.fontClass}>{dragState.word}</span>
    </DragPreview>
  );
};

export default DragLayer; 