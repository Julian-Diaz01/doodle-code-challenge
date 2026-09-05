import axios, { AxiosError } from 'axios'
import type { ApiAuthError, ApiErrorBody, CreateMessageBody, GetMessagesQuery, Message } from '../types'

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  headers: {
    Authorization: `Bearer ${import.meta.env.VITE_API_TOKEN}`,
  },
})

export class ApiError extends Error {
  readonly status: number

  constructor(status: number, message: string) {
    super(message)
    this.name = 'ApiError'
    this.status = status
  }
}

function isApiAuthError(error: unknown): error is ApiAuthError {
  return (
    typeof error === 'object' &&
    error !== null &&
    typeof (error as ApiAuthError).statusCode === 'number' &&
    typeof (error as ApiAuthError).message === 'string'
  )
}

function isApiErrorBody(error: unknown): error is ApiErrorBody {
  return (
    typeof error === 'object' &&
    error !== null &&
    typeof (error as ApiErrorBody).error === 'object' &&
    (error as ApiErrorBody).error !== null
  )
}

function toApiError(err: AxiosError): ApiError {
  const status = err.response?.status ?? 0
  const errorBody = err.response?.data

  if (isApiAuthError(errorBody)) {
    return new ApiError(errorBody.statusCode, errorBody.message)
  }

  if (isApiErrorBody(errorBody)) {
    const { message } = errorBody.error
    return new ApiError(
      status,
      Array.isArray(message) ? message.map((item) => `${item.field}: ${item.message}`).join('; ') : message,
    )
  }

  return new ApiError(status, err.message || 'Request failed')
}

api.interceptors.response.use(undefined, (err) => {
  throw axios.isAxiosError(err) ? toApiError(err) : err
})

export function getMessages(query?: GetMessagesQuery): Promise<Message[]> {
  return api.get<Message[]>('/api/v1/messages', { params: query }).then((res) => res.data)
}

export function createMessage(body: CreateMessageBody): Promise<Message> {
  return api.post<Message>('/api/v1/messages', body).then((res) => res.data)
}
