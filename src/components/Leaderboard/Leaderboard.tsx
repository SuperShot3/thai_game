import React from 'react';
import styled from 'styled-components';
import { userService } from '../../services/userService';
import { LeaderboardEntry } from '../../types/leaderboard';

const Container = styled.div`
  background: rgba(255, 255, 255, 0.9);
  border-radius: 15px;
  padding: 20px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  max-width: 600px;
  margin: 20px auto;
`;

const Title = styled.h2`
  color: #2c3e50;
  text-align: center;
  margin-bottom: 20px;
  font-size: 24px;
`;

const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
  margin-top: 10px;
`;

const Th = styled.th`
  background: #f8f9fa;
  padding: 12px;
  text-align: left;
  border-bottom: 2px solid #dee2e6;
  color: #495057;
`;

const Td = styled.td`
  padding: 12px;
  border-bottom: 1px solid #dee2e6;
  color: #495057;
`;

const Tr = styled.tr`
  &:hover {
    background: #f8f9fa;
  }
`;

const formatTime = (ms: number): string => {
  const seconds = Math.floor(ms / 1000);
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;
  return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
};

const Leaderboard: React.FC = () => {
  const entries = userService.getLeaderboard();

  return (
    <Container>
      <Title>Leaderboard</Title>
      <Table>
        <thead>
          <tr>
            <Th>Rank</Th>
            <Th>Name</Th>
            <Th>Difficulty</Th>
            <Th>Points</Th>
            <Th>Correct Words</Th>
            <Th>Time</Th>
          </tr>
        </thead>
        <tbody>
          {entries.map((entry: LeaderboardEntry, index: number) => (
            <Tr key={index}>
              <Td>{index + 1}</Td>
              <Td>{entry.name}</Td>
              <Td>{entry.difficulty}</Td>
              <Td>{entry.points}</Td>
              <Td>{entry.correctWords}</Td>
              <Td>{formatTime(entry.completionTime)}</Td>
            </Tr>
          ))}
        </tbody>
      </Table>
    </Container>
  );
};

export default Leaderboard; 