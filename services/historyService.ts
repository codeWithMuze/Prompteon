
import { supabase } from './supabaseClient';
import { PromptHistoryItem } from '../types';

export const savePromptToHistory = async (userId: string, original: string, improved: string, score: number) => {
  const { error } = await supabase
    .from('prompts')
    .insert([
      { 
        user_id: userId, 
        original_prompt: original, 
        improved_prompt: improved, 
        score: score 
      }
    ]);

  if (error) console.error('Error saving prompt history:', error);
};

export const fetchUserHistory = async (userId: string): Promise<PromptHistoryItem[]> => {
  const { data, error } = await supabase
    .from('prompts')
    .select('id, original_prompt, improved_prompt, score, created_at')
    .eq('user_id', userId)
    .order('created_at', { ascending: false })
    .limit(10);

  if (error) {
    console.error('Error fetching user history:', error);
    return [];
  }

  return data || [];
};
