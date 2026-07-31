require('dotenv').config();
const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(process.env.VITE_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY, {
  auth: { autoRefreshToken: false, persistSession: false },
});

async function main() {
  const { data, error } = await supabase.from('team_members').select('id, name, role').limit(10);
  if (error) {
    console.error('error:', error);
    return;
  }
  console.log(JSON.stringify(data, null, 2));

  const { data: distinctCheck } = await supabase.from('team_members').select('role');
  const distinctRoles = [...new Set((distinctCheck || []).map((r) => JSON.stringify(r.role)))];
  console.log('distinct role values:', distinctRoles);
}

main().then(() => process.exit(0)).catch((err) => {
  console.error(err);
  process.exit(1);
});
