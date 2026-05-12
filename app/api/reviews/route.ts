import { NextResponse } from 'next/server'
import {
  TRIPADVISOR_LOCATION_ID,
  FALLBACK_DATA,
  COMPETITOR,
} from '@/lib/constants'

export const dynamic = 'force-dynamic'

async function fetchGooglePlace(placeId: string, apiKey: string) {
  if (!placeId || !apiKey) return null

  try {
    const res = await fetch(
      `https://places.googleapis.com/v1/places/${placeId}`,
      {
        headers: {
          'X-Goog-Api-Key': apiKey,
          'X-Goog-FieldMask': 'rating,userRatingsTotal',
        },
      }
    )
    if (!res.ok) return null
    const data = await res.json()
    return {
      rating: data.rating || 0,
      count: data.userRatingsTotal || 0,
    }
  } catch (err) {
    console.error('Google Places API error:', err)
    return null
  }
}

async function fetchTripAdvisor(locationId: string, apiKey: string) {
  if (!locationId || !apiKey) return null

  try {
    const res = await fetch(
      `https://api.content.tripadvisor.com/api/v1/location/${locationId}/details?key=${apiKey}&language=en`
    )
    if (!res.ok) return null
    const data = await res.json()
    return {
      rating: data.rating ? parseFloat(data.rating) : 0,
      count: data.num_reviews ? parseInt(data.num_reviews, 10) : 0,
    }
  } catch (err) {
    console.error('TripAdvisor API error:', err)
    return null
  }
}

export async function GET() {
  const googleKey = process.env.GOOGLE_PLACES_API_KEY
  const t28PlaceId = process.env.T28_GOOGLE_PLACE_ID
  const mharsantaPlaceId = process.env.MHARSANTA_PLACE_ID
  const tripKey = process.env.TRIPADVISOR_API_KEY

  try {
    const [t28Google, mharsantaGoogle, tripAdvisor] = await Promise.all([
      t28PlaceId && googleKey ? fetchGooglePlace(t28PlaceId, googleKey) : Promise.resolve(null),
      mharsantaPlaceId && googleKey ? fetchGooglePlace(mharsantaPlaceId, googleKey) : Promise.resolve(null),
      tripKey ? fetchTripAdvisor(TRIPADVISOR_LOCATION_ID, tripKey) : Promise.resolve(null),
    ])

    const result = {
      t28: {
        google_count: t28Google?.count ?? FALLBACK_DATA.t28.google_count,
        google_rating: t28Google?.rating ?? FALLBACK_DATA.t28.google_rating,
        tripadvisor_count: tripAdvisor?.count ?? FALLBACK_DATA.t28.tripadvisor_count,
        tripadvisor_rating: tripAdvisor?.rating ?? FALLBACK_DATA.t28.tripadvisor_rating,
      },
      mharsanta: {
        google_count: mharsantaGoogle?.count ?? COMPETITOR.googleCount,
        google_rating: mharsantaGoogle?.rating ?? COMPETITOR.googleRating,
      },
      last_updated: new Date().toISOString(),
    }

    return NextResponse.json(result)
  } catch (err) {
    console.error('/api/reviews error:', err)
    return NextResponse.json(FALLBACK_DATA)
  }
}