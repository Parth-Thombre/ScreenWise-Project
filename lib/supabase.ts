import { createClient } from "@supabase/supabase-js";

// Load from environment
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

// Debugging logs (optional)
console.log("✅ SUPABASE URL:", supabaseUrl);
console.log("✅ SUPABASE ANON KEY:", supabaseAnonKey ? "Loaded ✅" : "Missing ❌");

// Safety check
if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error("❌ Supabase environment variables are missing. Please check your .env.local file.");
}

// Type-safe Supabase client
export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey);

// Database schema definition
export type Database = {
  public: {
    Tables: {
      users: {
        Row: {
          id: string;
          email: string;
          full_name: string;
          points: number;
          daily_goal: number;
          streak: number;
          created_at: string;
        };
        Insert: {
          id: string;
          email: string;
          full_name: string;
          points?: number;
          daily_goal?: number;
          streak?: number;
          created_at?: string;
        };
        Update: {
          id?: string;
          email?: string;
          full_name?: string;
          points?: number;
          daily_goal?: number;
          streak?: number;
          created_at?: string;
        };
      };
      screen_time_logs: {
        Row: {
          id: string;
          user_id: string;
          app_name: string;
          duration_minutes: number;
          date: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          app_name: string;
          duration_minutes: number;
          date: string;
          created_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          app_name?: string;
          duration_minutes?: number;
          date?: string;
          created_at?: string;
        };
      };
      rewards: {
        Row: {
          id: string;
          name: string;
          description: string;
          points_required: number;
          category: string;
          available: boolean;
          created_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          description: string;
          points_required: number;
          category: string;
          available?: boolean;
          created_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          description?: string;
          points_required?: number;
          category?: string;
          available?: boolean;
          created_at?: string;
        };
      };
      reward_redemptions: {
        Row: {
          id: string;
          user_id: string;
          reward_id: string;
          redeemed_at: string;
          status: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          reward_id: string;
          redeemed_at?: string;
          status?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          reward_id?: string;
          redeemed_at?: string;
          status?: string;
        };
      };
    };
  };
};
