'use client'

import { useRouter } from 'next/navigation'
import Image from 'next/image'
import { useEffect, useState } from 'react'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'

export default function UserAvatar() {
    const [isLoggedIn, setIsLoggedIn] = useState(false)
    const [showDropdown, setShowDropdown] = useState(false)
    const router = useRouter()
    const supabase = createClientComponentClient()

    useEffect(() => {
        checkUser()
    }, [])

    async function checkUser() {
        const { data: { session } } = await supabase.auth.getSession()
        setIsLoggedIn(!!session)
    }

    const handleAvatarClick = () => {
        if (isLoggedIn) {
            setShowDropdown(!showDropdown)
        } else {
            router.push('/login')
        }
    }

    const handleLogout = async () => {
        await supabase.auth.signOut()
        setIsLoggedIn(false)
        setShowDropdown(false)
        router.push('/')
        router.refresh()
    }

    const handleAdminClick = () => {
        router.push('/admin')
        setShowDropdown(false)
    }

    return (
        <div className="relative">
            <button
                onClick={handleAvatarClick}
                className="relative w-8 h-8 rounded-full overflow-hidden hover:opacity-80 transition-opacity bg-white p-0.5"
                title={isLoggedIn ? "点击查看选项" : "登录"}
            >
                <Image
                    src="/images/avatars/Freedom.png"
                    alt={isLoggedIn ? "用户头像" : "未登录"}
                    width={32}
                    height={32}
                    className="object-cover rounded-full"
                />
            </button>

            {isLoggedIn && showDropdown && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-10">
                    <button
                        onClick={handleAdminClick}
                        className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    >
                        管理后台
                    </button>
                    <button
                        onClick={handleLogout}
                        className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    >
                        退出登录
                    </button>
                </div>
            )}
        </div>
    )
} 