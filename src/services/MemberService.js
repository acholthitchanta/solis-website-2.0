import { supabase } from "../lib/supabase";

export async function fetchExecutives(){
    const {data, error} = await supabase
        .from('profiles')
        .select('*')
        .in('role', ['exec_board', 'admin'])
    
    return {data, error}

}