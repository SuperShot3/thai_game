import React, { useState } from 'react';
import styled from 'styled-components';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { Difficulty, DifficultyProgress } from './types';
import GameBoard from './components/GameBoard/GameBoard';
import DifficultySelector from './components/DifficultySelector/DifficultySelector';

const AppContainer = styled.div`
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  background-color: #f5f5f5;
  padding: 20px;
`;

const Title = styled.h1`
  color: #2c3e50;
  margin-bottom: 30px;
  text-align: center;
`;

const App: React.FC = () => {
  const [difficulty, setDifficulty] = useState<Difficulty>('beginner');
  const [progress, setProgress] = useState<DifficultyProgress>({
    beginner: 0,
    intermediate: 0,
    advanced: 0
  });

  const advanceToNextLevel = (currentLevel: Difficulty): Difficulty => {
    switch (currentLevel) {
      case 'beginner':
        return 'intermediate';
      case 'intermediate':
        return 'advanced';
      case 'advanced':
        return 'advanced'; // Stay on advanced when completed
      default:
        return currentLevel;
    }
  };

  const handleGameComplete = (result: boolean) => {
    if (result) {
      setProgress(prev => {
        const newProgress = { ...prev };
        const currentProgress = prev[difficulty];
        
        // Calculate new progress based on current level
        if (difficulty === 'beginner') {
          newProgress.beginner = Math.min(100, currentProgress + 20);
          // Advance to intermediate when beginner is complete
          if (newProgress.beginner === 100) {
            setDifficulty('intermediate');
          }
        } else if (difficulty === 'intermediate') {
          newProgress.intermediate = Math.min(100, currentProgress + 20);
          // Advance to advanced when intermediate is complete
          if (newProgress.intermediate === 100) {
            setDifficulty('advanced');
          }
        } else if (difficulty === 'advanced') {
          newProgress.advanced = Math.min(100, currentProgress + 20);
        }
        
        return newProgress;
      });
    }
  };

  return (
    <DndProvider backend={HTML5Backend}>
      <AppContainer>
        <Title>Thai Language Sentence Builder</Title>
        <DifficultySelector
          currentDifficulty={difficulty}
          progress={progress}
        />
        <GameBoard
          difficulty={difficulty}
          onGameComplete={handleGameComplete}
        />
      </AppContainer>
    </DndProvider>
  );
};

export default App; 