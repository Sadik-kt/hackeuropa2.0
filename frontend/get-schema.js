const SUPABASE_URL = "https://jnewfbrodalhytgqhxrr.supabase.co";
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImpuZXdmYnJvZGFsaHl0Z3FoeHJyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzM0NTU4NjEsImV4cCI6MjA4OTAzMTg2MX0.SIskP4OskPE5kdBSuNhe50t9Uudxo1B-lleojm5nfrI";

async function getSchema() {
  try {
    const res = await fetch(`${SUPABASE_URL}/rest/v1/`, {
      headers: {
        'apikey': SUPABASE_ANON_KEY,
        'Authorization': `Bearer ${SUPABASE_ANON_KEY}`
      }
    });
    const schema = await res.json();
    const rewards = schema.definitions.rewards;
    if (!rewards) {
      console.log('REWARDS_NOT_FOUND');
      console.log('Available Tables:', Object.keys(schema.definitions));
      return;
    }
    const cols = Object.keys(rewards.properties);
    console.log('--- REWARDS COLUMNS START ---');
    for (const col of cols) {
      console.log(`|${col}|`);
    }
    console.log('--- REWARDS COLUMNS END ---');
  } catch (err) {
    console.error('Error:', err);
  }
}

getSchema();
