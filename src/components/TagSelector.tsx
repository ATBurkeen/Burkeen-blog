'use client'

import { useState, useEffect, useRef } from 'react'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'

interface Tag {
    id: number
    name: string
    slug: string
}

interface TagSelectorProps {
    value: string
    onChange: (value: string) => void
}

export default function TagSelector({ value, onChange }: TagSelectorProps) {
    const [searchText, setSearchText] = useState('')
    const [suggestions, setSuggestions] = useState<Tag[]>([])
    const [showSuggestions, setShowSuggestions] = useState(false)
    const [loading, setLoading] = useState(false)
    const supabase = createClientComponentClient()
    const wrapperRef = useRef<HTMLDivElement>(null)

    // 将输入的标签字符串转换为数组
    const selectedTags = value.split(',').filter(Boolean).map(t => t.trim())

    // 点击外部关闭建议列表
    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
                setShowSuggestions(false)
            }
        }

        document.addEventListener('mousedown', handleClickOutside)
        return () => {
            document.removeEventListener('mousedown', handleClickOutside)
        }
    }, [])

    // 搜索标签
    const searchTags = async (query: string) => {
        if (!query.trim()) {
            setSuggestions([])
            return
        }

        setLoading(true)
        try {
            const { data, error } = await supabase
                .from('tags')
                .select('*')
                .ilike('name', `%${query}%`)
                .limit(5)

            if (error) throw error

            setSuggestions(data || [])
        } catch (error) {
            console.error('Error searching tags:', error)
        } finally {
            setLoading(false)
        }
    }

    // 创建新标签
    const createTag = async (name: string) => {
        try {
            const slug = name
                .toLowerCase()
                .replace(/[^a-z0-9\u4e00-\u9fa5]+/g, '-')
                .replace(/(^-|-$)/g, '')

            const { data, error } = await supabase
                .from('tags')
                .insert({ name, slug })
                .select()
                .single()

            if (error) throw error

            return data
        } catch (error) {
            console.error('Error creating tag:', error)
            return null
        }
    }

    // 处理标签选择或创建
    const handleTagSelect = async (tagName: string) => {
        if (selectedTags.includes(tagName)) {
            return
        }

        const newTags = [...selectedTags, tagName]
        onChange(newTags.join(', '))
        setSearchText('')
        setSuggestions([])
    }

    // 处理标签删除
    const handleTagRemove = (tagName: string) => {
        const newTags = selectedTags.filter(t => t !== tagName)
        onChange(newTags.join(', '))
    }

    // 处理输入变化
    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const text = e.target.value
        setSearchText(text)
        setShowSuggestions(true)
        searchTags(text)
    }

    // 处理回车键
    const handleKeyDown = async (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter' && searchText.trim()) {
            e.preventDefault()
            
            // 如果有建议并且显示中，选择第一个建议
            if (suggestions.length > 0 && showSuggestions) {
                handleTagSelect(suggestions[0].name)
            } else {
                // 否则创建新标签
                const newTag = await createTag(searchText.trim())
                if (newTag) {
                    handleTagSelect(newTag.name)
                }
            }
        }
    }

    return (
        <div ref={wrapperRef} className="space-y-2">
            {/* 已选择的标签 */}
            <div className="flex flex-wrap gap-2">
                {selectedTags.map((tag, index) => (
                    <span
                        key={index}
                        className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-sm flex items-center"
                    >
                        {tag}
                        <button
                            type="button"
                            onClick={() => handleTagRemove(tag)}
                            className="ml-1 text-blue-600 hover:text-blue-800"
                        >
                            ×
                        </button>
                    </span>
                ))}
            </div>

            {/* 标签输入框 */}
            <div className="relative">
                <input
                    type="text"
                    value={searchText}
                    onChange={handleInputChange}
                    onKeyDown={handleKeyDown}
                    onFocus={() => searchText.trim() && setShowSuggestions(true)}
                    className="input"
                    placeholder="输入标签名称..."
                />

                {/* 标签建议列表 */}
                {showSuggestions && (searchText.trim() || loading) && (
                    <div className="absolute z-10 w-full mt-1 bg-white rounded-md shadow-lg border border-gray-200">
                        {loading ? (
                            <div className="p-2 text-gray-500 text-center">搜索中...</div>
                        ) : suggestions.length > 0 ? (
                            <ul className="max-h-60 overflow-auto">
                                {suggestions.map((tag) => (
                                    <li
                                        key={tag.id}
                                        className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                                        onClick={() => {
                                            handleTagSelect(tag.name)
                                            setShowSuggestions(false)
                                        }}
                                    >
                                        {tag.name}
                                    </li>
                                ))}
                            </ul>
                        ) : searchText.trim() ? (
                            <div
                                className="p-2 text-blue-600 hover:bg-gray-100 cursor-pointer"
                                onClick={async () => {
                                    const newTag = await createTag(searchText.trim())
                                    if (newTag) {
                                        handleTagSelect(newTag.name)
                                        setShowSuggestions(false)
                                    }
                                }}
                            >
                                创建标签 "{searchText.trim()}"
                            </div>
                        ) : null}
                    </div>
                )}
            </div>
        </div>
    )
} 