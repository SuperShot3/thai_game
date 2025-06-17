import React, { useState } from 'react';
import styled from 'styled-components';
import { userService } from '../../services/userService';
import { Difficulty } from '../../types/game';

interface GameCompletionDialogProps {
  onClose: () => void;
  onRestart: () => void;
  score: number;
  correctWords: number;
  incorrectWords: number;
  difficulty: Difficulty;
  totalTime: number;
}

const Dialog = styled.div`
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background: #1a1a2e;
  padding: 2rem;
  border-radius: 12px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  z-index: 1000;
  color: #ffffff;
  width: 90%;
  max-width: 500px;
`;

const Overlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  z-index: 999;
`;

const Title = styled.h2`
  margin: 0 0 1.5rem;
  text-align: center;
  color: #ffffff;
`;

const Stats = styled.div`
  margin-bottom: 1.5rem;
`;

const Stat = styled.div`
  display: flex;
  justify-content: space-between;
  margin-bottom: 0.5rem;
  padding: 0.5rem;
  background: rgba(255, 255, 255, 0.05);
  border-radius: 4px;
`;

const ButtonGroup = styled.div`
  display: flex;
  justify-content: center;
  gap: 1rem;
  margin-top: 1.5rem;
`;

const Button = styled.button`
  padding: 0.75rem 1.5rem;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  font-weight: 600;
  transition: all 0.2s;

  &:hover {
    transform: translateY(-2px);
  }
`;

const PrimaryButton = styled(Button)`
  background: #4CAF50;
  color: white;

  &:hover {
    background: #45a049;
  }
`;

const SecondaryButton = styled(Button)`
  background: #f44336;
  color: white;

  &:hover {
    background: #da190b;
  }
`;

const Input = styled.input`
  width: 100%;
  padding: 0.75rem;
  margin: 1rem 0;
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 4px;
  background: rgba(255, 255, 255, 0.05);
  color: #ffffff;
  font-size: 1rem;

  &:focus {
    outline: none;
    border-color: #4CAF50;
  }
`;

const formatTime = (seconds: number): string => {
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;
  return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
};

const GameCompletionDialog: React.FC<GameCompletionDialogProps> = ({
  onClose,
  onRestart,
  score,
  correctWords,
  incorrectWords,
  difficulty,
  totalTime
}) => {
  const [name, setName] = useState('');

  const handleSubmit = () => {
    userService.addToLeaderboard({
      name,
      correctWords,
      incorrectWords,
      totalTime
    });
    onClose();
  };

  return (
    <>
      <Overlay onClick={onClose} />
      <Dialog>
        <Title>Level Complete!</Title>
        <Stats>
          <Stat>
            <span>Correct Words:</span>
            <span>{correctWords}</span>
          </Stat>
          <Stat>
            <span>Incorrect Words:</span>
            <span>{incorrectWords}</span>
          </Stat>
          <Stat>
            <span>Total Time:</span>
            <span>{formatTime(totalTime)}</span>
          </Stat>
        </Stats>
        <Input
          type="text"
          placeholder="Enter your name (optional)"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <ButtonGroup>
          <PrimaryButton onClick={handleSubmit}>Save Score</PrimaryButton>
          <SecondaryButton onClick={onRestart}>Play Again</SecondaryButton>
        </ButtonGroup>
      </Dialog>
    </>
  );
};

export default GameCompletionDialog; 