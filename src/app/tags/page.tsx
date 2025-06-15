import Link from 'next/link'
import { createServerSupabaseClient } from '@/lib/auth'

async function getPostCount() {
    const supabase = createServerSupabaseClient()
    const { count, error } = await supabase
        .from('posts')
        .select('*', { count: 'exact', head: true })
        .eq('published', true)

    if (error) {
        console.error('Error fetching post count:', error)
        return 0
    }

    return count || 0
}

async function getTags() {
    const supabase = createServerSupabaseClient()
    const { data: tags, error } = await supabase
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

    if (error) {
        console.error('Error fetching tags:', error)
        return []
    }

    return tags.map(tag => ({
        ...tag,
        postCount: tag.posts?.filter((post: any) => post.post?.published).length || 0
    }))
}

export default async function TagsPage() {
    const [tags, postCount] = await Promise.all([
        getTags(),
        getPostCount()
    ])

    return (
        <div className="container mx-auto px-4 py-8">
            {/* 文章统计 */}
            <div className="text-center mb-12">
                <p className="art-font text-4xl mb-16">
                    Burkeen's Blog 已发布 {postCount} 篇文章
                </p>
            </div>

            {/* 标签标题 */}
            <h1 className="text-3xl font-bold mb-8">标签</h1>

            {/* 标签列表 */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {tags.map((tag) => (
                    <Link
                        key={tag.id}
                        href={`/tags/${tag.slug}`}
                        className="card p-4 hover:bg-gray-50"
                    >
                        <h2 className="text-xl font-semibold text-gray-900">{tag.name}</h2>
                        <p className="text-gray-600 mt-1">
                            {tag.postCount} 篇文章
                        </p>
                    </Link>
                ))}

                {tags.length === 0 && (
                    <p className="text-gray-600 col-span-full text-center py-8">
                        暂无标签
                    </p>
                )}
            </div>
        </div>
    )
} 