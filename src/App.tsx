import React, { useState } from 'react';
import styled from 'styled-components';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { Difficulty } from './types';
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

  const handleDifficultyChange = (newDifficulty: Difficulty) => {
    setDifficulty(newDifficulty);
  };

  const handleGameComplete = (result: boolean) => {
    // Handle game completion
    console.log('Game completed:', result);
  };

  return (
    <DndProvider backend={HTML5Backend}>
      <AppContainer>
        <Title>Thai Language Sentence Builder</Title>
        <DifficultySelector
          currentDifficulty={difficulty}
          onSelect={handleDifficultyChange}
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