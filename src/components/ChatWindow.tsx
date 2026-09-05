import bodyBg from '../assets/body-bg.png'
import { useMessages } from '../hooks/useMessages'
import { MessageList } from './MessageList'
import { Composer } from './Composer'

interface ChatWindowProps {
  currentUser: string
}

export function ChatWindow({ currentUser }: ChatWindowProps) {
  const { messages, error } = useMessages()

  return (
    <div
      className="flex h-dvh justify-center bg-page"
      style={{ backgroundImage: `url(${bodyBg})`, backgroundRepeat: 'repeat', backgroundSize: '1100px' }}
    >
      <div className="flex h-full w-full max-w-[640px]  flex-col overflow-hidden">
        {error ? (
          <p className="m-auto text-bubble-secondary">Couldn't load messages. Please try again later.</p>
        ) : (
          <MessageList messages={messages} currentUser={currentUser} />
        )}
        <Composer currentUser={currentUser} />
      </div>
    </div>
  )
}
