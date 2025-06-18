import React, { useState, useCallback, useEffect, useRef } from 'react';
import styled from 'styled-components';
import { generateSentence } from '../../services/sentenceGenerator';
import { userService } from '../../services/userService';
import { Difficulty, ThaiSentence } from '../../types';
import DraggableWord from '../DraggableWord/DraggableWord';
import DroppableZone from '../DroppableZone/DroppableZone';
import Dialog from '../Dialog/Dialog';
import GameCompletionDialog from '../GameCompletionDialog/GameCompletionDialog';
import '../../styles/fonts.css';
import { useDragContext } from '../DraggableWord/DragContext';
import './GameBoard.css';

const GameBoardContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 20px;
  background: #1a1a2e;
  height: 100vh;
  width: 100vw;
  position: fixed;
  top: 0;
  left: 0;
  overflow: hidden;
  color: #ffffff;
  box-sizing: border-box;
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
  box-sizing: border-box;
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
  margin: 10px 0;
  justify-content: center;
  padding: 10px;
  background: rgba(255, 255, 255, 0.08);
  border-radius: 12px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  box-sizing: border-box;
  width: 100%;
`;

const AnswerContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
  margin: 10px 0;
  justify-content: center;
  min-height: 60px;
  padding: 10px;
  background: rgba(255, 255, 255, 0.05);
  border-radius: 12px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  box-sizing: border-box;
  width: 100%;
`;

