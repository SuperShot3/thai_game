import React from 'react';
import styled from 'styled-components';
import { Difficulty } from '../../types';

interface DifficultySelectorProps {
  currentDifficulty: Difficulty;
  progress: { [key in Difficulty]: number };
  onLevelSelect: (difficulty: Difficulty) => void;
  lockedLevels: Difficulty[];
}

const Container = styled.div`
  display: flex;
  gap: 1rem;
  margin-bottom: 2rem;
`;

const DifficultyButton = styled.button<{ isSelected: boolean; isLocked: boolean }>`
  padding: 0.75rem 1.5rem;
  border: none;
  border-radius: 4px;
  font-size: 1rem;
  cursor: ${props => props.isLocked ? 'not-allowed' : 'pointer'};
  transition: all 0.2s;
  position: relative;
  background-color: ${props => {
    if (props.isLocked) return '#e9ecef';
    if (props.isSelected) return '#2196f3';
    return '#f8f9fa';
  }};
  color: ${props => {
    if (props.isLocked) return '#adb5bd';
    if (props.isSelected) return 'white';
    return '#495057';
  }};
  border: 1px solid ${props => {
    if (props.isLocked) return '#dee2e6';
    if (props.isSelected) return '#2196f3';
    return '#ced4da';
  }};
  overflow: hidden;

  &:hover:not(:disabled) {
    background-color: ${props => {
      if (props.isLocked) return '#e9ecef';
      if (props.isSelected) return '#1976d2';
      return '#e9ecef';
    }};
  }
`;

const ProgressBarContainer = styled.div`
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  height: 3px;
  background-color: rgba(0, 0, 0, 0.1);
`;

const ProgressBar = styled.div<{ progress: number }>`
  height: 100%;
  background-color: #4caf50;
  width: ${props => props.progress}%;
  transition: width 0.3s ease;
`;

const LockIcon = styled.span`
  margin-left: 0.5rem;
  font-size: 0.875rem;
`;

export const DifficultySelector: React.FC<DifficultySelectorProps> = ({
  currentDifficulty,
  progress,
  onLevelSelect,
  lockedLevels
}) => {
  const difficulties: Difficulty[] = ['beginner', 'intermediate', 'advanced'];

  return (
    <Container>
      {difficulties.map(difficulty => {
        const isLocked = lockedLevels.includes(difficulty);
        return (
          <DifficultyButton
            key={difficulty}
            isSelected={currentDifficulty === difficulty}
            isLocked={isLocked}
            onClick={() => !isLocked && onLevelSelect(difficulty)}
            disabled={isLocked}
          >
            {difficulty.charAt(0).toUpperCase() + difficulty.slice(1)}
            {isLocked && <LockIcon>🔒</LockIcon>}
            <ProgressBarContainer>
              <ProgressBar progress={progress[difficulty]} />
            </ProgressBarContainer>
          </DifficultyButton>
        );
      })}
    </Container>
  );
}; 