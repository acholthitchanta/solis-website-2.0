/**
 * promote-pending-rds.cjs
 * ------------------------
 * Reads every row out of `pending_rds` (populated by the "Add Regional
 * Director" button in the app, which can't safely create real auth accounts
 * from the browser), creates a real Supabase Auth user for each one with a
 * freshly generated random password, inserts the matching `profiles` row
 * (role: 'rd', linked to their team), and then removes the row from
 * `pending_rds` now that it's been promoted.
 *
 * Uses the SERVICE ROLE key (same reasoning as create-executives.cjs):
 * creating auth users via the admin API, and inserting profiles on someone
 * else's behalf, both require bypassing RLS.
 *
 * SETUP:
 *   npm install dotenv @supabase/supabase-js
 *
 * .env file needs (same one create-executives.cjs uses):
 *   VITE_SUPABASE_URL=https://xxxx.supabase.co
 *   SUPABASE_SERVICE_ROLE_KEY=xxxx   <- Project Settings > API > service_role
 *
 * USAGE:
 *   node promote-pending-rds.cjs
 *
 * Each account gets its own randomly generated password -- there is no
 * shared/default password. Passwords are written to rd-credentials.json in
 * this directory since that's the only time they exist in plaintext; the
 * database only ever stores a hash. Distribute each person's password to
 * them individually, then delete rd-credentials.json. That file is
 * gitignored, but double check it never gets committed.
 */

require('dotenv').config();
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');
const { createClient } = require('@supabase/supabase-js');

const SUPABASE_URL = process.env.VITE_SUPABASE_URL;
const SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;
const CREDENTIALS_PATH = path.join(__dirname, 'rd-credentials.json');

if (!SUPABASE_URL || !SERVICE_ROLE_KEY) {
  console.error('Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY env vars.');
  process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SERVICE_ROLE_KEY, {
  auth: { autoRefreshToken: false, persistSession: false },
});

function generatePassword() {
  // 18 random bytes -> 24-char base64url string: no shared dictionary, no
  // ambiguity about charset, well above any reasonable minimum length.
  return crypto.randomBytes(18).toString('base64url');
}

async function main() {
  const { data: pending, error: fetchError } = await supabase
    .from('pending_rds')
    .select('id, team_id, name, email, headshot_url');

  if (fetchError) {
    console.error('Failed to fetch pending_rds:', fetchError.message);
    process.exit(1);
  }

  if (!pending || pending.length === 0) {
    console.log('No pending RDs to promote.');
    return;
  }

  const credentials = [];
  let successCount = 0;
  let failCount = 0;

  for (const person of pending) {
    // 1. Create the auth user with a fresh random password
    const password = generatePassword();
    const { data: userData, error: createError } = await supabase.auth.admin.createUser({
      email: person.email,
      password,
      email_confirm: true, // skip email confirmation step
      user_metadata: { name: person.name },
    });

    let userId;
    let passwordAssigned = false;

    if (createError) {
      // If the user already exists, look them up instead of failing outright.
      // We do NOT overwrite their existing password in this case.
      if (createError.message.toLowerCase().includes('already')) {
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
        userId = existing.id;
      } else {
        console.error(`Failed to create auth user for ${person.email}:`, createError.message);
        failCount++;
        continue;
      }
    } else {
      userId = userData.user.id;
      passwordAssigned = true;
    }

    // 2. Insert matching profiles row
    const { error: profileError } = await supabase.from('profiles').upsert({
      id: userId,
      full_name: person.name,
      email: person.email,
      headshot_url: person.headshot_url,
      role: 'rd',
      team_id: person.team_id,
    });

    if (profileError) {
      console.error(`Profile insert failed for ${person.email}:`, profileError.message);
      failCount++;
      continue;
    }

    // 3. Remove from the pending table now that it's been promoted
    const { error: deleteError } = await supabase.from('pending_rds').delete().eq('id', person.id);

    if (deleteError) {
      console.error(`Promoted ${person.email} but failed to clear pending_rds row:`, deleteError.message);
      failCount++;
      continue;
    }

    if (passwordAssigned) {
      credentials.push({ name: person.name, email: person.email, password });
    }

    console.log(`Promoted: ${person.name} (${person.email}) -> role: rd`);
    successCount++;
  }

  if (credentials.length > 0) {
    fs.writeFileSync(CREDENTIALS_PATH, JSON.stringify(credentials, null, 2));
    console.log(`\nWrote ${credentials.length} new password(s) to ${CREDENTIALS_PATH}`);
    console.log('Distribute each password individually, then delete that file -- it is the only place the plaintext password will ever exist.');
  }

  console.log(`\nFinished. ${successCount} succeeded, ${failCount} failed.`);
}

main().catch((err) => {
  console.error('Fatal error:', err);
  process.exit(1);
});
