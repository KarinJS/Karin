import React from 'react'
import ReactMarkdown from 'react-markdown'
import rehypeHighlight from 'rehype-highlight'
import remarkGfm from 'remark-gfm'

import 'highlight.js/styles/atom-one-dark.css'

/** @see https://github.com/NapNeko/NapCatQQ/blob/main/napcat.webui/src/components/tailwind_markdown.tsx */
const Markdown: React.FC<{ content: string }> = ({ content }) => {
  return (
    <ReactMarkdown
      remarkPlugins={[rehypeHighlight, remarkGfm]}
      components={{
        h1: ({ node, ...props }) => (
          <h1 className='my-3 text-2xl font-bold' {...props} />
        ),
        h2: ({ node, ...props }) => (
          <h2 className='my-2 text-xl font-bold' {...props} />
        ),
        h3: ({ node, ...props }) => (
          <h3 className='my-1 text-lg font-bold' {...props} />
        ),
        p: ({ node, ...props }) => <p className='m-0' {...props} />,
        a: ({ node, ...props }) => (
          <a
            className='text-primary-500 inline-block hover:underline'
            target='_blank'
            {...props}
          />
        ),
        ul: ({ node, ...props }) => (
          <ul className='list-disc list-inside' {...props} />
        ),
        ol: ({ node, ...props }) => (
          <ol className='list-decimal list-inside' {...props} />
        ),
        blockquote: ({ node, ...props }) => (
          <blockquote
            className='border-l-4 border-default-300 pl-4 italic'
            {...props}
          />
        ),
        code: ({ node, ...props }) => (
          <code className='bg-default-100 p-1 rounded text-xs' {...props} />
        )
      }}
    >
      {content}
    </ReactMarkdown>
  )
}

export default Markdown
