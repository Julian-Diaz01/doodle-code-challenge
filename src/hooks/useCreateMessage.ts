import { useMutation, useQueryClient } from '@tanstack/react-query'
import { createMessage } from '../api/client'

export function useCreateMessage() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: createMessage,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['messages'] })
    },
  })
}
