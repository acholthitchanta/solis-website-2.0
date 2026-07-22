require('dotenv').config();
const path = require('path');
const { initializeApp, cert } = require('firebase-admin/app');
const { getFirestore } = require('firebase-admin/firestore');
const { getStorage } = require('firebase-admin/storage');
const { createClient } = require('@supabase/supabase-js')

const SUPABASE_URL = process.env.VITE_SUPABASE_URL;
const SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;
let regionalDirectors = {};

if (!SUPABASE_URL || !SERVICE_ROLE_KEY) {
    console.error('Missing Supabase URL or Supabase service key');
    process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SERVICE_ROLE_KEY, {
    auth: { autoRefreshToken: false, persistSession: false }
})

//ensure bucket exists

async function ensureBucketExists(bucketName) {
    const { data: buckets, error } = await supabase.storage.listBuckets();
    if (error) throw error;
    const exists = buckets.some((b) => b.name === bucketName);
    if (!exists) {
        console.log(`BUCKET "${bucketName}" not found, creating it as public...`);
        const { error: createError } = await supabase.storage.createBucket(bucketName, {
            public: true,
        })
        if (createError) throw createError;
    }
}

async function addRegion(doc, region, discipline) {
    const dotIndex = doc.id.indexOf(':')
    const country = doc.id.slice(0, dotIndex);

    const { data, error } = await supabase.from('regions').select('id').eq('name', region);
    if (error) throw error;

    let regionId;
    if (data.length > 0) {
        regionId = data[0].id;
        console.log(`region already exists: ${region}`);
    } else {
        const { error: regionCreateError, data: newRegion } = await supabase
            .from('regions')
            .insert({
                name: region,
                country: country
            })
            .select();
        if (regionCreateError) throw regionCreateError;
        regionId = newRegion[0].id;
        console.log(`region added: ${region}, ${country}`);
    }

    //check if this team already exists, so re-running is safe
    const { data: existingTeam, error: teamLookupError } = await supabase
        .from('teams')
        .select('id')
        .eq('region_id', regionId)
        .eq('name', `${region}-${discipline}`);
    if (teamLookupError) throw teamLookupError;

    let teamId;
    if (existingTeam.length > 0) {
        teamId = existingTeam[0].id;
        console.log(`team already exists: ${region} - ${discipline}`);
    } else {
        const {error: createError, data: newTeam} = await supabase
            .from('teams')
            .insert({
                name: `${region}-${discipline}`,
                region_id: regionId,
                discipline: discipline
            })
            .select()

        if (createError){
            console.log("Error inserting team", createError.message)
            return
        }
        teamId = newTeam[0].id
        console.log(`team added: ${region} - ${discipline}`)
    }

    //events only belong to the region itself, not per-discipline teams,
    //so only process them once, on the base "music" pass
    if (discipline === 'music') {
        await addEvents(doc, regionId);
    }

    const members = await doc.ref.collection('members').get();


    //finding rd & adding members
    for (const person of members.docs) {
        const personData = person.data();

        const personId = person.id;
        const personName = personData.name;
        const personPosition = personData.position;

        //skipping rds, will add later w/ upload-headshots script
        if (personPosition === "Regional Director") {
            continue;
        }

        //skip if this member was already added, so re-running is safe
        //(and we don't waste time re-downloading their photo)
        const { data: existingMember, error: memberLookupError } = await supabase
            .from('team_members')
            .select('id')
            .eq('team_id', teamId)
            .eq('name', personName);
        if (memberLookupError) throw memberLookupError;
        if (existingMember.length > 0) {
            console.log(`${personName} already added, skipping`);
            continue;
        }

        //grabbing user's headshot

        const userDoc = await db.collection('users').doc(personId).get();
        const user = userDoc.data();
        let hasRealPhoto = false;
        let pfpFile;

        if (!user || !user.pfpURL){
            console.error('no user data exists, using placeholder.png');
        }
        else{
            const pfpdotIndex = user.pfpURL.lastIndexOf('.');

            if (pfpdotIndex !== -1 && user.pfpURL.substring(pfpdotIndex) !== ".HEIC"
            && user.pfpURL.substring(pfpdotIndex) !== ".heic" && user.pfpURL.substring(pfpdotIndex) !== ".JPG"
            && user.pfpURL.substring(pfpdotIndex) !== ".JPEG") {
                const baseName = user.pfpURL.substring(0, pfpdotIndex);
                const ext = user.pfpURL.substring(pfpdotIndex);
                user.pfpURL = `${baseName}_500x500${ext}`;
            }
            pfpFile = user.pfpURL;
            hasRealPhoto = true;
        }
        let outputBuffer;
        if (hasRealPhoto){
            try{
                const [buffer] = await bucket.file('members/' + pfpFile).download();
                console.log(`downloaded ${pfpFile} - ${buffer.length} bytes`)
                outputBuffer = await sharp(buffer).resize(500, 500).jpeg().flatten({background: '#ffffff'}).toBuffer();

                console.log('converted file to jpeg')
            }

            catch(err){
                console.error(`headshot failed for ${personName} (${pfpFile}): ${err.message}, using placeholder`);
                hasRealPhoto = false;
            }

        }
        if (hasRealPhoto){

            //upload the file
            const {error: uploadError} = await supabase.storage
                .from('members')
                .upload(personId + '.jpeg', outputBuffer,{
                    contentType: 'image/jpeg',
                    upsert: true,
                })
            if (uploadError){
                console.error(`Upload failed for ${personName}`, uploadError.message);
                hasRealPhoto = false;
            }
            else{
                console.log(`headshot uploaded for ${personName}`);
            }
        }

        let rawURL = hasRealPhoto? personId : 'solis';

        //get public url
        const {data: publicURLdata} = supabase.storage
            .from('members')
            .getPublicUrl(rawURL + '.jpeg');

        const headshotURL = publicURLdata.publicUrl;

        //add member data & member headshot to database
        const {error: memberCreateError, data: newData} = await supabase
            .from('team_members')
            .insert({
                team_id: teamId,
                name: personName,
                role: 'member',
                headshot_url: headshotURL
            })
            .select();

        if (memberCreateError){
            console.error(`member creation failed for ${personName}`, memberCreateError.message);
            continue;
        }

        if (!newData || newData.length ===0){
            console.warn(`no member found for ${personName}- image uploaded, but no row created.`)
            continue
        }

        console.log(`Done: ${personName}`);
    }
    console.log('\n')


}

