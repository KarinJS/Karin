import React from 'react'
import ReactMarkdown from 'react-markdown'
import rehypeHighlight from 'rehype-highlight'
import remarkGfm from 'remark-gfm'

import 'highlight.js/styles/atom-one-dark.css'

/** @see https://github.com/NapNeko/NapCatQQ/blob/main/napcat.webui/src/components/tailwind_markdown.tsx */
interface MarkdownProps {
  content: string
  className?: string // 添加可选的className属性
}

const Markdown: React.FC<MarkdownProps> = ({ content, className = '' }) => {
  return (
    <div className={className}> {/* 包装一个div来应用className */}
      <ReactMarkdown
        remarkPlugins={[rehypeHighlight, remarkGfm]}
        components={{
          h1: ({ node, ...props }) => (
            <h1 className='my-3 text-2xl font-bold text-foreground' {...props} />
          ),
          h2: ({ node, ...props }) => (
            <h2 className='my-2 text-xl font-bold text-foreground' {...props} />
          ),
          h3: ({ node, ...props }) => (
            <h3 className='my-1 text-lg font-bold text-foreground' {...props} />
          ),
          p: ({ node, ...props }) => <p className='m-0 text-foreground' {...props} />,
          a: ({ node, ...props }) => (
            <a
              className='text-primary hover:text-primary/80 inline-block hover:underline'
              target='_blank'
              {...props}
            />
          ),
          ul: ({ node, ...props }) => (
            <ul className='list-disc list-inside text-foreground' {...props} />
          ),
          ol: ({ node, ...props }) => (
            <ol className='list-decimal list-inside text-foreground' {...props} />
          ),
          blockquote: ({ node, ...props }) => (
            <blockquote
              className='border-l-4 border-primary/30 pl-4 italic text-foreground/80 bg-muted/30 py-2 rounded-r'
              {...props}
            />
          ),
          code: ({ node, ...props }) => (
            <code className='bg-muted px-1.5 py-0.5 rounded text-xs font-mono text-foreground border' {...props} />
          ),
          pre: ({ node, ...props }) => (
            <pre className='bg-muted p-3 rounded-lg overflow-x-auto border text-sm' {...props} />
          ),
          li: ({ node, ...props }) => (
            <li className='text-foreground' {...props} />
          ),
          strong: ({ node, ...props }) => (
            <strong className='font-bold text-foreground' {...props} />
          ),
          em: ({ node, ...props }) => (
            <em className='italic text-foreground' {...props} />
          ),
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  )
}

export default Markdown
