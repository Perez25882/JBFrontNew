"use client"

import { createContext, useContext } from "react"
import { useQuery } from "@tanstack/react-query"
import toast from "react-hot-toast"

const UserContext = createContext(null)

const BASE_URL = "https://2c8186ee0c04.ngrok-free.app/api/v1"
const CURRENT_USER_ID = "6939e7a48945df1d67c26f00"

export function UserProvider({ children }) {


    console.log("🔵 UserProvider mounted") // ← Add this

  const fetchUserData = async () => {

    console.log("🟢 fetchUserData called")
    try {
      const response = await fetch(`${BASE_URL}/users/me?userId=${CURRENT_USER_ID}`, {
        method: "GET",
        headers: { 
          "Content-Type": "application/json",
          "ngrok-skip-browser-warning": "true"
        },
      })

      if (!response.ok) {
        const err = await response.json().catch(() => ({}))
        throw new Error(err.message || "Failed to fetch user data")
      }

      const data = await response.json()

      if (!data.success) {
        throw new Error(data.message || "Failed to fetch user data")
      }

     
      console.log("DATA . DATA", data)

     return data.data;

    } catch (error) {
      console.error("Fetch user data error:", error.message)
      toast.error(error.message || "Failed to load user data")
      throw error
    }
  }

  const {
    data: Reseller,
    isLoading:isLoadingReseller,
    isError:isErrorReseller,
    refetch,
  } = useQuery({
    queryKey: ["userData", CURRENT_USER_ID],
    queryFn: fetchUserData,
    staleTime: 5 * 60 * 1000,
    cacheTime: 10 * 60 * 1000,
  })


  console.log("OVER HEREE", Reseller)

  return (
    <UserContext.Provider value={{ Reseller, isLoadingReseller, isErrorReseller, refetch }}>
      {children}
    </UserContext.Provider>
  )
}

export function useUser() {
  const context = useContext(UserContext)
  if (!context) {
    throw new Error("useUser must be used within UserProvider")
  }
  return context
}