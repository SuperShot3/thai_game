import React, { useState } from 'react';
import styled from 'styled-components';
import { DifficultySelector } from '../DifficultySelector/DifficultySelector';
import Leaderboard from '../Leaderboard/Leaderboard';
import { Difficulty } from '../../types';
import { userService } from '../../services/userService';

const WelcomeContainer = styled.div`
  width: 100%;
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem;
`;

const Title = styled.h1`
  color: #343a40;
  margin-bottom: 2rem;
  text-align: center;
`;

const ContentWrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 2rem;
`;

const ButtonGroup = styled.div`
  display: flex;
  justify-content: center;
  gap: 1rem;
  margin-bottom: 2rem;
`;

const Button = styled.button`
  padding: 0.75rem 1.5rem;
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

  &.secondary {
    background: #2196F3;
    &:hover {
      background: #1976D2;
    }
  }
`;

interface WelcomeProps {
  onStartGame: (difficulty: Difficulty) => void;
  currentDifficulty: Difficulty;
  progress: { [key in Difficulty]: number };
  lockedLevels: Difficulty[];
}

const Welcome: React.FC<WelcomeProps> = ({
  onStartGame,
  currentDifficulty,
  progress,
  lockedLevels
}) => {
  const [showLeaderboard, setShowLeaderboard] = useState(false);

  return (
    <WelcomeContainer>
      <Title>Thai Sentence Builder</Title>
      <ButtonGroup>
        <Button onClick={() => setShowLeaderboard(!showLeaderboard)}>
          {showLeaderboard ? 'Hide Leaderboard' : 'Show Leaderboard'}
        </Button>
      </ButtonGroup>
      
      <ContentWrapper>
        {showLeaderboard ? (
          <Leaderboard />
        ) : (
          <>
            <DifficultySelector
              currentDifficulty={currentDifficulty}
              progress={progress}
              onLevelSelect={onStartGame}
              lockedLevels={lockedLevels}
            />
            <Button 
              className="secondary"
              onClick={() => onStartGame(currentDifficulty)}
            >
              Start Game
            </Button>
          </>
        )}
      </ContentWrapper>
    </WelcomeContainer>
  );
};

export default Welcome; 