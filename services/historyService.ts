
import { supabase } from './supabaseClient';
import { PromptHistoryItem } from '../types';

export const savePromptToHistory = async (
  userId: string,
  original: string,
  improved: string,
  score: number,
  details?: {
    score_breakdown?: any;
    model?: string;
    duration_ms?: number;
    status?: string;
  }
) => {
  try {
    const res = await fetch('/api/history/save', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        original_prompt: original,
        improved_prompt: improved,
        score,
        score_breakdown: details?.score_breakdown,
        model: details?.model,
        duration_ms: details?.duration_ms,
        status: details?.status
      })
    });

    if (!res.ok) {
      const err = await res.json();
      console.error('Error saving history via API:', err);
    }
  } catch (error) {
    console.error('Network error saving history:', error);
  }
};

export const fetchUserHistory = async (userId: string): Promise<PromptHistoryItem[]> => {
  try {
    const res = await fetch('/api/history/recent');
    if (!res.ok) {
      console.error('Failed to fetch history API');
      return [];
    }
    const json = await res.json();
    return json.data || [];
  } catch (error) {
    console.error('Network error fetching history:', error);
    return [];
  }
};
