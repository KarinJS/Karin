import { Snippet } from '@heroui/snippet'

import type { Elements } from '@/types/segment'

export interface ShowStructedMessageProps {
  messages: Elements[]
}

const ShowStructedMessage = ({ messages }: ShowStructedMessageProps) => {
  return (
    <Snippet
      hideSymbol
      tooltipProps={{
        content: '点击复制',
      }}
      classNames={{
        copyButton: 'self-start sticky top-0 right-0',
      }}
      className='bg-content1 h-96 overflow-y-scroll items-start'
    >
      {JSON.stringify(messages, null, 2)
        .split('\n')
        .map((line, i) => (
          <span key={i} className='whitespace-pre-wrap break-all'>
            {line}
          </span>
        ))}
    </Snippet>
  )
}

export default ShowStructedMessage
