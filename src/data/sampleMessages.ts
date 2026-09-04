import type { Message } from '../types'

export const CURRENT_USER = 'Julian'

export const sampleMessages: Message[] = [
  {
    id: 'm1',
    author: 'Mango',
    message: 'Hi 🐈',
    createdAt: '2026-09-04T09:55:00.000Z',
  },
  {
    id: 'm2',
    author: 'JJ',
    message: 'Hola, everyone. I Wanted to get in touch with you regarding the project. Please let me know how you plan to contribute.',
    createdAt: '2026-09-04T10:10:00.000Z',
  },
  {
    id: 'm3',
    author: 'Julius',
    message: 'Ok, Bye!',
    createdAt: '2026-09-04T10:19:00.000Z',
  },
  {
    id: 'm4',
    author: 'Otto',
    message: 'Sounds good to me!',
    createdAt: '2026-09-04T10:22:00.000Z',
  },
  {
    id: 'm5',
    author: CURRENT_USER,
    message: 'Hola, everyone. I Wanted to get in touch with you regarding the project. Please let me know how you plan to contribute.',
    createdAt: '2026-09-04T14:38:00.000Z',
  },
]
