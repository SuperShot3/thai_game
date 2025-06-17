import { Difficulty } from '../types';
import { LeaderboardEntry } from '../types/leaderboard';

type ProgressData = {
  totalTime: number;
  timestamp: number;
  correctWords: number;
  incorrectWords: number;
};

type UserProgress = {
  [K in Difficulty]: ProgressData;
};

interface User {
  name: string;
  email: string;
  progress: UserProgress;
}

class UserService {
  private currentUser: User | null = null;
  private readonly STORAGE_KEY = 'thai_game_user';
  private leaderboard: LeaderboardEntry[] = [];

  constructor() {
    this.loadUser();
    this.loadLeaderboard();
  }

  private loadUser() {
    const savedUser = localStorage.getItem(this.STORAGE_KEY);
    if (savedUser) {
      this.currentUser = JSON.parse(savedUser);
    }
  }

  private saveUser() {
    if (this.currentUser) {
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(this.currentUser));
    }
  }

  private loadLeaderboard() {
    const savedLeaderboard = localStorage.getItem('leaderboard');
    if (savedLeaderboard) {
      this.leaderboard = JSON.parse(savedLeaderboard);
    }
  }

  private saveLeaderboard() {
    localStorage.setItem('leaderboard', JSON.stringify(this.leaderboard));
  }

  setUser(name: string, email: string): void {
    this.currentUser = {
      name,
      email,
      progress: {
        beginner: {
          totalTime: 0,
          timestamp: Date.now(),
          correctWords: 0,
          incorrectWords: 0
        },
        intermediate: {
          totalTime: 0,
          timestamp: Date.now(),
          correctWords: 0,
          incorrectWords: 0
        },
        advanced: {
          totalTime: 0,
          timestamp: Date.now(),
          correctWords: 0,
          incorrectWords: 0
        }
      }
    };
    this.saveUser();
  }

  getUser(): User | null {
    if (!this.currentUser) {
      const storedUser = localStorage.getItem(this.STORAGE_KEY);
      if (storedUser) {
        this.currentUser = JSON.parse(storedUser);
      }
    }
    return this.currentUser;
  }

  updateProgress(difficulty: Difficulty, isCorrect: boolean): ProgressData | null {
    if (!this.currentUser) return null;

    const progress = this.currentUser.progress[difficulty];
    const currentTime = Date.now();
    
    if (isCorrect) {
      progress.correctWords += 1;
    } else {
      progress.incorrectWords += 1;
    }
    
    progress.totalTime += currentTime - progress.timestamp;
    progress.timestamp = currentTime;

    this.saveUser();
    return progress;
  }

  getProgress(difficulty: Difficulty): ProgressData | null {
    if (!this.currentUser) return null;
    return this.currentUser.progress[difficulty];
  }

  isLevelComplete(difficulty: Difficulty): boolean {
    if (!this.currentUser) return false;
    const progress = this.currentUser.progress[difficulty];
    return progress.correctWords >= 5; // Complete after 5 correct sentences
  }

  getNextLevel(currentLevel: Difficulty): Difficulty | null {
    const levels: Difficulty[] = ['beginner', 'intermediate', 'advanced'];
    const currentIndex = levels.indexOf(currentLevel);
    if (currentIndex === -1 || currentIndex === levels.length - 1) return null;
    return levels[currentIndex + 1];
  }

  clearUser(): void {
    this.currentUser = null;
    localStorage.removeItem(this.STORAGE_KEY);
  }

  getLeaderboard() {
    return [...this.leaderboard];
  }

  addToLeaderboard(entry: LeaderboardEntry) {
    this.leaderboard.push(entry);
    this.saveLeaderboard();
  }
}

export const userService = new UserService(); 