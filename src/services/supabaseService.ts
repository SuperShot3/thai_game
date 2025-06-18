import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://xggtmazdbsbbkqzgbist.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhnZ3RtYXpkYnNiYmtxemdiaXN0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTAyMzA5OTgsImV4cCI6MjA2NTgwNjk5OH0.SM-WcPVwVFEzfbrzXxob4zyTazZiaqsLrlC4RQ4BaIs';

export const supabase = createClient(supabaseUrl, supabaseAnonKey); 