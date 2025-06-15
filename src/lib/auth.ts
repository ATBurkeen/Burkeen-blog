import { createServerComponentClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import { cache } from 'react'
import type { Profile } from '@/types/supabase'

export const createServerSupabaseClient = cache(() => {
    const cookieStore = cookies()
    return createServerComponentClient({ cookies: () => cookieStore })
})

export async function getSession() {
    const supabase = createServerSupabaseClient()
    try {
        const {
            data: { session },
        } = await supabase.auth.getSession()
        return session
    } catch (error) {
        console.error('Error:', error)
        return null
    }
}

export async function getProfile() {
    const supabase = createServerSupabaseClient()
    try {
        const { data: profile } = await supabase
            .from('profiles')
            .select('*')
            .single()
        return profile as Profile
    } catch (error) {
        console.error('Error:', error)
        return null
    }
}

export async function requireAdmin() {
    const profile = await getProfile()
    if (!profile || profile.role !== 'admin') {
        throw new Error('Unauthorized')
    }
    return profile
} 