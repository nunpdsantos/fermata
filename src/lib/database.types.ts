/**
 * TypeScript types matching the Supabase Postgres schema.
 * All user data tables use JSONB `data` columns for flexibility.
 */

// Inlined from the deleted services/syncMerge.ts (file retained for next cleanup task)
interface PreferencesSnapshot {
  selectedKey: { natural: string; accidental: string };
  selectedScale: string;
  instrument: string;
  guitarTuningId: string;
  baseOctave: number;
  colorMode: string;
  scaleOctaves: 1 | 2;
  volume: number;
  themeMode: string;
  synthPreset: string;
  updatedAt: number;
}

import type { CurriculumProgress } from '../core/types/curriculum';
import type { GamificationData } from '../core/types/gamification';
import type { ConceptRecord } from '../state/conceptStore';

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string;
          display_name: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id: string;
          display_name?: string | null;
        };
        Update: {
          display_name?: string | null;
        };
        Relationships: [];
      };
      user_preferences: {
        Row: {
          user_id: string;
          data: PreferencesSnapshot;
          updated_at: string;
        };
        Insert: {
          user_id: string;
          data: PreferencesSnapshot;
        };
        Update: {
          data?: PreferencesSnapshot;
          updated_at?: string;
        };
        Relationships: [];
      };
      curriculum_progress: {
        Row: {
          user_id: string;
          data: CurriculumProgress;
          updated_at: string;
        };
        Insert: {
          user_id: string;
          data: CurriculumProgress;
        };
        Update: {
          data?: CurriculumProgress;
          updated_at?: string;
        };
        Relationships: [];
      };
      gamification_data: {
        Row: {
          user_id: string;
          data: GamificationData;
          updated_at: string;
        };
        Insert: {
          user_id: string;
          data: GamificationData;
        };
        Update: {
          data?: GamificationData;
          updated_at?: string;
        };
        Relationships: [];
      };
      concept_tracking: {
        Row: {
          user_id: string;
          data: Record<string, ConceptRecord>;
          updated_at: string;
        };
        Insert: {
          user_id: string;
          data?: Record<string, ConceptRecord>;
        };
        Update: {
          data?: Record<string, ConceptRecord>;
          updated_at?: string;
        };
        Relationships: [];
      };
    };
    Views: Record<string, never>;
    Functions: Record<string, never>;
    Enums: Record<string, never>;
  };
}
