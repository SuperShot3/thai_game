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

const GlobalStyle = createGlobalStyle`
  * {
    -webkit-user-select: none;
    -moz-user-select: none;
    -ms-user-select: none;
    user-select: none;
    -webkit-touch-callout: none;
    margin: 0;
    padding: 0;
    box-sizing: border-box;
  }

  html, body {
    height: 100%;
    width: 100%;
    overflow: hidden;
    position: fixed;
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

  * {
    -webkit-tap-highlight-color: transparent;
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
  margin: 0 0 2rem 0; /* Reduced top margin, increased bottom margin */
  padding: 0 1rem;
  flex-shrink: 0;
  min-height: 400px; /* Ensure minimum height for visibility */
  max-height: 80vh; /* Limit maximum height */
  background: rgba(255, 255, 255, 0.8);
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  border: 1px solid rgba(0, 0, 0, 0.1);
  animation: slideDown 0.3s ease-out;
  overflow: hidden; /* Prevent content from spilling out */
  
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
  
  /* Responsive adjustments */
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

  useEffect(() => {
    // Initialize progress from user service
    calculateProgress();
  }, [difficulty]);

  const calculateProgress = () => {
    const newProgress: { [key in Difficulty]: number } = {
      beginner: 0,
      intermediate: 0,
      advanced: 0
    };

    Object.keys(newProgress).forEach((diff) => {
      const userProgress = userService.getProgress(diff as Difficulty);
      if (userProgress) {
        newProgress[diff as Difficulty] = (userProgress.correctWords / 5) * 100; // 5 is the target for level completion
      }
    });
    
    setProgress(newProgress);
  };

  const handleUserSubmit = (userData: { name: string; email: string }) => {
    userService.setUser(userData.name, userData.email);
    setShowUserForm(false);
  };

  const handleSkip = () => {
    userService.setUser('Guest', 'guest@example.com');
    setShowUserForm(false);
  };

  const handleLevelSelect = (selectedDifficulty: Difficulty) => {
    setDifficulty(selectedDifficulty);
  };

  const handleToggleCommercialMode = () => {
    setIsCommercialMode((prev) => !prev);
  };

  const handleLevelComplete = () => {
    calculateProgress();
    
    const userProgress = userService.getProgress(difficulty);
    if (userProgress) {
      const newProgressPercentage = (userProgress.correctWords / 5) * 100; // 5 is the target for level completion
      
      setProgress(prev => ({
        ...prev,
        [difficulty]: newProgressPercentage
      }));

      if (newProgressPercentage >= 100) {
        // Check if this is the final level (advanced)
        if (difficulty === 'advanced') {
          // Game completed - show final completion message
          setDialogMessage('🎉 Congratulations! You have completed ALL levels! You are now a Thai sentence master! 🏆');
          setDialogType('success');
          setDialogButtonText('Play Again');
          setShowDialog(true);
          setIsGameCompleted(true);
        } else {
          // Move to next level
          const nextLevel = userService.getNextLevel(difficulty);
          if (nextLevel) {
            setDifficulty(nextLevel);
            setDialogMessage(`🎊 Level ${difficulty.charAt(0).toUpperCase() + difficulty.slice(1)} completed! Moving to ${nextLevel.charAt(0).toUpperCase() + nextLevel.slice(1)} level.`);
            setDialogType('success');
            setDialogButtonText('Next Level');
            setShowDialog(true);
          }
        }
      } else {
        // Still working on current level
        const remaining = 5 - userProgress.correctWords;
        setDialogMessage(`Great job! ${remaining} more sentence${remaining !== 1 ? 's' : ''} to complete this level.`);
        setDialogType('success');
        setDialogButtonText('Continue');
        setShowDialog(true);
      }
    }
  };

  const handleDialogClose = () => {
    setShowDialog(false);
    // If game is completed, offer restart option
    if (isGameCompleted) {
      if (window.confirm('Would you like to restart the game and play again?')) {
        handleGameRestart();
      }
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
              <div style={{ 
                display: 'flex', 
                justifyContent: 'space-between', 
                alignItems: 'center', 
                marginBottom: '1rem',
                padding: '1rem',
                background: 'rgba(0, 0, 0, 0.05)',
                borderRadius: '8px',
                border: '2px solid #4CAF50'
              }}>
                <h3 style={{ margin: 0, color: '#4CAF50', fontWeight: 'bold' }}>🏆 Leaderboard</h3>
                <Button 
                  onClick={handleHideLeaderboard}
                  style={{
                    background: '#f44336',
                    color: 'white',
                    padding: '0.5rem 1rem',
                    fontSize: '0.9rem',
                    fontWeight: 'bold',
                    border: '2px solid #d32f2f',
                    boxShadow: '0 2px 4px rgba(0,0,0,0.2)'
                  }}
                >
                  ✕ Close Leaderboard
                </Button>
              </div>
              <Leaderboard />
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
        </FirstPageContainer>
      </>
    );
  }

  return (
    <>
      <GlobalStyle />
      <AppContainer>
        <Title>Thai Sentence Builder</Title>
        <ProgressText>{getProgressText()}</ProgressText>
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
    </>
  );
};

export default App; 