require('dotenv').config();
const path = require('path');
const {initializeApp, cert} = require('firebase-admin/app');
const {getFirestore} = require('firebase-admin/firestore');
const {getStorage} = require('firebase-admin/storage');
const {createClient} = require('@supabase/supabase-js')

const SUPABASE_URL = process.env.VITE_SUPABASE_URL;
const SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;
const BUCKET = 'regions';

if (!SUPABASE_URL || !SERVICE_ROLE_KEY){
    console.error('Missing Supabase URL or Supabase service key');
    process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SERVICE_ROLE_KEY, {
    auth: {autoRefreshToken: false, persistSession: false}
})

//ensure bucket exists

async function ensureBucketExists(){
    const {data: buckets, error} = await supabase.storage.listBuckets();
    if (error) throw error;
    const exists = buckets.some((b) => b.name === BUCKET);
    if (!exists){
        console.log(`BUCKET "${BUCKET}" not found, creating it as public...`);
        const {error: createError} = await supabase.storage.createBucket(BUCKET,{
            public: true,
        })
        if (createError) throw createError;
    }
}

async function addRegion(doc, region, discipline){
    const dotIndex = doc.id.indexOf(':')
    const country = doc.id.slice(0,dotIndex);

    //check if region is already there, if not add it
    // let {data, error} = await supabase.from('regions').select('id').eq('name', region);
    // if (error) throw error;
    // if (data.length > 0) return data[0].id;
    // else{
    //     const {error: createError, data: newData} = await supabase
    //         .from('regions')
    //         .insert({
    //             name: region,
    //             country: country
    //         })
    //         .select()
    //     if (createError){
    //         console.error(`region creation failed for ${region}`, createError.message);
    //         return;
    //     }
    //     console.log(`region added: ${region}, ${country}`)

    // }

    const {data, error} = await supabase.from('regions').select('id').eq('name', region);

    //getting all team members & rd
    const memberIds = await doc.ref.collection('members').get();
    const members = memberIds.docs;
    let rd;

    for(const person of members){
        const personId = person.id;
        const document = await db.collection('users').doc(personId).get();

        let data = document.data();
        if (){
            console.error('no data exists');
            continue;
        }

        if (data.position ==="Regional Director"){
            console.log(`director: ${data.fullName}`)
            rd = data;
        }
    }
    console.log('\n')
    //adding the team
    const {error: createError, data: newData} = await supabase
        .from('teams')
        .insert({
            region_id: data,
            name: `${region}, discipline`,
            rd_id: 
        })


}

const sharp = require('sharp');

const serviceAccount = require(path.join(__dirname, 'firebase-service-account.json'));

const app =initializeApp({
    credential: cert(serviceAccount),
    storageBucket: process.env.FIREBASE_STORAGE_BUCKET,
})

const db = getFirestore(app);
const bucket = getStorage(app).bucket();

const DISCIPLINE_OVERRIDES = {
  'new-jersey:bergen-county---art': { baseRegion: 'new-jersey:bergen-county', discipline: 'Art' },
  'new-jersey:bergen-county-fashion': { baseRegion: 'new-jersey:bergen-county', discipline: 'Fashion' },
  'new-jersey:bergen-county-nail-art': { baseRegion: 'new-jersey:bergen-county', discipline: 'Nails' },
  'new-york:manhattan-county-art': { baseRegion: 'new-york:manhattan-county', discipline: 'Art' },
  'washington:king-county-art': { baseRegion: 'washington:king-county', discipline: 'Art' },
  'arkansas:washington-county-art': { baseRegion: 'arkansas:washington-county', discipline: 'Art' },
};

async function main(){
    await ensureBucketExists();

    const snapshot = await db.collection('regions').get();
    console.log(`Found ${snapshot.size} region(s) in Firestore.`);
    let failCount = 0;
    let successCount = 0;

    for (const doc of snapshot.docs){
        const region = doc.data();
        
        const override = DISCIPLINE_OVERRIDES[doc.id];
        const baseRegionId = override? override.baseRegion : doc.id;
        const discipline = override? override.discipline : 'Music';
        
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

main().catch((err) =>{
    console.error('Error: ', err);
    process.exit(1);
})