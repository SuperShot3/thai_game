import React from 'react';
import styled from 'styled-components';
import { Difficulty } from '../../types';

interface DifficultySelectorProps {
  currentDifficulty: Difficulty;
  onSelect: (difficulty: Difficulty) => void;
}

const Container = styled.div`
  display: flex;
  gap: 10px;
  margin-bottom: 20px;
`;

const Button = styled.button<{ isActive: boolean }>`
  padding: 10px 20px;
  border: 2px solid #3498db;
  border-radius: 5px;
  background-color: ${props => props.isActive ? '#3498db' : 'white'};
  color: ${props => props.isActive ? 'white' : '#3498db'};
  cursor: pointer;
  transition: all 0.3s ease;
  font-weight: bold;

  &:hover {
    background-color: ${props => props.isActive ? '#2980b9' : '#f7f9fc'};
  }
`;

const DifficultySelector: React.FC<DifficultySelectorProps> = ({
  currentDifficulty,
  onSelect,
}) => {
  const difficulties: Difficulty[] = ['beginner', 'intermediate', 'advanced'];

  return (
    <Container>
      {difficulties.map((difficulty) => (
        <Button
          key={difficulty}
          isActive={currentDifficulty === difficulty}
          onClick={() => onSelect(difficulty)}
        >
          {difficulty.charAt(0).toUpperCase() + difficulty.slice(1)}
        </Button>
      ))}
    </Container>
  );
};

export default DifficultySelector; 