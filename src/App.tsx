import React, { useState, useEffect } from 'react';
import styled, { createGlobalStyle } from 'styled-components';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
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
        const nextLevel = userService.getNextLevel(difficulty);
        if (nextLevel) {
          setDifficulty(nextLevel);
          setDialogMessage('Level completed! Moving to the next level.');
          setDialogType('success');
        } else {
          setDialogMessage('Congratulations! You have completed all levels!');
          setDialogType('success');
        }
      } else {
        const remaining = 5 - userProgress.correctWords;
        setDialogMessage(`Great job! ${remaining} more sentences to complete this level.`);
        setDialogType('success');
      }
      setShowDialog(true);
    }
  };

  const handleDialogClose = () => {
    setShowDialog(false);
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

  if (showUserForm) {
    return (
      <>
        <GlobalStyle />
      <AppContainer>
        <Title>Thai Sentence Builder</Title>
        <UserForm onSubmit={handleUserSubmit} onSkip={handleSkip} />
          <Button onClick={() => setShowLeaderboard(true)}>View Leaderboard</Button>
          {showLeaderboard && (
            <>
              <Button onClick={() => setShowLeaderboard(false)}>Close Leaderboard</Button>
              <Leaderboard />
            </>
          )}
      </AppContainer>
      </>
    );
  }

  return (
    <DndProvider backend={HTML5Backend}>
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
          />
        )}
      </AppContainer>
    </DndProvider>
  );
};

export default App; 