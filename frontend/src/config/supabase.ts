// frontend/src/config/supabase.ts
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables!')
}

console.log('Supabase URL:', supabaseUrl)

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true,
  },
})

supabase.auth.onAuthStateChange((_event, session) => {
  if (session?.access_token) {
    localStorage.setItem('token', session.access_token)
    localStorage.setItem('user', JSON.stringify(session.user))
  } else {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
  }
})
