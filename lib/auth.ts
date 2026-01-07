import { NextRequest } from 'next/server'

export function getUserId(request: NextRequest): string | null {
  return request.headers.get('x-user-id')
}

export function setUserIdHeader(headers: Headers, userId: string) {
  headers.set('x-user-id', userId)
}

