'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import UserAvatar from './UserAvatar'

export default function Header() {
    const pathname = usePathname()

    return (
        <nav className="bg-transparent backdrop-blur-sm">
            <div className="container mx-auto px-4">
                <div className="flex justify-between items-center h-16">
                    <Link href="/" className="text-xl font-bold text-white drop-shadow-sm hover:text-blue-200 transition-colors">
                        Burkeen&apos;s Blog
                    </Link>

                    <div className="flex items-center space-x-4">
                        <Link
                            href="/"
                            className={`drop-shadow-sm hover:text-blue-200 transition-colors ${pathname === '/' ? 'text-blue-200' : 'text-white'}`}
                        >
                            首页
                        </Link>
                        <Link
                            href="/tags"
                            className={`drop-shadow-sm hover:text-blue-200 transition-colors ${pathname === '/tags' ? 'text-blue-200' : 'text-white'}`}
                        >
                            标签
                        </Link>
                        <UserAvatar />
                    </div>
                </div>
            </div>
        </nav>
    )
} 