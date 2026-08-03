import { supabase } from "../lib/supabase";


export function slugify(name) {
    return name.toLowerCase().replace(/\s+/g, '-')
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

    const {error} = await supabase
        .from('blogs')
        .update(updates)
        .eq('id', id)
    
    if (error) throw error

}