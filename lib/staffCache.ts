import { toast } from "sonner"
import { saveDoctorsToCache } from "./doctorCache"

export interface StaffUser {
  id: number
  username: string
  email: string
  phone_number: string | null
  address: string | null
  account_type: string
  notifications: any[]
}

export type StaffRole = "admin" | "cashier" | "laboratory" | "doctor" | "nurses" | "pharmacy"

const STAFF_CACHE_KEY = "allStaffData"
const STAFF_CACHE_TIMESTAMP_KEY = "allStaffTimestamp"
export const STAFF_CACHE_DURATION_MS = 24 * 60 * 60 * 1000 // 24 hours

// In-memory cache for instant access in the same session
let memoryStaff: StaffUser[] | null = null
let inFlightStaffPromise: Promise<StaffUser[]> | null = null

export const matchStaffRole = (accountType: string | undefined | null, role: StaffRole): boolean => {
  const normalized = accountType?.toLowerCase().trim() || ""
  switch (role) {
    case "admin":
      return normalized === "admin"
    case "cashier":
      return normalized === "cashier"
    case "laboratory":
      return normalized === "laboratory" || normalized === "lab"
    case "doctor":
      return normalized === "doctor" || normalized === "doctors"
    case "nurses":
      return normalized === "nurses" || normalized === "nurse"
    case "pharmacy":
      return normalized === "pharmacy" || normalized === "pharmacist"
    default:
      return normalized === role
  }
}

/**
 * Returns all cached staff from memory or localStorage.
 * If allowExpired is false (default), only returns data younger than 24 hours.
 * If allowExpired is true, returns whatever cached data exists (used as fallback).
 */
export const getAllCachedStaff = (allowExpired = false): StaffUser[] | null => {
  if (memoryStaff && memoryStaff.length > 0 && !allowExpired) {
    return memoryStaff
  }

  if (typeof window === "undefined") return null

  try {
    const stored = localStorage.getItem(STAFF_CACHE_KEY)
    const storedTimestamp = localStorage.getItem(STAFF_CACHE_TIMESTAMP_KEY)

    if (stored) {
      const parsed: unknown = JSON.parse(stored)
      if (Array.isArray(parsed)) {
        const users = parsed as StaffUser[]

        if (allowExpired) {
          memoryStaff = users
          return users
        }

        if (storedTimestamp) {
          const timestamp = parseInt(storedTimestamp, 10)
          const isFresh = Date.now() - timestamp < STAFF_CACHE_DURATION_MS
          if (isFresh) {
            memoryStaff = users
            return users
          }
        }
      }
    }
  } catch (e) {
    console.error("Error reading cached staff data:", e)
  }

  return null
}

/**
 * Synchronously retrieves cached staff filtered by role.
 */
export const getCachedStaffByRole = (role: StaffRole, allowExpired = false): StaffUser[] | null => {
  const allStaff = getAllCachedStaff(allowExpired)
  if (!allStaff) return null
  return allStaff.filter((user) => matchStaffRole(user.account_type, role))
}

/**
 * Fetches all staff from the API or 24-hour cache.
 * Deduplicates in-flight calls and synchronizes doctors cache.
 */
export const fetchAllStaff = async (forceRefresh = false): Promise<StaffUser[]> => {
  if (!forceRefresh) {
    const cached = getAllCachedStaff(false)
    if (cached && cached.length > 0) {
      return cached
    }
  }

  if (inFlightStaffPromise) {
    return inFlightStaffPromise
  }

  inFlightStaffPromise = (async () => {
    try {
      const response = await fetch("https://api2.caregiverhospital.com/app_user/all/")
      if (!response.ok) {
        throw new Error(`Failed to fetch staff: ${response.status}`)
      }
      const data = (await response.json()) as StaffUser[]

      if (Array.isArray(data)) {
        memoryStaff = data
        if (typeof window !== "undefined") {
          try {
            localStorage.setItem(STAFF_CACHE_KEY, JSON.stringify(data))
            localStorage.setItem(STAFF_CACHE_TIMESTAMP_KEY, Date.now().toString())
          } catch (e) {
            console.error("Error saving staff data to localStorage:", e)
          }
        }

        // Also sync doctor cache so AppointmentModal and other doctor views are pre-warmed
        const doctors = data
          .filter((u) => matchStaffRole(u.account_type, "doctor"))
          .map((doc) => ({
            id: String(doc.id),
            name: doc.username || `Doctor ${doc.id}`,
          }))
          .sort((a, b) => a.name.localeCompare(b.name))

        if (doctors.length > 0) {
          saveDoctorsToCache(doctors)
        }

        return data
      }

      return []
    } catch (error) {
      console.error("Error fetching staff:", error)
      const stale = getAllCachedStaff(true)
      if (stale && stale.length > 0) {
        toast.info("Using cached staff data", {
          description: "Could not fetch latest staff list.",
          duration: 3000,
        })
        return stale
      }
      throw error
    } finally {
      inFlightStaffPromise = null
    }
  })()

  return inFlightStaffPromise
}

/**
 * Retrieves staff filtered by role, using 24-hour cache when available.
 */
export const getStaffByRole = async (role: StaffRole, forceRefresh = false): Promise<StaffUser[]> => {
  if (!forceRefresh) {
    const cached = getCachedStaffByRole(role, false)
    if (cached && cached.length > 0) {
      return cached
    }
  }

  const allUsers = await fetchAllStaff(forceRefresh)
  return allUsers.filter((user) => matchStaffRole(user.account_type, role))
}

/**
 * Removes a staff member from the cache (e.g. after deletion).
 */
export const removeStaffFromCache = (id: number): void => {
  if (memoryStaff) {
    memoryStaff = memoryStaff.filter((u) => u.id !== id)
  }
  if (typeof window !== "undefined") {
    try {
      const stored = localStorage.getItem(STAFF_CACHE_KEY)
      if (stored) {
        const parsed = JSON.parse(stored) as StaffUser[]
        const updated = parsed.filter((u) => u.id !== id)
        localStorage.setItem(STAFF_CACHE_KEY, JSON.stringify(updated))
      }
    } catch (e) {
      console.error("Error removing staff from localStorage:", e)
    }
  }
}

/**
 * Clears the staff cache (e.g. when adding a new staff member).
 */
export const clearStaffCache = (): void => {
  memoryStaff = null
  if (typeof window !== "undefined") {
    localStorage.removeItem(STAFF_CACHE_KEY)
    localStorage.removeItem(STAFF_CACHE_TIMESTAMP_KEY)
  }
}

