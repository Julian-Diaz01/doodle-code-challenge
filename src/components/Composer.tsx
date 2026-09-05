import { useState, type SubmitEvent } from 'react'
import { Input } from './ui/input'
import { Button } from './ui/button'
import { useCreateMessage } from '../hooks/useCreateMessage'

interface ComposerProps {
  currentUser: string
}

export function Composer({ currentUser }: ComposerProps) {
  const [message, setMessage] = useState('')
  const { mutate, isPending } = useCreateMessage()

  function handleSubmit(e: SubmitEvent) {
    e.preventDefault()
    const trimmedMessage = message.trim() // prevent empty posts
    if (!trimmedMessage) return

    mutate({ message: trimmedMessage, author: currentUser })
    setMessage('')
  }

  return (
    <form
      className="flex items-center gap-2 bg-composer px-2 py-2"
      onSubmit={handleSubmit}
    >
      <label htmlFor="message" className="sr-only">
        Message
      </label>
      <Input
        id="message"
        name="message"
        type="text"
        placeholder="Message"
        autoComplete="off"
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        className="h-11 rounded-sm border-composer-border border-2 bg-white px-4 text-base text-ink placeholder:text-gray caret-composer-border focus-visible:ring-composer-border/50 focus-visible:border-composer-border"
      />
      <Button
        type="submit"
        disabled={isPending}
        className="h-11 shrink-0 rounded-sm bg-send px-5 text-base font-medium text-white hover:bg-send-hover focus-visible:ring-white"
      >
        Send
      </Button>
    </form>
  )
}
