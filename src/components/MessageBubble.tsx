import type { Message } from '../types'

function formatTimestamp(iso: string) {
  const date = new Date(iso)
  const day = String(date.getDate()).padStart(2, '0')
  const month = date.toLocaleString('en-US', { month: 'short' })
  const hours = String(date.getHours()).padStart(2, '0')
  const minutes = String(date.getMinutes()).padStart(2, '0')
  return `${day} ${month} ${date.getFullYear()},${hours}:${minutes}`
}

interface MessageBubbleProps {
  message: Message
  isOwn: boolean
}

export function MessageBubble({ message, isOwn }: MessageBubbleProps) {
  return (
    <li className={`flex ${isOwn ? 'justify-end' : 'justify-start'}`}>
      <div
        className={`rounded-sm p-4 border-bubble-border border max-w-[min(240px,80%)] sm:max-w-[min(420px,90%)]  ${
          isOwn ? 'bg-outgoing' : 'bg-white'
        }`}
      >
        {!isOwn && (
          <p className="mb-1 text-xs font-normal text-bubble-secondary">{message.author}</p>
        )}
        <p className="text-base leading-snug font-normal text-ink">{message.message}</p>
        <p className={`mt-1 text-xs text-bubble-secondary -mr-2 ${isOwn ? 'text-right' : 'text-left'}`}>
          {formatTimestamp(message.createdAt)}
        </p>
      </div>
    </li>
  )
}
