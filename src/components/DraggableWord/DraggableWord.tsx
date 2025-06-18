import React, { useRef, useState } from 'react';
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
  const cardRef = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState(false);

  const createDragImage = (element: HTMLElement) => {
    const dragImage = element.cloneNode(true) as HTMLElement;
    
    // Apply drag-specific styles
    dragImage.style.position = 'absolute';
    dragImage.style.top = '-1000px';
    dragImage.style.left = '-1000px';
    dragImage.style.opacity = '0.8';
    dragImage.style.transform = 'rotate(5deg) scale(0.9)';
    dragImage.style.pointerEvents = 'none';
    dragImage.style.zIndex = '10000';
    
    // Ensure the drag image has the same styling
    dragImage.style.background = isInUse ? 'rgba(255, 255, 255, 0.1)' : 'rgba(255, 255, 255, 0.2)';
    dragImage.style.border = `2px solid ${isInUse ? 'rgba(255, 255, 255, 0.2)' : 'rgba(255, 255, 255, 0.4)'}`;
    dragImage.style.borderRadius = '8px';
    dragImage.style.padding = '12px 20px';
    dragImage.style.margin = '8px';
    dragImage.style.color = '#fff';
    dragImage.style.fontSize = '1.1rem';
    dragImage.style.fontWeight = '500';
    dragImage.style.textShadow = '0 2px 4px rgba(0, 0, 0, 0.2)';
    dragImage.style.boxShadow = '0 4px 8px rgba(0, 0, 0, 0.3)';
    
    return dragImage;
  };

  const handleDragStart = (e: React.DragEvent) => {
    if (isInUse || isDragging) return;
    
    setIsDragging(true);
    e.dataTransfer.setData('text/plain', word);
    e.dataTransfer.effectAllowed = 'move';
    
    // Create a custom drag image that shows the actual card
    if (cardRef.current) {
      const dragImage = createDragImage(cardRef.current);
      
      // Add to document temporarily
      document.body.appendChild(dragImage);
      
      // Set as drag image
      e.dataTransfer.setDragImage(dragImage, 20, 20);
      
      // Remove from document after drag starts
      setTimeout(() => {
        if (document.body.contains(dragImage)) {
          document.body.removeChild(dragImage);
        }
      }, 0);
    }
    
    onDragStart(index);
  };

  const handleDragEnd = () => {
    setIsDragging(false);
    onDragEnd();
  };

  // Mobile touch handler for instant response
  const handleTouchStart = (e: React.TouchEvent) => {
    if (isInUse || isDragging) return;
    
    // For mobile, we'll use a simple approach - just start dragging immediately
    // This eliminates the delay while keeping it simple and reliable
    if (cardRef.current) {
      // Create a drag event immediately
      const dragEvent = new DragEvent('dragstart', {
        bubbles: true,
        cancelable: true,
        dataTransfer: new DataTransfer()
      });
      
      dragEvent.dataTransfer?.setData('text/plain', word);
      dragEvent.dataTransfer!.effectAllowed = 'move';
      
      // Create drag image
      const dragImage = createDragImage(cardRef.current);
      document.body.appendChild(dragImage);
      dragEvent.dataTransfer!.setDragImage(dragImage, 20, 20);
      
      // Dispatch the drag event
      cardRef.current.dispatchEvent(dragEvent);
      
      // Clean up drag image
      setTimeout(() => {
        if (document.body.contains(dragImage)) {
          document.body.removeChild(dragImage);
        }
      }, 0);
      
      setIsDragging(true);
      onDragStart(index);
    }
  };

  return (
    <WordCard
      ref={cardRef}
      draggable={!isInUse}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
      onTouchStart={handleTouchStart}
      isInUse={isInUse}
    >
      <WordText className={fontClass}>{word}</WordText>
    </WordCard>
  );
};

export default DraggableWord; 