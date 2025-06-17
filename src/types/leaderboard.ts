import { Difficulty } from './index';

export interface LeaderboardEntry {
  name: string;
  email: string;
  difficulty: Difficulty;
  timestamp: number;
  points: number;
  correctWords: number;
  incorrectWords: number;
  accuracy: number;
  totalTime: number;
} 