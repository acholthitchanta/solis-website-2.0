/**
 * upload-headshots.cjs
 * ----------------------
 * Uploads each headshot in headshots.json to a "headshots" Storage bucket,
 * then updates that person's `profiles.headshot_url` with the public URL.
 *
 * Uses the SERVICE ROLE key (same one from create-executives.cjs) because:
 *   - it can create the bucket itself if it doesn't exist yet
 *   - it can update OTHER users' profiles rows, which the anon key can't
 *     do even signed in as an admin unless you add a matching RLS policy
 *
 * SETUP:
 *   npm install dotenv @supabase/supabase-js
 *
 * .env file needs:
 *   SUPABASE_URL=https://xxxx.supabase.co
 *   SUPABASE_SERVICE_ROLE_KEY=xxxx
 *
 * USAGE:
 *   node upload-headshots.cjs
 *
 * Run from the folder containing this script, headshots.json, and the
 * actual .jpg files (e.g. the headshots-compressed folder).
 */

require('dotenv').config();
const fs = require('fs');
const path = require('path');
const { createClient } = require('@supabase/supabase-js');

const SUPABASE_URL = process.env.VITE_SUPABASE_URL;
const SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;
const BUCKET = 'headshots';

if (!SUPABASE_URL || !SERVICE_ROLE_KEY) {
  console.error('Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY env vars.');
  process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SERVICE_ROLE_KEY, {
  auth: { autoRefreshToken: false, persistSession: false },
});

async function ensureBucketExists() {
  const { data: buckets, error } = await supabase.storage.listBuckets();
  if (error) throw error;
  const exists = buckets.some((b) => b.name === BUCKET);
  if (!exists) {
    console.log(`Bucket "${BUCKET}" not found, creating it as public...`);
    const { error: createError } = await supabase.storage.createBucket(BUCKET, {
      public: true,
    });
    if (createError) throw createError;
  }
}

async function main() {
  await ensureBucketExists();

  const mappingPath = path.join(__dirname, 'headshots.json');
  const people = JSON.parse(fs.readFileSync(mappingPath, 'utf-8'));

  let successCount = 0;
  let failCount = 0;

  for (const person of people) {
    const localPath = path.join(__dirname, person.file);

    if (!fs.existsSync(localPath)) {
      console.error(`Skipping ${person.file}: file not found locally.`);
      failCount++;
      continue;
    }

    const fileBuffer = fs.readFileSync(localPath);

    // 1. Upload to Storage
    const { error: uploadError } = await supabase.storage
      .from(BUCKET)
      .upload(person.file, fileBuffer, {
        contentType: 'image/jpeg',
        upsert: true,
      });

    if (uploadError) {
      console.error(`Upload failed for ${person.file}:`, uploadError.message);
      failCount++;
      continue;
    }

    // 2. Get public URL
    const { data: publicUrlData } = supabase.storage
      .from(BUCKET)
      .getPublicUrl(person.file);
    const headshotUrl = publicUrlData.publicUrl;

    // 3. Update that person's profiles row by email
    const { error: updateError, data: updateData } = await supabase
      .from('profiles')
      .update({ headshot_url: headshotUrl })
      .eq('email', person.email)
      .select();

    if (updateError) {
      console.error(`Profile update failed for ${person.email}:`, updateError.message);
      failCount++;
      continue;
    }

    if (!updateData || updateData.length === 0) {
      console.warn(`No profile found for ${person.email} -- uploaded the image, but no row was updated. Check the email matches exactly.`);
      failCount++;
      continue;
    }

    console.log(`Done: ${person.file} -> ${person.email}`);
    successCount++;
  }

  console.log(`\nFinished. ${successCount} succeeded, ${failCount} failed.`);
}

main().catch((err) => {
  console.error('Fatal error:', err);
  process.exit(1);
});
