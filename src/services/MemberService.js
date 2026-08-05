import { supabase } from "../lib/supabase";
import { feature } from "topojson-client";
import worldCountries from "world-atlas/countries-50m.json";
import usStates from "us-atlas/states-10m.json";

function extractNames(topology) {
    const objectKey = Object.keys(topology.objects)[0]
    return feature(topology, topology.objects[objectKey]).features
        .map((f) => f.properties.name)
        .sort((a, b) => a.localeCompare(b))
}

export const countryOptions = extractNames(worldCountries)
export const usStateOptions = extractNames(usStates)

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
export async function getExecutives() {
    const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .in('role', ['exec_board', 'admin'])

    return { data, error }
}


export async function getRegions() {
    const { data, error } = await supabase
        .from('regions')
        .select('name')
    return { data, error }
}

export async function getRegion(name) {
    const { data, error } = await supabase
        .from('regions')
        .select('id, name, image_url')
        .eq('name', name)
        .single()

    return { data, error }
}

export async function getTeams(regionID) {
    const { data, error } = await supabase
        .from('teams')
        .select('id, discipline')
        .eq('region_id', regionID)

    return { data, error }
}

export async function getRDs(teamID) {
    const { data, error } = await supabase
        .from('profiles')
        .select('id, full_name, headshot_url, team_id')
        .in('role', ['rd'])
        .eq('team_id', teamID)

    return { data, error }
}

export async function getPendingRDs(teamID) {
    const { data, error } = await supabase
        .from('pending_rds')
        .select('id, name, team_id')
        .eq('team_id', teamID)

    return { data, error }
}

export async function getRegionMembers(teamID) {
    const { data, error } = await supabase
        .from('team_members')
        .select('id, name, headshot_url, role, team_id')
        .eq('team_id', teamID)

    return { data, error }
}

export async function getEvents(regionID) {
    const { data, error } = await supabase
        .from('events')
        .select('id, event_date, content, image_url')
        .eq('region_id', regionID)

    return { data, error }
}