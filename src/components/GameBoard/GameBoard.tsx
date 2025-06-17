import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { generateSentence } from '../../services/sentenceGenerator';
import { Difficulty } from '../../types';
import { userService } from '../../services/userService';

interface GameBoardProps {
  difficulty: Difficulty;
  onLevelComplete: (difficulty: Difficulty) => void;
}

interface WordState {
  word: string;
  isInUse: boolean;
}

const GameContainer = styled.div`
  width: 100%;
  max-width: 800px;
  margin: 0 auto;
  padding: 1rem;
  background: #ffffff;
  border-radius: 12px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  touch-action: none;
  -webkit-overflow-scrolling: none;
  overscroll-behavior: none;
  overflow: hidden;
  position: relative;
`;

const WordContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  margin-bottom: 1rem;
  min-height: 60px;
  padding: 0.5rem;
  background: #f8f9fa;
  border-radius: 8px;
  touch-action: none;
`;

const WordBox = styled.div<{ isDragging?: boolean }>`
  padding: 0.5rem 1rem;
  background: ${props => props.isDragging ? '#45a049' : '#4CAF50'};
  color: white;
  border-radius: 4px;
  cursor: grab;
  user-select: none;
  touch-action: none;
  will-change: transform;
  transform: translate3d(0, 0, 0);
  backface-visibility: hidden;
  -webkit-backface-visibility: hidden;
  -webkit-transform: translate3d(0, 0, 0);
  -webkit-tap-highlight-color: transparent;
  opacity: ${props => props.isDragging ? 0.8 : 1};

  &:active {
    cursor: grabbing;
  }
`;

const AnswerContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  min-height: 60px;
  padding: 0.5rem;
  background: #e9ecef;
  border-radius: 8px;
  touch-action: none;
`;

const GameBoard: React.FC<GameBoardProps> = ({ difficulty, onLevelComplete }) => {
  const [currentSentence, setCurrentSentence] = useState(generateSentence(difficulty));
  const [shuffledWords, setShuffledWords] = useState<WordState[]>([]);
  const [answerWords, setAnswerWords] = useState<WordState[]>([]);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [showDialog, setShowDialog] = useState(false);
  const [correctWords, setCorrectWords] = useState(0);
  const [incorrectWords, setIncorrectWords] = useState(0);
  const [elapsedTime, setElapsedTime] = useState(0);
  const [draggedWord, setDraggedWord] = useState<string | null>(null);

  useEffect(() => {
    if (currentSentence) {
      const words = currentSentence.thai.map((word: string) => ({ word, isInUse: false }));
      setShuffledWords(words.sort(() => Math.random() - 0.5));
      setAnswerWords([]);
    }
  }, [currentSentence]);

  useEffect(() => {
    const timer = setInterval(() => {
      setElapsedTime(prev => prev + 1);
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const handleDragStart = (e: React.DragEvent<HTMLDivElement>, word: string) => {
    e.preventDefault();
    setDraggedWord(word);
    if (e.dataTransfer) {
      e.dataTransfer.setDragImage(e.currentTarget, 0, 0);
    }
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>, target: 'answer' | 'shuffle') => {
    e.preventDefault();
    if (!draggedWord) return;

    if (target === 'answer') {
      setAnswerWords(prev => [...prev, { word: draggedWord, isInUse: false }]);
      setShuffledWords(prev => prev.filter(w => w.word !== draggedWord));
    } else {
      setShuffledWords(prev => [...prev, { word: draggedWord, isInUse: false }]);
      setAnswerWords(prev => prev.filter(w => w.word !== draggedWord));
    }
    setDraggedWord(null);
  };

  const checkAnswer = () => {
    const userAnswer = answerWords.map(w => w.word).join('');
    const correctAnswer = currentSentence?.thai.join('') || '';
    const isAnswerCorrect = userAnswer === correctAnswer;

    setIsCorrect(isAnswerCorrect);
    setShowDialog(true);

    if (isAnswerCorrect) {
      setCorrectWords(prev => prev + 1);
      userService.updateProgress(difficulty, true);
      onLevelComplete(difficulty);
    } else {
      setIncorrectWords(prev => prev + 1);
      userService.updateProgress(difficulty, false);
    }
  };

  const handleNextSentence = () => {
    setCurrentSentence(generateSentence(difficulty));
    setIsCorrect(null);
    setShowDialog(false);
  };

  if (!currentSentence) return null;

  return (
    <GameContainer>
      <WordContainer
        onDragOver={handleDragOver}
        onDrop={(e) => handleDrop(e, 'shuffle')}
      >
        {shuffledWords.map((wordState, index) => (
          <WordBox
            key={`${wordState.word}-${index}`}
            draggable
            onDragStart={(e) => handleDragStart(e, wordState.word)}
            isDragging={draggedWord === wordState.word}
          >
            {wordState.word}
          </WordBox>
        ))}
      </WordContainer>
      <AnswerContainer
        onDragOver={handleDragOver}
        onDrop={(e) => handleDrop(e, 'answer')}
      >
        {answerWords.map((wordState, index) => (
          <WordBox
            key={`answer-${wordState.word}-${index}`}
            draggable
            onDragStart={(e) => handleDragStart(e, wordState.word)}
            isDragging={draggedWord === wordState.word}
          >
            {wordState.word}
          </WordBox>
        ))}
      </AnswerContainer>
    </GameContainer>
  );
};

export default GameBoard; 