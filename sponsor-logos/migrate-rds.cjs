/**
 * migrate-rds.cjs
 * ----------------------
 * Creates Supabase Auth users + `profiles` rows for regional directors listed
 * in regional-directors.json, links each one to their team via
 * `profiles.team_id`, and inserts a matching `team_members` row (role:
 * 'Regional Director') so they show up in their team's listing.
 *
 * Also downloads each director's real headshot from Firebase Storage
 * (matched by name against Firestore's `users` collection, since
 * regional-directors.json only has name + email, not a Firestore doc id),
 * compresses/converts it with sharp, and uploads it to the Supabase
 * `headshots` bucket. Any failure along the way (no name match, missing
 * file, corrupt/unsupported image) just leaves headshot_url null instead of
 * crashing the run -- same catch-all approach as migrate-regions.cjs.
 *
 * Anyone with `email: null` in regional-directors.json is skipped entirely --
 * no auth account, no profile, no team_members row, no headshot lookup.
 * Their team just has no director until a real profile is created for them.
 *
 * Uses the SERVICE ROLE key (same reasoning as create-executives.cjs):
 * creating auth users via the admin API, and inserting profiles/team_members
 * on someone else's behalf, both require bypassing RLS.
 *
 * SETUP:
 *   npm install dotenv @supabase/supabase-js firebase-admin sharp
 *
 * USAGE:
 *   node migrate-rds.cjs
 *
 * All accounts are created with the same temporary password: "solisluna"
 * (same convention as create-executives.cjs).
 */

require('dotenv').config();
const fs = require('fs');
const path = require('path');
const { createClient } = require('@supabase/supabase-js');
const { initializeApp, cert } = require('firebase-admin/app');
const { getFirestore } = require('firebase-admin/firestore');
const { getStorage } = require('firebase-admin/storage');
const sharp = require('sharp');

const SUPABASE_URL = process.env.VITE_SUPABASE_URL;
const SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;
const TEMP_PASSWORD = 'solisluna';
const HEADSHOTS_BUCKET = 'headshots';

if (!SUPABASE_URL || !SERVICE_ROLE_KEY) {
  console.error('Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY env vars.');
  process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SERVICE_ROLE_KEY, {
  auth: { autoRefreshToken: false, persistSession: false },
});

const serviceAccount = require(path.join(__dirname, 'firebase-service-account.json'));
const firebaseApp = initializeApp({
  credential: cert(serviceAccount),
  storageBucket: process.env.FIREBASE_STORAGE_BUCKET,
});
const db = getFirestore(firebaseApp);
const bucket = getStorage(firebaseApp).bucket();

// same overrides used in migrate-regions.cjs, to decode a region string like
// "new-jersey:bergen-county---art" into its base region + discipline
const DISCIPLINE_OVERRIDES = {
  'new-jersey:bergen-county---art': { baseRegion: 'new-jersey:bergen-county', discipline: 'art' },
  'new-jersey:bergen-county-fashion': { baseRegion: 'new-jersey:bergen-county', discipline: 'fashion' },
  'new-jersey:bergen-county-nail-art': { baseRegion: 'new-jersey:bergen-county', discipline: 'nail art' },
  'new-york:manhattan-county-art': { baseRegion: 'new-york:manhattan-county', discipline: 'art' },
  'washington:king-county-art': { baseRegion: 'washington:king-county', discipline: 'art' },
  'arkansas:washington-county-art': { baseRegion: 'arkansas:washington-county', discipline: 'art' },
};

async function ensureBucketExists(bucketName) {
  const { data: buckets, error } = await supabase.storage.listBuckets();
  if (error) throw error;
  const exists = buckets.some((b) => b.name === bucketName);
  if (!exists) {
    console.log(`BUCKET "${bucketName}" not found, creating it as public...`);
    const { error: createError } = await supabase.storage.createBucket(bucketName, {
      public: true,
    });
    if (createError) throw createError;
  }
}

async function findTeamId(regionString) {
  const override = DISCIPLINE_OVERRIDES[regionString];
  const baseRegion = override ? override.baseRegion : regionString;
  const discipline = override ? override.discipline : 'music';

  const { data: regionData, error: regionError } = await supabase
    .from('regions')
    .select('id')
    .eq('name', baseRegion);
  if (regionError) throw regionError;
  if (regionData.length === 0) return null;

  const { data: teamData, error: teamError } = await supabase
    .from('teams')
    .select('id')
    .eq('region_id', regionData[0].id)
    .eq('name', `${baseRegion}-${discipline}`);
  if (teamError) throw teamError;
  if (teamData.length === 0) return null;

  return teamData[0].id;
}

// builds a lookup of every Firestore user, keyed by normalized full name,
// since regional-directors.json only has name + email, not a Firestore id
async function buildUsersByName() {
  const snapshot = await db.collection('users').get();
  const map = new Map();
  for (const doc of snapshot.docs) {
    const data = doc.data();
    if (!data.fullName) continue;
    map.set(data.fullName.trim().toLowerCase(), data);
  }
  return map;
}

