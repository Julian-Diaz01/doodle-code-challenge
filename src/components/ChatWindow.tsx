import bodyBg from '../assets/body-bg.png'
import { useMessages } from '../hooks/useMessages'
import { MessageList } from './MessageList'
import { Composer } from './Composer'

interface ChatWindowProps {
  currentUser: string
}

export function ChatWindow({ currentUser }: ChatWindowProps) {
  const { messages, isLoading, error } = useMessages()

  return (
    <div
      className="flex h-dvh flex-col bg-page"
      style={{ backgroundImage: `url(${bodyBg})`, backgroundRepeat: 'repeat', backgroundSize: '1100px' }}
    >
      <div className="flex flex-1 justify-center overflow-hidden">
        <div className="flex h-full w-full max-w-[640px] flex-col overflow-hidden">
          {error ? (
            <p className="m-auto text-bubble-secondary">Couldn't load messages. Please try again later.</p>
          ) : isLoading ? (
            <p className="m-auto text-bubble-secondary">Loading messages…</p>
          ) : messages.length === 0 ? (
            <p className="m-auto text-bubble-secondary">No messages yet. Say hi!</p>
          ) : (
            <MessageList messages={messages} currentUser={currentUser} />
          )}
        </div>
      </div>
      <Composer currentUser={currentUser} />
    </div>
  )
}
