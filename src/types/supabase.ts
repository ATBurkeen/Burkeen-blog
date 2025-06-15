export type Post = {
    id: number
    title: string
    slug: string
    content: string
    cover_image?: string
    created_at: string
    updated_at: string
    published: boolean
    author_id: string
    description?: string
}

export type Tag = {
    id: number
    name: string
    slug: string
}

export type PostTag = {
    post_id: number
    tag_id: number
}

export type Attachment = {
    id: number
    post_id: number
    file_name: string
    file_type: string
    file_size: number
    file_path: string
    created_at: string
}

export type Profile = {
    id: string
    email: string
    full_name?: string
    avatar_url?: string
    role: 'admin' | 'user'
} 