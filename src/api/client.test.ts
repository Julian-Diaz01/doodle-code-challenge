import { afterAll, afterEach, beforeAll, describe, expect, it } from 'vitest'
import { http, HttpResponse } from 'msw'
import { setupServer } from 'msw/node'
import { ApiError, createMessage, getMessages } from './client'
import type { Message } from '../types'

const BASE_URL = import.meta.env.VITE_API_BASE_URL
const MESSAGES_URL = `${BASE_URL}/api/v1/messages`

const server = setupServer()

beforeAll(() => server.listen({ onUnhandledRequest: 'error' }))
afterEach(() => server.resetHandlers())
afterAll(() => server.close())

const sampleMessage: Message = {
  _id: '1',
  message: 'hello there',
  author: 'Julian',
  createdAt: '2024-01-01T00:00:00.000Z',
}

describe('getMessages', () => {
  it('returns the messages from the API', async () => {
    server.use(http.get(MESSAGES_URL, () => HttpResponse.json([sampleMessage])))

    await expect(getMessages()).resolves.toEqual([sampleMessage])
  })

  it('forwards query params to the request', async () => {
    let receivedUrl: URL | undefined
    server.use(
      http.get(MESSAGES_URL, ({ request }) => {
        receivedUrl = new URL(request.url)
        return HttpResponse.json([])
      }),
    )

    await getMessages({ limit: 10, after: 'abc' })

    expect(receivedUrl?.searchParams.get('limit')).toBe('10')
    expect(receivedUrl?.searchParams.get('after')).toBe('abc')
  })

  it('sends the bearer token from env in the Authorization header', async () => {
    let authHeader: string | null = null
    server.use(
      http.get(MESSAGES_URL, ({ request }) => {
        authHeader = request.headers.get('authorization')
        return HttpResponse.json([])
      }),
    )

    await getMessages()

    expect(authHeader).toBe(`Bearer ${import.meta.env.VITE_API_TOKEN}`)
  })

  it('maps a NestJS-style auth error body to ApiError', async () => {
    server.use(
      http.get(MESSAGES_URL, () =>
        HttpResponse.json({ statusCode: 401, message: 'Unauthorized', error: 'Unauthorized' }, { status: 401 }),
      ),
    )

    await expect(getMessages()).rejects.toMatchObject({
      status: 401,
      message: 'Unauthorized',
    })
  })

  it('maps a validation error body with field errors into a readable message', async () => {
    server.use(
      http.get(MESSAGES_URL, () =>
        HttpResponse.json(
          {
            error: {
              message: [{ field: 'limit', message: 'must be a number' }],
              timestamp: '2024-01-01T00:00:00.000Z',
            },
          },
          { status: 400 },
        ),
      ),
    )

    await expect(getMessages()).rejects.toMatchObject({
      status: 400,
      message: 'limit: must be a number',
    })
  })

  it('maps a validation error body with a plain string message', async () => {
    server.use(
      http.get(MESSAGES_URL, () =>
        HttpResponse.json(
          { error: { message: 'Something went wrong', timestamp: '2024-01-01T00:00:00.000Z' } },
          { status: 400 },
        ),
      ),
    )

    await expect(getMessages()).rejects.toMatchObject({
      status: 400,
      message: 'Something went wrong',
    })
  })

  it('falls back to the axios error message for an unrecognized error body', async () => {
    server.use(http.get(MESSAGES_URL, () => HttpResponse.error()))

    const error = await getMessages().catch((err) => err)

    expect(error).toBeInstanceOf(ApiError)
  })
})

describe('createMessage', () => {
  it('posts the message body and resolves with the created message', async () => {
    const body = { message: 'hello', author: 'Julian' }
    server.use(
      http.post(MESSAGES_URL, async ({ request }) => {
        expect(await request.json()).toEqual(body)
        return HttpResponse.json(sampleMessage)
      }),
    )

    await expect(createMessage(body)).resolves.toEqual(sampleMessage)
  })

  it('rejects with an ApiError when the server responds with a validation error', async () => {
    server.use(
      http.post(MESSAGES_URL, () =>
        HttpResponse.json(
          {
            error: {
              message: [{ field: 'message', message: 'should not be empty' }],
              timestamp: '2024-01-01T00:00:00.000Z',
            },
          },
          { status: 400 },
        ),
      ),
    )

    await expect(createMessage({ message: '', author: 'Julian' })).rejects.toMatchObject({
      status: 400,
      message: 'message: should not be empty',
    })
  })
})
