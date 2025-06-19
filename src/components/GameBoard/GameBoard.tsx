import React, { useState, useCallback, useEffect, useRef } from 'react';
import styled from 'styled-components';
import { generateSentence } from '../../services/sentenceGenerator';
import { userService } from '../../services/userService';
import { leaderboardService } from '../Leaderboard/leaderboardService';
import { Difficulty, ThaiSentence } from '../../types';
import DraggableWord from '../DraggableWord/DraggableWord';
import DroppableZone from '../DroppableZone/DroppableZone';
import AIHelpAssistant from '../AIHelpAssistant/AIHelpAssistant';
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

const DifficultyIndicator = styled.div`
  background: rgba(255, 255, 255, 0.1);
  padding: 0.5rem 1rem;
  border-radius: 1.25rem;
  font-size: 1rem;
  color: #ffffff;
  margin-bottom: 1rem;
  text-transform: capitalize;
  border: 1px solid rgba(255, 255, 255, 0.2);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 500;
  letter-spacing: 0.5px;
`;

const SentenceCounter = styled.div`
  background: rgba(76, 175, 80, 0.1);
  padding: 0.5rem 1rem;
  border-radius: 1.25rem;
  font-size: 1rem;
  color: #4CAF50;
  margin-bottom: 1rem;
  text-align: center;
  border: 1px solid #4CAF50;
  box-shadow: 0 2px 8px rgba(76, 175, 80, 0.2);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  font-weight: 600;
  letter-spacing: 0.5px;
  animation: pulse 2s infinite;
  
  @keyframes pulse {
    0% {
      box-shadow: 0 2px 8px rgba(76, 175, 80, 0.2);
    }
    50% {
      box-shadow: 0 2px 12px rgba(76, 175, 80, 0.4);
    }
    100% {
      box-shadow: 0 2px 8px rgba(76, 175, 80, 0.2);
    }
  }
`;

const ProgressBar = styled.div`
  width: 100%;
  height: 4px;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 2px;
  margin-top: 0.5rem;
  overflow: hidden;
`;

const ProgressFill = styled.div<{ progress: number }>`
  height: 100%;
  background: linear-gradient(90deg, #4CAF50, #45a049);
  width: ${props => props.progress}%;
  transition: width 0.3s ease;
  border-radius: 2px;
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

const StatsDisplay = styled.div`
  display: flex;
  gap: 1rem;
  margin-bottom: 1rem;
  justify-content: center;
  flex-wrap: wrap;
`;

const StatItem = styled.div`
  background: rgba(255, 255, 255, 0.05);
  padding: 0.5rem 1rem;
  border-radius: 0.5rem;
  font-size: 0.9rem;
  color: #ffffff;
  border: 1px solid rgba(255, 255, 255, 0.1);
  display: flex;
  align-items: center;
  gap: 0.5rem;
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
  onLevelComplete: (difficulty: Difficulty, gameState?: { correctWords: number; incorrectWords: number; elapsedTime: number }) => void;
}

