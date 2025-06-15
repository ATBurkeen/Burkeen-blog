import { createServerSupabaseClient } from '@/lib/auth'
import PostCard from '@/components/PostCard'
import SearchBarWrapper from '@/components/SearchBarWrapper'
import type { Post, Tag } from '@/types/supabase'

async function getPosts() {
    const supabase = createServerSupabaseClient()
    const { data: posts, error } = await supabase
        .from('posts')
        .select(`
            *,
            tags:post_tags(
                tag:tags(*)
            )
        `)
        .eq('published', true)
        .order('created_at', { ascending: false })

    if (error) {
        console.error('Error fetching posts:', error)
        return []
    }

    return posts.map(post => ({
        ...post,
        tags: post.tags?.map((t: any) => t.tag)
    }))
}

export default async function HomePage() {
    const posts = await getPosts()

    return (
        <div className="content-container">
            <div className="glass-container p-8 mb-8">
                <div className="max-w-3xl mx-auto">
                    <h1 className="text-4xl font-bold text-center mb-6">Burkeen&apos;s Blog</h1>
                    <p className="text-xl text-gray-600 text-center mb-8">
                        分享编程技术、开发经验和学习心得
                    </p>
                    <SearchBarWrapper />
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {posts.map((post) => (
                    <PostCard key={post.id} post={post} />
                ))}
            </div>
        </div>
    )
} 