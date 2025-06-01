"use client"

import type React from "react"

import { useEffect } from "react"
import { usePathname, useRouter } from "next/navigation"
import useAuthStatus from "@/hooks/useAuthStatus"
import AdminSidebar from "@/components/AdminSidebar"

export default function ClientLayout({
  children,
}: {
  children: React.ReactNode
}) {


  const pathname = usePathname()
  const { isLoading, user } = useAuthStatus()
  const router = useRouter()

  useEffect(() => {
    if (!isLoading && user?.email !== 'shahriarsany57@gmail.com') {
      if (pathname.includes('admin-panel')) {
        router.push('/sign-in')
      }
    }
  }, [user])


  if (user?.email === 'shahriarsany57@gmail.com') {
    return (
      <>
        <div className="flex w-full justify-between">
          <AdminSidebar />
          <div className="flex-grow">
            {children}
          </div>
        </div>
      </>
    )
  }


}
