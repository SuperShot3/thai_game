import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { userService } from '../../services/userService';
import { LeaderboardEntry } from '../../types/leaderboard';

const Container = styled.div`
  width: 100%;
  max-width: 800px;
  margin: 2rem auto;
  padding: 1rem;
  background: #1a1a2e;
  border-radius: 12px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
`;

const Title = styled.h2`
  color: #ffffff;
  text-align: center;
  margin-bottom: 1.5rem;
`;

const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
  color: #ffffff;
`;

const Th = styled.th`
  padding: 1rem;
  text-align: left;
  border-bottom: 2px solid rgba(255, 255, 255, 0.1);
  font-weight: 600;
`;

const Td = styled.td`
  padding: 1rem;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
`;

const Tr = styled.tr`
  &:hover {
    background: rgba(255, 255, 255, 0.05);
  }
`;

const formatTime = (seconds: number): string => {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const remainingSeconds = seconds % 60;
  
  if (hours > 0) {
    return `${hours}:${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
  }
  return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
};

const Leaderboard: React.FC = () => {
  const [entries, setEntries] = useState<LeaderboardEntry[]>([]);

  useEffect(() => {
    const allEntries = userService.getLeaderboard();
    
    // Clean up duplicate guest entries by keeping only the best score for each guest
    const uniqueEntries = allEntries.reduce((acc: LeaderboardEntry[], current) => {
      const existingEntry = acc.find(entry => 
        entry.name === current.name && 
        entry.correctWords === current.correctWords
      );
      
      if (!existingEntry) {
        acc.push(current);
      } else if (current.totalTime < existingEntry.totalTime) {
        // Replace with better time if it exists
        const index = acc.indexOf(existingEntry);
        acc[index] = current;
      }
      
      return acc;
    }, []);

    // Sort by correct words (descending) and then by time (ascending)
    const sortedEntries = uniqueEntries.sort((a, b) => {
      if (b.correctWords !== a.correctWords) {
        return b.correctWords - a.correctWords;
      }
      return a.totalTime - b.totalTime;
    });

    setEntries(sortedEntries);
  }, []);

  return (
    <Container>
      <Title>Leaderboard</Title>
      <Table>
        <thead>
          <tr>
            <Th>Rank</Th>
            <Th>Name</Th>
            <Th>Correct</Th>
            <Th>Incorrect</Th>
            <Th>Total Time</Th>
          </tr>
        </thead>
        <tbody>
          {entries.map((entry: LeaderboardEntry, index: number) => (
            <Tr key={index}>
              <Td>{index + 1}</Td>
              <Td>{entry.name}</Td>
              <Td>{entry.correctWords}</Td>
              <Td>{entry.incorrectWords}</Td>
              <Td>{formatTime(entry.totalTime)}</Td>
            </Tr>
          ))}
        </tbody>
      </Table>
    </Container>
  );
};

export default Leaderboard; 