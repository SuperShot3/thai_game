import { supabase } from '../../services/supabaseService';
import { LeaderboardEntry } from './types';

interface LeaderboardRecord {
  player_name: string;
  correct: number;
  incorrect: number;
  time: number;
  ip_address: string;
  last_played: string;
}

class LeaderboardService {
  private static instance: LeaderboardService;
  private leaderboard: LeaderboardEntry[] = [];

  private constructor() {
    this.loadLeaderboard();
  }

  public static getInstance(): LeaderboardService {
    if (!LeaderboardService.instance) {
      LeaderboardService.instance = new LeaderboardService();
    }
    return LeaderboardService.instance;
  }

  private async getIpAddress(): Promise<string> {
    try {
      console.log('Fetching IP address...');
      const response = await fetch('https://api.ipify.org?format=json', {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
        },
        // Add timeout for mobile devices
        signal: AbortSignal.timeout(5000)
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      console.log('IP address fetched successfully:', data.ip);
      return data.ip;
    } catch (error) {
      console.error('Error fetching IP address:', error);
      // Fallback: generate a random identifier for mobile
      const fallbackId = `mobile_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      console.log('Using fallback ID:', fallbackId);
      return fallbackId;
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
        console.error('Supabase Error:', error.message);
        console.error('Error Details:', error);
        return;
      }

      if (!data) {
        console.error('No data received from Supabase');
        return;
      }

      // Group entries by IP address and take only the best score for each IP
      const bestScoresByIp = new Map<string, LeaderboardRecord>();
      
      data.forEach((entry: LeaderboardRecord) => {
        const existingBest = bestScoresByIp.get(entry.ip_address);
        if (!existingBest || this.isBetterScore(entry, existingBest)) {
          bestScoresByIp.set(entry.ip_address, entry);
        }
      });

      // Convert to LeaderboardEntry array
      this.leaderboard = Array.from(bestScoresByIp.values()).map(entry => ({
        name: entry.player_name,
        correctWords: entry.correct,
        incorrectWords: entry.incorrect,
        totalTime: entry.time
      }));

      // Sort by score and time
      this.leaderboard.sort((a, b) => {
        if (a.correctWords !== b.correctWords) {
          return b.correctWords - a.correctWords;
        }
        return a.totalTime - b.totalTime;
      });

      console.log('Processed leaderboard:', this.leaderboard);
    } catch (error) {
      console.error('Unexpected error in loadLeaderboard:', error);
      if (error instanceof Error) {
        console.error('Error message:', error.message);
        console.error('Error stack:', error.stack);
      }
    }
  }

  private isBetterScore(newScore: LeaderboardRecord, existingScore: LeaderboardRecord): boolean {
    // First compare by correct answers
    if (newScore.correct !== existingScore.correct) {
      return newScore.correct > existingScore.correct;
    }
    // If correct answers are equal, compare by time (lower is better)
    if (newScore.time !== existingScore.time) {
      return newScore.time < existingScore.time;
    }
    // If scores are identical, take the most recent one
    return new Date(newScore.last_played) > new Date(existingScore.last_played);
  }

  public async addEntry(entry: Omit<LeaderboardEntry, 'name'> & { name: string }): Promise<void> {
    const name = entry.name || `Guest ${this.generateGuestNumber()}`;
    
    try {
      const ipAddress = await this.getIpAddress();
      console.log('IP Address obtained:', ipAddress);
      
      console.log('Attempting to add entry to leaderboard:', {
        player_name: name,
        correct: entry.correctWords,
        incorrect: entry.incorrectWords,
        time: entry.totalTime,
        ip_address: ipAddress,
        last_played: new Date().toISOString()
      });

      // First, check for existing entries from this IP and name
      const { data: existingEntries, error: fetchError } = await supabase
        .from('leaderboard')
        .select('*')
        .or(`ip_address.eq.${ipAddress},player_name.eq.${entry.name}`);

      if (fetchError) {
        console.error('Error checking existing entries:', fetchError);
        console.error('Fetch error details:', fetchError.message, fetchError.details, fetchError.hint);
        return;
      }

      console.log('Existing entries found:', existingEntries?.length || 0);

      const newEntry = {
        player_name: entry.name,
        correct: entry.correctWords,
        incorrect: entry.incorrectWords,
        time: entry.totalTime,
        ip_address: ipAddress,
        last_played: new Date().toISOString()
      };

      // If there are existing entries, only add if this score is better
      if (existingEntries && existingEntries.length > 0) {
        const bestExisting = existingEntries.reduce((best, current) => 
          this.isBetterScore(current, best) ? current : best
        );

        console.log('Comparing scores:', {
          new: newEntry,
          existing: bestExisting,
          isBetter: this.isBetterScore(newEntry, bestExisting)
        });

        if (!this.isBetterScore(newEntry, bestExisting)) {
          console.log('New score is not better than existing score, skipping...');
          return;
        }

        // Delete old entries for this IP or name
        console.log('Deleting old entries for IP/name:', ipAddress, entry.name);
        const { error: deleteError } = await supabase
          .from('leaderboard')
          .delete()
          .or(`ip_address.eq.${ipAddress},player_name.eq.${entry.name}`);

        if (deleteError) {
          console.error('Error deleting old entries:', deleteError);
        }
      }

      // Add the new entry
      console.log('Inserting new entry:', newEntry);
      const { error: insertError } = await supabase
        .from('leaderboard')
        .insert([newEntry]);

      if (insertError) {
        console.error('Supabase Insert Error:', insertError.message);
        console.error('Error Details:', insertError);
        console.error('Error Code:', insertError.code);
        console.error('Error Details:', insertError.details);
        console.error('Error Hint:', insertError.hint);
        return;
      }

      console.log('Entry successfully added to leaderboard');
      await this.loadLeaderboard();
    } catch (error) {
      console.error('Unexpected error in addEntry:', error);
      if (error instanceof Error) {
        console.error('Error message:', error.message);
        console.error('Error stack:', error.stack);
      }
      // Re-throw the error so the calling code can handle it
      throw error;
    }
  }

  public async getEntries(): Promise<LeaderboardEntry[]> {
    await this.loadLeaderboard();
    return this.leaderboard;
  }

  public async clearEntries(): Promise<void> {
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
}

export const leaderboardService = LeaderboardService.getInstance(); 