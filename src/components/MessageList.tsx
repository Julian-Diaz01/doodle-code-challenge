import {useEffect, useRef} from 'react'
import type {Message} from '../types'
import {ScrollArea} from './ui/scroll-area'
import {MessageBubble} from './MessageBubble'

interface MessageListProps {
    messages: Message[]
    currentUser: string
}

export function MessageList({messages, currentUser}: MessageListProps) {
    const bottomRef = useRef<HTMLDivElement>(null)

    useEffect(() => {
        bottomRef.current?.scrollIntoView({block: 'end'})
    }, [messages.length])

    return (
        <ScrollArea className="min-h-0 flex-1">
            <ul aria-live="polite" className="flex flex-col px-6 py-4">
                {messages.map((message) => {
                    const isOwn = message.author === currentUser
                    return (
                        <li key={message._id} className={isOwn ? 'mt-4' : 'mt-2'}>
                            <MessageBubble message={message} isOwn={isOwn}/>
                        </li>
                    )
                })}
                <div ref={bottomRef}/>
            </ul>
        </ScrollArea>
    )
}
