export interface User {
    id: string
    email: string
    created_at: string
    updated_at: string
    role: 'admin' | 'user'
}

export interface Tag {
    id: number
    name: string
    slug: string
    created_at: string
    updated_at: string
}

export interface Post {
    id: number
    title: string
    slug: string
    content: string
    description?: string
    cover_image?: string
    published: boolean
    author_id: string
    created_at: string
    updated_at: string
    tags?: Tag[]
}

export interface PostWithAuthor extends Post {
    author: User
}

export interface FileUpload {
    path: string
    url: string
    size: number
    type: string
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