import ReactMarkdown from 'react-markdown'
import rehypeHighlight from 'rehype-highlight'

import 'highlight.js/styles/atom-one-dark.css'

const Markdown = ({ content }: { content: string }) => {
  return (
    <div className='prose prose-zinc max-w-none dark:prose-invert'>
      <ReactMarkdown rehypePlugins={[rehypeHighlight]}>
        {content}
      </ReactMarkdown>
    </div>
  )
}

export default Markdown
