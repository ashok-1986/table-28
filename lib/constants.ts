export const GOOGLE_REVIEW_URL =
  "https://www.google.com/maps/place/Table+Twenty+Eight/@55.8582319,-4.2471536,17z/data=!3m1!5s0x488846a146f0ed17:0xeb1e066c65aa3734!4m14!1m7!3m6!1s0x488847f9342ced61:0xb5d5f34127c117dc!2sTable+Twenty+Eight!8m2!3d55.8582289!4d-4.2445733!16s%2Fg%2F11kqsbznls/reviews"

export const TRIPADVISOR_URL =
  "https://www.tripadvisor.co.uk/UserReviewEdit-g186534-d26356397-Table_Twenty_Eight-Glasgow_Scotland.html"

export const TRIPADVISOR_LOCATION_ID = "26356397"

export const QR_SOURCES = ["receipt", "table", "bar", "door"] as const
export type QRSource = (typeof QR_SOURCES)[number] | "unknown"

export const REVIEW_TARGET = 600

export const COMPETITOR = {
  name: "Mharsanta",
  googleRating: 4.4,
  googleCount: 2487,
}

export const FALLBACK_DATA = {
  t28: {
    google_count: 339,
    google_rating: 4.6,
    tripadvisor_count: 0,
    tripadvisor_rating: 0,
  },
  mharsanta: {
    google_count: 2487,
    google_rating: 4.4,
  },
  last_updated: new Date().toISOString(),
}