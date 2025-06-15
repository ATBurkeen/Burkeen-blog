import './globals.css'
import type { Metadata } from 'next'
import { Inter, Noto_Sans_SC } from 'next/font/google'
import Header from '@/components/Header'

const inter = Inter({ subsets: ['latin'] })
const notoSansSC = Noto_Sans_SC({
    weight: ['400', '700'],
    subsets: ['latin'],
    display: 'swap',
    variable: '--font-noto-sc',
})

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
            <body className={`${inter.className} ${notoSansSC.variable}`}>
                <Header />
                <main>{children}</main>
            </body>
        </html>
    )
} 