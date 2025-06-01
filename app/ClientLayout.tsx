"use client"

import type React from "react"

import { useEffect } from "react"
import { usePathname, useRouter } from "next/navigation"
import { db } from "@/lib/firebase"
import { collection, addDoc, serverTimestamp } from "firebase/firestore"
import Navbar from "@/components/Navbar"
import Footer from "@/components/Footer"
import useAuthStatus from "@/hooks/useAuthStatus"

export default function ClientLayout({
  children,
}: {
  children: React.ReactNode
}) {


  const pathname = usePathname()
  const router = useRouter()


  useEffect(() => {
    // Only track visitors on the root page
    if (!pathname.includes('admin-panel')) {
      const trackVisitor = async () => {
        try {
          // Get IP address using a public API
          const ipResponse = await fetch("https://api.ipify.org?format=json")
          const ipData = await ipResponse.json()
          const ipAddress = ipData.ip

          // Get user agent from browser
          const userAgent = navigator.userAgent

          // Save visitor data to Firebase
          await addDoc(collection(db, "portfolio", "shahriar", "visitors"), {
            ipAddress,
            userAgent,
            pathname,
            timestamp: serverTimestamp(),
          })
        } catch (error) {
          console.log("Error tracking visitor:", error)
        }
      }

      trackVisitor()
    }

  }, [pathname])

  if (!pathname.includes('admin-panel')) {
    return (
      <>
        <Navbar />
        {children}
        <Footer />
      </>
    )
  }
  return (
    <>
      {children}
    </>
  )

}
