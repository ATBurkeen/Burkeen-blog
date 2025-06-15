import { notFound } from 'next/navigation'
import { createServerSupabaseClient } from '@/lib/auth'
import PostCard from '@/components/PostCard'

async function getTagWithPosts(slug: string) {
    const supabase = createServerSupabaseClient()
    const { data: tag, error: tagError } = await supabase
        .from('tags')
        .select('*')
        .eq('slug', slug)
        .single()

    if (tagError || !tag) {
        return null
    }

    const { data: posts, error: postsError } = await supabase
        .from('posts')
        .select(`
            *,
            tags:post_tags(
                tag:tags(*)
            )
        `)
        .eq('published', true)
        .eq('post_tags.tag_id', tag.id)
        .order('created_at', { ascending: false })

    if (postsError) {
        console.error('Error fetching posts:', postsError)
        return null
    }

    return {
        tag,
        posts: posts.map(post => ({
            ...post,
            tags: post.tags?.map((t: any) => t.tag)
        }))
    }
}

export default async function TagPage({
    params: { slug },
}: {
    params: { slug: string }
}) {
    const data = await getTagWithPosts(slug)

    if (!data) {
        notFound()
    }

    const { tag, posts } = data

    return (
        <div className="container mx-auto px-4 py-8">
            <h1 className="text-3xl font-bold mb-2">标签 "{tag.name}" 下的文章</h1>
            <p className="text-gray-600 mb-8">共 {posts.length} 篇文章</p>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {posts.map((post) => (
                    <PostCard key={post.id} post={post} />
                ))}
            </div>
        </div>
    )
} 