async function addEvents(doc, regionId) {
    const eventsSnapshot = await doc.ref.collection('events').get();

    for (const eventDoc of eventsSnapshot.docs) {
        const eventId = eventDoc.id;
        const eventData = eventDoc.data();
        const eventName = eventData.name;
        const eventDescription = eventData.description;
        const eventDate = eventData.date ? eventData.date.toDate() : null;
        const content = eventName ? `${eventName}: ${eventDescription}` : eventDescription;

        //skip if this event already exists, so re-running is safe
        const { data: existingEvent, error: eventLookupError } = await supabase
            .from('events')
            .select('id')
            .eq('region_id', regionId)
            .eq('content', content);
        if (eventLookupError) throw eventLookupError;
        if (existingEvent.length > 0) {
            console.log(`event already exists: ${eventName}`);
            continue;
        }

        const { error: eventCreateError, data: newEvent } = await supabase
            .from('events')
            .insert({
                region_id: regionId,
                event_date: eventDate,
                content: content
            })
            .select();
        if (eventCreateError) {
            console.error(`event creation failed for ${eventName}`, eventCreateError.message);
            continue;
        }
        const newEventId = newEvent[0].id;
        console.log(`event added: ${eventName}`);

        //grabbing the event's photo - same catch-all approach as headshots,
        //any failure (missing file, bad format, whatever) just skips the image
        try {
            const [buffer] = await bucket.file(`events/${eventId}.jpg`).download();
            const outputBuffer = await sharp(buffer).resize(1600).jpeg().flatten({background: '#ffffff'}).toBuffer();

            const { error: uploadError } = await supabase.storage
                .from('events')
                .upload(newEventId + '.jpeg', outputBuffer, {
                    contentType: 'image/jpeg',
                    upsert: true,
                });
            if (uploadError) throw uploadError;

            const { data: publicURLData } = supabase.storage
                .from('events')
                .getPublicUrl(newEventId + '.jpeg');

            const { error: imageInsertError } = await supabase
                .from('event_images')
                .insert({
                    event_id: newEventId,
                    image_url: publicURLData.publicUrl
                });
            if (imageInsertError) {
                console.error(`event image row failed for ${eventName}`, imageInsertError.message);
            } else {
                console.log(`event image uploaded for ${eventName}`);
            }
        } catch (err) {
            console.error(`event image missing for ${eventName} (${eventId}.jpg), skipping image`);
        }
    }
}

