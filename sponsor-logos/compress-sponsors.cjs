/**
 * compress-sponsors.js
 * ---------------------
 * Downloads every image already in the `sponsors` Storage bucket, resizes
 * it to a max height of 300px via sharp, and re-uploads it in place
 * (overwriting the original). Filenames don't change, so existing
 * `sponsors.image_url` values in the DB keep working -- this only shrinks
 * the file size of what's already in the bucket.
 *
 * Uses the ANON key (same as your Vite app), which means every request
 * goes through Row Level Security -- so this script signs in as an admin
 * user first, the same way upload-sponsors.js does.
 *
 * SETUP:
 *   npm install   (sharp is already a listed dependency)
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
 *   node compress-sponsors.js
 *
 * Run from the sponsor-logos folder.
 */

require('dotenv').config();
const sharp = require('sharp');
const { createClient } = require('@supabase/supabase-js');

const SUPABASE_URL = process.env.VITE_SUPABASE_URL;
const ANON_KEY = process.env.VITE_SUPABASE_ANON_KEY;
const ADMIN_EMAIL = process.env.ADMIN_EMAIL;
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD;
const BUCKET = 'sponsors';
const TARGET_HEIGHT = 300;

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

function extensionOf(fileName) {
  return fileName.split('.').pop().toLowerCase();
}

function compressBuffer(buffer, fileName) {
  const resized = sharp(buffer).resize({ height: TARGET_HEIGHT, withoutEnlargement: true });

  switch (extensionOf(fileName)) {
    case 'png':
      return resized.png({ quality: 80, compressionLevel: 9 }).toBuffer();
    case 'jpg':
    case 'jpeg':
      return resized.jpeg({ quality: 75 }).toBuffer();
    case 'webp':
      return resized.webp({ quality: 75 }).toBuffer();
    default:
      console.warn(`Unrecognized extension for ${fileName}, resizing without format-specific compression.`);
      return resized.toBuffer();
  }
}

function contentTypeFor(fileName) {
  switch (extensionOf(fileName)) {
    case 'png': return 'image/png';
    case 'jpg':
    case 'jpeg': return 'image/jpeg';
    case 'webp': return 'image/webp';
    default: return 'application/octet-stream';
  }
}

async function main() {
  await signInAsAdmin();

  const { data: files, error: listError } = await supabase.storage.from(BUCKET).list();
  if (listError) {
    console.error('Could not list bucket contents:', listError.message);
    process.exit(1);
  }

  const images = files.filter((f) => /\.(png|jpe?g|webp)$/i.test(f.name));
  console.log(`Found ${images.length} image(s) to compress (skipping ${files.length - images.length} non-image entries).`);

  let successCount = 0;
  let failCount = 0;

  for (const file of images) {
    // 1. Download the original
    const { data: blob, error: downloadError } = await supabase.storage
      .from(BUCKET)
      .download(file.name);

    if (downloadError) {
      console.error(`Download failed for ${file.name}:`, downloadError.message);
      failCount++;
      continue;
    }

    const originalBuffer = Buffer.from(await blob.arrayBuffer());

    // 2. Resize + compress
    let compressedBuffer;
    try {
      compressedBuffer = await compressBuffer(originalBuffer, file.name);
    } catch (err) {
      console.error(`Compression failed for ${file.name}:`, err.message);
      failCount++;
      continue;
    }

    // 3. Re-upload, overwriting the original
    const { error: uploadError } = await supabase.storage
      .from(BUCKET)
      .upload(file.name, compressedBuffer, {
        contentType: contentTypeFor(file.name),
        upsert: true,
      });

    if (uploadError) {
      console.error(`Re-upload failed for ${file.name}:`, uploadError.message);
      failCount++;
      continue;
    }

    const savedPercent = (100 * (1 - compressedBuffer.length / originalBuffer.length)).toFixed(1);
    console.log(`Done: ${file.name} (${originalBuffer.length}B -> ${compressedBuffer.length}B, ${savedPercent}% smaller)`);
    successCount++;
  }

  console.log(`\nFinished. ${successCount} succeeded, ${failCount} failed.`);

  await supabase.auth.signOut();
}

main().catch((err) => {
  console.error('Fatal error:', err);
  process.exit(1);
});
