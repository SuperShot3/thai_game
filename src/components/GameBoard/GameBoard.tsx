import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { DndProvider, useDrag, useDrop } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { GameBoardProps, ThaiSentence } from '../../types';
import { generateSentence } from '../../services/sentenceGenerator';

const Container = styled.div`
  width: 100%;
  max-width: 800px;
  padding: 20px;
  background: white;
  border-radius: 10px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
`;

const WordContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  margin-bottom: 20px;
  min-height: 60px;
  padding: 10px;
  background: #f8f9fa;
  border-radius: 5px;
`;

const DropZone = styled.div<{ isOver: boolean }>`
  width: 100px;
  height: 40px;
  border: 2px dashed ${props => props.isOver ? '#3498db' : '#ddd'};
  border-radius: 5px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: ${props => props.isOver ? '#f0f7ff' : 'white'};
  transition: all 0.3s ease;
`;

const WordCard = styled.div<{ isDragging: boolean }>`
  padding: 8px 16px;
  background: ${props => props.isDragging ? '#3498db' : 'white'};
  color: ${props => props.isDragging ? 'white' : '#2c3e50'};
  border: 2px solid #3498db;
  border-radius: 5px;
  cursor: move;
  user-select: none;
  transition: all 0.3s ease;

  &:hover {
    background: #3498db;
    color: white;
  }
`;

const Button = styled.button`
  padding: 10px 20px;
  background: #2ecc71;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  font-weight: bold;
  transition: background 0.3s ease;

  &:hover {
    background: #27ae60;
  }

  &:disabled {
    background: #95a5a6;
    cursor: not-allowed;
  }
`;

interface DragItem {
  word: string;
  index: number;
}

const DraggableWord = ({ word, index, isInUse, onDragStart, onDragEnd }: { 
  word: string; 
  index: number;
  isInUse: boolean;
  onDragStart: () => void;
  onDragEnd: () => void;
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
    <WordCard ref={drag} isDragging={isDragging} style={{ opacity: isInUse ? 0.5 : 1 }}>
      {word}
    </WordCard>
  );
};

const DroppableZone = ({ position, onDrop, word, onRemove }: { 
  position: number; 
  onDrop: (word: string) => void; 
  word?: string;
  onRemove: () => void;
}) => {
  const [{ isOver }, drop] = useDrop({
    accept: 'WORD',
    drop: (item: DragItem) => onDrop(item.word),
    collect: (monitor) => ({
      isOver: monitor.isOver(),
    }),
  });

  const handleDoubleClick = () => {
    if (word) {
      onRemove();
    }
  };

  return (
    <DropZone 
      ref={drop} 
      isOver={isOver} 
      onDoubleClick={handleDoubleClick}
      style={{ cursor: word ? 'pointer' : 'default' }}
    >
      {word || ''}
    </DropZone>
  );
};

// Fisher-Yates shuffle algorithm
const shuffleArray = <T,>(array: T[]): T[] => {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
};

interface ShuffledWord {
  word: string;
  originalIndex: number;
  isInUse: boolean;
}

const GameBoard: React.FC<GameBoardProps> = ({ difficulty, onGameComplete }) => {
  const [sentence, setSentence] = useState<ThaiSentence>(() => generateSentence(difficulty));
  const [shuffledWords, setShuffledWords] = useState<ShuffledWord[]>([]);
  const [userAnswer, setUserAnswer] = useState<string[]>([]);
  const [isComplete, setIsComplete] = useState(false);
  const [draggedWordIndex, setDraggedWordIndex] = useState<number | null>(null);

  // Update sentence when difficulty changes
  useEffect(() => {
    const newSentence = generateSentence(difficulty);
    setSentence(newSentence);
    setUserAnswer([]);
    setIsComplete(false);
    setDraggedWordIndex(null);
  }, [difficulty]);

  // Initialize or update shuffled words when sentence changes
  useEffect(() => {
    const words = sentence.thai.map((word, index) => ({
      word,
      originalIndex: index,
      isInUse: false
    }));
    setShuffledWords(shuffleArray(words));
  }, [sentence]);

  const handleDrop = (word: string, position: number) => {
    // Find the word in shuffled words and mark it as in use
    setShuffledWords(prev => prev.map(w => 
      w.word === word ? { ...w, isInUse: true } : w
    ));

    const newAnswer = [...userAnswer];
    newAnswer[position] = word;
    setUserAnswer(newAnswer);
    setDraggedWordIndex(null);
  };

  const handleWordDragStart = (index: number) => {
    setDraggedWordIndex(index);
  };

  const handleWordDragEnd = () => {
    // If the word was dragged but not dropped in a valid position
    if (draggedWordIndex !== null) {
      setDraggedWordIndex(null);
    }
  };

  const handleWordRemove = (position: number) => {
    const removedWord = userAnswer[position];
    if (removedWord) {
      // Find the word in shuffled words and mark it as not in use
      setShuffledWords(prev => prev.map(w => 
        w.word === removedWord ? { ...w, isInUse: false } : w
      ));
    }

    const newAnswer = [...userAnswer];
    newAnswer[position] = '';
    setUserAnswer(newAnswer);
  };

  const checkAnswer = () => {
    const isCorrect = userAnswer.join('') === sentence.thai.join('');
    setIsComplete(true);
    onGameComplete(isCorrect);
    
    // If the answer is correct, generate a new sentence after a short delay
    if (isCorrect) {
      setTimeout(() => {
        const newSentence = generateSentence(difficulty);
        setSentence(newSentence);
        setUserAnswer([]);
        setIsComplete(false);
        setDraggedWordIndex(null);
      }, 1500); // 1.5 second delay to show the success state
    }
  };

  const resetGame = () => {
    const newSentence = generateSentence(difficulty);
    setSentence(newSentence);
    setUserAnswer([]);
    setIsComplete(false);
    setDraggedWordIndex(null);
  };

  return (
    <DndProvider backend={HTML5Backend}>
      <Container>
        <WordContainer>
          {shuffledWords.map(({ word, originalIndex, isInUse }) => (
            <DraggableWord 
              key={originalIndex} 
              word={word} 
              index={originalIndex} 
              isInUse={isInUse}
              onDragStart={() => handleWordDragStart(originalIndex)}
              onDragEnd={handleWordDragEnd}
            />
          ))}
        </WordContainer>

        <WordContainer>
          {sentence.thai.map((_, index) => (
            <DroppableZone
              key={index}
              position={index}
              onDrop={(word) => handleDrop(word, index)}
              word={userAnswer[index]}
              onRemove={() => handleWordRemove(index)}
            />
          ))}
        </WordContainer>

        <div style={{ display: 'flex', gap: '10px', justifyContent: 'center' }}>
          <Button onClick={checkAnswer} disabled={isComplete}>
            Check Answer
          </Button>
          <Button onClick={resetGame}>
            Try Again
          </Button>
        </div>

        {isComplete && (
          <div style={{ marginTop: '20px', textAlign: 'center' }}>
            <p>English: {sentence.english}</p>
            {userAnswer.join('') === sentence.thai.join('') && (
              <p style={{ color: '#2ecc71', fontWeight: 'bold' }}>Correct! New sentence coming up...</p>
            )}
          </div>
        )}
      </Container>
    </DndProvider>
  );
};

export default GameBoard; 