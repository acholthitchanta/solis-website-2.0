/**
 * upload-press.js
 * -----------------
 * Uploads every press logo listed in press.json to the `press` Supabase
 * Storage bucket, then inserts a row per press feature into the `press`
 * table with the resulting public URL. Entries with `file: null` (no local
 * logo available) are inserted with `article_logo_url` left blank.
 *
 * Uses the ANON key (same as your Vite app), which means every request
 * goes through Row Level Security -- so this script signs in as an admin
 * user first, the same way upload-sponsors.js does.
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
 *   node upload-press.js
 *
 * Run from the sponsor-logos folder (needs press.json and the logos/
 * folder alongside it).
 *
 * NOTE: assumes the table is named `press` -- rename TABLE below if yours
 * is called something else (e.g. `press_features`).
 */

require('dotenv').config();
const fs = require('fs');
const path = require('path');
const { createClient } = require('@supabase/supabase-js');

const SUPABASE_URL = process.env.VITE_SUPABASE_URL;
const ANON_KEY = process.env.VITE_SUPABASE_ANON_KEY;
const ADMIN_EMAIL = process.env.ADMIN_EMAIL;
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD;
const BUCKET = 'press';
const TABLE = 'press';

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

function contentTypeFor(fileName) {
  const ext = fileName.split('.').pop().toLowerCase();
  if (ext === 'png') return 'image/png';
  if (ext === 'jpg' || ext === 'jpeg') return 'image/jpeg';
  return 'application/octet-stream';
}

async function main() {
  await signInAsAdmin();

  const mappingPath = path.join(__dirname, 'press.json');
  const pressFeatures = JSON.parse(fs.readFileSync(mappingPath, 'utf-8'));

  let successCount = 0;
  let failCount = 0;

  for (const feature of pressFeatures) {
    let logoUrl = null;

    if (feature.file) {
      const localPath = path.join(__dirname, 'logos', feature.file);

      if (!fs.existsSync(localPath)) {
        console.error(`Skipping logo for ${feature.publisher}: ${feature.file} not found locally.`);
        failCount++;
        continue;
      }

      const fileBuffer = fs.readFileSync(localPath);

      // 1. Upload to Storage
      const { error: uploadError } = await supabase.storage
        .from(BUCKET)
        .upload(feature.file, fileBuffer, {
          contentType: contentTypeFor(feature.file),
          upsert: true, // overwrite if re-running
        });

      if (uploadError) {
        console.error(`Upload failed for ${feature.publisher}:`, uploadError.message);
        failCount++;
        continue;
      }

      // 2. Get public URL
      const { data: publicUrlData } = supabase.storage
        .from(BUCKET)
        .getPublicUrl(feature.file);
      logoUrl = publicUrlData.publicUrl;
    } else {
      console.warn(`No local logo for ${feature.publisher}, inserting without article_logo_url.`);
    }

    // 3. Insert into press table
    const { error: insertError } = await supabase.from(TABLE).insert({
      publisher: feature.publisher,
      description: feature.description,
      article_url: feature.article_url,
      article_logo_url: logoUrl,
    });

    if (insertError) {
      console.error(`DB insert failed for ${feature.publisher}:`, insertError.message);
      failCount++;
      continue;
    }

    console.log(`Done: ${feature.publisher}${logoUrl ? ` -> ${feature.file}` : ' (no logo)'}`);
    successCount++;
  }

  console.log(`\nFinished. ${successCount} succeeded, ${failCount} failed.`);

  await supabase.auth.signOut();
}

main().catch((err) => {
  console.error('Fatal error:', err);
  process.exit(1);
});
