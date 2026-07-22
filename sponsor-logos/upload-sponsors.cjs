/**
 * upload-sponsors.js
 * -------------------
 * Uploads every sponsor logo listed in sponsors.json to a Supabase Storage
 * bucket, then inserts a row per sponsor into the `sponsors` table with
 * the resulting public URL.
 *
 * Uses the ANON key (same as your Vite app), which means every request
 * goes through Row Level Security -- so this script signs in as an admin
 * user first, the same way your app's login would. That admin user's
 * `profiles.role` must be 'admin' for the sponsors table's RLS policy to
 * allow the insert.
 *
 * SETUP:
 *   npm install @supabase/supabase-js
 *
 * ENV VARS (required):
 *   VITE_SUPABASE_URL       -> same value as your Vite app's .env
 *   VITE_SUPABASE_ANON_KEY  -> same value as your Vite app's .env
 *   ADMIN_EMAIL             -> email of a user whose profiles.role = 'admin'
 *   ADMIN_PASSWORD          -> that user's password
 *
 * USAGE:
 *   VITE_SUPABASE_URL=https://xxxx.supabase.co \
 *   VITE_SUPABASE_ANON_KEY=xxxx \
 *   ADMIN_EMAIL=you@example.com \
 *   ADMIN_PASSWORD=yourpassword \
 *   node upload-sponsors.js
 *
 * Run from the folder containing this script, sponsors.json, and the
 * logoN.png files (i.e. the sponsor-logos folder).
 *
 * NOTE ON STORAGE RLS:
 *   The `sponsors` bucket also needs a storage policy allowing admins to
 *   INSERT objects (bucket creation itself requires elevated privileges
 *   the anon key doesn't have, so create the bucket manually first --
 *   see instructions below the script).
 */

require('dotenv').config();
const fs = require('fs');
const path = require('path');
const { createClient } = require('@supabase/supabase-js');

const SUPABASE_URL = process.env.VITE_SUPABASE_URL;
const ANON_KEY = process.env.VITE_SUPABASE_ANON_KEY;
const ADMIN_EMAIL = process.env.ADMIN_EMAIL;
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD;
const BUCKET = 'gallery';

if (!SUPABASE_URL || !ANON_KEY) {
  console.error('Missing VITE_SUPABASE_URL or VITE_SUPABASE_ANON_KEY env vars.');
  process.exit(1);
}
if (!ADMIN_EMAIL || !ADMIN_PASSWORD) {
  console.error(
    'Missing ADMIN_EMAIL or ADMIN_PASSWORD env vars.\n' +
    'The anon key respects RLS, so this script needs to sign in as a user ' +
    'whose profiles.role = \'admin\' to be allowed to write.'
  );
  process.exit(1);
}

const supabase = createClient(SUPABASE_URL, ANON_KEY);

async function signInAsAdmin() {
  const { data, error } = await supabase.auth.signInWithPassword({
    email: ADMIN_EMAIL,
    password: ADMIN_PASSWORD,
  });
  if (error) {
    console.error('Sign-in failed:', error.message);
    process.exit(1);
  }
  console.log(`Signed in as ${data.user.email}`);

  // Sanity check: confirm this user is actually an admin per your profiles table
  const { data: profile, error: profileError } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', data.user.id)
    .single();

  if (profileError || !profile) {
    console.error('Could not verify admin role:', profileError?.message);
    process.exit(1);
  }
  if (profile.role !== 'admin') {
    console.error(`User ${ADMIN_EMAIL} has role "${profile.role}", not "admin". Aborting.`);
    process.exit(1);
  }
}

async function main() {
  await signInAsAdmin();

  const mappingPath = path.join(__dirname, 'sponsors.json');
  const sponsors = JSON.parse(fs.readFileSync(mappingPath, 'utf-8'));

  const stillTodo = sponsors.filter((s) => s.name.startsWith('TODO'));
  if (stillTodo.length > 0) {
    console.warn(
      `Warning: ${stillTodo.length} sponsor(s) still have placeholder names ` +
      `(${stillTodo.map((s) => s.file).join(', ')}). They'll upload with that ` +
      `placeholder as the name -- fix sponsors.json and re-run, or edit later in Supabase.`
    );
  }

  let successCount = 0;
  let failCount = 0;

  for (const sponsor of sponsors) {
    const localPath = path.join(__dirname, sponsor.file);

    if (!fs.existsSync(localPath)) {
      console.error(`Skipping ${sponsor.file}: file not found locally.`);
      failCount++;
      continue;
    }

    const fileBuffer = fs.readFileSync(localPath);

    // 1. Upload to Storage
    const { error: uploadError } = await supabase.storage
      .from(BUCKET)
      .upload(sponsor.file, fileBuffer, {
        contentType: 'image/png',
        upsert: true, // overwrite if re-running
      });

    if (uploadError) {
      console.error(`Upload failed for ${sponsor.file}:`, uploadError.message);
      failCount++;
      continue;
    }

    // 2. Get public URL
    const { data: publicUrlData } = supabase.storage
      .from(BUCKET)
      .getPublicUrl(sponsor.file);
    const imageUrl = publicUrlData.publicUrl;

    // 3. Insert into sponsors table
    const { error: insertError } = await supabase.from('sponsors').insert({
      name: sponsor.name,
      image_url: imageUrl,
    });

    if (insertError) {
      console.error(`DB insert failed for ${sponsor.file}:`, insertError.message);
      failCount++;
      continue;
    }

    console.log(`Done: ${sponsor.file} -> "${sponsor.name}"`);
    successCount++;
  }

  console.log(`\nFinished. ${successCount} succeeded, ${failCount} failed.`);

  await supabase.auth.signOut();
}

main().catch((err) => {
  console.error('Fatal error:', err);
  process.exit(1);
});