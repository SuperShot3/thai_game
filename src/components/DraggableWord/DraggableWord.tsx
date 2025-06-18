import React, { useRef } from 'react';
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
  transition: transform 0.1s ease, background 0.1s ease, border-color 0.1s ease;
  opacity: ${({ isInUse }) => isInUse ? 0.5 : 1};
  will-change: transform;
  touch-action: none;

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
  const elementRef = useRef<HTMLDivElement>(null);
  const isDragging = useRef(false);

  const handleDragStart = (e: React.DragEvent) => {
    if (isInUse || isDragging.current) return;
    
    isDragging.current = true;
    e.dataTransfer.setData('text/plain', word);
    e.dataTransfer.effectAllowed = 'move';
    
    // Create a custom drag image for better performance
    const dragImage = e.currentTarget.cloneNode(true) as HTMLElement;
    dragImage.style.opacity = '0.8';
    dragImage.style.transform = 'rotate(5deg)';
    document.body.appendChild(dragImage);
    e.dataTransfer.setDragImage(dragImage, 0, 0);
    
    // Remove the drag image after a short delay
    setTimeout(() => {
      if (document.body.contains(dragImage)) {
        document.body.removeChild(dragImage);
      }
    }, 100);
    
    onDragStart(index);
  };

  const handleDragEnd = () => {
    isDragging.current = false;
    onDragEnd();
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    if (isInUse) return;
    
    // Prevent default to avoid any delay
    e.preventDefault();
    
    // Start dragging immediately
    const touch = e.touches[0];
    const element = elementRef.current;
    
    if (element) {
      // Create a drag event manually
      const dragEvent = new DragEvent('dragstart', {
        bubbles: true,
        cancelable: true,
        dataTransfer: new DataTransfer()
      });
      
      // Set the data
      dragEvent.dataTransfer?.setData('text/plain', word);
      dragEvent.dataTransfer!.effectAllowed = 'move';
      
      // Dispatch the drag event
      element.dispatchEvent(dragEvent);
    }
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    if (isInUse) return;
    
    // Start dragging immediately on mouse down
    const element = elementRef.current;
    
    if (element) {
      // Create a drag event manually
      const dragEvent = new DragEvent('dragstart', {
        bubbles: true,
        cancelable: true,
        dataTransfer: new DataTransfer()
      });
      
      // Set the data
      dragEvent.dataTransfer?.setData('text/plain', word);
      dragEvent.dataTransfer!.effectAllowed = 'move';
      
      // Dispatch the drag event
      element.dispatchEvent(dragEvent);
    }
  };

  return (
    <WordCard
      ref={elementRef}
      draggable={true}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
      onTouchStart={handleTouchStart}
      onMouseDown={handleMouseDown}
      isInUse={isInUse}
    >
      <WordText className={fontClass}>{word}</WordText>
    </WordCard>
  );
};

export default DraggableWord; 