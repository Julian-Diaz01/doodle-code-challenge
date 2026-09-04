import bodyBg from '../assets/body-bg.png'
import type { Message } from '../types'
import { MessageList } from './MessageList'
import { Composer } from './Composer'

interface ChatWindowProps {
  messages: Message[]
  currentUser: string
}

export function ChatWindow({ messages, currentUser }: ChatWindowProps) {
  return (
    <div
      className="flex h-dvh justify-center bg-page"
      style={{ backgroundImage: `url(${bodyBg})`, backgroundRepeat: 'repeat', backgroundSize: '1100px' }}
    >
      <div className="flex h-full w-full max-w-[640px]  flex-col overflow-hidden">
        <MessageList messages={messages} currentUser={currentUser} />
        <Composer />
      </div>
    </div>
  )
}
