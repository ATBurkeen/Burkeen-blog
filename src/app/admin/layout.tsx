'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import AdminSidebar from '@/components/AdminSidebar'

export default function AdminLayout({
    children,
}: {
    children: React.ReactNode
}) {
    const router = useRouter()
    const supabase = createClientComponentClient()

    useEffect(() => {
        const checkAuth = async () => {
            const { data: { user }, error } = await supabase.auth.getUser()
            if (error || !user) {
                router.push('/')
            }
        }

        checkAuth()
    }, [router, supabase])

    return (
        <div className="min-h-screen pt-16">
            <AdminSidebar />
            <div className="pr-64">
                <div className="container mx-auto px-4 py-8">
                    {children}
                </div>
            </div>
        </div>
    )
} 