import React, { useState, useEffect } from 'react';
import styled, { createGlobalStyle } from 'styled-components';
import GameBoard from './components/GameBoard/GameBoard';
import { DifficultySelector } from './components/DifficultySelector/DifficultySelector';
import AdManager from './components/Ads/AdManager';
import { userService } from './services/userService';
import { Difficulty } from './types';
import UserForm from './components/UserForm/UserForm';
import Leaderboard from './components/Leaderboard/Leaderboard';
import Dialog from './components/Dialog/Dialog';
import { DragProvider } from './components/DraggableWord/DragContext';
import DragLayer from './components/DraggableWord/DragLayer';
import FeedbackButton from './components/Feedback/FeedbackButton';
import FeedbackModal from './components/Feedback/FeedbackModal';
import { leaderboardService } from './components/Leaderboard/leaderboardService';

const GlobalStyle = createGlobalStyle`
  * {
    -webkit-user-select: none;
    -moz-user-select: none;
    -ms-user-select: none;
    user-select: none;
    -webkit-touch-callout: none;
    -webkit-tap-highlight-color: transparent;
    margin: 0;
    padding: 0;
    box-sizing: border-box;
  }

  html, body {
    height: 100%;
    width: 100%;
    overflow: hidden;
    position: fixed;
    -webkit-touch-callout: none;
    -webkit-tap-highlight-color: transparent;
    -webkit-touch-action: manipulation;
    touch-action: manipulation;
  }

  /* Allow scrolling when leaderboard is open */
  body.leaderboard-open {
    overflow: auto;
    position: static;
  }

  input, textarea {
    -webkit-user-select: text;
    -moz-user-select: text;
    -ms-user-select: text;
    user-select: text;
  }

  /* Prevent iOS magnifying glass */
  * {
    -webkit-touch-callout: none;
    -webkit-tap-highlight-color: transparent;
  }

  /* Improve touch responsiveness */
  button, [role="button"] {
    -webkit-touch-action: manipulation;
    touch-action: manipulation;
  }
`;

const AppContainer = styled.div`
  min-height: 100vh;
  height: 100vh;
  width: 100vw;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 2rem;
  background: #f8f9fa;
  overflow: hidden;
  position: fixed;
  top: 0;
  left: 0;
  box-sizing: border-box;
`;

const FirstPageContainer = styled.div`
  min-height: 100vh;
  width: 100vw;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 2rem;
  padding-bottom: 4rem; /* Extra bottom padding for scrolling */
  background: #f8f9fa;
  overflow-y: auto;
  overflow-x: hidden;
  position: absolute; /* Changed from fixed to absolute */
  top: 0;
  left: 0;
  box-sizing: border-box;
  -webkit-overflow-scrolling: touch; /* Smooth scrolling on iOS */
  
  /* Custom scrollbar styling */
  &::-webkit-scrollbar {
    width: 8px;
  }
  
  &::-webkit-scrollbar-track {
    background: rgba(0, 0, 0, 0.1);
    border-radius: 4px;
  }
  
  &::-webkit-scrollbar-thumb {
    background: rgba(0, 0, 0, 0.3);
    border-radius: 4px;
  }
  
  &::-webkit-scrollbar-thumb:hover {
    background: rgba(0, 0, 0, 0.5);
  }
  
  /* Ensure content can scroll */
  & > * {
    flex-shrink: 0;
  }
`;

const Title = styled.h1`
  color: #343a40;
  margin-bottom: 2rem;
  text-align: center;
`;

const ProgressText = styled.div`
  color: #495057;
  margin-bottom: 1rem;
  text-align: center;
  font-size: 1.1rem;
`;

const Button = styled.button`
  padding: 0.75rem 1.5rem;
  margin: 1rem;
  border: none;
  border-radius: 6px;
  background: #4CAF50;
  color: white;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;

  &:hover {
    background: #45a049;
    transform: translateY(-2px);
  }
`;

const LeaderboardSection = styled.div`
  width: 100%;
  max-width: 800px;
  margin: 0 0 2rem 0;
  padding: 0 1rem;
  flex-shrink: 0;
  min-height: 400px;
  max-height: 80vh;
  background: rgba(255, 255, 255, 0.8);
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  border: 1px solid rgba(0, 0, 0, 0.1);
  animation: slideDown 0.3s ease-out;
  overflow: hidden;
  position: relative;
  
  @keyframes slideDown {
    from {
      opacity: 0;
      transform: translateY(-20px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }
  
  @media (max-width: 768px) {
    margin: 0 0 1rem 0;
    padding: 0 0.5rem;
    min-height: 300px;
    max-height: 70vh;
  }
`;

