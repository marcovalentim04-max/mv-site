import { createClient } from "@supabase/supabase-js";

// Acessa variáveis públicas do Vite
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('⚠️ Variáveis de ambiente do Supabase não configuradas!');
  console.error('VITE_SUPABASE_URL:', supabaseUrl ? 'Configurada' : 'Faltando');
  console.error('VITE_SUPABASE_ANON_KEY:', supabaseAnonKey ? 'Configurada' : 'Faltando');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
