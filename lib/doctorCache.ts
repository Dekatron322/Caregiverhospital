import { toast } from "sonner"

export interface Doctor {
  id: string
  name: string
}

const CACHE_KEY = "doctorsData"
const TIMESTAMP_KEY = "doctorsTimestamp"
export const CACHE_DURATION_MS = 24 * 60 * 60 * 1000 // 24 hours

// In-memory cache for ultra-fast access within the same session
let inMemoryDoctors: Doctor[] | null = null
let inFlightFetchPromise: Promise<Doctor[]> | null = null

/**
 * Retrieves doctors from memory or localStorage.
 * If allowExpired is false (default), only returns data younger than 24 hours.
 * If allowExpired is true, returns whatever cached data exists (used as network fallback).
 */
export const getCachedDoctors = (allowExpired = false): Doctor[] | null => {
  if (inMemoryDoctors && inMemoryDoctors.length > 0 && !allowExpired) {
    return inMemoryDoctors
  }

  if (typeof window === "undefined") return null

  try {
    const storedDoctors = localStorage.getItem(CACHE_KEY)
    const storedTimestamp = localStorage.getItem(TIMESTAMP_KEY)

    if (storedDoctors) {
      const parsed: unknown = JSON.parse(storedDoctors)

      if (
        Array.isArray(parsed) &&
        parsed.every((doc) => typeof doc === "object" && doc !== null && "id" in doc && "name" in doc)
      ) {
        const validatedDoctors: Doctor[] = parsed.map((doc: any) => ({
          id: String(doc.id),
          name: String(doc.name),
        }))

        if (allowExpired) {
          inMemoryDoctors = validatedDoctors
          return validatedDoctors
        }

        if (storedTimestamp) {
          const timestamp = parseInt(storedTimestamp, 10)
          const isFresh = Date.now() - timestamp < CACHE_DURATION_MS

          if (isFresh) {
            inMemoryDoctors = validatedDoctors
            return validatedDoctors
          }
        }
      }
    }
  } catch (error) {
    console.error("Error reading cached doctors:", error)
  }

  return null
}

/**
 * Stores doctors into in-memory cache and localStorage with current timestamp.
 */
export const saveDoctorsToCache = (doctors: Doctor[]): void => {
  inMemoryDoctors = doctors
  if (typeof window === "undefined") return

  try {
    localStorage.setItem(CACHE_KEY, JSON.stringify(doctors))
    localStorage.setItem(TIMESTAMP_KEY, Date.now().toString())
  } catch (error) {
    console.error("Error caching doctors to localStorage:", error)
  }
}

/**
 * Fetches the doctors list.
 * - Uses 24-hour cache first (no API call if cached within 24h).
 * - Deduplicates in-flight network requests.
 * - Falls back to stale cache if the API request fails.
 */
export const getDoctorsList = async (forceRefresh = false): Promise<Doctor[]> => {
  // 1. If not forcing refresh, return valid 24h cache immediately
  if (!forceRefresh) {
    const cached = getCachedDoctors(false)
    if (cached && cached.length > 0) {
      return cached
    }
  }

  // 2. Deduplicate ongoing fetch requests
  if (inFlightFetchPromise) {
    return inFlightFetchPromise
  }

  // 3. Initiate fetch with request deduplication
  inFlightFetchPromise = (async () => {
    try {
      const response = await fetch("https://api2.caregiverhospital.com/app_user/all/")
      if (!response.ok) {
        throw new Error(`Failed to fetch doctors: ${response.status}`)
      }

      const data = (await response.json()) as any[]

      // Also warm staff cache in localStorage
      if (typeof window !== "undefined" && Array.isArray(data)) {
        try {
          localStorage.setItem("allStaffData", JSON.stringify(data))
          localStorage.setItem("allStaffTimestamp", Date.now().toString())
        } catch (e) {
          console.error("Error caching staff data:", e)
        }
      }

      // Filter users who are doctors (handles "Doctor", "Doctors", with trimming and case-insensitivity)
      const filteredDoctors: Doctor[] = data
        .filter((user: any) => {
          const role = user.account_type?.toLowerCase().trim()
          return role === "doctor" || role === "doctors"
        })
        .map((doc: any) => ({
          id: String(doc.id),
          name: doc.username || `Doctor ${doc.id}`,
        }))
        .sort((a, b) => a.name.localeCompare(b.name))

      if (filteredDoctors.length > 0) {
        saveDoctorsToCache(filteredDoctors)
        return filteredDoctors
      }

      // If response is empty, check if we have any stale cache
      const stale = getCachedDoctors(true)
      if (stale && stale.length > 0) {
        return stale
      }

      return filteredDoctors
    } catch (error) {
      console.error("Error fetching doctors:", error)

      // Fallback: Use stale cache if available
      const staleDoctors = getCachedDoctors(true)
      if (staleDoctors && staleDoctors.length > 0) {
        toast.info("Using cached doctors data", {
          description: "Could not fetch latest doctors list.",
          duration: 3000,
        })
        return staleDoctors
      }

      throw error
    } finally {
      inFlightFetchPromise = null
    }
  })()

  return inFlightFetchPromise
}

export const clearDoctorsCache = (): void => {
  inMemoryDoctors = null
  if (typeof window !== "undefined") {
    localStorage.removeItem(CACHE_KEY)
    localStorage.removeItem(TIMESTAMP_KEY)
  }
}

