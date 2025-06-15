'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import MarkdownEditor from '@/components/MarkdownEditor'

export default function EditPostPage({
    params: { id },
}: {
    params: { id: string }
}) {
    const router = useRouter()
    const supabase = createClientComponentClient()
    const [title, setTitle] = useState('')
    const [description, setDescription] = useState('')
    const [content, setContent] = useState('')
    const [tags, setTags] = useState('')
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)
    const [initialLoading, setInitialLoading] = useState(true)

    useEffect(() => {
        async function fetchPost() {
            try {
                const { data: { user }, error: userError } = await supabase.auth.getUser()
                if (userError) throw userError
                if (!user) throw new Error('请先登录')

                const { data: post, error: postError } = await supabase
                    .from('posts')
                    .select(`
                        *,
                        tags:post_tags(
                            tag:tags(*)
                        )
                    `)
                    .eq('id', id)
                    .single()

                if (postError) throw postError
                if (!post) throw new Error('文章不存在')

                setTitle(post.title)
                setDescription(post.description || '')
                setContent(post.content)
                setTags(post.tags?.map((t: any) => t.tag.name).join(',') || '')
            } catch (error: any) {
                console.error('Error fetching post:', error)
                setError(error.message || '加载文章失败')
            } finally {
                setInitialLoading(false)
            }
        }

        fetchPost()
    }, [id, supabase])

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setError(null)
        setLoading(true)

        try {
            const { data: { user }, error: userError } = await supabase.auth.getUser()
            if (userError) throw userError
            if (!user) throw new Error('请先登录')

            // 更新文章
            const { error: updateError } = await supabase
                .from('posts')
                .update({
                    title,
                    description,
                    content,
                    updated_at: new Date().toISOString(),
                })
                .eq('id', id)

            if (updateError) throw updateError

            // 处理标签
            const tagNames = tags.split(',').map(t => t.trim()).filter(Boolean)

            // 先删除所有现有的标签关联
            const { error: deleteTagsError } = await supabase
                .from('post_tags')
                .delete()
                .eq('post_id', id)

            if (deleteTagsError) throw deleteTagsError

            // 创建新标签并建立关联
            for (const tagName of tagNames) {
                // 尝试插入标签，如果已存在则忽略
                const { data: tag, error: tagError } = await supabase
                    .from('tags')
                    .select()
                    .eq('name', tagName)
                    .single()

                if (tagError && tagError.code !== 'PGRST116') {
                    throw tagError
                }

                let tagId
                if (!tag) {
                    const { data: newTag, error: createTagError } = await supabase
                        .from('tags')
                        .insert({ name: tagName, slug: tagName.toLowerCase() })
                        .select()
                        .single()

                    if (createTagError) throw createTagError
                    tagId = newTag.id
                } else {
                    tagId = tag.id
                }

                // 创建文章-标签关联
                const { error: linkError } = await supabase
                    .from('post_tags')
                    .insert({ post_id: id, tag_id: tagId })

                if (linkError) throw linkError
            }

            router.push('/admin/posts')
            router.refresh()
        } catch (error: any) {
            console.error('Error updating post:', error)
            setError(error.message || '更新文章失败')
        } finally {
            setLoading(false)
        }
    }

    const handleImageUpload = async (file: File) => {
        try {
            const { data: { user }, error: userError } = await supabase.auth.getUser()
            if (userError) throw userError
            if (!user) throw new Error('请先登录')

            // 检查文件类型
            const fileExt = file.name.split('.').pop()?.toLowerCase()
            const allowedImageTypes = ['jpg', 'jpeg', 'png', 'gif', 'webp']

            if (!fileExt || !allowedImageTypes.includes(fileExt)) {
                throw new Error('不支持的图片格式，请使用 JPG、PNG、GIF 或 WebP 格式')
            }

            // 检查文件大小（限制为 5MB）
            if (file.size > 5 * 1024 * 1024) {
                throw new Error('图片大小不能超过 5MB')
            }

            // 生成安全的文件名
            const fileName = `${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`
            const filePath = `${user.id}/${fileName}`

            const { error: uploadError } = await supabase.storage
                .from('blog-uploads')
                .upload(filePath, file, {
                    cacheControl: '3600',
                    upsert: false
                })

            if (uploadError) throw uploadError

            const { data: { publicUrl } } = supabase.storage
                .from('blog-uploads')
                .getPublicUrl(filePath)

            return publicUrl
        } catch (error: any) {
            console.error('Error uploading image:', error)
            throw new Error(error.message || '上传图片失败')
        }
    }

    const handleAttachmentUpload = async (file: File) => {
        try {
            const { data: { user }, error: userError } = await supabase.auth.getUser()
            if (userError) throw userError
            if (!user) throw new Error('请先登录')

            // 检查文件大小（限制为 10MB）
            if (file.size > 10 * 1024 * 1024) {
                throw new Error('附件大小不能超过 10MB')
            }

            // 生成安全的文件名
            const fileName = `${Date.now()}-${Math.random().toString(36).substring(2)}-${file.name}`
            const filePath = `${user.id}/${fileName}`

            const { error: uploadError } = await supabase.storage
                .from('blog-uploads')
                .upload(filePath, file, {
                    cacheControl: '3600',
                    upsert: false
                })

            if (uploadError) throw uploadError

            const { data: { publicUrl } } = supabase.storage
                .from('blog-uploads')
                .getPublicUrl(filePath)

            return publicUrl
        } catch (error: any) {
            console.error('Error uploading attachment:', error)
            throw new Error(error.message || '上传附件失败')
        }
    }

    if (initialLoading) {
        return (
            <div className="container mx-auto px-4 py-8">
                <div className="text-center">加载中...</div>
            </div>
        )
    }

    return (
        <div className="container mx-auto px-4 py-8">
            <h1 className="text-3xl font-bold mb-8">编辑文章</h1>

            {error && (
                <div className="bg-red-50 text-red-500 p-4 rounded-lg mb-6">
                    {error}
                </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
                <div className="bg-white bg-opacity-50 backdrop-blur-sm rounded-lg p-6">
                    <label className="block text-lg font-medium text-gray-700 mb-2">
                        标题
                    </label>
                    <input
                        type="text"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        required
                        className="w-full h-12 px-4 rounded-md bg-white bg-opacity-50 border-0 focus:ring-2 focus:ring-blue-500"
                        placeholder="输入文章标题..."
                    />
                </div>

                <div className="bg-white bg-opacity-50 backdrop-blur-sm rounded-lg p-6">
                    <label className="block text-lg font-medium text-gray-700 mb-2">
                        描述
                    </label>
                    <input
                        type="text"
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        className="w-full h-12 px-4 rounded-md bg-white bg-opacity-50 border-0 focus:ring-2 focus:ring-blue-500"
                        placeholder="输入文章描述..."
                    />
                </div>

                <div className="bg-white bg-opacity-50 backdrop-blur-sm rounded-lg p-6">
                    <label className="block text-lg font-medium text-gray-700 mb-2">
                        标签
                    </label>
                    <input
                        type="text"
                        value={tags}
                        onChange={(e) => setTags(e.target.value)}
                        placeholder="使用英文逗号分隔多个标签..."
                        className="w-full h-12 px-4 rounded-md bg-white bg-opacity-50 border-0 focus:ring-2 focus:ring-blue-500"
                    />
                </div>

                <div>
                    <label className="block text-lg font-medium text-gray-700 mb-2">
                        文章内容
                    </label>
                    <MarkdownEditor
                        value={content}
                        onChange={setContent}
                        onImageUpload={handleImageUpload}
                        onAttachmentUpload={handleAttachmentUpload}
                    />
                </div>

                <div className="flex justify-end space-x-4">
                    <button
                        type="button"
                        onClick={() => router.back()}
                        className="px-6 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600 transition-colors"
                    >
                        取消
                    </button>
                    <button
                        type="submit"
                        disabled={loading}
                        className={`px-6 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
                    >
                        {loading ? '保存中...' : '保存文章'}
                    </button>
                </div>
            </form>
        </div>
    )
} 