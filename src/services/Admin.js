import { supabase } from "../lib/supabase";


export function slugify(name) {
    return name
        .toLowerCase()
        .trim()
        .replace(/[^a-z0-9\s-]/g, '')  
        .replace(/\s+/g, '-')           // replace spaces with hyphens
        .replace(/-+/g, '-')            // collapse multiple hyphens into one
}


export async function addBlog({title, author, description, imageURL, date, category, content}){
    const {error} = await supabase
        .from('blogs')
        .insert({
            title: title,
            author: author,
            content: content,
            description: description,
            image_url: imageURL,
            date: date,
            category: category,
            slug: slugify(title)
        })
    
    if(error) throw error
}

export async function deleteBlog(id){
    const {data, error} = await supabase
        .from('blogs')
        .delete()
        .eq('id', id)
        .select()

    if (error) throw error
    if (!data || data.length === 0) throw new Error('Blog not found or you do not have permission to delete it')
}

export async function uploadBlogImage(file){
    const bitmap = await createImageBitmap(file);
    const MAX_DIM = 1600;
    const scale = Math.min(1, MAX_DIM / Math.max(bitmap.width, bitmap.height));
    const w = Math.round(bitmap.width * scale);
    const h = Math.round(bitmap.height * scale);

    const canvas = document.createElement('canvas');
    canvas.width = w;
    canvas.height = h;
    const ctx = canvas.getContext('2d');
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0,0,w,h);
    ctx.drawImage(bitmap, 0,0,w,h)

    let blob = await new Promise(resolve => canvas.toBlob(resolve, 'image/jpeg', 0.85));
    let quality = 0.75;
    while (blob.size > 150_000 && quality >= 0.4) {
        blob = await new Promise(resolve => canvas.toBlob(resolve, 'image/jpeg', quality));
        quality -= 0.1;
    }
    
    const key =  `${crypto.randomUUID()}.jpeg`

    //upload the file
    const {error: uploadError} = await supabase.storage
        .from('blogs')
        .upload(key, blob,{
            contentType: 'image/jpeg',
        });
    
    if (uploadError) throw uploadError;
    
    const {data} = supabase.storage.from('blogs').getPublicUrl(key)
    
    return data.publicUrl
}

export async function editBlog(id, {title, author,category, description, imageURL, content}){
    const updates = {}

    if (author !== undefined) updates.author = author
    if (category !== undefined) updates.category = category
    if (description !== undefined) updates.description = description
    if (imageURL !== undefined) updates.image_url = imageURL
    if (content !== undefined) updates.content = content

    const {data, error} = await supabase
        .from('blogs')
        .update(updates)
        .eq('id', id)
        .select()

    if (error) throw error
    if (!data || data.length === 0) throw new Error('Blog not found or you do not have permission to edit it')

}


export async function uploadRegionImage(file){
    const bitmap = await createImageBitmap(file);
    const MAX_DIM = 2000;
    const scale = Math.min(1, MAX_DIM / Math.max(bitmap.width, bitmap.height));
    const w = Math.round(bitmap.width * scale);
    const h = Math.round(bitmap.height * scale);

    const canvas = document.createElement('canvas');
    canvas.width = w;
    canvas.height = h;
    const ctx = canvas.getContext('2d');
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0,0,w,h);
    ctx.drawImage(bitmap, 0,0,w,h)

    let blob = await new Promise(resolve => canvas.toBlob(resolve, 'image/jpeg', 0.85));
    let quality = 0.75;
    while (blob.size > 150_000 && quality >= 0.4) {
        blob = await new Promise(resolve => canvas.toBlob(resolve, 'image/jpeg', quality));
        quality -= 0.1;
    }
    
    const key =  `${crypto.randomUUID()}.jpeg`

    //upload the file
    const {error: uploadError} = await supabase.storage
        .from('regions')
        .upload(key, blob,{
            contentType: 'image/jpeg',
        });
    
    if (uploadError) throw uploadError;
    
    const {data} = supabase.storage.from('regions').getPublicUrl(key)
    
    return data.publicUrl
}

export async function addRegion({country, state, county, imageURL}){
    let name = ''

    if (state){
        name = `${country}:${state}:${county}`
    }
    else{
        name = `${country}:${county}`
    }

    const {error} = await supabase
        .from('regions')
        .insert({
            name: name,
            country: country,
            image_url: imageURL || null
        })

    if (error) throw error;
}

export async function addTeam({region_name, region_id, discipline}){
    //name in this format usa:new-jersey:bergen-county-art
    const {error} = await supabase
        .from('teams')
        .insert({
            name: `${region_name}-${discipline}`,
            region_id: region_id,
            discipline: discipline
        })
    
    if (error) throw error
}

