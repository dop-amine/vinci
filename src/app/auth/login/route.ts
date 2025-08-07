import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'
import { getPayload } from 'payload'
import config from '@/payload.config'

export async function POST(request: Request) {
  try {
    let email = ''
    let password = ''

    const contentType = request.headers.get('content-type') || ''
    if (contentType.includes('application/json')) {
      const body = await request.json()
      email = body?.email ?? ''
      password = body?.password ?? ''
    } else {
      const formData = await request.formData()
      email = String(formData.get('email') ?? '')
      password = String(formData.get('password') ?? '')
    }

    if (!email || !password) {
      return NextResponse.json({ error: 'Email and password required' }, { status: 400 })
    }

    const payload = await getPayload({ config })
    const result = await payload.login({
      collection: 'users',
      data: { email, password },
    })

    const exp = (result?.exp ?? null) as number | null
    const cookieStore = await cookies()

    if (!result.token) {
      return NextResponse.json({ error: 'Login failed - no token received' }, { status: 401 })
    }

    cookieStore.set('payload-token', result.token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      expires: exp ? new Date(exp * 1000) : undefined,
    })

    // Redirect to dashboard; the dashboard code will redirect by role
    return NextResponse.redirect(new URL('/dashboard', request.url), { status: 303 })
  } catch (_error) {
    return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 })
  }
}
