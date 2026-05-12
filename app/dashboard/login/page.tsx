'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'

function generateToken(): string {
  const array = new Uint8Array(32)
  crypto.getRandomValues(array)
  return Array.from(array, (b) => b.toString(16).padStart(2, '0')).join('')
}

export default function LoginPage() {
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [csrfToken, setCsrfToken] = useState('')
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  useEffect(() => {
    const token = generateToken()
    setCsrfToken(token)
    document.cookie = `csrf_token=${token}; path=/; SameSite=Strict; httpOnly`
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (loading || !csrfToken) return
    setError('')
    setLoading(true)

    try {
      const res = await fetch('/api/auth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password, csrfToken }),
      })

      if (res.ok) {
        router.push('/dashboard')
      } else {
        setError('Invalid password')
      }
    } catch {
      setError('Something went wrong')
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className="min-h-screen bg-[#0C0C0A] flex items-center justify-center p-6">
      <div className="w-full max-w-sm">
        <h1 className="font-display text-2xl text-[#C9A84C] italic text-center mb-8">
          Dashboard Access
        </h1>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="password" className="sr-only">
              Password
            </label>
            <input
              id="password"
              type="password"
              autoComplete="current-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter password"
              className="w-full px-4 py-3 bg-[#141410] border border-[#5A5644] rounded text-[#EAE6D8] font-body placeholder:text-[#5A5644] focus:outline-none focus:border-[#C9A84C]"
            />
          </div>

          {error && (
            <p role="alert" className="text-[#C04A4A] text-sm font-body">
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={loading}
            aria-disabled={loading}
            aria-busy={loading}
            className="w-full py-3 bg-[#C9A84C] text-[#0C0C0A] font-body font-semibold text-sm uppercase tracking-wider rounded hover:opacity-90 transition-opacity disabled:opacity-50"
          >
            {loading ? 'Signing in…' : 'Sign In'}
          </button>
        </form>
      </div>
    </main>
  )
}