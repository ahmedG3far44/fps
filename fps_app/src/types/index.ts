import type { User } from "next-auth"

declare module "next-auth" {
  interface User {
    role?: string
    onboarded?: boolean
  }
  interface Session {
    user: {
      id: string
      name?: string | null
      email?: string | null
      image?: string | null
      role: string
      onboarded?: boolean
    }
  }
}
