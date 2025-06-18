import React from 'react';
import styled from 'styled-components';

interface DialogProps {
  message: string;
  type: 'success' | 'error';
  onClose: () => void;
  buttonText?: string; // Optional custom button text
}

const DialogOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
`;

const DialogContent = styled.div<{ type: 'success' | 'error' }>`
  background-color: white;
  padding: 2rem;
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  max-width: 90%;
  width: 400px;
  text-align: center;
  border-top: 4px solid ${props => props.type === 'success' ? '#4caf50' : '#f44336'};
`;

const DialogMessage = styled.p`
  margin: 0 0 1.5rem;
  font-size: 1.1rem;
  color: #333;
`;

const CloseButton = styled.button`
  background-color: #2196f3;
  color: white;
  border: none;
  padding: 0.5rem 1.5rem;
  border-radius: 4px;
  cursor: pointer;
  font-size: 1rem;
  transition: background-color 0.2s;

  &:hover {
    background-color: #1976d2;
  }
`;

const Dialog: React.FC<DialogProps> = ({ message, type, onClose, buttonText = 'Close' }) => {
  return (
    <DialogOverlay onClick={onClose}>
      <DialogContent type={type} onClick={e => e.stopPropagation()}>
        <DialogMessage>{message}</DialogMessage>
        <CloseButton onClick={onClose}>{buttonText}</CloseButton>
      </DialogContent>
    </DialogOverlay>
  );
};

export default Dialog; 