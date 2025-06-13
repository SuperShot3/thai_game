import React from 'react';
import styled from 'styled-components';
import { Difficulty, DifficultyProgress } from '../../types';

interface DifficultySelectorProps {
  currentDifficulty: Difficulty;
  progress: DifficultyProgress;
}

const Container = styled.div`
  display: flex;
  gap: 10px;
  margin-bottom: 20px;
`;

const ProgressButton = styled.div<{ 
  isActive: boolean; 
  progress: number;
  isCurrentLevel: boolean;
  isLocked: boolean;
}>`
  position: relative;
  width: 120px;
  height: 40px;
  border: 2px solid ${props => {
    if (props.isCurrentLevel) return '#3498db';
    if (props.isLocked) return '#e0e0e0';
    return '#3498db';
  }};
  border-radius: 5px;
  overflow: hidden;
  box-shadow: ${props => props.isCurrentLevel ? '0 0 10px rgba(52, 152, 219, 0.5)' : 'none'};
  transition: all 0.3s ease;
  opacity: ${props => props.isLocked ? 0.5 : 1};

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: ${props => props.progress}%;
    height: 100%;
    background-color: ${props => {
      if (props.isActive) return '#3498db';
      if (props.progress === 100) return '#2ecc71';
      return '#e0e0e0';
    }};
    transition: width 0.3s ease, background-color 0.3s ease;
  }
`;

const DifficultyText = styled.span<{ progress: number; isLocked: boolean }>`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  color: ${props => props.progress > 50 ? 'white' : '#2c3e50'};
  font-weight: bold;
  z-index: 1;
  text-shadow: ${props => props.progress > 50 ? '0 0 2px rgba(0,0,0,0.3)' : 'none'};
  opacity: ${props => props.isLocked ? 0.5 : 1};
  text-transform: capitalize;
`;

const DifficultySelector: React.FC<DifficultySelectorProps> = ({
  currentDifficulty,
  progress,
}) => {
  const difficulties: Difficulty[] = ['beginner', 'intermediate', 'advanced'];

  const isLevelLocked = (difficulty: Difficulty): boolean => {
    if (difficulty === 'beginner') return false;
    if (difficulty === 'intermediate') return progress.beginner < 100;
    if (difficulty === 'advanced') return progress.intermediate < 100;
    return false;
  };

  return (
    <Container>
      {difficulties.map((difficulty) => (
        <ProgressButton
          key={difficulty}
          isActive={currentDifficulty === difficulty}
          progress={progress[difficulty]}
          isCurrentLevel={currentDifficulty === difficulty}
          isLocked={isLevelLocked(difficulty)}
        >
          <DifficultyText 
            progress={progress[difficulty]}
            isLocked={isLevelLocked(difficulty)}
          >
            {difficulty}
          </DifficultyText>
        </ProgressButton>
      ))}
    </Container>
  );
};

export default DifficultySelector; 