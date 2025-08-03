import { cookies } from 'next/headers'
import { getPayload } from 'payload'
import config from '@/payload.config'

export async function getCurrentUser() {
  try {
    const cookieStore = await cookies()
    const token = cookieStore.get('payload-token')

    if (!token) {
      return null
    }

    const payload = await getPayload({ config })

    // Create a proper headers object for Payload
    const headers = new Headers()
    headers.set('cookie', `payload-token=${token.value}`)

    const { user } = await payload.auth({ headers })

    return user
  } catch (error) {
    console.error('Error getting current user:', error)
    return null
  }
}

export function isAuthorized(userRole: string, allowedRoles: string[]): boolean {
  return allowedRoles.includes(userRole)
}

export function redirectByRole(role: string): string {
  switch (role) {
    case 'ADMIN':
      return '/dashboard/admin'
    case 'TEACHER':
      return '/dashboard/teacher'
    case 'PARENT':
      return '/dashboard/parent'
    case 'STUDENT':
      return '/dashboard/student'
    default:
      return '/dashboard'
  }
}
