import Link from 'next/link'
import { requireAdmin } from '@/lib/auth'

export default function AdminPage() {
    return (
        <div className="backdrop-blur-sm bg-white bg-opacity-50 rounded-lg p-8">
            <h1 className="text-3xl font-bold mb-8">管理后台</h1>
            <p className="text-gray-600">
                欢迎来到管理后台！请从右侧选择要执行的操作。
            </p>
        </div>
    )
} 