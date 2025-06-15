import { createMiddlewareClient } from '@supabase/auth-helpers-nextjs'
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export async function middleware(request: NextRequest) {
    const res = NextResponse.next()
    const supabase = createMiddlewareClient({ req: request, res })

    const {
        data: { session },
    } = await supabase.auth.getSession()

    // 如果用户已登录且访问登录页面，重定向到管理后台
    if (session && request.nextUrl.pathname === '/login') {
        const redirectUrl = new URL('/admin', request.url)
        return NextResponse.redirect(redirectUrl)
    }

    // 如果用户未登录且尝试访问管理页面，重定向到登录页
    if (!session && request.nextUrl.pathname.startsWith('/admin')) {
        const redirectUrl = new URL('/login', request.url)
        return NextResponse.redirect(redirectUrl)
    }

    return res
}

// 配置需要进行中间件处理的路由
export const config = {
    matcher: [
        '/admin/:path*',
        '/login'
    ]
} 