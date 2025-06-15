import './globals.css'
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import Header from '@/components/Header'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
    title: "Burkeen's Blog",
    description: '分享编程技术、开发经验和学习心得',
}

export default function RootLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return (
        <html lang="zh-CN">
            <head>
                <link
                    href="https://fonts.googleapis.com/css2?family=ZCOOL+KuHei&display=swap"
                    rel="stylesheet"
                />
            </head>
            <body className={inter.className}>
                <Header />
                <main>{children}</main>
            </body>
        </html>
    )
} 