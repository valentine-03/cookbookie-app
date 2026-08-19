import { createClient } from '@supabase/supabase-js'

// These come from your .env file (see .env.example).
// VITE_ prefix is required for Vite to expose them to the browser.
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  console.warn(
    'Missing Supabase env vars. Copy .env.example to .env and fill in your project URL + anon key.'
  )
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey)
