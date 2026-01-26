import { UserDetails } from "types/user"

interface CachedUserDetails extends UserDetails {
  timestamp: number
}

const CACHE_KEY = "userDetails"
const CACHE_DURATION = 30 * 60 * 1000 // 30 minutes

export const getCachedUserDetails = (): UserDetails | null => {
  if (typeof window === "undefined") return null

  try {
    const cached = localStorage.getItem(CACHE_KEY)
    if (!cached) return null

    const parsed = JSON.parse(cached) as CachedUserDetails

    // Check if cache is still valid
    if (Date.now() - parsed.timestamp > CACHE_DURATION) {
      localStorage.removeItem(CACHE_KEY)
      return null
    }

    const { timestamp, ...userDetails } = parsed
    return userDetails
  } catch (error) {
    console.error("Error parsing cached user details:", error)
    localStorage.removeItem(CACHE_KEY)
    return null
  }
}

export const setCachedUserDetails = (userDetails: UserDetails): void => {
  if (typeof window === "undefined") return

  try {
    const cached: CachedUserDetails = {
      ...userDetails,
      timestamp: Date.now(),
    }
    localStorage.setItem(CACHE_KEY, JSON.stringify(cached))
  } catch (error) {
    console.error("Error caching user details:", error)
  }
}

export const clearCachedUserDetails = (): void => {
  if (typeof window === "undefined") return
  localStorage.removeItem(CACHE_KEY)
}
