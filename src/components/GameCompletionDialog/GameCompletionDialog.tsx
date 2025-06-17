import React, { useState } from 'react';
import styled from 'styled-components';
import { userService } from '../../services/userService';
import { LeaderboardEntry } from '../../types/leaderboard';
import { Difficulty } from '../../types';

const DialogOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.7);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
`;

const DialogContent = styled.div`
  background-color: #1a1a2e;
  padding: 2rem;
  border-radius: 12px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.3);
  max-width: 90%;
  width: 400px;
  text-align: center;
  color: white;
  border: 2px solid rgba(255, 255, 255, 0.1);
`;

const Title = styled.h2`
  color: #4CAF50;
  margin-bottom: 1.5rem;
`;

const Message = styled.p`
  margin-bottom: 1.5rem;
  font-size: 1.1rem;
  line-height: 1.5;
`;

const Input = styled.input`
  width: 100%;
  padding: 0.8rem;
  margin-bottom: 1rem;
  border: 2px solid rgba(255, 255, 255, 0.1);
  border-radius: 6px;
  background: rgba(255, 255, 255, 0.05);
  color: white;
  font-size: 1rem;

  &:focus {
    outline: none;
    border-color: #4CAF50;
  }
`;

const ButtonContainer = styled.div`
  display: flex;
  gap: 1rem;
  justify-content: center;
  margin-top: 1.5rem;
`;

const Button = styled.button<{ variant?: 'primary' | 'secondary' }>`
  padding: 0.8rem 1.5rem;
  border: none;
  border-radius: 6px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  background: ${props => props.variant === 'primary' ? '#4CAF50' : '#3498db'};
  color: white;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.3);
  }

  &:active {
    transform: translateY(0);
  }
`;

interface GameCompletionDialogProps {
  onClose: () => void;
  onRestart: () => void;
  score: number;
  correctWords: number;
  incorrectWords: number;
  difficulty: Difficulty;
}

const GameCompletionDialog: React.FC<GameCompletionDialogProps> = ({ 
  onClose, 
  onRestart, 
  score,
  correctWords,
  incorrectWords,
  difficulty
}) => {
  const [name, setName] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);

  const calculateAccuracy = (correct: number, incorrect: number): number => {
    const total = correct + incorrect;
    if (total === 0) return 0;
    return (correct / total) * 100;
  };

  const handleSubmit = () => {
    if (name.trim()) {
      const user = userService.getUser();
      if (user) {
        const progress = userService.getProgress(difficulty);
        if (progress) {
          const accuracy = calculateAccuracy(correctWords, incorrectWords);
          const entry: LeaderboardEntry = {
            name: name.trim(),
            email: user.email,
            difficulty: difficulty,
            timestamp: Date.now(),
            points: correctWords * 10,
            correctWords: correctWords,
            incorrectWords: incorrectWords,
            accuracy: accuracy,
            totalTime: progress.totalTime
          };
          userService.addToLeaderboard(entry);
          setIsSubmitted(true);
        }
      }
    }
  };

  const handleRestart = () => {
    if (name.trim() && !isSubmitted) {
      handleSubmit();
    }
    onRestart();
  };

  return (
    <DialogOverlay>
      <DialogContent>
        <Title>Congratulations! 🎉</Title>
        <Message>
          You have completed all levels! Your final score is {score} points.
          <br />
          Correct words: {correctWords}
          <br />
          Incorrect words: {incorrectWords}
          <br />
          Accuracy: {calculateAccuracy(correctWords, incorrectWords).toFixed(1)}%
          {!isSubmitted && <br />}
          {!isSubmitted && "Would you like to add your name to the leaderboard?"}
        </Message>
        
        {!isSubmitted && (
          <Input
            type="text"
            placeholder="Enter your name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            maxLength={20}
          />
        )}

        <ButtonContainer>
          <Button variant="primary" onClick={handleRestart}>
            {isSubmitted ? 'Play Again' : 'Save & Play Again'}
          </Button>
          <Button variant="secondary" onClick={onClose}>
            Close Game
          </Button>
        </ButtonContainer>
      </DialogContent>
    </DialogOverlay>
  );
};

export default GameCompletionDialog; 