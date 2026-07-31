require('dotenv').config();
const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(process.env.VITE_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY, {
  auth: { autoRefreshToken: false, persistSession: false },
});

async function main() {
  const { data, error } = await supabase.from('regions').select('*').limit(1);
  if (error) {
    console.error('error:', error);
    return;
  }
  console.log('columns on regions:', data.length ? Object.keys(data[0]) : '(no rows to inspect)');
}

main().then(() => process.exit(0)).catch((err) => {
  console.error(err);
  process.exit(1);
});
