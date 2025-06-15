import { Difficulty, DifficultyProgress } from '../types/game';
import { LeaderboardEntry } from '../types/leaderboard';

interface UserData {
  name: string;
  email?: string;
  isGuest?: boolean;
}

class UserService {
  private static instance: UserService;
  private guestCounter: number = 1;
  private startTime: number = 0;
  private levelStartTime: number = Date.now();
  private currentUser: UserData | null = null;
  private leaderboard: LeaderboardEntry[] = [];
  private progress: DifficultyProgress = {
    beginner: 0,
    intermediate: 0,
    advanced: 0,
    easy: 0
  };

  private constructor() {
    this.loadLeaderboard();
    this.loadProgress();
  }

  private loadLeaderboard(): void {
    const savedLeaderboard = localStorage.getItem('leaderboard');
    if (savedLeaderboard) {
      this.leaderboard = JSON.parse(savedLeaderboard);
    }
  }

  private loadProgress(): void {
    const savedProgress = localStorage.getItem('gameProgress');
    if (savedProgress) {
      this.progress = JSON.parse(savedProgress);
    }
  }

  private saveLeaderboard(): void {
    localStorage.setItem('leaderboard', JSON.stringify(this.leaderboard));
  }

  private saveProgress(): void {
    localStorage.setItem('gameProgress', JSON.stringify(this.progress));
  }

  public static getInstance(): UserService {
    if (!UserService.instance) {
      UserService.instance = new UserService();
    }
    return UserService.instance;
  }

  public initialize(): void {
    this.startTime = Date.now();
    this.levelStartTime = Date.now();
    this.loadProgress();
  }

  public setUserData(userData: UserData | null): void {
    this.currentUser = userData;
  }

  public getUserData(): UserData | null {
    return this.currentUser;
  }

  public generateGuestName(): string {
    return `Guest ${this.guestCounter++}`;
  }

  public getProgress(): DifficultyProgress {
    return { ...this.progress };
  }

  public updateProgress(difficulty: Difficulty, isCorrect: boolean): void {
    if (isCorrect) {
      this.progress[difficulty] = Math.min(this.progress[difficulty] + 20, 100);
      this.saveProgress();
    }
  }

  private calculatePoints(difficulty: Difficulty, correctWords: number): number {
    const basePoints = {
      easy: 10,
      beginner: 20,
      intermediate: 30,
      advanced: 40
    };
    return basePoints[difficulty] * correctWords;
  }

  public recordLevelCompletion(difficulty: Difficulty, correctWords: number): void {
    const completionTime = Date.now() - this.startTime;
    const points = this.calculatePoints(difficulty, correctWords);
    const entry: LeaderboardEntry = {
      name: this.currentUser?.name || 'Guest',
      email: this.currentUser?.email,
      difficulty,
      completionTime,
      totalTime: completionTime,
      timestamp: Date.now(),
      points,
      correctWords
    };
    this.leaderboard.push(entry);
    this.saveLeaderboard();
  }

  public getLeaderboard(): LeaderboardEntry[] {
    return this.leaderboard.sort((a, b) => b.points - a.points);
  }

  public formatTime(ms: number): string {
    const seconds = Math.floor(ms / 1000);
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  }

  public resetProgress(): void {
    this.progress = {
      beginner: 0,
      intermediate: 0,
      advanced: 0,
      easy: 0
    };
    localStorage.removeItem('gameProgress');
  }
}

export const userService = UserService.getInstance(); 