import { useQuery } from '@tanstack/react-query'
import { getMessages } from '../api/client'

export function useMessages() {
  const { data, isError } = useQuery({
    queryKey: ['messages'],
    queryFn: () => getMessages(),
    select: (messages) => [...messages],
  })

  return { messages: data ?? [], error: isError }
}