export async function addEvent({region_id, date, title, content, imageURL}){
    const {error} = await supabase
        .from('events')
        .insert({
            content: `${title}: ${content}`,
            event_date: date,
            image_url: imageURL,
            region_id: region_id
        })
    
    if (error) throw error
}


export async function uploadEventImage(file){
    const bitmap = await createImageBitmap(file);
    const MAX_DIM = 1000;
    const scale = Math.min(1, MAX_DIM / Math.max(bitmap.width, bitmap.height));
    const w = Math.round(bitmap.width * scale);
    const h = Math.round(bitmap.height * scale);

    const canvas = document.createElement('canvas');
    canvas.width = w;
    canvas.height = h;
    const ctx = canvas.getContext('2d');
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0,0,w,h);
    ctx.drawImage(bitmap, 0,0,w,h)

    let blob = await new Promise(resolve => canvas.toBlob(resolve, 'image/jpeg', 0.85));
    let quality = 0.75;
    while (blob.size > 150_000 && quality >= 0.4) {
        blob = await new Promise(resolve => canvas.toBlob(resolve, 'image/jpeg', quality));
        quality -= 0.1;
    }
    
    const key =  `${crypto.randomUUID()}.jpeg`

    //upload the file
    const {error: uploadError} = await supabase.storage
        .from('events')
        .upload(key, blob,{
            contentType: 'image/jpeg',
        });
    
    if (uploadError) throw uploadError;
    
    const {data} = supabase.storage.from('events').getPublicUrl(key)
    
    return data.publicUrl
}
export async function uploadMemberHeadshot(file){
    const bitmap = await createImageBitmap(file);
    const MAX_DIM = 500;
    const scale = Math.min(1, MAX_DIM / Math.max(bitmap.width, bitmap.height));
    const w = Math.round(bitmap.width * scale);
    const h = Math.round(bitmap.height * scale);

    const canvas = document.createElement('canvas');
    canvas.width = w;
    canvas.height = h;
    const ctx = canvas.getContext('2d');
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0,0,w,h);
    ctx.drawImage(bitmap, 0,0,w,h)

    let blob = await new Promise(resolve => canvas.toBlob(resolve, 'image/jpeg', 0.85));
    let quality = 0.75;
    while (blob.size > 150_000 && quality >= 0.4) {
        blob = await new Promise(resolve => canvas.toBlob(resolve, 'image/jpeg', quality));
        quality -= 0.1;
    }
    
    const key =  `${crypto.randomUUID()}.jpeg`

    //upload the file
    const {error: uploadError} = await supabase.storage
        .from('members')
        .upload(key, blob,{
            contentType: 'image/jpeg',
        });
    
    if (uploadError) throw uploadError;
    
    const {data} = supabase.storage.from('members').getPublicUrl(key)
    
    return data.publicUrl
}

export async function addMember({team_id, name, headshotURL, role}){
    const {error} = await supabase
        .from('team_members')
        .insert({
            team_id: team_id,
            name: name,
            headshot_url: headshotURL,
            role: role
        })

    if (error) throw error
}

export async function editMember(id, {name, role, headshotURL}){
    const updates = {}

    if (name !== undefined) updates.name = name
    if (role !== undefined) updates.role = role
    if (headshotURL !== undefined) updates.headshot_url = headshotURL

    const {data, error} = await supabase
        .from('team_members')
        .update(updates)
        .eq('id', id)
        .select()

    if (error) throw error
    if (!data || data.length === 0) throw new Error('Member not found or you do not have permission to edit it')
}

export async function deleteMember(id){
    const {data, error} = await supabase
        .from('team_members')
        .delete()
        .eq('id', id)
        .select()

    if (error) throw error
    if (!data || data.length === 0) throw new Error('Member not found or you do not have permission to delete it')
}

export async function editEvent(id, {title, date, content, imageURL}){
    const updates = {
        content: `${title}: ${content}`,
        event_date: date,
    }

    if (imageURL !== undefined) updates.image_url = imageURL

    const {data, error} = await supabase
        .from('events')
        .update(updates)
        .eq('id', id)
        .select()

    if (error) throw error
    if (!data || data.length === 0) throw new Error('Event not found or you do not have permission to edit it')
}

export async function deleteEvent(id){
    const {data, error} = await supabase
        .from('events')
        .delete()
        .eq('id', id)
        .select()

    if (error) throw error
    if (!data || data.length === 0) throw new Error('Event not found or you do not have permission to delete it')
}

export async function deleteRegionImage(imageUrl){
    if (!imageUrl) return

    const key = imageUrl.split('/regions/').pop()
    const {error} = await supabase.storage.from('regions').remove([key])

    if (error) throw error
}

export async function updateRegionImage(id, imageURL){
    const {data, error} = await supabase
        .from('regions')
        .update({image_url: imageURL})
        .eq('id', id)
        .select()

    if (error) throw error
    if (!data || data.length === 0) throw new Error('Region not found or you do not have permission to edit it')
}