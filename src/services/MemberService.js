import { supabase } from "../lib/supabase";


export function slugifyCountryName(name) {
    if (name === 'United States of America') return 'usa'
    return name.toLowerCase().replace(/\s+/g, '-')
}

export function formatSlugLabel(slug) {
    return slug
    .split('-')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ')
}
export function formatSlugRegion(slug) {
    const parts = slug.split(':')
    if (parts[0] === 'usa') parts.shift()
    return parts
    .reverse()
    .map((part) => formatSlugLabel(part))
    .join(', ')
}
export async function getExecutives(){
    const {data, error} = await supabase
        .from('profiles')
        .select('*')
        .in('role', ['exec_board', 'admin'])
    
    return {data, error}
}


export async function getRegions(){
    const {data, error} = await supabase
        .from('regions')
        .select('name')
    return {data, error}
}

export async function getRegion(name){
    const {data,error} = await supabase
        .from('regions')
        .select('id, name')
        .eq('name',name)
        .single()
    
    return {data,error}
}

export async function getTeams(regionID){
    const {data, error} = await supabase
        .from('teams')
        .select('id')
        .eq('region_id', regionID)

    return {data, error}
}

export async function getRDs(teamID){
    const {data, error} = await supabase
        .from('profiles')
        .select('full_name, headshot_url')
        .in('role', ['rd'])
        .eq('team_id', regionID)
    
    return {data, error}
}

export async function getRegionMembers(teamID){
    const {data,error} = await supabase
        .from('team_members')
        .select('full_name, headshot_url')
        .eq('team_id', teamID)
    
    return {data,error}
}

export async function getEvents(regionID){
    const {data,error} = await supabase
        .from('events')
        .select('event_date, content, image_url')
        .eq('region_id', regionID)
    
        return {data,error}
}