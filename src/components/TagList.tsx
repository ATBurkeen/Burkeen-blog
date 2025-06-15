'use client'

import { useState } from 'react'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'

interface Tag {
    id: number
    name: string
    slug: string
    postCount: number
}

interface TagListProps {
    tags: Tag[]
    onTagsChange: () => void
}

export default function TagList({ tags, onTagsChange }: TagListProps) {
    const [loading, setLoading] = useState(false)
    const supabase = createClientComponentClient()

    const handleDelete = async (tagId: number) => {
        if (!confirm('确定要删除这个标签吗？相关文章的标签关联也会被删除。')) {
            return
        }

        setLoading(true)
        try {
            // 删除标签关联
            await supabase
                .from('post_tags')
                .delete()
                .eq('tag_id', tagId)

            // 删除标签
            const { error } = await supabase
                .from('tags')
                .delete()
                .eq('id', tagId)

            if (error) throw error

            onTagsChange()
        } catch (error) {
            console.error('Error deleting tag:', error)
            alert('删除标签失败')
        } finally {
            setLoading(false)
        }
    }

    if (tags.length === 0) {
        return (
            <div className="bg-white p-6 rounded-lg shadow text-center text-gray-500">
                还没有创建任何标签
            </div>
        )
    }

    return (
        <div className="bg-white rounded-lg shadow overflow-hidden">
            <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                    <tr>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            标签名称
                        </th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Slug
                        </th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            文章数
                        </th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            操作
                        </th>
                    </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                    {tags.map((tag) => (
                        <tr key={tag.id}>
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                {tag.name}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                {tag.slug}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                {tag.postCount}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm">
                                <button
                                    onClick={() => handleDelete(tag.id)}
                                    disabled={loading}
                                    className="text-red-600 hover:text-red-900 disabled:opacity-50"
                                >
                                    删除
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    )
} 