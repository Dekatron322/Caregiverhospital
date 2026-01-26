"use client"
import React, { createContext, useContext, useEffect, useState, ReactNode } from "react"
import axios from "axios"
import { getCachedUserDetails, setCachedUserDetails, clearCachedUserDetails } from "lib/userCache"
import { UserDetails } from "types/user"

interface UserContextType {
  userDetails: UserDetails | null
  loading: boolean
  error: string | null
  refetchUserDetails: () => Promise<void>
  clearUserDetails: () => void
}

const UserContext = createContext<UserContextType | undefined>(undefined)

export const useUser = () => {
  const context = useContext(UserContext)
  if (context === undefined) {
    throw new Error("useUser must be used within a UserProvider")
  }
  return context
}

interface UserProviderProps {
  children: ReactNode
}

export const UserProvider: React.FC<UserProviderProps> = ({ children }) => {
  const [userDetails, setUserDetails] = useState<UserDetails | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchUserDetails = async () => {
    try {
      setLoading(true)
      setError(null)

      // Check cache first
      const cachedUser = getCachedUserDetails()
      if (cachedUser) {
        setUserDetails(cachedUser)
        setLoading(false)
        return
      }

      const userId = localStorage.getItem("id")
      if (!userId) {
        throw new Error("User ID not found")
      }

      const response = await axios.get<UserDetails>(
        `https://api2.caregiverhospital.com/app_user/get-user-detail/${userId}/`
      )

      if (response.data) {
        // Ensure all required fields are present with defaults if API doesn't provide them
        const completeUserDetails: UserDetails = {
          id: response.data.id,
          username: response.data.username,
          email: response.data.email,
          phone_number: response.data.phone_number || "",
          address: response.data.address || "",
          account_type: response.data.account_type || "",
          notifications: response.data.notifications || [],
        }
        setUserDetails(completeUserDetails)
        setCachedUserDetails(completeUserDetails) // Cache the result
      } else {
        throw new Error("User details not found")
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Failed to fetch user details"
      setError(errorMessage)
      console.error("Error fetching user details:", err)
    } finally {
      setLoading(false)
    }
  }

  const clearUserDetails = () => {
    setUserDetails(null)
    setError(null)
    setLoading(false)
    // Clear cache when user logs out
    clearCachedUserDetails()
  }

  useEffect(() => {
    fetchUserDetails()
  }, [])

  const value: UserContextType = {
    userDetails,
    loading,
    error,
    refetchUserDetails: fetchUserDetails,
    clearUserDetails,
  }

  return <UserContext.Provider value={value}>{children}</UserContext.Provider>
}
