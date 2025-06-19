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

  private async loadLeaderboard(): Promise<void> {
    try {
      console.log('🔄 Loading leaderboard from Supabase...');
      const { data, error } = await supabase
        .from('leaderboard')
        .select('*')
        .order('correct', { ascending: false })
        .order('time', { ascending: true });

      if (error) {
        console.error('❌ Supabase Error:', error.message);
        return;
      }

      if (!data) {
        console.log('⚠️ No data received from Supabase');
        this.leaderboard = [];
        return;
      }

      // NEW LOGIC: Show all entries, don't filter by IP
      this.leaderboard = data.map((entry: LeaderboardRecord) => ({
        name: entry.player_name,
        correctWords: entry.correct,
        incorrectWords: entry.incorrect,
        totalTime: entry.time
      }));

      console.log('✅ Leaderboard loaded successfully:', this.leaderboard.length, 'entries');
    } catch (error) {
      console.error('❌ Error loading leaderboard:', error);
      this.leaderboard = [];
    }
  }

  public async addEntry(entry: Omit<LeaderboardEntry, 'name'> & { name: string }): Promise<void> {
    const name = entry.name || 'Guest';
    
    try {
      console.log('📝 Adding entry to leaderboard:', {
        player_name: name,
        correct: entry.correctWords,
        incorrect: entry.incorrectWords,
        time: entry.totalTime
      });

      // Check if the exact same entry already exists
      const { data: existing, error: selectError } = await supabase
        .from('leaderboard')
        .select('id')
        .eq('player_name', name)
        .eq('correct', entry.correctWords)
        .eq('incorrect', entry.incorrectWords)
        .eq('time', entry.totalTime)
        .limit(1);

      if (selectError) {
        console.error('❌ Supabase Select Error:', selectError.message);
        throw selectError;
      }

      const timestamp = new Date().toISOString();

      if (existing && existing.length > 0) {
        // Duplicate found - update the last_played timestamp instead of inserting
        const existingId = (existing[0] as { id: number }).id;
        console.log('⚠️ Duplicate entry found, updating last_played for id', existingId);

        const { error: updateError } = await supabase
          .from('leaderboard')
          .update({ last_played: timestamp, ip_address: 'local' })
          .eq('id', existingId);

        if (updateError) {
          console.error('❌ Supabase Update Error:', updateError.message);
          throw updateError;
        }

        console.log('✅ Existing entry updated');
      } else {
        // Insert new record if no duplicate exists
        const newEntry = {
          player_name: name,
          correct: entry.correctWords,
          incorrect: entry.incorrectWords,
          time: entry.totalTime,
          ip_address: 'local',
          last_played: timestamp
        };

        console.log('💾 Inserting new entry:', newEntry);
        const { error: insertError } = await supabase
          .from('leaderboard')
          .insert([newEntry]);

        if (insertError) {
          console.error('❌ Supabase Insert Error:', insertError.message);
          throw insertError;
        }

        console.log('✅ Entry successfully added to leaderboard');
      }
      
      // Reload the leaderboard to show the new entry
      await this.loadLeaderboard();
      
    } catch (error) {
      console.error('❌ Error adding entry:', error);
      throw error;
    }
  }

  public async getEntries(): Promise<LeaderboardEntry[]> {
    await this.loadLeaderboard();
    return this.leaderboard;
  }

  // Keep the clearEntries method for admin purposes
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
      console.log('✅ Leaderboard cleared successfully');
    } catch (error) {
      console.error('Error clearing leaderboard:', error);
    }
  }

  // Add test entry for "Bob test" with 100 correct words
  public async addTestEntry(): Promise<void> {
    try {
      console.log('🧪 Adding test entry for Bob test...');
      
      // Try with the exact same structure as regular entries
      const testEntry = {
        player_name: 'Bob test',
        correct: 100,
        incorrect: 15,
        time: 1800, // 30 minutes in seconds
        ip_address: 'local', // Use same as regular entries
        last_played: new Date().toISOString()
      };

      console.log('💾 Inserting test entry:', testEntry);
      
      // First, let's check if we can connect to Supabase
      const { data: testData, error: testError } = await supabase
        .from('leaderboard')
        .select('count')
        .limit(1);
      
      if (testError) {
        console.error('❌ Supabase connection test failed:', testError);
        throw new Error(`Database connection failed: ${testError.message}`);
      }
      
      console.log('✅ Supabase connection test successful');
      
      // Now try to insert the test entry
      const { data: insertData, error: insertError } = await supabase
        .from('leaderboard')
        .insert([testEntry])
        .select();

      if (insertError) {
        console.error('❌ Supabase Insert Error:', insertError);
        console.error('❌ Error details:', {
          message: insertError.message,
          details: insertError.details,
          hint: insertError.hint,
          code: insertError.code
        });
        
        // Try a simpler insert without .select() as fallback
        console.log('🔄 Trying fallback insert method...');
        const { error: fallbackError } = await supabase
          .from('leaderboard')
          .insert([testEntry]);
          
        if (fallbackError) {
          console.error('❌ Fallback insert also failed:', fallbackError);
          throw fallbackError;
        }
        
        console.log('✅ Fallback insert successful');
      } else {
        console.log('✅ Test entry successfully added to leaderboard:', insertData);
      }
      
      // Reload the leaderboard to show the new entry
      await this.loadLeaderboard();
      
    } catch (error) {
      console.error('❌ Error adding test entry:', error);
      if (error instanceof Error) {
        console.error('❌ Error message:', error.message);
        console.error('❌ Error stack:', error.stack);
      }
      throw error;
    }
  }

  // Test Supabase connection
  public async testConnection(): Promise<boolean> {
    try {
      console.log('🔍 Testing Supabase connection...');
      
      const { data, error } = await supabase
        .from('leaderboard')
        .select('count')
        .limit(1);
      
      if (error) {
        console.error('❌ Connection test failed:', error);
        return false;
      }
      
      console.log('✅ Connection test successful:', data);
      return true;
    } catch (error) {
      console.error('❌ Connection test error:', error);
      return false;
    }
  }
}

export const leaderboardService = LeaderboardService.getInstance(); 