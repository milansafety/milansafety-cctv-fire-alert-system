// mobile-app/lib/supabase.js
import 'react-native-url-polyfill/auto';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://dozfkjiywkqxthznqpfw.supabase.co'; // <-- APNI URL YAHAN PASTE KAREIN
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRvemZraml5d2txeHRoem5xcGZ3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDk2NDY1ODcsImV4cCI6MjA2NTIyMjU4N30.yjIKbkurnkOYr8UEHIhgFqtxoINvWp6wUg6P9Fjgk6U'; // <-- APNI KEY YAHAN PASTE KAREIN

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
      storage: AsyncStorage,
          autoRefreshToken: true,
              persistSession: true,
                  detectSessionInUrl: false,
                    },
                    });