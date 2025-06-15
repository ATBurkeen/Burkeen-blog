'use client'

import { useState, ComponentPropsWithoutRef } from 'react'
import ReactMarkdown from 'react-markdown'
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter'
import { tomorrow } from 'react-syntax-highlighter/dist/esm/styles/prism'
import remarkGfm from 'remark-gfm'

type CodeProps = ComponentPropsWithoutRef<'code'> & {
    inline?: boolean
}

interface MarkdownEditorProps {
    value?: string
    onChange: (value: string) => void
    onImageUpload?: (file: File) => Promise<string>
    onAttachmentUpload?: (file: File) => Promise<string>
}

export default function MarkdownEditor({
    value = '',
    onChange,
    onImageUpload,
    onAttachmentUpload,
}: MarkdownEditorProps) {
    const [isPreview, setIsPreview] = useState(false)
    const [uploading, setUploading] = useState(false)
    const [error, setError] = useState<string | null>(null)

    const handleContentChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        onChange(e.target.value)
    }

    const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        if (!onImageUpload || !e.target.files?.length) return
        setError(null)
        setUploading(true)

        try {
            const file = e.target.files[0]
            const url = await onImageUpload(file)
            const imageMarkdown = `![${file.name}](${url})`
            const newContent = value + '\n' + imageMarkdown
            onChange(newContent)
        } catch (error: any) {
            setError(error.message || '图片上传失败')
        } finally {
            setUploading(false)
            // 清除 input 的值，这样相同的文件可以再次选择
            e.target.value = ''
        }
    }

    const handleAttachmentUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        if (!onAttachmentUpload || !e.target.files?.length) return
        setError(null)
        setUploading(true)

        try {
            const file = e.target.files[0]
            const url = await onAttachmentUpload(file)
            const attachmentMarkdown = `[${file.name}](${url})`
            const newContent = value + '\n' + attachmentMarkdown
            onChange(newContent)
        } catch (error: any) {
            setError(error.message || '附件上传失败')
        } finally {
            setUploading(false)
            // 清除 input 的值，这样相同的文件可以再次选择
            e.target.value = ''
        }
    }

    return (
        <div className="rounded-lg overflow-hidden bg-white bg-opacity-50 backdrop-blur-sm">
            <div className="flex items-center justify-between p-4 border-b bg-gray-50 bg-opacity-50">
                <div className="flex items-center space-x-4">
                    <button
                        type="button"
                        onClick={() => setIsPreview(!isPreview)}
                        className={`px-4 py-2 rounded-md transition-colors ${isPreview
                            ? 'bg-white shadow-sm'
                            : 'hover:bg-white hover:shadow-sm'
                            }`}
                    >
                        {isPreview ? '编辑' : '预览'}
                    </button>
                    {onImageUpload && (
                        <label className={`px-4 py-2 rounded-md transition-colors cursor-pointer ${uploading ? 'opacity-50 cursor-not-allowed' : 'hover:bg-white hover:shadow-sm'
                            }`}>
                            {uploading ? '上传中...' : '插入图片'}
                            <input
                                type="file"
                                accept="image/*"
                                className="hidden"
                                onChange={handleImageUpload}
                                disabled={uploading}
                            />
                        </label>
                    )}
                    {onAttachmentUpload && (
                        <label className={`px-4 py-2 rounded-md transition-colors cursor-pointer ${uploading ? 'opacity-50 cursor-not-allowed' : 'hover:bg-white hover:shadow-sm'
                            }`}>
                            {uploading ? '上传中...' : '插入附件'}
                            <input
                                type="file"
                                className="hidden"
                                onChange={handleAttachmentUpload}
                                disabled={uploading}
                            />
                        </label>
                    )}
                </div>
            </div>

            {error && (
                <div className="p-4 bg-red-50 text-red-500 text-sm">
                    {error}
                </div>
            )}

            {isPreview ? (
                <div className="prose max-w-none p-6 min-h-[500px] bg-white bg-opacity-50">
                    <ReactMarkdown
                        remarkPlugins={[remarkGfm]}
                        components={{
                            code: ({ inline, className, children, ...props }: CodeProps) => {
                                const match = /language-(\w+)/.exec(className || '')
                                return !inline && match ? (
                                    <SyntaxHighlighter
                                        style={tomorrow}
                                        language={match[1]}
                                        PreTag="div"
                                    >
                                        {String(children).replace(/\n$/, '')}
                                    </SyntaxHighlighter>
                                ) : (
                                    <code {...props} className={className}>
                                        {children}
                                    </code>
                                )
                            }
                        }}
                    >
                        {value}
                    </ReactMarkdown>
                </div>
            ) : (
                <textarea
                    value={value}
                    onChange={handleContentChange}
                    className="w-full min-h-[500px] p-6 bg-transparent font-mono text-base focus:outline-none"
                    placeholder="使用 Markdown 编写文章..."
                />
            )}
        </div>
    )
} 