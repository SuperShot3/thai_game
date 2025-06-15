import React, { useState, useEffect } from 'react';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { TouchBackend } from 'react-dnd-touch-backend';
import styled from 'styled-components';
import { GameBoardProps, ThaiSentence } from '../../types';
import { generateSentence } from '../../services/sentenceGenerator';
import DraggableWord from '../DraggableWord/DraggableWord';
import DroppableZone from '../DroppableZone/DroppableZone';
import '../../styles/fonts.css';

const GameBoardContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 20px;
  background: #1a1a2e;
  min-height: 100vh;
  color: #ffffff;
`;

const SentenceContainer = styled.div`
  background: rgba(255, 255, 255, 0.1);
  padding: 20px;
  border-radius: 12px;
  margin-bottom: 20px;
  text-align: center;
  max-width: 800px;
  width: 100%;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
`;

const WordContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
  margin: 20px 0;
  justify-content: center;
  padding: 15px;
  background: rgba(255, 255, 255, 0.08);
  border-radius: 12px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
`;

const AnswerContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
  margin: 20px 0;
  justify-content: center;
  min-height: 70px;
  padding: 15px;
  background: rgba(255, 255, 255, 0.05);
  border-radius: 12px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
`;

const ButtonContainer = styled.div`
  display: flex;
  gap: 15px;
  margin-top: 20px;
`;

const Button = styled.button<{ isPrimary?: boolean }>`
  padding: 12px 24px;
  border: none;
  border-radius: 8px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
  background: ${props => props.isPrimary ? '#4CAF50' : 'rgba(255, 255, 255, 0.1)'};
  color: white;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);

  &:hover {
    background: ${props => props.isPrimary ? '#45a049' : 'rgba(255, 255, 255, 0.15)'};
    transform: translateY(-2px);
  }

  &:active {
    transform: translateY(0);
  }

  &:disabled {
    background: rgba(255, 255, 255, 0.05);
    cursor: not-allowed;
    transform: none;
  }
`;

const ThaiText = styled.span`
  font-family: 'Noto Sans Thai', sans-serif;
  font-size: 1.2rem;
  line-height: 1.5;
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

const ResultContainer = styled.div`
  margin-top: 20px;
  padding: 15px;
  border-radius: 8px;
  text-align: center;
  background: rgba(255, 255, 255, 0.1);
  animation: fadeIn 0.3s ease-in;
`;

const ConfirmDialog = styled.div`
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background: #1a1a2e;
  padding: 20px;
  border-radius: 12px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.3);
  z-index: 1000;
  text-align: center;
  border: 2px solid rgba(255, 255, 255, 0.1);
`;

const Overlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.7);
  z-index: 999;
`;

const DialogButton = styled(Button)`
  margin: 10px;
  min-width: 100px;
