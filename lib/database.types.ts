export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[];

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string;
          username: string;
          display_name: string | null;
          avatar_url: string | null;
          created_at: string;
        };
        Insert: {
          id: string;
          username: string;
          display_name?: string | null;
          avatar_url?: string | null;
          created_at?: string;
        };
        Update: {
          username?: string;
          display_name?: string | null;
          avatar_url?: string | null;
        };
        Relationships: [];
      };
      matches: {
        Row: {
          id: string;
          provider: string;
          provider_match_id: number;
          competition: string;
          utc_kickoff: string;
          home_team_name: string;
          away_team_name: string;
          status: string;
          score_home: number | null;
          score_away: number | null;
          stage: string | null;
          matchday: number | null;
          updated_at: string;
        };
        Insert: {
          id?: string;
          provider?: string;
          provider_match_id: number;
          competition: string;
          utc_kickoff: string;
          home_team_name: string;
          away_team_name: string;
          status: string;
          score_home?: number | null;
          score_away?: number | null;
          stage?: string | null;
          matchday?: number | null;
          updated_at?: string;
        };
        Update: {
          provider?: string;
          provider_match_id?: number;
          competition?: string;
          utc_kickoff?: string;
          home_team_name?: string;
          away_team_name?: string;
          status?: string;
          score_home?: number | null;
          score_away?: number | null;
          stage?: string | null;
          matchday?: number | null;
          updated_at?: string;
        };
        Relationships: [];
      };
      match_logs: {
        Row: {
          id: string;
          user_id: string;
          match_id: string;
          watched: boolean;
          attended: boolean;
          rating: number | null;
          review: string | null;
          stadium: string | null;
          city: string | null;
          notes: string | null;
          visibility: "public" | "private";
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          match_id: string;
          watched?: boolean;
          attended?: boolean;
          rating?: number | null;
          review?: string | null;
          stadium?: string | null;
          city?: string | null;
          notes?: string | null;
          visibility?: "public" | "private";
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          watched?: boolean;
          attended?: boolean;
          rating?: number | null;
          review?: string | null;
          stadium?: string | null;
          city?: string | null;
          notes?: string | null;
          visibility?: "public" | "private";
          updated_at?: string;
        };
        Relationships: [];
      };
    };
    Views: Record<string, never>;
    Functions: Record<string, never>;
    Enums: Record<string, never>;
    CompositeTypes: Record<string, never>;
  };
}
