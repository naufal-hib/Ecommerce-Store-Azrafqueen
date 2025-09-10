import "next-auth"
import "next-auth/jwt"

// Define the custom user properties
interface User {
  role?: string
}

// Extend the built-in session and JWT types
declare module "next-auth" {
  interface Session {
    user: User & {
      id?: string
      role?: string
    }
  }
  
  interface User {
    role?: string
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    role?: string
  }
}