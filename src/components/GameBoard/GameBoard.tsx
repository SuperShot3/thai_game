import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { DndProvider, useDrag, useDrop } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { GameBoardProps, ThaiSentence } from '../../types';

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

const DraggableWord = ({ word, index }: { word: string; index: number }) => {
  const [{ isDragging }, drag] = useDrag({
    type: 'WORD',
    item: { word, index },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  });

  return (
    <WordCard ref={drag} isDragging={isDragging}>
      {word}
    </WordCard>
  );
};

const DroppableZone = ({ position, onDrop, word }: { position: number; onDrop: (word: string) => void; word?: string }) => {
  const [{ isOver }, drop] = useDrop({
    accept: 'WORD',
    drop: (item: { word: string }) => onDrop(item.word),
    collect: (monitor) => ({
      isOver: monitor.isOver(),
    }),
  });

  return (
    <DropZone ref={drop} isOver={isOver}>
      {word || ''}
    </DropZone>
  );
};

const GameBoard: React.FC<GameBoardProps> = ({ difficulty, onGameComplete }) => {
  const [sentence, setSentence] = useState<ThaiSentence>({
    thai: ['สวัสดี', 'ครับ', 'คุณ'],
    english: 'Hello, you',
    hints: []
  });
  const [userAnswer, setUserAnswer] = useState<string[]>([]);
  const [isComplete, setIsComplete] = useState(false);

  const handleDrop = (word: string, position: number) => {
    const newAnswer = [...userAnswer];
    newAnswer[position] = word;
    setUserAnswer(newAnswer);
  };

  const checkAnswer = () => {
    const isCorrect = userAnswer.join('') === sentence.thai.join('');
    setIsComplete(true);
    onGameComplete(isCorrect);
  };

  const resetGame = () => {
    setUserAnswer([]);
    setIsComplete(false);
  };

  return (
    <DndProvider backend={HTML5Backend}>
      <Container>
        <WordContainer>
          {sentence.thai.map((word, index) => (
            <DraggableWord key={index} word={word} index={index} />
          ))}
        </WordContainer>

        <WordContainer>
          {sentence.thai.map((_, index) => (
            <DroppableZone
              key={index}
              position={index}
              onDrop={(word) => handleDrop(word, index)}
              word={userAnswer[index]}
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
          </div>
        )}
      </Container>
    </DndProvider>
  );
};

export default GameBoard; 