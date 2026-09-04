export interface Message {
  _id: string
  message: string
  author: string
  createdAt: string
}

export interface CreateMessageBody {
  message: string
  author: string
}

export interface GetMessagesQuery {
  limit?: number
  after?: string
  before?: string
}

export interface ApiValidationErrorItem {
  field: string
  message: string
}

export interface ApiErrorBody {
  error: {
    message: string | ApiValidationErrorItem[]
    timestamp: string
  }
}

export interface ApiAuthError {
  message: string
  statusCode: number
  error: string
}
