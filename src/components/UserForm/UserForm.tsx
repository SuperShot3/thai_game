import React, { useState } from 'react';
import styled from 'styled-components';

interface UserFormProps {
  onSubmit: (data: { name: string; email: string }) => void;
  onSkip: () => void;
}

const FormContainer = styled.div`
  background: white;
  padding: 2rem;
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  width: 100%;
  max-width: 400px;
`;

const Title = styled.h2`
  color: #343a40;
  margin-bottom: 1.5rem;
  text-align: center;
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

const Input = styled.input`
  padding: 0.75rem;
  border: 1px solid #ced4da;
  border-radius: 4px;
  font-size: 1rem;
  width: 100%;

  &:focus {
    outline: none;
    border-color: #2196f3;
    box-shadow: 0 0 0 2px rgba(33, 150, 243, 0.1);
  }
`;

const Button = styled.button`
  background-color: #2196f3;
  color: white;
  border: none;
  padding: 0.75rem;
  border-radius: 4px;
  font-size: 1rem;
  cursor: pointer;
  transition: background-color 0.2s;

  &:hover {
    background-color: #1976d2;
  }

  &:disabled {
    background-color: #bdbdbd;
    cursor: not-allowed;
  }
`;

const SkipButton = styled(Button)`
  background-color: transparent;
  color: #2196f3;
  border: 1px solid #2196f3;
  margin-top: 0.5rem;

  &:hover {
    background-color: rgba(33, 150, 243, 0.1);
  }
`;

const UserForm: React.FC<UserFormProps> = ({ onSubmit, onSkip }) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({ name, email });
  };

  return (
    <FormContainer>
      <Title>Welcome to Thai Sentence Builder</Title>
      <Form onSubmit={handleSubmit}>
        <Input
          type="text"
          placeholder="Your name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
        <Input
          type="email"
          placeholder="Your email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <Button type="submit" disabled={!name || !email}>
          Start Learning
        </Button>
        <SkipButton type="button" onClick={onSkip}>
          Continue as Guest
        </SkipButton>
      </Form>
    </FormContainer>
  );
};

export default UserForm; 