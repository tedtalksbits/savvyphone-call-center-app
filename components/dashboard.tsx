"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import CallControl from "./call-control"

export default function Dashboard() {
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const router = useRouter()

  useEffect(() => {
    // Check if the user is logged in
    // This is a mock check and should be replaced with actual session validation
    const checkLoginStatus = async () => {
      try {
        const response = await fetch("http://localhost:6060/accounts")
        if (response.ok) {
          setIsLoggedIn(true)
        } else {
          router.push("/")
        }
      } catch (error) {
        console.error("Error checking login status:", error)
        router.push("/")
      }
    }

    checkLoginStatus()
  }, [router])

  const handleLogout = async () => {
    try {
      const response = await fetch("http://localhost:6060/logout", {
        method: "POST",
      })
      if (response.ok) {
        router.push("/")
      }
    } catch (error) {
      console.error("Error logging out:", error)
    }
  }

  if (!isLoggedIn) {
    return <div>Loading...</div>
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Agent Dashboard</h1>
      <Button onClick={handleLogout} className="mb-4">
        Logout
      </Button>
      <CallControl />
    </div>
  )
}