`;

interface DragItem {
  word: string;
  index: number;
}

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

// Helper function to detect if the device is touch-enabled
const isTouchDevice = () => {
  return 'ontouchstart' in window || navigator.maxTouchPoints > 0;
};

const GameBoard: React.FC<GameBoardProps> = ({ difficulty, onGameComplete }) => {
  const [sentence, setSentence] = useState<ThaiSentence>(() => generateSentence(difficulty));
  const [shuffledWords, setShuffledWords] = useState<ShuffledWord[]>([]);
  const [userAnswer, setUserAnswer] = useState<string[]>([]);
  const [isComplete, setIsComplete] = useState(false);
  const [draggedWordIndex, setDraggedWordIndex] = useState<number | null>(null);
  const [currentFont, setCurrentFont] = useState(1);
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);

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
    if (isComplete) return;
    
    setUserAnswer(prev => {
      const newAnswer = [...prev];
      newAnswer[position] = word;
      return newAnswer;
    });

    setShuffledWords(prev => 
      prev.map((w, i) => 
        i === draggedWordIndex ? { ...w, isInUse: true } : w
      )
    );
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
    if (isComplete) return;

    const wordToRemove = userAnswer[position];
    if (!wordToRemove) return;

    setUserAnswer(prev => {
      const newAnswer = [...prev];
      newAnswer[position] = '';
      return newAnswer;
    });

    setShuffledWords(prev =>
      prev.map(w => 
        w.word === wordToRemove ? { ...w, isInUse: false } : w
      )
    );
  };

  const getNextFont = () => {
    return (currentFont % 4) + 1;
  };

  const checkAnswer = () => {
    const correctWords = userAnswer.filter((word, index) => word === sentence.thai[index]).length;
    const isAllCorrect = correctWords === sentence.thai.length;
    setIsCorrect(isAllCorrect);
    setIsComplete(true);
    onGameComplete(isAllCorrect, correctWords);
    setShowConfirmDialog(true);
  };

  const handleNextRound = () => {
    const newSentence = generateSentence(difficulty);
    setSentence(newSentence);
    setUserAnswer([]);
    setIsComplete(false);
    setDraggedWordIndex(null);
    setCurrentFont(getNextFont());
    setShowConfirmDialog(false);
  };

  const handleTryAgain = () => {
    setUserAnswer([]);
    setIsComplete(false);
    setDraggedWordIndex(null);
    setShuffledWords(prev => prev.map(w => ({ ...w, isInUse: false })));
    setShowConfirmDialog(false);
  };

  const resetGame = () => {
    const newSentence = generateSentence(difficulty);
    setSentence(newSentence);
    setUserAnswer([]);
    setIsComplete(false);
    setDraggedWordIndex(null);
  };

  return (
    <DndProvider backend={isMobile ? TouchBackend : HTML5Backend}>
      <GameBoardContainer>
        <SentenceContainer>
          <div className="english-text">{sentence.english}</div>
          <div className={`thai-text font-${currentFont}`}>{sentence.thai.join(' ')}</div>
        </SentenceContainer>
        
        <AnswerContainer>
          {sentence.thai.map((_, index) => (
            <DroppableZone
              key={index}
              index={index}
              onDrop={(word) => handleDrop(word, index)}
              onRemove={() => handleWordRemove(index)}
              word={userAnswer[index] || ''}
              isComplete={isComplete}
              isCorrect={isComplete && userAnswer[index] === sentence.thai[index]}
              fontClass={`font-${currentFont}`}
            />
          ))}
        </AnswerContainer>

        <WordContainer>
          {shuffledWords.map((word, index) => (
            <DraggableWord
              key={`${word}-${index}`}
              word={word.word}
              index={index}
              isInUse={word.isInUse}
              onDragStart={() => handleWordDragStart(index)}
              onDragEnd={handleWordDragEnd}
              fontClass={`font-${currentFont}`}
            />
          ))}
        </WordContainer>

        <ButtonContainer>
          <Button 
            isPrimary 
            onClick={checkAnswer} 
            disabled={isComplete || userAnswer.length !== sentence.thai.length}
          >
            Check Answer
          </Button>
          <Button 
            onClick={resetGame} 
            disabled={!isComplete && userAnswer.length === 0}
          >
            Reset
          </Button>
        </ButtonContainer>

        {showConfirmDialog && (
          <>
            <Overlay onClick={() => setShowConfirmDialog(false)} />
            <ConfirmDialog>
              <div className={`thai-text font-${currentFont}`}>
                {isCorrect ? 'ถูกต้อง! (Correct!)' : 'ไม่ถูกต้อง (Incorrect)'}
              </div>
              {isCorrect ? (
                <DialogButton isPrimary onClick={handleNextRound}>
                  Next Round
                </DialogButton>
              ) : (
                <DialogButton onClick={handleTryAgain}>
                  Try Again
                </DialogButton>
              )}
            </ConfirmDialog>
          </>
        )}
      </GameBoardContainer>
    </DndProvider>
  );
};

export default GameBoard; 