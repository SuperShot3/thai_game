import React from 'react';
import styled from 'styled-components';
import { userService } from '../../services/userService';
import { LeaderboardEntry } from '../../types/leaderboard';

const Container = styled.div`
  background: rgba(255, 255, 255, 0.9);
  border-radius: 15px;
  padding: 20px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  max-width: 800px;
  margin: 20px auto;
  overflow-x: auto;
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
  min-width: 700px;
`;

const Th = styled.th`
  background: #f8f9fa;
  padding: 12px;
  text-align: left;
  border-bottom: 2px solid #dee2e6;
  color: #495057;
  white-space: nowrap;
`;

const Td = styled.td`
  padding: 12px;
  border-bottom: 1px solid #dee2e6;
  color: #495057;
  white-space: nowrap;
`;

const Tr = styled.tr`
  &:hover {
    background: #f8f9fa;
  }
`;

const AccuracyCell = styled(Td)<{ accuracy: number }>`
  color: ${props => {
    if (props.accuracy >= 80) return '#28a745';
    if (props.accuracy >= 60) return '#ffc107';
    return '#dc3545';
  }};
  font-weight: ${props => props.accuracy >= 80 ? 'bold' : 'normal'};
`;

const formatTime = (ms: number): string => {
  const seconds = Math.floor(ms / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const remainingMinutes = minutes % 60;
  const remainingSeconds = seconds % 60;
  
  if (hours > 0) {
    return `${hours}h ${remainingMinutes}m`;
  }
  if (minutes > 0) {
    return `${minutes}m ${remainingSeconds}s`;
  }
  return `${seconds}s`;
};

const Leaderboard: React.FC = () => {
  const entries = userService.getLeaderboard()
    .sort((a, b) => b.points - a.points); // Sort by points in descending order

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
            <Th>Correct</Th>
            <Th>Incorrect</Th>
            <Th>Accuracy</Th>
            <Th>Total Time</Th>
          </tr>
        </thead>
        <tbody>
          {entries.map((entry: LeaderboardEntry, index: number) => {
            // Calculate accuracy if not present
            const accuracy = entry.accuracy ?? 
              (entry.correctWords + entry.incorrectWords > 0 
                ? (entry.correctWords / (entry.correctWords + entry.incorrectWords)) * 100 
                : 0);

            return (
              <Tr key={index}>
                <Td>{index + 1}</Td>
                <Td>{entry.name}</Td>
                <Td>{entry.difficulty}</Td>
                <Td>{entry.points}</Td>
                <Td>{entry.correctWords}</Td>
                <Td>{entry.incorrectWords}</Td>
                <AccuracyCell accuracy={accuracy}>
                  {accuracy.toFixed(1)}%
                </AccuracyCell>
                <Td>{formatTime(entry.totalTime)}</Td>
              </Tr>
            );
          })}
        </tbody>
      </Table>
    </Container>
  );
};

export default Leaderboard; 