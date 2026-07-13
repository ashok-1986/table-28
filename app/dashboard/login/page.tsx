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
  const [showPassword, setShowPassword] = useState(false)
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
          <div className="relative">
            <label htmlFor="password" className="sr-only">
              Password
            </label>
            <input
              id="password"
              type={showPassword ? 'text' : 'password'}
              autoComplete="current-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter password"
              className="w-full px-4 py-3 pr-12 bg-[#141410] border border-[#5A5644] rounded text-[#EAE6D8] font-body placeholder:text-[#5A5644] focus:outline-none focus:border-[#C9A84C] focus-visible:ring-2 focus-visible:ring-[#C9A84C]"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-[#5A5644] hover:text-[#C9A84C] transition-colors focus-visible:ring-2 focus-visible:ring-[#C9A84C] rounded outline-none"
              aria-label={showPassword ? 'Hide password' : 'Show password'}
            >
              {showPassword ? (
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0112 4.5c4.756 0 8.773 3.162 10.065 7.498a10.523 10.523 0 01-4.293 5.774M6.228 6.228L3 3m3.228 3.228l3.65 3.65m7.894 7.894L21 21m-3.228-3.228l-3.65-3.65m0 0a3 3 0 10-4.243-4.243m4.242 4.242L9.88 9.88" />
                </svg>
              ) : (
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.644C3.399 8.044 7.307 4.5 12 4.5c4.693 0 8.601 3.544 9.964 7.178.07.207.07.431 0 .639C20.601 15.956 16.693 19.5 12 19.5c-4.693 0-8.601-3.544-9.964-7.178z" />
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              )}
            </button>
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
            className="w-full py-3 bg-[#C9A84C] text-[#0C0C0A] font-body font-semibold text-sm uppercase tracking-wider rounded hover:opacity-90 transition-opacity disabled:opacity-50 focus-visible:ring-2 focus-visible:ring-[#C9A84C] outline-none"
          >
            {loading ? 'Signing in…' : 'Sign In'}
          </button>
        </form>
      </div>
    </main>
  )
}