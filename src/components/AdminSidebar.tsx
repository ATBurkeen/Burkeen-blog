'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'

export default function AdminSidebar() {
    const pathname = usePathname()

    const menuItems = [
        {
            href: '/admin/posts/new',
            title: '创建新文章',
            description: '撰写并发布新的博客文章'
        },
        {
            href: '/admin/posts',
            title: '管理文章',
            description: '编辑或删除已有文章'
        },
        {
            href: '/admin/tags',
            title: '管理标签',
            description: '创建和组织文章标签'
        }
    ]

    return (
        <div className="fixed right-0 top-16 h-[calc(100vh-4rem)] w-64 bg-transparent">
            <nav className="h-full p-4">
                <ul className="space-y-3">
                    {menuItems.map((item) => (
                        <li key={item.href}>
                            <Link
                                href={item.href}
                                className={`block p-4 rounded-lg transition-all duration-200 backdrop-blur-sm
                                    ${pathname === item.href
                                        ? 'bg-white bg-opacity-90 shadow-lg transform -translate-x-2'
                                        : 'bg-white bg-opacity-50 hover:bg-opacity-70 hover:-translate-x-2'
                                    }`}
                            >
                                <h3 className="text-lg font-semibold text-gray-900 mb-1">
                                    {item.title}
                                </h3>
                                <p className="text-sm text-gray-600">
                                    {item.description}
                                </p>
                            </Link>
                        </li>
                    ))}
                </ul>
            </nav>
        </div>
    )
} 