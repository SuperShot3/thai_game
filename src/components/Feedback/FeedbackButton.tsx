import React from 'react';
import styled from 'styled-components';

interface FeedbackButtonProps {
  onClick: () => void;
}

const Button = styled.button`
  background: #2196f3;
  color: white;
  border: none;
  padding: 12px 24px;
  border-radius: 8px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
  box-shadow: 0 2px 8px rgba(33, 150, 243, 0.3);
  margin: 1rem;

  &:hover {
    background: #1976d2;
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(33, 150, 243, 0.4);
  }

  &:active {
    transform: translateY(0);
  }

  &:focus {
    outline: none;
    box-shadow: 0 0 0 3px rgba(33, 150, 243, 0.3);
  }
`;

const FeedbackButton: React.FC<FeedbackButtonProps> = ({ onClick }) => {
  return (
    <Button onClick={onClick}>
      💬 Send Feedback
    </Button>
  );
};

export default FeedbackButton; 