/**
 * update-blog-content.js
 * ------------------------
 * Updates the `content` column of every row in the `blogs` table to the
 * Markdown-formatted version in blogs-formatted.json, matching rows by
 * `slug`. Does not touch any other column (title, date, category, etc.)
 * and does not insert any new rows -- purely an UPDATE pass over existing
 * blog posts.
 *
 * Uses the ANON key (same as your Vite app), which means every request
 * goes through Row Level Security -- so this script signs in as an admin
 * user first, the same way upload-sponsors.js / upload-press.js do.
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
 *   node update-blog-content.js
 *
 * Run from the sponsor-logos folder (needs blogs-formatted.json alongside it).
 */

require('dotenv').config();
const fs = require('fs');
const path = require('path');
const { createClient } = require('@supabase/supabase-js');

const SUPABASE_URL = process.env.VITE_SUPABASE_URL;
const ANON_KEY = process.env.VITE_SUPABASE_ANON_KEY;
const ADMIN_EMAIL = process.env.ADMIN_EMAIL;
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD;
const TABLE = 'blogs';

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

async function main() {
  await signInAsAdmin();

  const jsonPath = path.join(__dirname, 'blogs-formatted.json');
  const blogs = JSON.parse(fs.readFileSync(jsonPath, 'utf-8'));

  let successCount = 0;
  let failCount = 0;

  for (const blog of blogs) {
    const { error, count } = await supabase
      .from(TABLE)
      .update({ content: blog.content })
      .eq('slug', blog.slug)
      .select('id', { count: 'exact' });

    if (error) {
      console.error(`Update failed for ${blog.slug}:`, error.message);
      failCount++;
      continue;
    }

    if (!count) {
      console.warn(`No row found with slug "${blog.slug}" -- skipped.`);
      failCount++;
      continue;
    }

    console.log(`Updated: ${blog.slug}`);
    successCount++;
  }

  console.log(`\nFinished. ${successCount} succeeded, ${failCount} failed.`);

  await supabase.auth.signOut();
}

main().catch((err) => {
  console.error('Fatal error:', err);
  process.exit(1);
});
