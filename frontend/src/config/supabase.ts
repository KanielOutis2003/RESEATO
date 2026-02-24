// frontend/src/config/supabase.ts
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables!')
}

console.log('Supabase URL:', supabaseUrl) // Debug line - check console

export const supabase = createClient(supabaseUrl, supabaseAnonKey)