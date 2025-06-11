// frontend/src/services/supabaseClient.js

import { createClient } from '@supabase/supabase-js';

// ✅ Yeh sahi tarika hai
const supabaseUrl = process.env.REACT_APP_SUPABASE_URL;
const supabaseAnonKey = process.env.REACT_APP_SUPABASE_ANON_KEY;

// Supabase keys check karne ke liye error
if (!supabaseUrl || !supabaseAnonKey) {
    throw new Error("supabaseUrl and supabaseAnonKey are required. Make sure you have set them in GitHub Secrets and restarted the server.");
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);