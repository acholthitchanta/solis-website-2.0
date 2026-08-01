import { supabase } from "../lib/supabase";

export async function getSponsors(){
    const {data: files, error} = await supabase.storage
        .from('sponsors')
        .list()
    
    if(error){
        console.error(error)
        return []
    }

    return files.map((file) =>{
        const {data} = supabase.storage.from('sponsors').getPublicUrl(file.name)
        return data.publicUrl
    })
}

export async function getReviews(){
    const {data, error} = await supabase
        .from('reviews')
        .select('*')
    
    return {data, error}
}

export async function getPress(){
    const {data, error} = await supabase
        .from('press')
        .select('*')
    
    return {data,error}
}


export async function getBlogs(){
    const { data, error } = await supabase
        .from('blogs')
        .select('*')
        .order('date', { ascending: false });

    return {data,error}
}

export async function getBlog(slug){
    const {data,error} = await supabase
        .from('blogs')
        .select('*')
        .eq('slug', slug)
        .single()
    
    return {data,error}
}