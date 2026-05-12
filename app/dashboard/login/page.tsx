'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

export default function LoginPage() {
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    try {
      const res = await fetch('/api/auth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password }),
      })

      if (res.ok) {
        router.push('/dashboard')
      } else {
        setError('Invalid password')
      }
    } catch (err) {
      setError('Something went wrong')
    }
  }

  return (
    <main className="min-h-screen bg-[#0C0C0A] flex items-center justify-center p-6">
      <div className="w-full max-w-sm">
        <h1 className="font-display text-2xl text-[#C9A84C] italic text-center mb-8">
          Dashboard Access
        </h1>

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Enter password"
            className="w-full px-4 py-3 bg-[#141410] border border-[#5A5644] rounded text-[#EAE6D8] font-body placeholder:text-[#5A5644] focus:outline-none focus:border-[#C9A84C]"
          />

          {error && (
            <p className="text-[#C04A4A] text-sm font-body">{error}</p>
          )}

          <button
            type="submit"
            className="w-full py-3 bg-[#C9A84C] text-[#0C0C0A] font-body font-semibold text-sm uppercase tracking-wider rounded hover:opacity-90 transition-opacity"
          >
            Sign In
          </button>
        </form>
      </div>
    </main>
  )
}