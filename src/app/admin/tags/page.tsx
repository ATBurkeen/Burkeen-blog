'use client'

import { useState, useEffect } from 'react'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import TagForm from '@/components/TagForm'
import TagList from '@/components/TagList'

export default function TagsPage() {
    const [tags, setTags] = useState<any[]>([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)
    const supabase = createClientComponentClient()

    useEffect(() => {
        loadTags()
    }, [])

    async function loadTags() {
        try {
            const { data, error } = await supabase
                .from('tags')
                .select(`
                    *,
                    posts:post_tags(
                        post:posts(
                            id,
                            published
                        )
                    )
                `)
                .order('name')

            if (error) throw error

            setTags(data.map(tag => ({
                ...tag,
                postCount: tag.posts?.filter((p: any) => p.post?.published).length || 0
            })))
        } catch (error: any) {
            console.error('Error loading tags:', error)
            setError(error.message || '加载标签失败')
        } finally {
            setLoading(false)
        }
    }

    if (loading) {
        return (
            <div className="container mx-auto px-4 py-8">
                <div className="text-center">加载中...</div>
            </div>
        )
    }

    if (error) {
        return (
            <div className="container mx-auto px-4 py-8">
                <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded">
                    {error}
                </div>
            </div>
        )
    }

    return (
        <div className="container mx-auto px-4 py-8">
            <h1 className="text-3xl font-bold mb-8">标签管理</h1>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2">
                    <TagList tags={tags} onTagsChange={loadTags} />
                </div>

                <div>
                    <TagForm onSuccess={loadTags} />
                </div>
            </div>
        </div>
    )
} 