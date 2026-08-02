import React, {useContext, useState, useEffect} from "react";
import { supabase } from "../lib/supabase";

const AuthContext = React.createContext()

export function useAuth(){
    return useContext(AuthContext)
}

const EDITOR_ROLES = ['exec_board', 'admin']

export function AuthProvider({children}){
    const [currentUser, setCurrentUser] = useState()
    const [profile, setProfile] = useState(null)
    const [loading, setLoading] = useState(true)

    async function login(email,password){
        const {data, error} = await supabase.auth.signInWithPassword({
        email: email,
        password: password
        })

        return {data, error}
    }

    async function logout(){
        const {error} = await supabase.auth.signOut();
        return {error}
    }

    useEffect(()=>{
        const {data: {subscription}} = supabase.auth.onAuthStateChange((event,session) =>{
            setCurrentUser(session?.user ?? null)
            setLoading(false)
        })
        return () => subscription.unsubscribe()
    }, [])

    const value = {
        currentUser,
        login,
        logout
    }

    return(
        <AuthContext.Provider value={value}>
            {!loading && children}
        </AuthContext.Provider>
    )
}
