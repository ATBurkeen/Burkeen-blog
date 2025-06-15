'use client'

import { useState, useCallback } from 'react'
import { useRouter } from 'next/navigation'

export default function SearchBar() {
    const [query, setQuery] = useState('')
    const router = useRouter()

    const handleSearch = useCallback((e: React.FormEvent) => {
        e.preventDefault()
        if (query.trim()) {
            router.push(`/search?q=${encodeURIComponent(query.trim())}`)
        }
    }, [query, router])

    return (
        <form onSubmit={handleSearch} className="w-full max-w-3xl mx-auto">
            <div className="relative">
                <input
                    type="search"
                    className="w-full py-3 px-4 text-xl bg-transparent border-b-2 border-gray-300 focus:border-blue-500 focus:outline-none transition-colors placeholder-gray-400"
                    placeholder="搜索文章..."
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                />
                <button
                    type="submit"
                    className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                >
                    <svg
                        className="h-6 w-6"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                        />
                    </svg>
                </button>
            </div>
        </form>
    )
} 