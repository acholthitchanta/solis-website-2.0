require('dotenv').config();
const path = require('path');
const {initializeApp, cert} = require('firebase-admin/app');
const {getFirestore} = require('firebase-admin/firestore');
const {getStorage} = require('firebase-admin/storage');
const {createClient} = require('@supabase/supabase-js')

// supabase init

const SUPABASE_URL = process.env.VITE_SUPABASE_URL;
const SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;
const BUCKET = 'gallery';

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

const sharp = require('sharp');

const serviceAccount = require(path.join(__dirname, 'firebase-service-account.json'));

const app =initializeApp({
    credential: cert(serviceAccount),
    storageBucket: process.env.FIREBASE_STORAGE_BUCKET,
})

const db = getFirestore(app);
const bucket = getStorage(app).bucket();

async function main(){
    await ensureBucketExists();

    const [files] = await bucket.getFiles({ prefix: 'gallery/'});
    console.log(`Found ${files.length} picture(s) in Firestore.`);
    let failCount = 0;
    let successCount = 0;

    for (const file of files){
        if(file.name.endsWith("/")) continue;
        const blog = file.name;
        const [buffer] = await file.download();

        console.log(`Downloaded ${blog} - ${buffer.length} bytes`)

        const metadata = await sharp(buffer).metadata();
        console.log('original dimensions:', metadata.width,'x', metadata.height, 'is transparent?', metadata.hasAlpha)

        let outputBuffer = await sharp(buffer).jpeg().flatten({background: '#ffffff'}).toBuffer();

        let attempts = 0;

        while (attempts < 5 && outputBuffer.length > 150_000){
            outputBuffer = await sharp(outputBuffer).jpeg({quality:80 - 5*attempts}).toBuffer();
            attempts += 1;
        }
        console.log(`new file size: ${outputBuffer.length} bytes`);

        //upload the file
        const {error: uploadError} = await supabase.storage
            .from(BUCKET)
            .upload(path.basename(file.name) + '.jpeg', outputBuffer,{
                contentType: 'image/jpeg',
                upsert: true,
            });
        
        if (uploadError){
            console.error(`Upload failed for ${file}:`, uploadError.message);
            failCount ++;
            continue;
        }

        //get public url
        const {data: publicURLData} = supabase.storage
            .from(BUCKET)
            .getPublicUrl(file.name +'.jpeg');
        
        const blogPicUrl = publicURLData.publicUrl;

        //add blog data & blog picture to database
        const {error: createError, data: newData} = await supabase
            .from('gallery')
            .insert({image_url: blogPicUrl})
            .select();
        

        if (createError){
            console.error(`Blog creation failed for ${file}`, createError.message);
            failCount++;
            continue;
        }
        
        if (!newData || newData.length ===0){
            console.warn(`no blog found for ${file}- image uploaded, but no row created.`)
            failCount++;
            continue
        }

        console.log(`Done: ${file}`);
        successCount ++;


        console.log('\n')

    }

    console.log(`\n Finished. ${successCount} succeeded, ${failCount} failed.`)

}

main().catch((err) =>{
    console.error('Error: ', err);
    process.exit(1);
})