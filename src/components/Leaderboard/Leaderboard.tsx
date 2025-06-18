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
  overflow-x: auto; /* Allow horizontal scrolling if needed */
  overflow-y: auto; /* Allow vertical scrolling if needed */
  max-height: 70vh; /* Limit height to prevent overflow */
`;

const Title = styled.h2`
  color: #ffffff;
  text-align: center;
  margin-bottom: 1.5rem;
  font-size: clamp(1.5rem, 4vw, 2rem); /* Responsive font size */
`;

const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
  color: #ffffff;
  min-width: 600px; /* Ensure minimum width for readability */
  table-layout: fixed; /* Fixed layout for better column control */
`;

const Th = styled.th`
  padding: 0.75rem 0.5rem;
  text-align: left;
  border-bottom: 2px solid rgba(255, 255, 255, 0.1);
  font-weight: 600;
  font-size: clamp(0.8rem, 2.5vw, 1rem);
  white-space: nowrap; /* Prevent text wrapping in headers */
  overflow: hidden;
  text-overflow: ellipsis;
  
  /* Column width distribution */
  &:nth-child(1) { width: 10%; } /* Rank */
  &:nth-child(2) { width: 30%; } /* Name */
  &:nth-child(3) { width: 15%; } /* Correct */
  &:nth-child(4) { width: 15%; } /* Incorrect */
  &:nth-child(5) { width: 30%; } /* Total Time */
`;

const Td = styled.td`
  padding: 0.75rem 0.5rem;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  font-size: clamp(0.75rem, 2.2vw, 0.9rem);
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap; /* Prevent text wrapping in cells */
  
  /* Special handling for name column */
  &:nth-child(2) {
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    max-width: 0; /* Force text truncation */
  }
  
  /* Center align numeric columns */
  &:nth-child(1),
  &:nth-child(3),
  &:nth-child(4),
  &:nth-child(5) {
    text-align: center;
  }
`;

const Tr = styled.tr`
  &:hover {
    background: rgba(255, 255, 255, 0.05);
  }
`;

const EmptyState = styled.div`
  text-align: center;
  color: #ffffff;
  padding: 2rem;
  font-style: italic;
  opacity: 0.7;
`;

const LoadingState = styled(EmptyState)`
  color: #4a90e2;
`;

const ErrorState = styled(EmptyState)`
  color: #e74c3c;
`;

const TestButton = styled.button`
  margin: 1rem;
  padding: 0.5rem 1rem;
  background: #4a90e2;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;

  &:hover {
    background: #357abd;
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
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchLeaderboard = async () => {
    try {
      setLoading(true);
      const leaderboardData = await userService.getLeaderboard();
      setEntries(leaderboardData);
      setError(null);
    } catch (err) {
      setError('Failed to load leaderboard');
      console.error('Error fetching leaderboard:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleTestClick = async () => {
    try {
      await userService.testAddEntry();
      await fetchLeaderboard();
    } catch (err) {
      console.error('Error in test:', err);
    }
  };

  useEffect(() => {
    fetchLeaderboard();
    const intervalId = setInterval(fetchLeaderboard, 30000);
    return () => clearInterval(intervalId);
  }, []);

  return (
    <Container>
      <Title>Leaderboard</Title>
      <TestButton onClick={handleTestClick}>Add Test Entry</TestButton>
      {loading ? (
        <LoadingState>Loading leaderboard...</LoadingState>
      ) : error ? (
        <ErrorState>{error}</ErrorState>
      ) : entries.length === 0 ? (
        <EmptyState>No entries yet. Be the first to complete a level!</EmptyState>
      ) : (
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
                <Td title={entry.name}>{entry.name}</Td>
                <Td>{entry.correctWords}</Td>
                <Td>{entry.incorrectWords}</Td>
                <Td>{formatTime(entry.totalTime)}</Td>
              </Tr>
            ))}
          </tbody>
        </Table>
      )}
    </Container>
  );
};

export default Leaderboard; 