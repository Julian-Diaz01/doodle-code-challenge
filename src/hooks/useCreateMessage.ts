import {useMutation, useQueryClient} from '@tanstack/react-query'
import {createMessage} from '../api/client'
import type {CreateMessageBody, Message} from '../types'

export const MESSAGES_QUERY_KEY = ['messages']

export function reconcileMessage(messages: Message[] = [], optimisticId: string, createdMessage: Message): Message[] {
    //swaps the old msg with the one from the db with real id
    return messages.map((message) => (message._id === optimisticId ? createdMessage : message))
}

interface MutationContext {
    previousMessages?: Message[]
    optimisticId: string
}

export function useCreateMessage() {
    const queryClient = useQueryClient()

    return useMutation<Message, unknown, CreateMessageBody, MutationContext>({
        mutationFn: createMessage,
        onMutate: async (body) => {
            await queryClient.cancelQueries({queryKey: MESSAGES_QUERY_KEY})

            const previousMessages = queryClient.getQueryData<Message[]>(MESSAGES_QUERY_KEY)
            const optimisticId = crypto.randomUUID()
            const optimisticMessage: Message = {
                _id: optimisticId,
                message: body.message,
                author: body.author,
                createdAt: new Date().toISOString(),
            }

            queryClient.setQueryData<Message[]>(MESSAGES_QUERY_KEY, (old = []) => [...old, optimisticMessage])

            return {previousMessages, optimisticId}
        },
        onError: (_err, _newMessage, onMutateResult) => {
            if (onMutateResult) {
                queryClient.setQueryData(MESSAGES_QUERY_KEY, onMutateResult.previousMessages)
            }
        },
        onSuccess: (createdMessage, _newMessage, onMutateResult) => {
            queryClient.setQueryData<Message[]>(MESSAGES_QUERY_KEY, (old ) =>
                reconcileMessage(old, onMutateResult.optimisticId, createdMessage)
            )
        },
        onSettled: () => {
            queryClient.invalidateQueries({queryKey: MESSAGES_QUERY_KEY})
        },
    })
}
