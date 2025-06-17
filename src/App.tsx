import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import GameBoard from './components/GameBoard/GameBoard';
import Welcome from './components/Welcome/Welcome';
import AdManager from './components/Ads/AdManager';
import { userService } from './services/userService';
import { Difficulty } from './types';
import UserForm from './components/UserForm/UserForm';
import Dialog from './components/Dialog/Dialog';

const AppContainer = styled.div`
  min-height: 100vh;
  height: 100vh;
  width: 100vw;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 1rem;
  background: #f8f9fa;
  overflow: hidden;
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  touch-action: none;
  -webkit-overflow-scrolling: none;
  overscroll-behavior: none;

  @media (max-width: 768px) {
    padding: 0.5rem;
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
  const [isPlaying, setIsPlaying] = useState(false);

  useEffect(() => {
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
        newProgress[diff as Difficulty] = (userProgress.correctWords / 5) * 100;
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

  const handleStartGame = (selectedDifficulty: Difficulty) => {
    setDifficulty(selectedDifficulty);
    setIsPlaying(true);
  };

  const handleToggleCommercialMode = () => {
    setIsCommercialMode((prev) => !prev);
  };

  const handleLevelComplete = () => {
    calculateProgress();
    
    const userProgress = userService.getProgress(difficulty);
    if (userProgress) {
      const newProgressPercentage = (userProgress.correctWords / 5) * 100;
      
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
      <AppContainer>
        <Title>Thai Sentence Builder</Title>
        <UserForm onSubmit={handleUserSubmit} onSkip={handleSkip} />
      </AppContainer>
    );
  }

  if (!isPlaying) {
    return (
      <AppContainer>
        <Welcome
          onStartGame={handleStartGame}
          currentDifficulty={difficulty}
          progress={progress}
          lockedLevels={getLockedLevels()}
        />
      </AppContainer>
    );
  }

  return (
    <DndProvider backend={HTML5Backend}>
      <AppContainer>
        <Title>Thai Sentence Builder</Title>
        <ProgressText>{getProgressText()}</ProgressText>
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