const ButtonContainer = styled.div`
  display: flex;
  gap: 10px;
  margin-top: 10px;
  flex-wrap: wrap;
  justify-content: center;
  width: 100%;
  box-sizing: border-box;
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
  const [shuffledWords, setShuffledWords] = useState<string[]>([]);
  const [userAnswer, setUserAnswer] = useState<string[]>([]);
  const [usedWords, setUsedWords] = useState<Set<string>>(new Set());
  const [isComplete, setIsComplete] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [showDialog, setShowDialog] = useState(false);
  const [showCompletionDialog, setShowCompletionDialog] = useState(false);
  const [showHint, setShowHint] = useState(false);
  const [currentFont, setCurrentFont] = useState('font-1');
  const [currentHintIndex, setCurrentHintIndex] = useState(0);
  const [correctWords, setCorrectWords] = useState(0);
  const [incorrectWords, setIncorrectWords] = useState(0);
  const [elapsedTime, setElapsedTime] = useState(0);
  const startTimeRef = useRef(Date.now());
  const { stopDrag, dragState, getActiveDropZone, dropZones } = useDragContext();

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
    setShuffledWords(shuffleArray(newSentence.thaiWords));
    setUserAnswer([]);
    setUsedWords(new Set()); // Reset used words for new sentence
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

      // Update progress with new total time
      const currentProgress = userService.getProgress(difficulty) || {
        totalTime: 0,
        timestamp: startTimeRef.current,
        correctWords: 0,
        incorrectWords: 0
      };

      userService.updateProgress(difficulty, {
        ...currentProgress,
        totalTime: currentProgress.totalTime + 1, // Add one second
        timestamp: now
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [difficulty, generateNewSentence]);

  useEffect(() => {
    if (isComplete && isCorrect) {
      // Handle correct answer progression
      const timer = setTimeout(() => {
        // Check if we need to move to next level
        if (userService.isLevelComplete(difficulty) && difficulty !== 'advanced') {
          // Level is complete, let the parent component handle progression
          return;
        }
        // Generate new sentence for current level
        generateNewSentence();
      }, 1000); // Small delay to show the correct answer briefly

      return () => clearTimeout(timer);
    }
  }, [isComplete, isCorrect, difficulty, generateNewSentence]);

  // Global drop handler
  useEffect(() => {
    if (!dragState?.isDragging) return;
    const handleDropEvent = (e: Event) => {
      // Only handle if dragging
      if (!dragState?.isDragging) return;
      const activeZoneId = getActiveDropZone();
      if (activeZoneId && dropZones.has(activeZoneId)) {
        const zone = dropZones.get(activeZoneId)!;
        handleDrop(dragState.word, zone.position);
      } else {
        stopDrag();
      }
    };
    document.addEventListener('pointerup', handleDropEvent, { passive: false });
    document.addEventListener('touchend', handleDropEvent, { passive: false });
    return () => {
      document.removeEventListener('pointerup', handleDropEvent);
      document.removeEventListener('touchend', handleDropEvent);
    };
  }, [dragState, getActiveDropZone, dropZones]);

  const handleDrop = (word: string, position: number) => {
    // Check if the word is already used
    if (usedWords.has(word)) {
      return;
    }

    // Check if the position is already filled
    if (userAnswer[position]) {
      return;
    }

    // Place the word
    const newUserAnswer = [...userAnswer];
    newUserAnswer[position] = word;
    setUserAnswer(newUserAnswer);
    
    // Mark word as used
    setUsedWords(prev => new Set([...Array.from(prev), word]));

    // Do NOT check correctness or conclude round here
    stopDrag();
  };

  const checkAnswer = () => {
    if (!currentSentence) return false;
    return userAnswer.join(' ') === currentSentence.thaiWords.join(' ');
  };

  const handleAnswerCheck = () => {
    const isAnswerCorrect = checkAnswer();
    setIsComplete(true);
    setIsCorrect(isAnswerCorrect);

    const currentProgress = userService.getProgress(difficulty) || {
      totalTime: 0,
      timestamp: Date.now(),
      correctWords: 0,
      incorrectWords: 0
    };

    if (isAnswerCorrect) {
      setCorrectWords(prev => prev + 1);
      userService.updateProgress(difficulty, {
        ...currentProgress,
        correctWords: currentProgress.correctWords + 1,
        timestamp: Date.now()
      });
      
      if (userService.isLevelComplete(difficulty)) {
        setShowCompletionDialog(true);
      }
    } else {
      setIncorrectWords(prev => prev + 1);
      userService.updateProgress(difficulty, {
        ...currentProgress,
        incorrectWords: currentProgress.incorrectWords + 1,
        timestamp: Date.now()
      });
      setShowDialog(true);
    }
  };

  const handleClear = () => {
    if (isComplete) return;

    setUserAnswer(Array(currentSentence?.thaiWords.length || 0).fill(''));
    setUsedWords(new Set()); // Reset used words
  };

  const handleTryAgain = () => {
    setShowDialog(false);
    // Reset for retry on same sentence (only for incorrect answers)
    setIsComplete(false);
    setIsCorrect(false);
    setUserAnswer(Array(currentSentence?.thaiWords.length || 0).fill(''));
    setUsedWords(new Set()); // Reset used words
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
    onLevelComplete(difficulty);  // Call onLevelComplete to handle progression
  };

  if (!currentSentence) return null;

  return (
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
            position={index}
            onDrop={handleDrop}
            isFilled={userAnswer[index] !== ''}
            filledWord={userAnswer[index]}
            fontClass={currentFont}
          />
        ))}
      </AnswerContainer>

      <WordContainer>
        {shuffledWords.map((word, index) => (
          <DraggableWord
            key={`${word}-${index}`}
            word={word}
            fontClass={currentFont}
            isUsed={usedWords.has(word)}
            onDragStart={() => {
              // Optional: Add any drag start logic
            }}
            onDragEnd={() => {
              // Optional: Add any drag end logic
            }}
          />
        ))}
      </WordContainer>

      <ButtonContainer>
        <Button 
          variant="primary" 
          onClick={handleAnswerCheck}
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
          message="Try again! Your answer is incorrect."
          type="error"
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
          totalTime={elapsedTime}
        />
      )}
    </GameBoardContainer>
  );
};

export default GameBoard; 