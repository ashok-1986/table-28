import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { password, csrfToken } = body

    const csrfCookie = request.cookies.get('csrf_token')
    if (!csrfToken || !csrfCookie || csrfToken !== csrfCookie.value) {
      return NextResponse.json({ error: 'Invalid request' }, { status: 403 })
    }

    const storedPassword = process.env.DASHBOARD_PASSWORD

    if (!password || !storedPassword) {
      return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 })
    }

    if (password !== storedPassword) {
      return NextResponse.json({ error: 'Invalid password' }, { status: 401 })
    }

    const response = NextResponse.json({ success: true })
    response.cookies.set('dash_auth', '1', {
      httpOnly: true,
      maxAge: 604800,
      path: '/',
      sameSite: 'strict',
      secure: process.env.NODE_ENV === 'production',
    })
    response.cookies.delete('csrf_token')

    return response
  } catch (err) {
    console.error('/api/auth error:', err)
    return NextResponse.json({ error: 'Internal error' }, { status: 500 })
  }
}