import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = "https://jnewfbrodalhytgqhxrr.supabase.co";
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImpuZXdmYnJvZGFsaHl0Z3FoeHJyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzM0NTU4NjEsImV4cCI6MjA4OTAzMTg2MX0.SIskP4OskPE5kdBSuNhe50t9Uudxo1B-lleojm5nfrI";

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
