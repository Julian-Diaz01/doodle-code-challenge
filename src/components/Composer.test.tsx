import { beforeEach, describe, expect, it, vi } from 'vitest'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { Composer } from './Composer'
import * as client from '../api/client'

vi.mock('../api/client')

function renderComposer() {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false }, mutations: { retry: false } },
  })
  return render(
    <QueryClientProvider client={queryClient}>
      <Composer currentUser="Julian" />
    </QueryClientProvider>,
  )
}

describe('Composer', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('disables the send button while a message is in flight', async () => {
    vi.mocked(client.createMessage).mockReturnValue(new Promise(() => {}))
    const user = userEvent.setup()
    renderComposer()

    await user.type(screen.getByLabelText('Message'), 'hi')
    await user.click(screen.getByRole('button', { name: /send/i }))

    expect(screen.getByRole('button', { name: /send/i })).toBeDisabled()
  })

  it('does not submit whitespace-only input', async () => {
    const user = userEvent.setup()
    renderComposer()

    await user.type(screen.getByLabelText('Message'), '   ')
    await user.click(screen.getByRole('button', { name: /send/i }))

    expect(client.createMessage).not.toHaveBeenCalled()
  })

  it('submits the trimmed message and clears the input', async () => {
    vi.mocked(client.createMessage).mockResolvedValue({
      _id: '1',
      message: 'hi',
      author: 'Julian',
      createdAt: '2024-01-01T00:00:00.000Z',
    })
    const user = userEvent.setup()
    renderComposer()

    const input = screen.getByLabelText('Message') as HTMLInputElement
    await user.type(input, '  hi  ')
    await user.click(screen.getByRole('button', { name: /send/i }))

    expect(client.createMessage).toHaveBeenCalledWith(
      { message: 'hi', author: 'Julian' },
      expect.anything(),
    )
    expect(input.value).toBe('')
  })
})
