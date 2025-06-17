import { Difficulty } from './index';

export interface LeaderboardEntry {
  name: string;
  correctWords: number;
  incorrectWords: number;
  totalTime: number;
} 