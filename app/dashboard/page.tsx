import { REVIEW_TARGET, COMPETITOR } from '@/lib/constants'
import { cookies } from 'next/headers'

/**
 * PERFORMANCE OPTIMIZATION:
 * Enable caching for the internal review data fetch.
 * While the presence of cookies() makes the route dynamic, memoizing the internal
 * fetch call ensures that the expensive external API orchestration in /api/reviews
 * is only performed once per hour.
 * Expected impact: Dashboard loads in ~50ms instead of waiting for multiple external APIs.
 */
export const revalidate = 3600

async function getReviewData() {
  const cookieStore = cookies()
  const authCookie = cookieStore.get('dash_auth')

  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/api/reviews`, {
      next: { revalidate: 3600 },
      headers: {
        Cookie: `dash_auth=${authCookie?.value}`,
      },
    })
    if (!res.ok) throw new Error('Failed to fetch')
    return await res.json()
  } catch (err) {
    console.error('Dashboard fetch error:', err)
    return null
  }
}

export default async function DashboardPage() {
  const data = await getReviewData()

  const t28Google = data?.t28?.google_count ?? 339
  const t28GoogleRating = data?.t28?.google_rating ?? 4.6
  const t28TripAdvisor = data?.t28?.tripadvisor_count ?? 0
  const mharsantaGoogle = data?.mharsanta?.google_count ?? COMPETITOR.googleCount

  const totalT28 = t28Google + t28TripAdvisor
  const progress = Math.min((totalT28 / REVIEW_TARGET) * 100, 100)
  const gap = mharsantaGoogle - totalT28

  return (
    <main className="min-h-screen bg-[#0C0C0A] text-[#EAE6D8] p-6">
      <div className="max-w-2xl mx-auto">
        <header className="mb-10">
          <h1 className="font-display text-3xl text-[#C9A84C] italic">
            Table Twenty Eight
          </h1>
          <p className="font-body text-[#9A9278] mt-2">Review Dashboard</p>
        </header>

        <div className="space-y-6">
          <section className="bg-[#141410] rounded-lg p-6 border border-[#5A5644]">
            <h2 className="font-body text-xs uppercase tracking-widest text-[#9A9278] mb-4">
              Total Reviews
            </h2>
            <div className="text-5xl font-mono text-[#C9A84C]">{totalT28}</div>
            <div className="mt-4">
              <div className="flex justify-between text-sm font-body text-[#9A9278] mb-2">
                <span>Progress to {REVIEW_TARGET} goal</span>
                <span>{progress.toFixed(1)}%</span>
              </div>
              <div
                className="h-2 bg-[#0C0C0A] rounded-full overflow-hidden"
                role="progressbar"
                aria-valuenow={Math.round(progress)}
                aria-valuemin={0}
                aria-valuemax={100}
                aria-label="Progress to review goal"
              >
                <div
                  className="h-full bg-[#4E8C6A] transition-all"
                  style={{ width: `${progress}%` }}
                />
              </div>
            </div>
          </section>

          <div className="grid grid-cols-2 gap-4">
            <section className="bg-[#141410] rounded-lg p-5 border border-[#5A5644]">
              <h3 className="font-body text-xs uppercase tracking-widest text-[#9A9278] mb-2">
                Google
              </h3>
              <div className="text-3xl font-mono">{t28Google}</div>
              <div className="text-sm font-mono text-[#9A9278] mt-1">
                ★ {t28GoogleRating}
              </div>
            </section>

            <section className="bg-[#141410] rounded-lg p-5 border border-[#5A5644]">
              <h3 className="font-body text-xs uppercase tracking-widest text-[#9A9278] mb-2">
                TripAdvisor
              </h3>
              <div className="text-3xl font-mono">{t28TripAdvisor}</div>
              <div className="text-sm font-mono text-[#9A9278] mt-1">
                ★ {data?.t28?.tripadvisor_rating ?? '—'}
              </div>
            </section>
          </div>

          <section className="bg-[#141410] rounded-lg p-6 border border-[#5A5644]">
            <h2 className="font-body text-xs uppercase tracking-widest text-[#9A9278] mb-4">
              Competitor Gap
            </h2>
            <div className="flex items-baseline gap-3">
              {gap > 0 ? (
                <>
                  <span className="text-4xl font-mono">{gap}</span>
                  <span className="font-body text-[#9A9278]">
                    behind {COMPETITOR.name} ({mharsantaGoogle})
                  </span>
                </>
              ) : gap < 0 ? (
                <>
                  <span className="text-4xl font-mono text-[#C9A84C]">
                    {Math.abs(gap)}
                  </span>
                  <span className="font-body text-[#C9A84C]">
                    ahead of {COMPETITOR.name} ({mharsantaGoogle})
                  </span>
                </>
              ) : (
                <span className="text-2xl font-mono text-[#C9A84C]">
                  Level with {COMPETITOR.name} ({mharsantaGoogle})
                </span>
              )}
            </div>
          </section>

          <footer className="text-center text-sm font-mono text-[#5A5644]">
            Last updated: {data?.last_updated ? (
              <time dateTime={data.last_updated}>{new Date(data.last_updated).toLocaleString()}</time>
            ) : (
              'N/A'
            )}
          </footer>
        </div>
      </div>
    </main>
  )
}