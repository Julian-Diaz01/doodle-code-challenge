import type { ReactNode } from 'react'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { act, renderHook, waitFor } from '@testing-library/react'
import { MESSAGES_QUERY_KEY, reconcileMessage, useCreateMessage } from './useCreateMessage'
import * as client from '../api/client'
import type { Message } from '../types'

vi.mock('../api/client')

function createWrapper(queryClient: QueryClient) {
  return function Wrapper({ children }: { children: ReactNode }) {
    return <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  }
}

describe('reconcileMessage', () => {
  const persisted: Message = { _id: 'server-1', message: 'hi', author: 'A', createdAt: '2024-01-01T00:00:00.000Z' }

  it('replaces the optimistic message with the persisted one', () => {
    const optimistic: Message = { _id: 'temp-1', message: 'hi', author: 'A', createdAt: '2024-01-01T00:00:00.000Z' }

    expect(reconcileMessage([optimistic], 'temp-1', persisted)).toEqual([persisted])
  })

  it('leaves unrelated messages untouched', () => {
    const other: Message = { _id: 'other', message: 'x', author: 'B', createdAt: '2024-01-01T00:00:00.000Z' }
    const optimistic: Message = { _id: 'temp-1', message: 'hi', author: 'A', createdAt: '2024-01-01T00:00:00.000Z' }

    expect(reconcileMessage([other, optimistic], 'temp-1', persisted)).toEqual([other, persisted])
  })

  it('defaults to an empty array when there are no cached messages', () => {
    expect(reconcileMessage(undefined, 'temp-1', persisted)).toEqual([])
  })
})

describe('useCreateMessage', () => {
  let queryClient: QueryClient

  beforeEach(() => {
    vi.clearAllMocks()
    queryClient = new QueryClient({
      defaultOptions: { queries: { retry: false }, mutations: { retry: false } },
    })
  })

  it('optimistically appends the new message before the request resolves', async () => {
    let resolveCreate!: (message: Message) => void
    vi.mocked(client.createMessage).mockReturnValue(
      new Promise((resolve) => {
        resolveCreate = resolve
      }),
    )
    queryClient.setQueryData<Message[]>(MESSAGES_QUERY_KEY, [])

    const { result } = renderHook(() => useCreateMessage(), { wrapper: createWrapper(queryClient) })

    act(() => {
      result.current.mutate({ message: 'hello', author: 'Julian' })
    })

    await waitFor(() => {
      const cached = queryClient.getQueryData<Message[]>(MESSAGES_QUERY_KEY)
      expect(cached).toHaveLength(1)
    })
    expect(queryClient.getQueryData<Message[]>(MESSAGES_QUERY_KEY)?.[0]).toMatchObject({
      message: 'hello',
      author: 'Julian',
    })

    resolveCreate({ _id: 'server-1', message: 'hello', author: 'Julian', createdAt: '2024-01-01T00:00:00.000Z' })

    await waitFor(() => expect(result.current.isSuccess).toBe(true))

    expect(queryClient.getQueryData<Message[]>(MESSAGES_QUERY_KEY)).toEqual([
      { _id: 'server-1', message: 'hello', author: 'Julian', createdAt: '2024-01-01T00:00:00.000Z' },
    ])
  })

  it('rolls back the optimistic message when the request fails', async () => {
    queryClient.setQueryData<Message[]>(MESSAGES_QUERY_KEY, [])
    vi.mocked(client.createMessage).mockRejectedValue(new Error('network down'))

    const { result } = renderHook(() => useCreateMessage(), { wrapper: createWrapper(queryClient) })

    act(() => {
      result.current.mutate({ message: 'hello', author: 'Julian' })
    })

    await waitFor(() => expect(result.current.isError).toBe(true))

    expect(queryClient.getQueryData<Message[]>(MESSAGES_QUERY_KEY)).toEqual([])
  })

  it('exposes isPending while the mutation is in flight', async () => {
    vi.mocked(client.createMessage).mockReturnValue(new Promise(() => {}))

    const { result } = renderHook(() => useCreateMessage(), { wrapper: createWrapper(queryClient) })

    act(() => {
      result.current.mutate({ message: 'hello', author: 'Julian' })
    })

    await waitFor(() => expect(result.current.isPending).toBe(true))
  })
})
