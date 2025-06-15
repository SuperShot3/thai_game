import React, { useState } from 'react';
import styled from 'styled-components';

const FormContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 20px;
  padding: 30px;
  background: white;
  border-radius: 10px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  max-width: 400px;
  width: 90%;
  margin: 20px auto;
`;

const Title = styled.h2`
  color: #2c3e50;
  margin: 0;
  text-align: center;
`;

const Input = styled.input`
  width: 100%;
  padding: 12px;
  border: 2px solid #e0e0e0;
  border-radius: 6px;
  font-size: 16px;
  transition: border-color 0.3s;

  &:focus {
    border-color: #3498db;
    outline: none;
  }
`;

const Button = styled.button`
  width: 100%;
  padding: 12px;
  background: #3498db;
  color: white;
  border: none;
  border-radius: 6px;
  font-size: 16px;
  cursor: pointer;
  transition: background-color 0.3s;

  &:hover {
    background: #2980b9;
  }

  &.skip {
    background: #95a5a6;
    &:hover {
      background: #7f8c8d;
    }
  }
`;

interface UserFormProps {
  onSubmit: (userData: { name: string; email: string }) => void;
  onSkip: () => void;
}

const UserForm: React.FC<UserFormProps> = ({ onSubmit, onSkip }) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({ name, email });
  };

  return (
    <FormContainer>
      <Title>Welcome to Thai Sentence Builder!</Title>
      <form onSubmit={handleSubmit} style={{ width: '100%' }}>
        <Input
          type="text"
          placeholder="Your name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
        <Input
          type="email"
          placeholder="Your email (optional)"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          style={{ marginTop: '10px' }}
        />
        <Button type="submit" style={{ marginTop: '20px' }}>
          Start Playing
        </Button>
      </form>
      <Button className="skip" onClick={onSkip}>
        Skip & Play as Guest
      </Button>
    </FormContainer>
  );
};

export default UserForm; 