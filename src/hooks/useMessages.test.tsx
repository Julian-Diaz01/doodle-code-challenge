import type { ReactNode } from 'react'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { renderHook, waitFor } from '@testing-library/react'
import { useMessages } from './useMessages'
import * as client from '../api/client'
import type { Message } from '../types'

vi.mock('../api/client')

function createWrapper() {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false } },
  })
  return function Wrapper({ children }: { children: ReactNode }) {
    return <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  }
}

const older: Message = { _id: '1', message: 'first', author: 'Me', createdAt: '2024-01-01T00:00:00.000Z' }
const newer: Message = { _id: '2', message: 'second', author: 'Me', createdAt: '2024-01-02T00:00:00.000Z' }

describe('useMessages', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('starts in a loading state with no messages', () => {
    vi.mocked(client.getMessages).mockReturnValue(new Promise(() => {}))

    const { result } = renderHook(() => useMessages(), { wrapper: createWrapper() })

    expect(result.current.isLoading).toBe(true)
    expect(result.current.messages).toEqual([])
    expect(result.current.error).toBe(false)
  })

  it('sorts messages ascending by createdAt regardless of API order', async () => {
    vi.mocked(client.getMessages).mockResolvedValue([newer, older])

    const { result } = renderHook(() => useMessages(), { wrapper: createWrapper() })

    await waitFor(() => expect(result.current.isLoading).toBe(false))

    expect(result.current.messages.map((m) => m._id)).toEqual(['1', '2'])
  })

  it('exposes an error flag and empty messages when the fetch fails', async () => {
    vi.mocked(client.getMessages).mockRejectedValue(new Error('network down'))

    const { result } = renderHook(() => useMessages(), { wrapper: createWrapper() })

    await waitFor(() => expect(result.current.error).toBe(true))

    expect(result.current.messages).toEqual([])
    expect(result.current.isLoading).toBe(false)
  })
})
