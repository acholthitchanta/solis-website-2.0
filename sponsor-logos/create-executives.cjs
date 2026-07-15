/**
 * create-executives.cjs
 * ----------------------
 * Bulk-creates Supabase Auth users for the executive board and inserts a
 * matching row into `profiles` for each one, with the correct role.
 *
 * Uses the SERVICE ROLE key because creating auth users via admin API and
 * inserting profiles on someone else's behalf both require bypassing RLS --
 * the anon key (even signed in as an admin) can't do this.
 *
 * SETUP:
 *   npm install dotenv @supabase/supabase-js
 *
 * .env file needs (separate from your Vite app's anon key):
 *   SUPABASE_URL=https://xxxx.supabase.co
 *   SUPABASE_SERVICE_ROLE_KEY=xxxx   <- Project Settings > API > service_role
 *
 * USAGE:
 *   node create-executives.cjs
 *
 * All accounts are created with the same temporary password: "solisluna"
 * Everyone should change it after first login. This script does NOT send
 * email invites -- it just creates accounts directly with that password.
 */

require('dotenv').config();
const fs = require('fs');
const path = require('path');
const { createClient } = require('@supabase/supabase-js');

const SUPABASE_URL = process.env.VITE_SUPABASE_URL;
const SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;
const TEMP_PASSWORD = 'solisluna';

if (!SUPABASE_URL || !SERVICE_ROLE_KEY) {
  console.error('Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY env vars.');
  process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SERVICE_ROLE_KEY, {
  auth: { autoRefreshToken: false, persistSession: false },
});

async function main() {
  const rosterPath = path.join(__dirname, 'executives.json');
  const roster = JSON.parse(fs.readFileSync(rosterPath, 'utf-8'));

  let successCount = 0;
  let failCount = 0;

  for (const person of roster) {
    // 1. Create the auth user
    const { data: userData, error: createError } = await supabase.auth.admin.createUser({
      email: person.email,
      password: TEMP_PASSWORD,
      email_confirm: true, // skip email confirmation step
    });

    if (createError) {
      // If the user already exists, look them up instead of failing outright
      if (createError.message.toLowerCase().includes('already') ) {
        console.warn(`${person.email} already exists in Auth -- fetching existing user...`);
        const { data: listData, error: listError } = await supabase.auth.admin.listUsers();
        if (listError) {
          console.error(`Could not look up existing user for ${person.email}:`, listError.message);
          failCount++;
          continue;
        }
        const existing = listData.users.find((u) => u.email === person.email);
        if (!existing) {
          console.error(`${person.email} reported as existing but not found in list. Skipping.`);
          failCount++;
          continue;
        }
        await upsertProfile(existing.id, person);
        successCount++;
        continue;
      }

      console.error(`Failed to create auth user for ${person.email}:`, createError.message);
      failCount++;
      continue;
    }

    const userId = userData.user.id;

    // 2. Insert matching profiles row
    const ok = await upsertProfile(userId, person);
    if (ok) {
      console.log(`Created: ${person.full_name} (${person.email}) -> role: ${person.role}`);
      successCount++;
    } else {
      failCount++;
    }
  }

  console.log(`\nFinished. ${successCount} succeeded, ${failCount} failed.`);
  console.log(`Temporary password for all accounts: "${TEMP_PASSWORD}" -- have everyone change it after first login.`);
}

async function upsertProfile(userId, person) {
  const { error: profileError } = await supabase.from('profiles').upsert({
    id: userId,
    full_name: person.full_name,
    email: person.email,
    role: person.role,
  });

  if (profileError) {
    console.error(`Profile insert failed for ${person.email}:`, profileError.message);
    return false;
  }
  return true;
}

main().catch((err) => {
  console.error('Fatal error:', err);
  process.exit(1);
});
