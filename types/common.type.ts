export interface User {
    id: string,
    email: string,
    name: string,
    username: string,
    avatar_url?: string,
    bio?: string,
    is_verified?: boolean,
    followers_count?: number,
    following_count?: number,
    posts_count?: number,
    likes_count?: number,
    last_active?: string,
    created_at?: string,
    updated_at?: string
}