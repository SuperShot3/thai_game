import { Difficulty } from '../types';
import { LeaderboardEntry } from '../types/leaderboard';
import { supabase } from './supabaseService';

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
  private static instance: UserService;
  private currentUser: User | null = null;
  private readonly STORAGE_KEY = 'thai_game_user';
  private leaderboard: LeaderboardEntry[] = [];

  private constructor() {
    this.loadUser();
    this.loadLeaderboard();
  }

  public static getInstance(): UserService {
    if (!UserService.instance) {
      UserService.instance = new UserService();
    }
    return UserService.instance;
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

  private async loadLeaderboard(): Promise<void> {
    try {
      console.log('Attempting to fetch leaderboard from Supabase...');
      const { data, error } = await supabase
        .from('leaderboard')
        .select('*')
        .order('correct', { ascending: false })
        .order('time', { ascending: true });

      if (error) {
        console.error('Error loading leaderboard:', error);
        return;
      }

      console.log('Leaderboard data received:', data);
      this.leaderboard = data.map(entry => ({
        name: entry.player_name,
        correctWords: entry.correct,
        incorrectWords: entry.incorrect,
        totalTime: entry.time
      }));
    } catch (error) {
      console.error('Error loading leaderboard:', error);
    }
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

  public async addToLeaderboard(entry: Omit<LeaderboardEntry, 'name'> & { name?: string }): Promise<void> {
    const name = entry.name || `Guest ${this.generateGuestNumber()}`;
    
    try {
      const { error } = await supabase
        .from('leaderboard')
        .insert([{
          player_name: name,
          correct: entry.correctWords,
          incorrect: entry.incorrectWords,
          time: entry.totalTime
        }]);

      if (error) {
        console.error('Error adding to leaderboard:', error);
        return;
      }

      await this.loadLeaderboard();
    } catch (error) {
      console.error('Error adding to leaderboard:', error);
    }
  }

  public async getLeaderboard(): Promise<LeaderboardEntry[]> {
    await this.loadLeaderboard();
    return this.leaderboard;
  }

  public async clearLeaderboard(): Promise<void> {
    try {
      const { error } = await supabase
        .from('leaderboard')
        .delete()
        .not('id', 'is', null);

      if (error) {
        console.error('Error clearing leaderboard:', error);
        return;
      }

      this.leaderboard = [];
    } catch (error) {
      console.error('Error clearing leaderboard:', error);
    }
  }

  private generateGuestNumber(): number {
    const guestEntries = this.leaderboard.filter(entry => entry.name.startsWith('Guest '));
    if (guestEntries.length === 0) return 1;
    
    const numbers = guestEntries.map(entry => {
      const num = parseInt(entry.name.split(' ')[1]);
      return isNaN(num) ? 0 : num;
    });
    
    return Math.max(...numbers) + 1;
  }

  public async testAddEntry(): Promise<void> {
    try {
      console.log('Adding test entry to leaderboard...');
      const { error } = await supabase
        .from('leaderboard')
        .insert([{
          player_name: 'Test Player',
          correct: 5,
          incorrect: 1,
          time: 120
        }]);

      if (error) {
        console.error('Error adding test entry:', error);
        return;
      }

      console.log('Test entry added successfully');
      await this.loadLeaderboard();
    } catch (error) {
      console.error('Error in test:', error);
    }
  }
}

export const userService = UserService.getInstance(); 