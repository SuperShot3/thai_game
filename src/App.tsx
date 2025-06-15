import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import GameBoard from './components/GameBoard/GameBoard';
import AdManager from './components/Ads/AdManager';
import { userService } from './services/userService';
import { Difficulty, DifficultyProgress } from './types/game';
import DifficultySelector from './components/DifficultySelector/DifficultySelector';
import UserForm from './components/UserForm/UserForm';
import Leaderboard from './components/Leaderboard/Leaderboard';

const AppContainer = styled.div`
  min-height: 100vh;
  background: #1a1a2e;
  color: white;
  padding: 20px;
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const Title = styled.h1`
  font-size: 2.5rem;
  margin-bottom: 20px;
  text-align: center;
  color: #fff;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
`;

const App: React.FC = () => {
  const [difficulty, setDifficulty] = useState<Difficulty>('beginner');
  const [progress, setProgress] = useState<DifficultyProgress>({
    beginner: 0,
    intermediate: 0,
    advanced: 0,
    easy: 0
  });
  const [showUserForm, setShowUserForm] = useState(true);
  const [showLeaderboard, setShowLeaderboard] = useState(false);
  const [isCommercialMode, setIsCommercialMode] = useState(false);

  useEffect(() => {
    userService.initialize();
    setProgress(userService.getProgress());
  }, []);

  const handleUserSubmit = (userData: { name: string; email: string }) => {
    userService.setUserData(userData);
    setShowUserForm(false);
  };

  const handleSkip = () => {
    userService.setUserData(null);
    setShowUserForm(false);
  };

  const handleGameComplete = (isCorrect: boolean, correctWords: number) => {
    userService.updateProgress(difficulty, isCorrect);
    if (isCorrect) {
      userService.recordLevelCompletion(difficulty, correctWords);
    }
    setProgress(userService.getProgress());
  };

  const handleToggleCommercialMode = () => {
    setIsCommercialMode(true);
  };

  if (showUserForm) {
    return (
      <AppContainer>
        <UserForm onSubmit={handleUserSubmit} onSkip={handleSkip} />
      </AppContainer>
    );
  }

  return (
    <DndProvider backend={HTML5Backend}>
      <AppContainer>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
          <h1 style={{ margin: 0 }}>Thai Sentence Builder</h1>
          <button 
            onClick={() => setShowLeaderboard(!showLeaderboard)}
            style={{
              padding: '10px 20px',
              background: '#3498db',
              color: 'white',
              border: 'none',
              borderRadius: '5px',
              cursor: 'pointer'
            }}
          >
            {showLeaderboard ? 'Hide Leaderboard' : 'Show Leaderboard'}
          </button>
        </div>

        <AdManager 
          isCommercialMode={isCommercialMode}
          onToggleCommercialMode={handleToggleCommercialMode}
        />

        {showLeaderboard ? (
          <Leaderboard />
        ) : (
          <>
            <DifficultySelector 
              currentDifficulty={difficulty} 
              progress={progress}
            />
            <GameBoard 
              difficulty={difficulty} 
              onGameComplete={handleGameComplete} 
            />
          </>
        )}
      </AppContainer>
    </DndProvider>
  );
};

export default App; 