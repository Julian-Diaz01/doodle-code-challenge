import { Input } from './ui/input'
import { Button } from './ui/button'

export function Composer() {
  return (
    <form
      className="flex items-center gap-2 bg-composer px-2 py-2"
      onSubmit={(e) => e.preventDefault()}
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
        className="h-11 rounded-sm border-composer-border border-2 bg-white px-4 text-base text-ink placeholder:text-gray caret-composer-border focus-visible:ring-composer-border/50 focus-visible:border-composer-border"
      />
      <Button
        type="submit"
        className="h-11 shrink-0 rounded-sm bg-send px-5 text-base font-medium text-white hover:bg-send-hover focus-visible:ring-white"
      >
        Send
      </Button>
    </form>
  )
}
