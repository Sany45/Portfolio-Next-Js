"use client"

import type React from "react"

import { useEffect } from "react"
import { usePathname } from "next/navigation"
import { db } from "@/lib/firebase"
import { collection, addDoc, serverTimestamp } from "firebase/firestore"
import "./globals.css"

export default function ClientLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const pathname = usePathname()

  useEffect(() => {
    // Only track visitors on the root page
    if (pathname === "/") {
      const trackVisitor = async () => {
        try {
          // Get IP address using a public API
          const ipResponse = await fetch("https://api.ipify.org?format=json")
          const ipData = await ipResponse.json()
          const ipAddress = ipData.ip

          // Get user agent from browser
          const userAgent = navigator.userAgent

          // Save visitor data to Firebase
          await addDoc(collection(db, "visitors"), {
            ipAddress,
            userAgent,
            pathname,
            timestamp: serverTimestamp(),
          })
        } catch (error) {
          console.error("Error tracking visitor:", error)
        }
      }

      trackVisitor()
    }
  }, [pathname])

  return (
    // <html lang="en">
    // <body>{children}</body>
    // </html>
    <>
      {children}
    </>
  )
}
