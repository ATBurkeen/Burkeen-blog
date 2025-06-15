import Link from 'next/link'
import Image from 'next/image'
import { Post, Tag } from '@/types/supabase'

interface PostCardProps {
    post: Post & {
        tags?: Tag[]
    }
}

export default function PostCard({ post }: PostCardProps) {
    return (
        <div className="card overflow-hidden transition-all duration-300 hover:transform hover:scale-[1.02]">
            {post.cover_image && (
                <div className="relative h-48 w-full">
                    <Image
                        src={post.cover_image}
                        alt={post.title}
                        fill
                        className="object-cover"
                    />
                </div>
            )}
            <div className="p-6">
                <Link href={`/post/${post.slug}`}>
                    <h2 className="text-2xl font-bold mb-3 hover:text-blue-600 transition-colors">
                        {post.title}
                    </h2>
                </Link>

                <p className="text-gray-600 mb-4 line-clamp-2">
                    {post.description || ''}
                </p>

                <div className="flex flex-wrap items-center justify-between gap-4">
                    <div className="flex flex-wrap gap-2">
                        {post.tags && post.tags.map((tag) => (
                            <Link
                                key={tag.id}
                                href={`/tags/${tag.slug}`}
                                className="text-sm bg-blue-100 bg-opacity-50 text-blue-800 px-2 py-1 rounded-full hover:bg-opacity-70 transition-colors"
                            >
                                {tag.name}
                            </Link>
                        ))}
                    </div>

                    <time className="text-sm text-gray-500" dateTime={post.created_at}>
                        {new Date(post.created_at).toLocaleDateString()}
                    </time>
                </div>
            </div>
        </div>
    )
} 