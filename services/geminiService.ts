import { AnalysisResult, PromptMode } from "../types";
import { supabase } from "./supabaseClient";

export const analyzePrompt = async (prompt: string, mode: PromptMode): Promise<AnalysisResult> => {
  const { data: { session } } = await supabase.auth.getSession();
  
  const response = await fetch('/api/generate', {
    method: 'POST',
    headers: { 
      'Content-Type': 'application/json',
      'Authorization': session ? `Bearer ${session.access_token}` : ''
    },
    body: JSON.stringify({ prompt, mode }),
  });

  const json = await response.json();
  
  if (!json.success) {
    throw new Error(json.error || "Forge logic failure");
  }

  return json.data as AnalysisResult;
};