const GameBoard: React.FC<GameBoardProps> = ({ difficulty, onLevelComplete }) => {
  const [currentSentence, setCurrentSentence] = useState<ThaiSentence | null>(null);
  const [shuffledWords, setShuffledWords] = useState<string[]>([]);
  const [userAnswer, setUserAnswer] = useState<string[]>([]);
  const [usedWords, setUsedWords] = useState<Set<string>>(new Set());
  const [isComplete, setIsComplete] = useState(false);
  const [showDialog, setShowDialog] = useState(false);
  const [currentFont, setCurrentFont] = useState('font-1');
  const [correctWords, setCorrectWords] = useState(0);
  const [incorrectWords, setIncorrectWords] = useState(0);
  const [elapsedTime, setElapsedTime] = useState(0);
  const [isExiting, setIsExiting] = useState(false);
  const [showExitConfirm, setShowExitConfirm] = useState(false);
  const [isLevelCompleting, setIsLevelCompleting] = useState(false);
  const [helpClickedThisRound, setHelpClickedThisRound] = useState(false);
  const [sessionStats, setSessionStats] = useState({
    totalCorrectWords: 0,
    totalIncorrectWords: 0,
    totalTime: 0
  });
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
    setShowDialog(false);
    setHelpClickedThisRound(false); // Reset help state for new sentence
  }, [difficulty]);

  // Generate new sentence when difficulty changes
  useEffect(() => {
    console.log('Difficulty changed to:', difficulty);
    setCurrentSentence(null);
    setUserAnswer([]);
    setUsedWords(new Set());
    setIsComplete(false);
    
    setElapsedTime(0);
    startTimeRef.current = Date.now();
    
    // Generate new sentence immediately for better mobile performance
    generateNewSentence();
  }, [difficulty, generateNewSentence]);

  // Ensure progress is synchronized on mount
  useEffect(() => {
    const currentProgress = userService.getProgress(difficulty);
    console.log('Component mounted - syncing progress for difficulty:', difficulty, 'Progress:', currentProgress);
    
    if (currentProgress) {
      setCorrectWords(currentProgress.correctWords);
      setIncorrectWords(currentProgress.incorrectWords);
    }
  }, [difficulty]); // Add difficulty as dependency

  // FIX: Remove the progress update from the timer
  useEffect(() => {
    const timer = setInterval(() => {
      const now = Date.now();
      const elapsed = Math.floor((now - startTimeRef.current) / 1000);
      setElapsedTime(elapsed);
      // DON'T update progress here - only track time locally
    }, 1000);

    return () => clearInterval(timer);
  }, []); // Remove difficulty dependency since it's not used in the effect

  const handleDrop = useCallback((word: string, position: number) => {
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
  }, [usedWords, userAnswer, stopDrag]);

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
  }, [dragState, getActiveDropZone, dropZones, handleDrop, stopDrag]);

  const checkAnswer = () => {
    if (!currentSentence) return false;
    
    // First check if all positions are filled
    if (userAnswer.some(word => !word)) {
      return false;
    }
    
    // Then check if the answer matches exactly
    return userAnswer.join(' ') === currentSentence.thaiWords.join(' ');
  };

  const handleAnswerCheck = () => {
    // First verify all words are placed
    if (userAnswer.some(word => !word)) {
      return;
    }

    const isAnswerCorrect = checkAnswer();
    setIsComplete(true);

    const currentProgress = userService.getProgress(difficulty) || {
      totalTime: 0,
      timestamp: Date.now(),
      correctWords: 0,
      incorrectWords: 0
    };

    if (isAnswerCorrect) {
      const newCorrectWords = currentProgress.correctWords + 1;
      console.log('Correct answer! Progress:', {
        current: currentProgress.correctWords,
        new: newCorrectWords,
        difficulty
      });
      
      setCorrectWords(newCorrectWords);
      
      // Single point of progress update
      userService.updateProgress(difficulty, {
        ...currentProgress,
        correctWords: newCorrectWords,
        timestamp: Date.now()
      });
      
      // Update session statistics (persists across levels)
      userService.updateSessionStats(1, 0, elapsedTime);
      const updatedSessionStats = userService.getSessionStats();
      setSessionStats(updatedSessionStats);
      console.log('Session stats updated for correct answer:', updatedSessionStats);
      
      // Show completion dialog only when reaching exactly 5 correct words
      if (newCorrectWords === 5) {
        console.log('🎉 Level completed! Calling onLevelComplete');
        
        // Set level completing state
        setIsLevelCompleting(true);
        
        // Call onLevelComplete with current game state
        onLevelComplete(difficulty, {
          correctWords: newCorrectWords,
          incorrectWords: currentProgress.incorrectWords,
          elapsedTime: elapsedTime
        });
        
        // Reset the state after calling onLevelComplete
        setIsLevelCompleting(false);
      } else {
        console.log('Not level complete yet. Progress:', newCorrectWords, '/ 5');
        // Generate new sentence after a short delay for any correct answer
        setTimeout(() => {
          generateNewSentence();
          setIsComplete(false);
        }, 1000);
      }
    } else {
      setIncorrectWords(prev => prev + 1);
      
      // Update incorrect words count
      userService.updateProgress(difficulty, {
        ...currentProgress,
        incorrectWords: currentProgress.incorrectWords + 1,
        timestamp: Date.now()
      });
      
      // Update session statistics (persists across levels)
      userService.updateSessionStats(0, 1, elapsedTime);
      const updatedSessionStats = userService.getSessionStats();
      setSessionStats(updatedSessionStats);
      console.log('Session stats updated for incorrect answer:', updatedSessionStats);
      
      setShowDialog(true);
    }
  };

  const handleClear = () => {
    if (isComplete) return;

    setUserAnswer(Array(currentSentence?.thaiWords.length || 0).fill(''));
    setUsedWords(new Set()); // Reset used words
  };

  const getSentenceCounterText = () => {
    if (correctWords >= 5) {
      return "🎉 Level Complete!";
    }
    return `📝 Sentence ${correctWords + 1} of 5`;
  };

  const getSentenceCounterColor = () => {
    if (correctWords >= 5) {
      return "#FFD700"; // Gold for completion
    }
    return "#4CAF50"; // Green for in progress
  };

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  const handleHelpClick = () => {
    setHelpClickedThisRound(true);
  };

  const handleExitClick = () => {
    if (isExiting || showExitConfirm) return; // Prevent multiple clicks
    setShowExitConfirm(true);
  };

  const handleExitConfirm = async () => {
    setIsExiting(true);
    setShowExitConfirm(false);

    try {
      // Calculate current session stats for leaderboard save
      const currentTime = Math.floor((Date.now() - startTimeRef.current) / 1000);
      const totalSessionTime = sessionStats.totalTime + currentTime;
      const totalSessionCorrect = sessionStats.totalCorrectWords + correctWords;
      const totalSessionIncorrect = sessionStats.totalIncorrectWords + incorrectWords;

      // Get current user
      const currentUser = userService.getUser();
      if (!currentUser) {
        console.error('No user found for exit save');
        return;
      }

      // Don't save scores for Guest users
      if (currentUser.name === 'Guest') {
        console.log('🚫 Guest user - skipping leaderboard save');
      } else {
        // Save to leaderboard with session stats only for non-Guest users
        await leaderboardService.addEntry({
          name: currentUser.name,
          correctWords: totalSessionCorrect,
          incorrectWords: totalSessionIncorrect,
          totalTime: totalSessionTime
        });

        console.log('✅ Exit stats saved to leaderboard:', {
          name: currentUser.name,
          correctWords: totalSessionCorrect,
          incorrectWords: totalSessionIncorrect,
          totalTime: totalSessionTime
        });
      }

      // Update session stats before exiting
      userService.updateSessionStats(correctWords, incorrectWords, currentTime);

      // IMPORTANT: Send only current level stats for exit detection
      // This ensures the system knows it's an exit, not a level completion
      onLevelComplete(difficulty, {
        correctWords: correctWords, // Only current level correct words
        incorrectWords: incorrectWords, // Only current level incorrect words
        elapsedTime: currentTime // Only current level time
      });

    } catch (error) {
      console.error('❌ Error saving exit stats:', error);
      // Still exit even if save fails - send only current level stats
      onLevelComplete(difficulty, {
        correctWords: correctWords,
        incorrectWords: incorrectWords,
        elapsedTime: Math.floor((Date.now() - startTimeRef.current) / 1000)
      });
    }
  };

  const handleExitCancel = () => {
    setShowExitConfirm(false);
  };

  // Calculate current stats for display
  const currentTime = Math.floor((Date.now() - startTimeRef.current) / 1000);
  const totalSessionTime = sessionStats.totalTime + currentTime;
  const totalSessionCorrect = sessionStats.totalCorrectWords + correctWords;
  const totalSessionIncorrect = sessionStats.totalIncorrectWords + incorrectWords;

  if (!currentSentence) return null;

  return (
    <GameBoardContainer>
      <DifficultyIndicator>
        Level: {difficulty}
      </DifficultyIndicator>
      
      <SentenceCounter style={{ color: getSentenceCounterColor() }}>
        {getSentenceCounterText()}
        <ProgressBar>
          <ProgressFill progress={(correctWords / 5) * 100} />
        </ProgressBar>
      </SentenceCounter>
      
      <StatsDisplay>
        <StatItem>
          ✅ Level: {correctWords}/5
        </StatItem>
        <StatItem>
          ❌ Level: {incorrectWords}
        </StatItem>
        <StatItem>
          ⏱️ Level: {formatTime(elapsedTime)}
        </StatItem>
      </StatsDisplay>
      
      {/* Session Statistics */}
      <div style={{
        background: 'rgba(33, 150, 243, 0.1)',
        padding: '0.5rem 1rem',
        borderRadius: '8px',
        margin: '0.5rem 0',
        textAlign: 'center',
        border: '1px solid #2196f3',
        fontSize: '0.9rem'
      }}>
        <div style={{ fontWeight: 'bold', color: '#2196f3', marginBottom: '0.25rem' }}>
          🏆 Session Total
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-around', gap: '1rem' }}>
          <span>✅ {sessionStats.totalCorrectWords}</span>
          <span>❌ {sessionStats.totalIncorrectWords}</span>
          <span>⏱️ {formatTime(sessionStats.totalTime)}</span>
        </div>
      </div>
      
      {isLevelCompleting && (
        <div style={{
          background: 'rgba(76, 175, 80, 0.1)',
          color: '#4CAF50',
          padding: '0.5rem 1rem',
          borderRadius: '8px',
          margin: '0.5rem 0',
          textAlign: 'center',
          fontWeight: 'bold',
          border: '1px solid #4CAF50'
        }}>
          🎉 Level Completed! Moving to next level...
        </div>
      )}
      
      <SentenceContainer>
        <EnglishText>
          {currentSentence.english}
        </EnglishText>
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
        {shuffledWords.map((word, index) => {
          // Find the correct position for this word in the original sentence
          const correctPosition = currentSentence.thaiWords.findIndex(w => w === word);
          return (
            <DraggableWord
              key={`${word}-${index}`}
              word={word}
              fontClass={currentFont}
              correctPosition={correctPosition}
              isUsed={usedWords.has(word)}
              onDragStart={() => {
                // Optional: Add any drag start logic
              }}
              onDragEnd={() => {
                // Optional: Add any drag end logic
              }}
            />
          );
        })}
      </WordContainer>

      <ButtonContainer>
        <Button 
          variant="primary" 
          onClick={handleAnswerCheck}
          disabled={isComplete || userAnswer.length !== currentSentence?.thaiWords.length || userAnswer.some(word => !word)}
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
        <Button 
          variant="danger" 
          onClick={handleExitClick}
          disabled={isExiting}
        >
          {isExiting ? 'Exiting...' : 'Exit'}
        </Button>
      </ButtonContainer>

      {/* AI Help Assistant */}
      <AIHelpAssistant
        targetSentence={currentSentence.thaiWords}
        userAnswer={userAnswer}
        availableWords={shuffledWords}
        helpClickedThisRound={helpClickedThisRound}
        onHelpClick={handleHelpClick}
      />

      {/* Exit Confirmation Dialog */}
      {showExitConfirm && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(0, 0, 0, 0.7)',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          zIndex: 1000
        }}>
          <div style={{
            background: 'white',
            padding: '2rem',
            borderRadius: '12px',
            maxWidth: '400px',
            textAlign: 'center',
            boxShadow: '0 4px 20px rgba(0, 0, 0, 0.3)'
          }}>
            <h3 style={{ marginTop: 0, color: '#000' }}>Exit Game?</h3>
            <p style={{ color: '#000', marginBottom: '1.5rem' }}>
              {userService.getUser()?.name === 'Guest' 
                ? 'Your session will end without saving to leaderboard:'
                : 'Your current session stats will be saved to the leaderboard:'
              }
            </p>
            <div style={{
              background: '#f5f5f5',
              padding: '1rem',
              borderRadius: '8px',
              marginBottom: '1.5rem',
              fontSize: '0.9rem'
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem', color: '#000' }}>
                <span>✅ Correct:</span>
                <span style={{ fontWeight: 'bold' }}>{totalSessionCorrect}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem', color: '#000' }}>
                <span>❌ Incorrect:</span>
                <span style={{ fontWeight: 'bold' }}>{totalSessionIncorrect}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', color: '#000' }}>
                <span>⏱️ Time:</span>
                <span style={{ fontWeight: 'bold' }}>{formatTime(totalSessionTime)}</span>
              </div>
            </div>
            <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}>
              <button
                onClick={handleExitCancel}
                style={{
                  padding: '0.5rem 1rem',
                  border: '1px solid #ccc',
                  borderRadius: '6px',
                  background: 'white',
                  cursor: 'pointer',
                  color: '#000'
                }}
              >
                Cancel
              </button>
              <button
                onClick={handleExitConfirm}
                style={{
                  padding: '0.5rem 1rem',
                  border: 'none',
                  borderRadius: '6px',
                  background: '#dc3545',
                  color: 'white',
                  cursor: 'pointer'
                }}
              >
                {userService.getUser()?.name === 'Guest' ? 'Exit' : 'Exit & Save'}
              </button>
            </div>
          </div>
        </div>
      )}
    </GameBoardContainer>
  );
};

export default GameBoard;