import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
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

const AppContainer = styled.div`
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 2rem;
  background: #f8f9fa;
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

  useEffect(() => {
    // Initialize progress from user service
    const difficulties: Difficulty[] = ['beginner', 'intermediate', 'advanced'];
    const newProgress = { ...progress };
    
    difficulties.forEach(diff => {
      const userProgress = userService.getProgress(diff);
      if (userProgress) {
        newProgress[diff] = (userProgress.completedSentences / userProgress.requiredSentences) * 100;
      }
    });
    
    setProgress(newProgress);
  }, []);

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
    const completionTime = Date.now();
    const updatedProgress = userService.updateProgress(difficulty, completionTime);
    
    if (updatedProgress) {
      const newProgressPercentage = (updatedProgress.completedSentences / updatedProgress.requiredSentences) * 100;
      
      setProgress(prev => ({
        ...prev,
        [difficulty]: newProgressPercentage
      }));

      if (userService.isLevelComplete(difficulty)) {
        const nextLevel = userService.getNextLevel(difficulty);
        if (nextLevel) {
          setDialogMessage(`Congratulations! You've completed the ${difficulty} level! Moving to ${nextLevel}...`);
          setDifficulty(nextLevel);
        } else {
          setDialogMessage("Congratulations! You've completed all levels!");
        }
      } else {
        const remaining = updatedProgress.requiredSentences - updatedProgress.completedSentences;
        setDialogMessage(`Great job! ${remaining} more sentences to complete this level.`);
      }
      
      setDialogType('success');
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

  const getCurrentProgress = () => {
    const userProgress = userService.getProgress(difficulty);
    if (userProgress) {
      return `${userProgress.completedSentences} / ${userProgress.requiredSentences} sentences completed`;
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

  return (
    <DndProvider backend={HTML5Backend}>
      <AppContainer>
        <Title>Thai Sentence Builder</Title>
        <ProgressText>{getCurrentProgress()}</ProgressText>
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
        <Leaderboard />
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