import { Difficulty } from './index';

export interface LeaderboardEntry {
  name: string;
  email?: string;
  difficulty: Difficulty;
  completionTime: number;
  totalTime: number;
  timestamp: number;
  points: number;
  correctWords: number;
} 