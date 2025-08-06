// types/next-auth.d.ts
import { DefaultSession } from 'next-auth'

declare module 'next-auth' {
  interface Session {
    user: {
      id?: string
      // Maintain other user properties
      name?: string | null
      email?: string | null
      image?: string | null
    } & DefaultSession['user']
  }
}