const App: React.FC = () => {
  const [difficulty, setDifficulty] = useState<Difficulty>('beginner');
  const [progress, setProgress] = useState<{ [key in Difficulty]: number }>({
    beginner: 0,
    intermediate: 0,
    advanced: 0
  });
  const [showUserForm, setShowUserForm] = useState(true);
  const [showDialog, setShowDialog] = useState(false);
  const [dialogMessage, setDialogMessage] = useState('');
  const [dialogType, setDialogType] = useState<'success' | 'error'>('success');
  const [isCommercialMode, setIsCommercialMode] = useState(false);
  const [showLeaderboard, setShowLeaderboard] = useState(false);
  const [isGameCompleted, setIsGameCompleted] = useState(false);
  const [dialogButtonText, setDialogButtonText] = useState('Close');
  const [showFeedbackModal, setShowFeedbackModal] = useState(false);
  const [isChangingLevel, setIsChangingLevel] = useState(false);

  // Add effect to recalculate progress when showing dialog
  useEffect(() => {
    if (showDialog) {
      calculateProgress();
    }
  }, [showDialog]);

  // Add effect to recalculate progress when difficulty changes
  useEffect(() => {
    calculateProgress();
  }, [difficulty]);

  // Initialize progress when app starts
  useEffect(() => {
    calculateProgress();
  }, []);

  const calculateProgress = () => {
    const newProgress: { [key in Difficulty]: number } = {
      beginner: 0,
      intermediate: 0,
      advanced: 0
    };

    // Calculate progress for each difficulty level
    Object.keys(newProgress).forEach((diff) => {
      const userProgress = userService.getProgress(diff as Difficulty);
      if (userProgress) {
        // Ensure progress doesn't exceed 100%
        const correctWords = Math.min(userProgress.correctWords, 5);
        newProgress[diff as Difficulty] = (correctWords / 5) * 100;
      }
    });
    
    setProgress(newProgress);
  };

  const handleUserSubmit = (userData: { name: string }) => {
    userService.setUser(userData.name);
    setShowUserForm(false);
  };

  const handleSkip = () => {
    userService.setUser('Guest');
    setShowUserForm(false);
  };

  const handleLevelSelect = (selectedDifficulty: Difficulty) => {
    setDifficulty(selectedDifficulty);
  };

  const handleToggleCommercialMode = () => {
    setIsCommercialMode((prev) => !prev);
  };

  const handleLevelComplete = (completedDifficulty: Difficulty, gameState?: { correctWords: number; incorrectWords: number; elapsedTime: number }) => {
    try {
      console.log('Level complete called for difficulty:', completedDifficulty, 'with gameState:', gameState);
      
      calculateProgress();
      
      const userProgress = userService.getProgress(difficulty);
      if (userProgress) {
        const correctWords = Math.min(userProgress.correctWords, 5);
        const newProgressPercentage = (correctWords / 5) * 100;
        
        setProgress(prev => ({
          ...prev,
          [difficulty]: newProgressPercentage
        }));

        if (newProgressPercentage >= 100) {
          // Submit score to leaderboard when level is completed
          const currentUser = userService.getUser();
          const userName = currentUser?.name || 'Guest';
          
          // Use gameState if available, otherwise fall back to userProgress
          const finalCorrectWords = gameState?.correctWords || correctWords;
          const finalIncorrectWords = gameState?.incorrectWords || userProgress.incorrectWords;
          const finalTotalTime = gameState?.elapsedTime || userProgress.totalTime;
          
          console.log('Submitting to leaderboard:', {
            name: userName,
            correctWords: finalCorrectWords,
            incorrectWords: finalIncorrectWords,
            totalTime: finalTotalTime
          });
          
          // Submit to leaderboard with better error handling
          leaderboardService.addEntry({
            name: userName,
            correctWords: finalCorrectWords,
            incorrectWords: finalIncorrectWords,
            totalTime: finalTotalTime
          }).then(() => {
            console.log('Leaderboard submission successful');
          }).catch(error => {
            console.error('Error submitting to leaderboard:', error);
          });

          // Check if this is the final level (advanced)
          if (difficulty === 'advanced') {
            // Game completed - show final completion message and leaderboard
            setDialogMessage('🎉 Congratulations! You have completed ALL levels! You are now a Thai sentence master! 🏆');
            setDialogType('success');
            setDialogButtonText('View Leaderboard');
            setShowDialog(true);
            setIsGameCompleted(true);
          } else {
            // Automatically move to the next level
            const nextLevel = userService.getNextLevel(difficulty);
            if (nextLevel) {
              const completedLevel = difficulty; // Store the completed level name
              
              console.log('Moving from', completedLevel, 'to', nextLevel);
              
              // Show loading state
              setIsChangingLevel(true);
              
              // Set the new difficulty immediately
              setDifficulty(nextLevel);
              
              // Show completion message
              setDialogMessage(`🎊 Level ${completedLevel.charAt(0).toUpperCase() + completedLevel.slice(1)} completed! Moving to ${nextLevel} level.`);
              setDialogType('success');
              setDialogButtonText('Continue');
              setShowDialog(true);
              
              // Clear loading state after a short delay
              setTimeout(() => {
                setIsChangingLevel(false);
              }, 1000);
            }
          }
        } else {
          // Still working on current level
          const remaining = 5 - correctWords;
          setDialogMessage(`Great job! ${remaining} more sentence${remaining !== 1 ? 's' : ''} to complete this level.`);
          setDialogType('success');
          setDialogButtonText('Continue');
          setShowDialog(true);
        }
      } else {
        console.warn('No user progress found for difficulty:', difficulty);
        // Fallback: show a generic completion message
        setDialogMessage('Level completed! Moving to next level.');
        setDialogType('success');
        setDialogButtonText('Continue');
        setShowDialog(true);
      }
    } catch (error) {
      console.error('Error in handleLevelComplete:', error);
      // Fallback: show error message and try to continue
      setDialogMessage('Level completed! Moving to next level.');
      setDialogType('success');
      setDialogButtonText('Continue');
      setShowDialog(true);
    }
  };

  const handleDialogClose = () => {
    setShowDialog(false);
    
    // If game is completed, show leaderboard
    if (isGameCompleted) {
      setShowLeaderboard(true);
      // Add class to body to allow scrolling
      document.body.classList.add('leaderboard-open');
    }
  };

  const handleGameRestart = () => {
    setIsGameCompleted(false);
    setDifficulty('beginner');
    setProgress({
      beginner: 0,
      intermediate: 0,
      advanced: 0
    });
    userService.clearUser();
    // Reset to user form
    setShowUserForm(true);
  };

  const getLockedLevels = (): Difficulty[] => {
    const lockedLevels: Difficulty[] = [];
    if (!userService.isLevelComplete('beginner')) {
      lockedLevels.push('intermediate');
      lockedLevels.push('advanced');
    } else if (!userService.isLevelComplete('intermediate')) {
      lockedLevels.push('advanced');
    }
    return lockedLevels;
  };

  const getProgressText = () => {
    const userProgress = userService.getProgress(difficulty);
    if (userProgress) {
      return `${userProgress.correctWords} / 5 sentences completed`;
    }
    return '';
  };

  const handleShowLeaderboard = () => {
    setShowLeaderboard(true);
    // Add class to body to allow scrolling
    document.body.classList.add('leaderboard-open');
    // Scroll to top when leaderboard is opened
    setTimeout(() => {
      const container = document.querySelector('[data-first-page-container]');
      if (container) {
        container.scrollTop = 0;
      }
    }, 100);
  };

  const handleHideLeaderboard = () => {
    setShowLeaderboard(false);
    // Remove class from body to restore fixed behavior
    document.body.classList.remove('leaderboard-open');
  };

  if (showUserForm) {
    return (
      <>
        <GlobalStyle />
        <FirstPageContainer data-first-page-container>
          <Title>Thai Sentence Builder</Title>
          
          {showLeaderboard && (
            <LeaderboardSection>
              <Leaderboard onClose={handleHideLeaderboard} showCloseButton={true} />
              {isGameCompleted && (
                <Button 
                  onClick={handleGameRestart}
                  style={{
                    background: '#4CAF50',
                    color: 'white',
                    padding: '1rem 2rem',
                    fontSize: '1.1rem',
                    fontWeight: 'bold',
                    border: '2px solid #45a049',
                    boxShadow: '0 4px 8px rgba(76, 175, 80, 0.3)',
                    marginTop: '1rem',
                    borderRadius: '8px',
                    cursor: 'pointer'
                  }}
                >
                  🎮 Play Again
                </Button>
              )}
            </LeaderboardSection>
          )}
          
          <UserForm onSubmit={handleUserSubmit} onSkip={handleSkip} />
          <Button 
            onClick={handleShowLeaderboard}
            style={{
              background: '#2196f3',
              color: 'white',
              padding: '1rem 2rem',
              fontSize: '1.1rem',
              fontWeight: 'bold',
              border: '2px solid #1976d2',
              boxShadow: '0 4px 8px rgba(33, 150, 243, 0.3)',
              marginTop: '1rem'
            }}
          >
            🏆 View Leaderboard
          </Button>
          <FeedbackButton onClick={() => setShowFeedbackModal(true)} />
        </FirstPageContainer>
        <FeedbackModal 
          isOpen={showFeedbackModal}
          onClose={() => setShowFeedbackModal(false)} 
        />
      </>
    );
  }

  return (
    <DragProvider>
      <>
        <GlobalStyle />
        <AppContainer>
          <Title>Thai Sentence Builder</Title>
          <ProgressText>{getProgressText()}</ProgressText>
          {isChangingLevel && (
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
              🔄 Changing Level...
            </div>
          )}
          <DifficultySelector
            currentDifficulty={difficulty}
            progress={progress}
            onLevelSelect={handleLevelSelect}
            lockedLevels={getLockedLevels()}
          />
          <GameBoard
            difficulty={difficulty}
            onLevelComplete={handleLevelComplete}
          />
          <AdManager isCommercialMode={isCommercialMode} onToggleCommercialMode={handleToggleCommercialMode} />
          {showDialog && (
            <Dialog
              message={dialogMessage}
              type={dialogType}
              onClose={handleDialogClose}
              buttonText={dialogButtonText}
            />
          )}
        </AppContainer>
        <DragLayer />
      </>
    </DragProvider>
  );
};

export default App; 