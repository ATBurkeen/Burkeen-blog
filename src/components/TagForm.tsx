'use client'

import { useState } from 'react'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'

interface TagFormProps {
    onSuccess: () => void
}

export default function TagForm({ onSuccess }: TagFormProps) {
    const [name, setName] = useState('')
    const [error, setError] = useState<string | null>(null)
    const [loading, setLoading] = useState(false)
    const supabase = createClientComponentClient()

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setError(null)
        setLoading(true)

        try {
            // 生成 slug
            const slug = name
                .toLowerCase()
                .replace(/[^a-z0-9\u4e00-\u9fa5]+/g, '-')
                .replace(/(^-|-$)/g, '')

            // 检查标签是否已存在
            const { data: existingTag } = await supabase
                .from('tags')
                .select()
                .or(`name.eq.${name},slug.eq.${slug}`)
                .single()

            if (existingTag) {
                throw new Error('标签已存在')
            }

            // 创建新标签
            const { error: createError } = await supabase
                .from('tags')
                .insert({ name, slug })

            if (createError) throw createError

            setName('')
            onSuccess()
        } catch (error: any) {
            console.error('Error creating tag:', error)
            setError(error.message || '创建标签失败')
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-xl font-semibold mb-4">创建新标签</h2>

            <form onSubmit={handleSubmit}>
                {error && (
                    <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded mb-4">
                        {error}
                    </div>
                )}

                <div className="mb-4">
                    <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                        标签名称
                    </label>
                    <input
                        type="text"
                        id="name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="input"
                        required
                    />
                </div>

                <button
                    type="submit"
                    disabled={loading}
                    className="btn-primary w-full"
                >
                    {loading ? '创建中...' : '创建标签'}
                </button>
            </form>
        </div>
    )
} 