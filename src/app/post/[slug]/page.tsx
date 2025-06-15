import Image from 'next/image'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { createServerSupabaseClient } from '@/lib/auth'
import MarkdownContent from '@/components/MarkdownContent'

async function getPost(slug: string) {
    const supabase = createServerSupabaseClient()
    const decodedSlug = decodeURIComponent(slug)

    const { data: post, error } = await supabase
        .from('posts')
        .select(`
            *,
            author:profiles(*),
            tags:post_tags(
                tag:tags(*)
            )
        `)
        .eq('slug', decodedSlug)
        .eq('published', true)
        .single()

    if (error || !post) {
        console.error('Error fetching post:', error)
        return null
    }

    return {
        ...post,
        tags: post.tags?.map((t: any) => t.tag)
    }
}

export default async function PostPage({
    params: { slug },
}: {
    params: { slug: string }
}) {
    const post = await getPost(slug)

    if (!post) {
        notFound()
    }

    return (
        <div className="content-container">
            <article className="glass-container p-8">
                {post.cover_image && (
                    <div className="relative h-[400px] -mx-8 -mt-8 mb-8">
                        <Image
                            src={post.cover_image}
                            alt={post.title}
                            fill
                            className="object-cover rounded-t-lg"
                            priority
                        />
                    </div>
                )}

                <header className="mb-8">
                    <h1 className="text-4xl font-bold mb-4">{post.title}</h1>

                    <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600">
                        <time dateTime={post.created_at}>
                            {new Date(post.created_at).toLocaleDateString()}
                        </time>

                        {post.tags && post.tags.length > 0 && (
                            <div className="flex flex-wrap gap-2">
                                {post.tags.map((tag: any) => (
                                    <Link
                                        key={tag.id}
                                        href={`/tags/${tag.slug}`}
                                        className="bg-blue-100 bg-opacity-50 text-blue-800 px-2 py-1 rounded-full hover:bg-opacity-70 transition-colors"
                                    >
                                        {tag.name}
                                    </Link>
                                ))}
                            </div>
                        )}
                    </div>

                    {post.description && (
                        <p className="mt-4 text-lg text-gray-600 italic">
                            {post.description}
                        </p>
                    )}
                </header>

                <div className="prose prose-lg max-w-none">
                    <MarkdownContent content={post.content} />
                </div>
            </article>
        </div>
    )
} 