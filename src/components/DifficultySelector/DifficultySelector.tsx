import React from 'react';
import styled from 'styled-components';
import { Difficulty, DifficultyProgress } from '../../types';

interface DifficultySelectorProps {
  currentDifficulty: Difficulty;
  progress: DifficultyProgress;
}

const Container = styled.div`
  display: flex;
  gap: 15px;
  margin: 20px 0;
  justify-content: center;
  flex-wrap: wrap;
  padding: 20px;
  background: rgba(255, 255, 255, 0.05);
  border-radius: 15px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
`;

const ProgressButton = styled.div<{ 
  isActive: boolean; 
  progress: number;
  isCurrentLevel: boolean;
  isLocked: boolean;
}>`
  position: relative;
  width: 140px;
  height: 50px;
  border: 2px solid ${props => {
    if (props.isCurrentLevel) return '#4CAF50';
    if (props.isLocked) return 'rgba(255, 255, 255, 0.1)';
    return 'rgba(255, 255, 255, 0.2)';
  }};
  border-radius: 12px;
  overflow: hidden;
  box-shadow: ${props => props.isCurrentLevel ? '0 0 15px rgba(76, 175, 80, 0.3)' : 'none'};
  transition: all 0.3s ease;
  opacity: ${props => props.isLocked ? 0.5 : 1};
  background: ${props => {
    if (props.isLocked) return 'rgba(255, 255, 255, 0.05)';
    if (props.isCurrentLevel) return 'rgba(76, 175, 80, 0.1)';
    return 'rgba(255, 255, 255, 0.08)';
  }};
  backdrop-filter: blur(5px);
  cursor: ${props => props.isLocked ? 'not-allowed' : 'pointer'};

  &:hover {
    transform: ${props => props.isLocked ? 'none' : 'translateY(-2px)'};
    box-shadow: ${props => props.isLocked ? 'none' : '0 6px 12px rgba(0, 0, 0, 0.2)'};
  }

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: ${props => props.progress}%;
    height: 100%;
    background: ${props => {
      if (props.isActive) return 'linear-gradient(90deg, rgba(76, 175, 80, 0.4) 0%, rgba(76, 175, 80, 0.6) 100%)';
      if (props.progress === 100) return 'linear-gradient(90deg, rgba(46, 204, 113, 0.4) 0%, rgba(46, 204, 113, 0.6) 100%)';
      return 'linear-gradient(90deg, rgba(255, 255, 255, 0.1) 0%, rgba(255, 255, 255, 0.2) 100%)';
    }};
    transition: width 0.3s ease, background-color 0.3s ease;
    border-radius: 10px;
  }

  &::after {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: ${props => props.progress === 100 ? 'rgba(46, 204, 113, 0.1)' : 'transparent'};
    border-radius: 10px;
    pointer-events: none;
  }
`;

const DifficultyText = styled.span<{ progress: number; isLocked: boolean }>`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  color: ${props => props.isLocked ? 'rgba(255, 255, 255, 0.5)' : 'rgba(255, 255, 255, 0.9)'};
  font-weight: 600;
  font-size: 1.1rem;
  z-index: 1;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
  opacity: ${props => props.isLocked ? 0.5 : 1};
  text-transform: capitalize;
  letter-spacing: 0.5px;
`;

const ProgressText = styled.span<{ progress: number; isLocked: boolean }>`
  position: absolute;
  top: -25px;
  left: 50%;
  transform: translateX(-50%);
  font-size: 0.9rem;
  color: ${props => props.isLocked ? 'rgba(255, 255, 255, 0.5)' : 'rgba(255, 255, 255, 0.8)'};
  opacity: ${props => props.isLocked ? 0.5 : 1};
  font-weight: 500;
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.2);
  background: rgba(0, 0, 0, 0.2);
  padding: 2px 8px;
  border-radius: 10px;
  backdrop-filter: blur(5px);
`;

const DifficultySelector: React.FC<DifficultySelectorProps> = ({
  currentDifficulty,
  progress,
}) => {
  const difficulties: Difficulty[] = ['easy', 'beginner', 'intermediate', 'advanced'];

  const isLevelLocked = (difficulty: Difficulty): boolean => {
    if (difficulty === 'easy') return false;
    if (difficulty === 'beginner') return progress.easy < 100;
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
          <ProgressText 
            progress={progress[difficulty]}
            isLocked={isLevelLocked(difficulty)}
          >
            {progress[difficulty]}%
          </ProgressText>
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