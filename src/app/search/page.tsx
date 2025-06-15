import { createServerSupabaseClient } from '@/lib/auth'
import PostCard from '@/components/PostCard'
import SearchBarWrapper from '@/components/SearchBarWrapper'

async function searchPosts(query: string) {
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
        .textSearch('search_vector', query)
        .order('created_at', { ascending: false })

    if (error) {
        console.error('Error searching posts:', error)
        return []
    }

    return posts.map(post => ({
        ...post,
        tags: post.tags?.map((t: any) => t.tag)
    }))
}

export default async function SearchPage({
    searchParams,
}: {
    searchParams: { q: string }
}) {
    const query = searchParams.q || ''
    const posts = query ? await searchPosts(query) : []

    return (
        <div className="container mx-auto px-4 py-8">
            <div className="max-w-2xl mx-auto mb-8">
                <h1 className="text-3xl font-bold mb-4">搜索结果</h1>
                <SearchBarWrapper />
            </div>

            {query && (
                <p className="text-gray-600 mb-8">
                    找到 {posts.length} 篇相关文章 "{query}"
                </p>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {posts.map((post) => (
                    <PostCard key={post.id} post={post} />
                ))}
            </div>

            {query && posts.length === 0 && (
                <div className="text-center py-12">
                    <p className="text-gray-600">没有找到相关文章</p>
                </div>
            )}
        </div>
    )
} 