import { Difficulty } from '../types';
import { supabase } from './supabaseService';

type ProgressData = {
  totalTime: number;
  timestamp: number;
  correctWords: number;
  incorrectWords: number;
};

interface User {
  name: string;
  email: string;
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

  public setUser(name: string, email: string): void {
    this.currentUser = { name, email };
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(this.currentUser));
  }

  public getUser(): User | null {
    return this.currentUser;
  }

  public clearUser(): void {
    this.currentUser = null;
    localStorage.removeItem(this.STORAGE_KEY);
  }

  public getProgress(difficulty: Difficulty): ProgressData | null {
    const key = `progress_${difficulty}`;
    const storedProgress = localStorage.getItem(key);
    if (storedProgress) {
      try {
        return JSON.parse(storedProgress);
      } catch (error) {
        console.error('Error parsing stored progress:', error);
        return null;
      }
    }
    return null;
  }

  public updateProgress(difficulty: Difficulty, data: ProgressData): void {
    const key = `progress_${difficulty}`;
    localStorage.setItem(key, JSON.stringify(data));
  }

  public clearProgress(difficulty: Difficulty): void {
    const key = `progress_${difficulty}`;
    localStorage.removeItem(key);
  }

  public isLevelComplete(difficulty: Difficulty): boolean {
    const progress = this.getProgress(difficulty);
    return progress ? progress.correctWords >= 5 : false;
  }

  public getNextLevel(difficulty: Difficulty): Difficulty | null {
    switch (difficulty) {
      case 'beginner':
        return 'intermediate';
      case 'intermediate':
        return 'advanced';
      default:
        return null;
    }
  }
}

export const userService = UserService.getInstance(); 