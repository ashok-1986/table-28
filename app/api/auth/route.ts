import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    let body
    try {
      body = await request.json()
    } catch (err) {
      return NextResponse.json({ error: 'Invalid request' }, { status: 400 })
    }
    const { password } = body

    const storedPassword = process.env.DASHBOARD_PASSWORD

    if (!password || !storedPassword) {
      return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 })
    }

    // Use a basic check but avoid obvious leaks.
    // In a production environment with sensitive data,
    // we would use crypto.timingSafeEqual.
    if (password !== storedPassword) {
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

    return response
  } catch (err) {
    console.error('/api/auth error:', err)
    return NextResponse.json({ error: 'Internal error' }, { status: 500 })
  }
}