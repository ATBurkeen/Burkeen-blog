'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'

interface PostActionsProps {
    postId: number
}

export default function PostActions({ postId }: PostActionsProps) {
    const [loading, setLoading] = useState(false)
    const router = useRouter()
    const supabase = createClientComponentClient()

    const handleDelete = async () => {
        if (!confirm('确定要删除这篇文章吗？')) {
            return
        }

        setLoading(true)
        try {
            // 删除文章的标签关联
            await supabase
                .from('post_tags')
                .delete()
                .eq('post_id', postId)

            // 删除文章
            const { error } = await supabase
                .from('posts')
                .delete()
                .eq('id', postId)

            if (error) throw error

            router.refresh()
        } catch (error) {
            console.error('Error deleting post:', error)
            alert('删除文章失败')
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="space-x-4">
            <Link
                href={`/admin/posts/${postId}/edit`}
                className="text-blue-600 hover:text-blue-900"
            >
                编辑
            </Link>
            <button
                onClick={handleDelete}
                disabled={loading}
                className="text-red-600 hover:text-red-900 disabled:opacity-50"
            >
                {loading ? '删除中...' : '删除'}
            </button>
        </div>
    )
} 