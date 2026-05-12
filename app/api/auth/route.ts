import { NextRequest, NextResponse } from 'next/server'
import { timingSafeEqual } from 'crypto'

export async function POST(request: NextRequest) {
  try {
    let body
    try {
      body = await request.json()
    } catch {
      return NextResponse.json({ error: 'Invalid request' }, { status: 400 })
    }
    const { password, csrfToken } = body

    const csrfCookie = request.cookies.get('csrf_token')
    if (!csrfToken || !csrfCookie || csrfToken !== csrfCookie.value) {
      return NextResponse.json({ error: 'Invalid request' }, { status: 403 })
    }

    const storedPassword = process.env.DASHBOARD_PASSWORD

    if (!password || !storedPassword) {
      return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 })
    }

    const match =
      password.length === storedPassword.length &&
      timingSafeEqual(Buffer.from(password), Buffer.from(storedPassword))
    if (!match) {
      return NextResponse.json({ error: 'Invalid password' }, { status: 401 })
    }

    const response = NextResponse.json({ success: true })
    response.cookies.set('dash_auth', '1', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      maxAge: 604800,
      path: '/',
      sameSite: 'strict',
    })
    response.cookies.delete('csrf_token')

    return response
  } catch (err) {
    console.error('/api/auth error:', err)
    return NextResponse.json({ error: 'Internal error' }, { status: 500 })
  }
}