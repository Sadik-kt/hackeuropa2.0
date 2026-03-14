import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = "https://jnewfbrodalhytgqhxrr.supabase.co";
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImpuZXdmYnJvZGFsaHl0Z3FoeHJyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzM0NTU4NjEsImV4cCI6MjA4OTAzMTg2MX0.SIskP4OskPE5kdBSuNhe50t9Uudxo1B-lleojm5nfrI";

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

async function inspect() {
  const { data, error } = await supabase.from('rewards').select('*').limit(1);
  if (error) {
    console.error('Error:', error);
  } else if (data && data.length > 0) {
    console.log('Columns:', Object.keys(data[0]));
  } else {
    console.log('No data found in rewards table');
    // Try to get schema via an empty select? 
    // Usually select * on empty table returns [] and we can't get keys easily.
    // But we can try to insert a dummy row? No, that might fail too.
  }
  process.exit();
}

inspect();
