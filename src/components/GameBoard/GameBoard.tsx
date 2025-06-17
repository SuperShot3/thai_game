import React, { useState, useEffect, useCallback, useRef } from 'react';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { TouchBackend } from 'react-dnd-touch-backend';
import styled from 'styled-components';
import { Difficulty, ThaiSentence } from '../../types';
import { generateSentence, resetUsedSentences } from '../../services/sentenceGenerator';
import DraggableWord from '../DraggableWord/DraggableWord';
import DroppableZone from '../DroppableZone/DroppableZone';
import GameCompletionDialog from '../GameCompletionDialog/GameCompletionDialog';
import '../../styles/fonts.css';
import Dialog from '../Dialog/Dialog';
import { userService } from '../../services/userService';

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
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1rem;
  width: 100%;
  padding: 1rem;
  background: #f8f9fa;
  border-radius: 0.5rem;
`;

const EnglishText = styled.div`
  font-size: 1.2rem;
  color: #495057;
  text-align: center;
  margin-bottom: 1rem;
  min-height: 2.4rem;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const HintButton = styled.button`
  background: #4dabf7;
  color: white;
  border: none;
  padding: 0.5rem 1rem;
  border-radius: 0.5rem;
  cursor: pointer;
  font-size: 1rem;
  transition: all 0.2s;

  &:hover {
    background: #339af0;
  }

  &:disabled {
    background: #adb5bd;
    cursor: not-allowed;
  }
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

const Button = styled.button<{ variant?: 'primary' | 'secondary' | 'danger' }>`
  padding: 12px 24px;
  border: none;
  border-radius: 8px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  background: ${props => {
    switch (props.variant) {
      case 'primary':
        return '#4CAF50';
      case 'secondary':
        return '#3498db';
      case 'danger':
        return '#e74c3c';
      default:
        return 'rgba(255, 255, 255, 0.1)';
    }
  }};
  color: white;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);

  &:hover {
    background: ${props => {
      switch (props.variant) {
        case 'primary':
          return '#45a049';
        case 'secondary':
          return '#2980b9';
        case 'danger':
          return '#c0392b';
        default:
          return 'rgba(255, 255, 255, 0.15)';
      }
    }};
    transform: translateY(-2px);
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.3);
  }

  &:active {
    transform: translateY(0);
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
  }

  &:disabled {
    background: rgba(255, 255, 255, 0.05);
    cursor: not-allowed;
    transform: none;
    box-shadow: none;
  }
