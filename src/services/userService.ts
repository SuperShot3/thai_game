import { Difficulty } from '../types';

type ProgressData = {
  totalTime: number;
  timestamp: number;
  correctWords: number;
  incorrectWords: number;
};

interface User {
  name: string;
  lastScore?: {
    correctWords: number;
    incorrectWords: number;
    totalTime: number;
    timestamp: number;
  };
  sessionStats?: {
    totalCorrectWords: number;
    totalIncorrectWords: number;
    totalTime: number;
    sessionStartTime: number;
  };
}

class UserService {
  private static instance: UserService;
  private currentUser: User | null = null;
  private readonly STORAGE_KEY = 'thai_game_user';

  private constructor() {
    this.loadUser();
  }

  public static getInstance(): UserService {
    if (!UserService.instance) {
      UserService.instance = new UserService();
    }
    return UserService.instance;
  }

  private loadUser(): void {
    const storedUser = localStorage.getItem(this.STORAGE_KEY);
    if (storedUser) {
      try {
        this.currentUser = JSON.parse(storedUser);
      } catch (error) {
        console.error('Error parsing stored user:', error);
        this.currentUser = null;
      }
    }
  }

  public setUser(name: string): void {
    this.currentUser = { 
      name,
      sessionStats: {
        totalCorrectWords: 0,
        totalIncorrectWords: 0,
        totalTime: 0,
        sessionStartTime: Date.now()
      }
    };
    this.saveToStorage();
  }

  public updateUserScore(score: { correctWords: number; incorrectWords: number; totalTime: number }): void {
    if (this.currentUser) {
      this.currentUser.lastScore = {
        ...score,
        timestamp: Date.now()
      };
      this.saveToStorage();
    }
  }

  private saveToStorage(): void {
    if (this.currentUser) {
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(this.currentUser));
    }
  }

  public getUser(): User | null {
    return this.currentUser;
  }

  public clearUser(): void {
    this.currentUser = null;
    localStorage.removeItem(this.STORAGE_KEY);
    // Also clear all progress
    Object.values(['beginner', 'intermediate', 'advanced'] as const).forEach(diff => {
      this.clearProgress(diff);
    });
  }

  public getProgress(difficulty: Difficulty): ProgressData | null {
    try {
      const key = `progress_${difficulty}`;
      
      // Check if localStorage is available
      if (typeof window === 'undefined' || !window.localStorage) {
        console.warn('localStorage not available');
        return null;
      }
      
      const storedProgress = localStorage.getItem(key);
      if (storedProgress) {
        try {
          const progress = JSON.parse(storedProgress);
          // Validate and normalize progress data
          return {
            totalTime: Math.max(0, Number(progress.totalTime) || 0),
            timestamp: Number(progress.timestamp) || Date.now(),
            correctWords: Math.max(0, Math.min(5, Number(progress.correctWords) || 0)),
            incorrectWords: Math.max(0, Number(progress.incorrectWords) || 0)
          };
        } catch (parseError) {
          console.error('Error parsing stored progress:', parseError);
          // Clear corrupted data
          localStorage.removeItem(key);
          return null;
        }
      }
      return null;
    } catch (error) {
      console.error('Error getting progress:', error);
      return null;
    }
  }

  public updateProgress(difficulty: Difficulty, data: ProgressData): void {
    try {
      // Validate and normalize data before saving
      const normalizedData = {
        totalTime: Math.max(0, Number(data.totalTime) || 0),
        timestamp: Number(data.timestamp) || Date.now(),
        correctWords: Math.max(0, Math.min(5, Number(data.correctWords) || 0)),
        incorrectWords: Math.max(0, Number(data.incorrectWords) || 0)
      };

      const key = `progress_${difficulty}`;
      
      // Check if localStorage is available
      if (typeof window !== 'undefined' && window.localStorage) {
        localStorage.setItem(key, JSON.stringify(normalizedData));
        console.log(`Progress updated for ${difficulty}:`, normalizedData);
      } else {
        console.warn('localStorage not available, progress not saved');
      }
    } catch (error) {
      console.error('Error updating progress:', error);
    }
  }

  public clearProgress(difficulty: Difficulty): void {
    const key = `progress_${difficulty}`;
    localStorage.removeItem(key);
  }

  public isLevelComplete(difficulty: Difficulty): boolean {
    const progress = this.getProgress(difficulty);
    // Ensure we have exactly 5 correct words for level completion
    return progress ? progress.correctWords === 5 : false;
  }

  public getNextLevel(difficulty: Difficulty): Difficulty | null {
    // Only allow progression if current level is complete
    if (!this.isLevelComplete(difficulty)) {
      return null;
    }

    switch (difficulty) {
      case 'beginner':
        return 'intermediate';
      case 'intermediate':
        return 'advanced';
      default:
        return null;
    }
  }

  public clearAllProgress(): void {
    console.log('Clearing all progress for new player');
    // Clear progress for all difficulty levels
    Object.values(['beginner', 'intermediate', 'advanced'] as const).forEach(diff => {
      this.clearProgress(diff);
    });
    console.log('All progress cleared');
  }

  // NEW: Session statistics methods
  public getSessionStats() {
    return this.currentUser?.sessionStats || {
      totalCorrectWords: 0,
      totalIncorrectWords: 0,
      totalTime: 0,
      sessionStartTime: Date.now()
    };
  }

  public updateSessionStats(correctWords: number, incorrectWords: number, elapsedTime: number): void {
    if (this.currentUser) {
      if (!this.currentUser.sessionStats) {
        this.currentUser.sessionStats = {
          totalCorrectWords: 0,
          totalIncorrectWords: 0,
          totalTime: 0,
          sessionStartTime: Date.now()
        };
      }

      this.currentUser.sessionStats.totalCorrectWords += correctWords;
      this.currentUser.sessionStats.totalIncorrectWords += incorrectWords;
      this.currentUser.sessionStats.totalTime += elapsedTime;

      this.saveToStorage();
      console.log('Session stats updated:', this.currentUser.sessionStats);
    }
  }

  public resetSessionStats(): void {
    if (this.currentUser) {
      this.currentUser.sessionStats = {
        totalCorrectWords: 0,
        totalIncorrectWords: 0,
        totalTime: 0,
        sessionStartTime: Date.now()
      };
      this.saveToStorage();
      console.log('Session stats reset');
    }
  }
}

export const userService = UserService.getInstance(); 