async function getHeadshotUrl(personName, userId, usersByName) {
  const user = usersByName.get(personName.trim().toLowerCase());
  if (!user) {
    console.warn(`No Firestore user match for "${personName}" -- no headshot.`);
    return null;
  }
  if (!user.pfpURL) {
    return null;
  }

  let pfpFile = user.pfpURL;
  const dotIndex = pfpFile.lastIndexOf('.');
  if (
    dotIndex !== -1 &&
    pfpFile.substring(dotIndex) !== '.HEIC' &&
    pfpFile.substring(dotIndex) !== '.heic' &&
    pfpFile.substring(dotIndex) !== '.JPG' &&
    pfpFile.substring(dotIndex) !== '.JPEG'
  ) {
    const baseName = pfpFile.substring(0, dotIndex);
    const ext = pfpFile.substring(dotIndex);
    pfpFile = `${baseName}_500x500${ext}`;
  }

  try {
    const [buffer] = await bucket.file('members/' + pfpFile).download();
    const outputBuffer = await sharp(buffer)
      .resize(500, 500)
      .jpeg()
      .flatten({ background: '#ffffff' })
      .toBuffer();

    const { error: uploadError } = await supabase.storage
      .from(HEADSHOTS_BUCKET)
      .upload(userId + '.jpeg', outputBuffer, {
        contentType: 'image/jpeg',
        upsert: true,
      });
    if (uploadError) throw uploadError;

    const { data: publicURLData } = supabase.storage
      .from(HEADSHOTS_BUCKET)
      .getPublicUrl(userId + '.jpeg');

    console.log(`headshot uploaded for ${personName}`);
    return publicURLData.publicUrl;
  } catch (err) {
    console.error(`headshot failed for ${personName} (${pfpFile}): ${err.message}`);
    return null;
  }
}

async function upsertProfile(userId, person, teamId, headshotUrl) {
  const { error: profileError } = await supabase.from('profiles').upsert({
    id: userId,
    full_name: person.name,
    email: person.email,
    role: 'rd',
    team_id: teamId,
    headshot_url: headshotUrl,
  });

  if (profileError) {
    console.error(`Profile creation failed for ${person.email}:`, profileError.message);
    return false;
  }
  return true;
}

async function addDirectorAsTeamMember(teamId, person, headshotUrl) {
  // idempotent, so re-running this script is safe
  const { data: existing, error: lookupError } = await supabase
    .from('team_members')
    .select('id')
    .eq('team_id', teamId)
    .eq('name', person.name);
  if (lookupError) throw lookupError;
  if (existing.length > 0) return;

  const { error: insertError } = await supabase.from('team_members').insert({
    team_id: teamId,
    name: person.name,
    role: 'Regional Director',
    headshot_url: headshotUrl,
  });
  if (insertError) {
    console.error(`team_members insert failed for ${person.name}:`, insertError.message);
  }
}

async function main() {
  await ensureBucketExists(HEADSHOTS_BUCKET);

  const rosterPath = path.join(__dirname, 'regional-directors.json');
  const roster = JSON.parse(fs.readFileSync(rosterPath, 'utf-8'));

  const usersByName = await buildUsersByName();

  let successCount = 0;
  let skippedCount = 0;
  let failCount = 0;

  for (const person of roster) {
    if (!person.email) {
      console.log(`Skipping ${person.name} (${person.region}) -- no email, discarding.`);
      skippedCount++;
      continue;
    }

    const teamId = await findTeamId(person.region);
    if (!teamId) {
      console.error(`No matching team found for ${person.name} (${person.region}). Run migrate-regions.cjs first?`);
      failCount++;
      continue;
    }

    // 1. Create the auth user
    const { data: userData, error: createError } = await supabase.auth.admin.createUser({
      email: person.email,
      password: TEMP_PASSWORD,
      email_confirm: true,
    });

    let userId;
    if (createError) {
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
    }

    // 2. Grab their real headshot from Firebase, if we can find one
    const headshotUrl = await getHeadshotUrl(person.name, userId, usersByName);

    // 3. Insert/update profiles row, linked to their team
    const profileOk = await upsertProfile(userId, person, teamId, headshotUrl);
    if (!profileOk) {
      failCount++;
      continue;
    }

    // 4. Add them to team_members so they show up in the team listing
    await addDirectorAsTeamMember(teamId, person, headshotUrl);

    console.log(`Done: ${person.name} (${person.email}) -> team ${person.region}`);
    successCount++;
  }

  console.log(`\nFinished. ${successCount} succeeded, ${skippedCount} skipped (no email), ${failCount} failed.`);
  console.log(`Temporary password for all new accounts: "${TEMP_PASSWORD}" -- have everyone change it after first login.`);
}

main().catch((err) => {
  console.error('Fatal error:', err);
  process.exit(1);
});
