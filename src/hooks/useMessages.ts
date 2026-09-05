import { useQuery } from '@tanstack/react-query'
import { getMessages } from '../api/client'

const POLL_INTERVAL_MS = 3500

export function useMessages() {
  const { data, isLoading, isError } = useQuery({
    queryKey: ['messages'],
    queryFn: () => getMessages(),
    select: (messages) => [...messages].sort((a, b) => Date.parse(a.createdAt) - Date.parse(b.createdAt)),
    refetchInterval: POLL_INTERVAL_MS,
    refetchIntervalInBackground: false, // stops when page is not in focus
  })

  return { messages: data ?? [], isLoading, error: isError }
}