const sharp = require('sharp');

const serviceAccount = require(path.join(__dirname, 'firebase-service-account.json'));

const app = initializeApp({
    credential: cert(serviceAccount),
    storageBucket: process.env.FIREBASE_STORAGE_BUCKET,
})

const db = getFirestore(app);
const bucket = getStorage(app).bucket();

const DISCIPLINE_OVERRIDES = {
    'new-jersey:bergen-county---art': { baseRegion: 'new-jersey:bergen-county', discipline: 'art' },
    'new-jersey:bergen-county-fashion': { baseRegion: 'new-jersey:bergen-county', discipline: 'fashion' },
    'new-jersey:bergen-county-nail-art': { baseRegion: 'new-jersey:bergen-county', discipline: 'nail art' },
    'new-york:manhattan-county-art': { baseRegion: 'new-york:manhattan-county', discipline: 'art' },
    'washington:king-county-art': { baseRegion: 'washington:king-county', discipline: 'art' },
    'arkansas:washington-county-art': { baseRegion: 'arkansas:washington-county', discipline: 'art' },
};

async function main() {
    await ensureBucketExists('regions');
    await ensureBucketExists('members');
    await ensureBucketExists('events');

    const snapshot = await db.collection('regions').get();
    console.log(`Found ${snapshot.size} region(s) in Firestore.`);
    let failCount = 0;
    let successCount = 0;

    for (const doc of snapshot.docs) {
        const region = doc.data();

        const override = DISCIPLINE_OVERRIDES[doc.id];
        const baseRegionId = override ? override.baseRegion : doc.id;
        const discipline = override ? override.discipline : 'music';

        await addRegion(doc, baseRegionId, discipline);

        //getting all the people of each region
        // for(const person of members){
        //     const personId = person.id;
        //     const document = await db.collection('users').doc(personId).get();

        //     let data = document.data();
        //     if (!data){
        //         console.error('no data exists');
        //         continue;
        //     }

        //     if (data.position ==="Regional Director"){
        //         console.log(`director: ${data.fullName}`)
        //     }
        //     else{
        //         console.log(`${data.fullName}`)
        //     }
        // }
        // console.log('\n')

        // const events = await doc.ref.collection('events').get();

        // if (region.picture){
        //     let picture = await bucket.file("regions/" + region.picture).getSignedUrl();
        // }



        // //upload the file
        // const {error: uploadError} = await supabase.storage
        //     .from(BUCKET)
        //     .upload(doc.id + '.jpeg', outputBuffer,{
        //         contentType: 'image/jpeg',
        //         upsert: true,
        //     });

        // if (uploadError){
        //     console.error(`Upload failed for ${blog.title}:`, uploadError.message);
        //     failCount ++;
        //     continue;
        // }

        // //get public url
        // const {data: publicURLData} = supabase.storage
        //     .from(BUCKET)
        //     .getPublicUrl(doc.id +'.jpeg');

        // const blogPicUrl = publicURLData.publicUrl;

        // //add blog data & blog picture to database
        // const {error: createError, data: newData} = await supabase
        //     .from('blogs')
        //     .insert({image_url: blogPicUrl, 
        //         author: blog.author, 
        //         title: blog.title, 
        //         description: blog.description, 
        //         content: blog.content,
        //         date: blog.date.toDate()})
        //     .select();


        // if (createError){
        //     console.error(`Blog creation failed for ${blog.title}`, createError.message);
        //     failCount++;
        //     continue;
        // }

        // if (!newData || newData.length ===0){
        //     console.warn(`no blog found for ${blog.title}- image uploaded, but no row created.`)
        //     failCount++;
        //     continue
        // }

        // console.log(`Done: ${blog.title}`);
        // successCount ++;


        // console.log('\n')

    }

    // console.log(`\n Finished. ${successCount} succeeded, ${failCount} failed.`)

}

main().catch((err) => {
    console.error('Error: ', err);
    process.exit(1);
})