`;

interface WordState {
  word: string;
  isInUse: boolean;
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

interface GameBoardProps {
  difficulty: Difficulty;
  onLevelComplete: (difficulty: Difficulty) => void;
}

const GameBoard: React.FC<GameBoardProps> = ({ difficulty, onLevelComplete }) => {
  const [currentSentence, setCurrentSentence] = useState<ThaiSentence | null>(null);
  const [shuffledWords, setShuffledWords] = useState<WordState[]>([]);
  const [userAnswer, setUserAnswer] = useState<string[]>([]);
  const [isComplete, setIsComplete] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [showDialog, setShowDialog] = useState(false);
  const [showCompletionDialog, setShowCompletionDialog] = useState(false);
  const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
  const [showHint, setShowHint] = useState(false);
  const [currentFont, setCurrentFont] = useState('font-1');
  const [currentHintIndex, setCurrentHintIndex] = useState(0);
  const [correctWords, setCorrectWords] = useState(0);
  const [incorrectWords, setIncorrectWords] = useState(0);
  const [elapsedTime, setElapsedTime] = useState(0);
  const startTimeRef = useRef(Date.now());

  const getRandomFont = () => {
    const fonts = [
      'font-1',  // Noto Sans Thai
      'font-2',  // Noto Serif Thai
      'font-3',  // Sarabun
      'font-4',  // Charm
      'font-5',  // Mitr
      'font-6',  // Kanit
      'font-7',  // Prompt
      'font-8',  // Taviraj
      'font-9',  // Pridi
      'font-10', // Sriracha
      'font-11'  // Mali
    ];
    return fonts[Math.floor(Math.random() * fonts.length)];
  };

  const generateNewSentence = useCallback(() => {
    const newSentence = generateSentence(difficulty);
    setCurrentSentence(newSentence);
    setCurrentFont(getRandomFont());
    setShuffledWords(shuffleArray(newSentence.thaiWords.map(word => ({ word, isInUse: false }))));
    setUserAnswer([]);
    setIsComplete(false);
    setIsCorrect(false);
    setShowDialog(false);
    setShowHint(false);
  }, [difficulty]);

  useEffect(() => {
    generateNewSentence();
    startTimeRef.current = Date.now();
    const timer = setInterval(() => {
      const now = Date.now();
      const elapsed = Math.floor((now - startTimeRef.current) / 1000);
      setElapsedTime(elapsed);
    }, 1000);

    return () => clearInterval(timer);
  }, [difficulty, generateNewSentence]);

  const handleDrop = (e: React.DragEvent<HTMLDivElement>, position: number) => {
    if (isComplete) return;

    const word = e.dataTransfer.getData('text/plain');
    if (!word) return;

    const newUserAnswer = [...userAnswer];
    const existingWord = newUserAnswer[position];
    
    if (existingWord) {
      // Return the existing word to the word bank
      setShuffledWords(prev => 
        prev.map(w => w.word === existingWord ? { ...w, isInUse: false } : w)
      );
    }

    newUserAnswer[position] = word;
    setUserAnswer(newUserAnswer);
    
    // Mark the word as in use
    setShuffledWords(prev => 
      prev.map(w => w.word === word ? { ...w, isInUse: true } : w)
    );
  };

  const handleWordRemove = (position: number) => {
    if (isComplete) return;

    const word = userAnswer[position];
    if (word) {
      setShuffledWords(prev => 
        prev.map(w => w.word === word ? { ...w, isInUse: false } : w)
      );
      
      const newUserAnswer = [...userAnswer];
      newUserAnswer[position] = '';
      setUserAnswer(newUserAnswer);
    }
  };

  const checkAnswer = () => {
    if (!currentSentence) return;

    const isAnswerCorrect = userAnswer.join('') === currentSentence.thaiWords.join('');
    setIsCorrect(isAnswerCorrect);
    setIsComplete(true);
    setShowDialog(true);

    if (isAnswerCorrect) {
      setCorrectWords(prev => prev + 1);
      const user = userService.getUser();
      if (user) {
        userService.updateProgress(difficulty, true);
        
        if (userService.isLevelComplete(difficulty)) {
          const nextLevel = userService.getNextLevel(difficulty);
          if (!nextLevel) {
            // All levels completed
            const progress = userService.getProgress(difficulty);
            if (progress) {
              setShowCompletionDialog(true);
            }
          } else {
            onLevelComplete(difficulty);
          }
        }
      }
    } else {
      setIncorrectWords(prev => prev + 1);
      userService.updateProgress(difficulty, false);
    }
  };

  const handleClear = () => {
    if (isComplete) return;

    // Return all words to the word bank
    setShuffledWords(prev => 
      prev.map(word => ({ ...word, isInUse: false }))
    );
    setUserAnswer(Array(currentSentence?.thaiWords.length || 0).fill(''));
  };

  const handleTryAgain = () => {
    setShowDialog(false);
    if (isCorrect) {
      generateNewSentence();
    } else {
      setIsComplete(false);
      setIsCorrect(false);
      setUserAnswer(Array(currentSentence?.thaiWords.length || 0).fill(''));
      setShuffledWords(prev => 
        prev.map(word => ({ ...word, isInUse: false }))
      );
    }
  };

  const toggleHint = () => {
    if (showHint) {
      setShowHint(false);
      setCurrentHintIndex(0);
    } else {
      setShowHint(true);
    }
  };

  const showNextHint = () => {
    if (currentSentence && currentHintIndex < currentSentence.hints.length - 1) {
      setCurrentHintIndex(prev => prev + 1);
    }
  };

  const handleRestart = () => {
    setShowCompletionDialog(false);
    setCorrectWords(0);
    setIncorrectWords(0);
    userService.clearUser();
    window.location.reload();
  };

  const handleClose = () => {
    setShowCompletionDialog(false);
    window.location.href = '/';
  };

  if (!currentSentence) return null;

  return (
    <DndProvider backend={isMobile ? TouchBackend : HTML5Backend}>
      <GameBoardContainer>
        <SentenceContainer>
          <EnglishText>
            {showHint 
              ? currentSentence.hints[currentHintIndex]
              : 'Click hint to see word hints'}
          </EnglishText>
          <div style={{ display: 'flex', gap: '10px' }}>
            <HintButton onClick={toggleHint}>
              {showHint ? 'Hide Hint' : 'Show Hint'}
            </HintButton>
            {showHint && currentSentence.hints.length > 1 && (
              <HintButton onClick={showNextHint}>
                Next Hint
              </HintButton>
            )}
          </div>
        </SentenceContainer>
        
        <AnswerContainer>
          {currentSentence.thaiWords.map((_: string, index: number) => (
            <DroppableZone
              key={index}
              onDrop={(e) => handleDrop(e, index)}
              onWordRemove={() => handleWordRemove(index)}
              word={userAnswer[index]}
              isComplete={isComplete}
              isCorrect={isCorrect}
            >
              <span className={currentFont}>{userAnswer[index] || ''}</span>
            </DroppableZone>
          ))}
        </AnswerContainer>

        <WordContainer>
          {shuffledWords.map((wordState, index) => (
            <DraggableWord
              key={`${wordState.word}-${index}`}
              word={wordState.word}
              index={index}
              isInUse={wordState.isInUse}
              onDragStart={() => {}}
              onDragEnd={() => {}}
              fontClass={currentFont}
            />
          ))}
        </WordContainer>

        <ButtonContainer>
          <Button 
            variant="primary" 
            onClick={checkAnswer}
            disabled={isComplete || userAnswer.some(word => !word)}
          >
            Check Answer
          </Button>
          <Button 
            variant="secondary" 
            onClick={handleClear}
            disabled={isComplete || !userAnswer.some(word => word)}
          >
            Clear
          </Button>
        </ButtonContainer>

        {showDialog && (
          <Dialog
            message={isCorrect ? 
              "Congratulations! Your answer is correct!" : 
              "Try again! Your answer is not quite right."}
            type={isCorrect ? 'success' : 'error'}
            onClose={handleTryAgain}
          />
        )}

        {showCompletionDialog && (
          <GameCompletionDialog
            onClose={handleClose}
            onRestart={handleRestart}
            score={correctWords * 10}
            correctWords={correctWords}
            incorrectWords={incorrectWords}
            difficulty={difficulty}
          />
        )}
      </GameBoardContainer>
    </DndProvider>
  );
};

export default GameBoard; 