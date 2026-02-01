import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = 'https://fuphindmzbrvlojaneee.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZ1cGhpbmRtemJydmxvamFuZWVlIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njk5NDQ0OTAsImV4cCI6MjA4NTUyMDQ5MH0.bd_TeJa-0JeksI11t68OOHDig1GoVcvAgvxn73sdLy8';

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);