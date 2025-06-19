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
  const [isDevelopmentMode, setIsDevelopmentMode] = useState(false);

  // DEVELOPMENT MODE: Clear leaderboard AND player progress on app start
  useEffect(() => {
    const initializeDevelopmentMode = async () => {
      try {
        // Check if we're in development mode
        const isDevelopment = process.env.NODE_ENV === 'development' || 
                             window.location.hostname === 'localhost' ||
                             window.location.hostname === '127.0.0.1' ||
                             window.location.hostname.includes('localhost');
        
        setIsDevelopmentMode(isDevelopment);
        
        if (isDevelopment) {
          console.log('🧹 DEVELOPMENT MODE DETECTED');
          console.log('🧹 Clearing leaderboard on app start...');
          await leaderboardService.clearEntries();
          console.log('✅ Leaderboard cleared for development');
          
          console.log('🧹 Clearing player progress on app start...');
          userService.clearAllProgress();
          userService.clearUser();
          console.log('✅ Player progress cleared for development');
          
          // Reset local state to ensure clean start
          setProgress({
            beginner: 0,
            intermediate: 0,
            advanced: 0
          });
          setDifficulty('beginner');
          setIsGameCompleted(false);
          setShowUserForm(true);
          
          console.log('🔧 Development mode active - fresh start on each restart');
        }
      } catch (error) {
        console.error('❌ Error in development mode initialization:', error);
      }
    };

    initializeDevelopmentMode();
  }, []); // Run only once when app starts

  // Single source of truth for progress calculation
  useEffect(() => {
    calculateProgress();
  }, [difficulty, showDialog]);

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
    const currentUser = userService.getUser();
    
    // Check if this is a new player (different name or no previous user)
    if (!currentUser || currentUser.name !== userData.name) {
      console.log(`New player detected: ${userData.name}`);
      
      // Clear all previous progress for the new player
      userService.clearAllProgress();
      
      // Reset game state
      setDifficulty('beginner');
      setProgress({
        beginner: 0,
        intermediate: 0,
        advanced: 0
      });
      
      console.log('Progress cleared for new player');
    } else {
      console.log(`Returning player: ${userData.name}`);
      // For returning players, keep session stats but reset if they want a fresh start
      // Session stats will persist across their play session
    }
    
    // Set the new user (this will initialize session stats for new players)
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
      console.log('=== LEVEL COMPLETE FUNCTION CALLED ===');
      console.log('Level complete called for difficulty:', completedDifficulty, 'with gameState:', gameState);
      
      // Use gameState if available, otherwise get from userService
      const finalCorrectWords = gameState?.correctWords || 0;
      const finalIncorrectWords = gameState?.incorrectWords || 0;
      const finalTotalTime = gameState?.elapsedTime || 0;
      
      console.log('Final game state:', { finalCorrectWords, finalIncorrectWords, finalTotalTime });
      
      // Check if this is an exit (not a level completion)
      const isExit = finalCorrectWords < 5;
      
      if (isExit) {
        console.log('🚪 User exited during gameplay');
        
        // For exit, return to main screen with entrance form
        setDifficulty('beginner'); // Reset to beginner for next game
        setShowUserForm(true); // Show the entrance form
        return;
      }
      
      // Check if level is actually completed (5 correct words)
      if (finalCorrectWords >= 5) {
        console.log('✅ Level is completed with 5 correct words');
        
        // Single point of progress update - use completedDifficulty
        const currentProgress = userService.getProgress(completedDifficulty) || {
          totalTime: 0,
          timestamp: Date.now(),
          correctWords: 0,
          incorrectWords: 0
        };
        
        // Update progress once and only once
        userService.updateProgress(completedDifficulty, {
          ...currentProgress,
          correctWords: finalCorrectWords,
          incorrectWords: finalIncorrectWords,
          totalTime: finalTotalTime,
          timestamp: Date.now()
        });
        
        // Recalculate progress to update UI
        calculateProgress();

        // Submit score to leaderboard when level is completed
        const currentUser = userService.getUser();
        const userName = currentUser?.name || 'Guest';
        
        console.log('🏆 Submitting to leaderboard:', {
          name: userName,
          correctWords: finalCorrectWords,
          incorrectWords: finalIncorrectWords,
          totalTime: finalTotalTime
        });

        leaderboardService.addEntry({
          name: userName,
          correctWords: finalCorrectWords,
          incorrectWords: finalIncorrectWords,
          totalTime: finalTotalTime
        }).then(() => {
          console.log('✅ Leaderboard submission successful');
          // Force refresh the leaderboard display
          setTimeout(() => {
            if (showLeaderboard) {
              setShowLeaderboard(false);
              setTimeout(() => setShowLeaderboard(true), 100);
            }
          }, 1000);
        }).catch(error => {
          console.error('❌ Error submitting to leaderboard:', error);
        });

        // Check if this is the final level (advanced)
        if (completedDifficulty === 'advanced') {
          console.log('🎉 Game completed - showing final completion message');
          setDialogMessage('🎉 Congratulations! You have completed ALL levels! You are now a Thai sentence master! 🏆');
          setDialogType('success');
          setDialogButtonText('View Leaderboard');
          setShowDialog(true);
          setIsGameCompleted(true);
        } else {
          // Automatically move to the next level
          const nextLevel = userService.getNextLevel(completedDifficulty);
          console.log('Next level determined:', nextLevel);
          
          if (nextLevel) {
            const completedLevel = completedDifficulty;
            
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
          } else {
            console.error('Could not determine next level for difficulty:', completedDifficulty);
            setDialogMessage('Level completed!');
            setDialogType('success');
            setDialogButtonText('Continue');
            setShowDialog(true);
          }
        }
      } else {
        console.log('❌ Level not completed yet. Correct words:', finalCorrectWords);
        // Still working on current level
        const remaining = 5 - finalCorrectWords;
        setDialogMessage(`Great job! ${remaining} more sentence${remaining !== 1 ? 's' : ''} to complete this level.`);
        setDialogType('success');
        setDialogButtonText('Continue');
        setShowDialog(true);
      }
    } catch (error) {
      console.error('❌ Error in handleLevelComplete:', error);
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

  const handleDevelopmentReset = async () => {
    try {
      console.log('🧹 MANUAL DEVELOPMENT RESET');
      
      // Clear leaderboard
      console.log('Clearing leaderboard...');
      await leaderboardService.clearEntries();
      
      // Clear all player progress and session stats
      console.log('Clearing player progress and session stats...');
      userService.clearAllProgress();
      userService.resetSessionStats();
      userService.clearUser();
      
      // Reset all local state
      setProgress({
        beginner: 0,
        intermediate: 0,
        advanced: 0
      });
      setDifficulty('beginner');
      setIsGameCompleted(false);
      setShowUserForm(true);
      setShowLeaderboard(false);
      setShowDialog(false);
      
      console.log('✅ Complete development reset successful');
      alert('🎯 Development reset complete! Fresh start ready.');
      
    } catch (error) {
      console.error('❌ Error in development reset:', error);
      alert('Error during development reset');
    }
  };

  const handleAddTestEntry = async () => {
    try {
      console.log('🧪 Adding test entry for Bob test...');
      await leaderboardService.addTestEntry();
      alert('✅ Test entry "Bob test" added successfully! Check the leaderboard.');
    } catch (error) {
      console.error('❌ Error adding test entry:', error);
      
      let errorMessage = 'Error adding test entry';
      if (error instanceof Error) {
        errorMessage = `Error: ${error.message}`;
      } else if (typeof error === 'object' && error !== null) {
        errorMessage = `Error: ${JSON.stringify(error)}`;
      }
      
      alert(errorMessage);
      
      // Offer to add a local test entry as fallback
      const addLocal = window.confirm('Database error occurred. Would you like to add a local test entry instead?');
      if (addLocal) {
        handleAddLocalTestEntry();
      }
    }
  };

  const handleAddLocalTestEntry = () => {
    try {
      // Create a local test entry without database
      const testEntry = {
        name: 'Bob test (Local)',
        correctWords: 100,
        incorrectWords: 15,
        totalTime: 1800
      };
      
      // Add to local leaderboard array
      leaderboardService['leaderboard'].unshift(testEntry);
      
      console.log('✅ Local test entry added:', testEntry);
      alert('✅ Local test entry "Bob test (Local)" added! Check the leaderboard.');
      
      // Force leaderboard refresh
      if (showLeaderboard) {
        setShowLeaderboard(false);
        setTimeout(() => setShowLeaderboard(true), 100);
      }
    } catch (error) {
      console.error('❌ Error adding local test entry:', error);
      alert('Error adding local test entry');
    }
  };

  const handleTestConnection = async () => {
    try {
      const isConnected = await leaderboardService.testConnection();
      if (isConnected) {
        alert('✅ Supabase connection successful!');
      } else {
        alert('❌ Supabase connection failed! Check console for details.');
      }
    } catch (error) {
      console.error('❌ Connection test error:', error);
      alert('❌ Connection test error! Check console for details.');
    }
  };

  if (showUserForm) {
    return (
      <>
        <GlobalStyle />
        <FirstPageContainer data-first-page-container>
          <Title>Thai Sentence Builder</Title>
          
          {/* Development Mode Indicator for User Form */}
          {isDevelopmentMode && (
            <div style={{
              background: '#ff9800',
              color: 'white',
              padding: '0.5rem 1rem',
              borderRadius: '8px',
              margin: '0.5rem 0',
              textAlign: 'center',
              fontWeight: 'bold',
              border: '1px solid #f57c00',
              fontSize: '0.9rem'
            }}>
              🔧 DEVELOPMENT MODE - Fresh start on each restart
              <button 
                onClick={handleDevelopmentReset}
                style={{
                  background: '#f57c00',
                  color: 'white',
                  border: 'none',
                  padding: '0.25rem 0.5rem',
                  borderRadius: '4px',
                  marginLeft: '1rem',
                  cursor: 'pointer',
                  fontSize: '0.8rem'
                }}
              >
                Reset Everything
              </button>
              <button 
                onClick={handleAddTestEntry}
                style={{
                  background: '#4CAF50',
                  color: 'white',
                  border: 'none',
                  padding: '0.25rem 0.5rem',
                  borderRadius: '4px',
                  marginLeft: '0.5rem',
                  cursor: 'pointer',
                  fontSize: '0.8rem'
                }}
              >
                Add Bob Test
              </button>
              <button 
                onClick={handleTestConnection}
                style={{
                  background: '#2196f3',
                  color: 'white',
                  border: 'none',
                  padding: '0.25rem 0.5rem',
                  borderRadius: '4px',
                  marginLeft: '0.5rem',
                  cursor: 'pointer',
                  fontSize: '0.8rem'
                }}
              >
                Test Connection
              </button>
            </div>
          )}
          
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
          
          {/* Development Mode Indicator */}
          {isDevelopmentMode && (
            <div style={{
              background: '#ff9800',
              color: 'white',
              padding: '0.5rem 1rem',
              borderRadius: '8px',
              margin: '0.5rem 0',
              textAlign: 'center',
              fontWeight: 'bold',
              border: '1px solid #f57c00',
              fontSize: '0.9rem'
            }}>
              🔧 DEVELOPMENT MODE - Fresh start on each restart
              <button 
                onClick={handleDevelopmentReset}
                style={{
                  background: '#f57c00',
                  color: 'white',
                  border: 'none',
                  padding: '0.25rem 0.5rem',
                  borderRadius: '4px',
                  marginLeft: '1rem',
                  cursor: 'pointer',
                  fontSize: '0.8rem'
                }}
              >
                Reset Everything
              </button>
              <button 
                onClick={handleAddTestEntry}
                style={{
                  background: '#4CAF50',
                  color: 'white',
                  border: 'none',
                  padding: '0.25rem 0.5rem',
                  borderRadius: '4px',
                  marginLeft: '0.5rem',
                  cursor: 'pointer',
                  fontSize: '0.8rem'
                }}
              >
                Add Bob Test
              </button>
              <button 
                onClick={handleTestConnection}
                style={{
                  background: '#2196f3',
                  color: 'white',
                  border: 'none',
                  padding: '0.25rem 0.5rem',
                  borderRadius: '4px',
                  marginLeft: '0.5rem',
                  cursor: 'pointer',
                  fontSize: '0.8rem'
                }}
              >
                Test Connection
              </button>
            </div>
          )}
          
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