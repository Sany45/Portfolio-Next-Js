"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { db } from "@/lib/firebase"
import { collection, getDocs, query, orderBy, deleteDoc, doc } from "firebase/firestore"
import Link from "next/link"

export default function ShowLeads() {
  const [leads, setLeads] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [password, setPassword] = useState("")
  const [authenticated, setAuthenticated] = useState(false)
  const [error, setError] = useState("")

  // Simple authentication - in a real app, use a more secure method
  const correctPassword = "admin123" // This should be an environment variable in production

  const handleAuthentication = (e: React.FormEvent) => {
    e.preventDefault()
    if (password === correctPassword) {
      setAuthenticated(true)
      fetchLeads()
    } else {
      setError("Incorrect password")
    }
  }

  const fetchLeads = async () => {
    try {
      setLoading(true)
      const leadsQuery = query(collection(db, "contacts"), orderBy("createdAt", "desc"))
      const querySnapshot = await getDocs(leadsQuery)

      const leadsData = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
        createdAt: doc.data().createdAt?.toDate?.() || new Date(),
      }))

      setLeads(leadsData)
    } catch (error) {
      console.error("Error fetching leads:", error)
    } finally {
      setLoading(false)
    }
  }

  const fetchVisitors = async () => {
    try {
      const visitorsQuery = query(collection(db, "visitors"), orderBy("timestamp", "desc"))
      const querySnapshot = await getDocs(visitorsQuery)

      const visitorsData = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
        timestamp: doc.data().timestamp?.toDate?.() || new Date(),
      }))

      setVisitors(visitorsData)
    } catch (error) {
      console.error("Error fetching visitors:", error)
    }
  }

  const [visitors, setVisitors] = useState<any[]>([])
  const [activeTab, setActiveTab] = useState("leads")

  const handleDeleteLead = async (id: string) => {
    if (confirm("Are you sure you want to delete this lead?")) {
      try {
        await deleteDoc(doc(db, "contacts", id))
        setLeads(leads.filter((lead) => lead.id !== id))
      } catch (error) {
        console.error("Error deleting lead:", error)
      }
    }
  }

  const handleDeleteVisitor = async (id: string) => {
    if (confirm("Are you sure you want to delete this visitor record?")) {
      try {
        await deleteDoc(doc(db, "visitors", id))
        setVisitors(visitors.filter((visitor) => visitor.id !== id))
      } catch (error) {
        console.error("Error deleting visitor record:", error)
      }
    }
  }

  useEffect(() => {
    if (authenticated) {
      fetchLeads()
      fetchVisitors()
    }
  }, [authenticated])

  if (!authenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100 dark:bg-gray-900">
        <div className="bg-white dark:bg-gray-800 p-8 rounded-lg shadow-md w-full max-w-md">
          <h1 className="text-2xl font-bold mb-6 text-center text-gray-800 dark:text-white">Admin Login</h1>

          {error && <div className="mb-4 p-3 bg-red-100 text-red-800 rounded-md">{error}</div>}

          <form onSubmit={handleAuthentication}>
            <div className="mb-4">
              <label htmlFor="password" className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">
                Password
              </label>
              <input
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-3 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Enter admin password"
              />
            </div>
            <button
              type="submit"
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-md transition-colors duration-300"
            >
              Login
            </button>
          </form>

          <div className="mt-4 text-center">
            <Link href="/" className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300">
              Back to Home
            </Link>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 p-4 sm:p-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-800 dark:text-white">Admin Dashboard</h1>
          <Link
            href="/"
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md transition-colors duration-300"
          >
            Back to Home
          </Link>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden">
          <div className="flex border-b border-gray-200 dark:border-gray-700">
            <button
              className={`px-4 py-3 font-medium ${activeTab === "leads"
                  ? "bg-blue-600 text-white"
                  : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                }`}
              onClick={() => setActiveTab("leads")}
            >
              Contact Form Leads
            </button>
            <button
              className={`px-4 py-3 font-medium ${activeTab === "visitors"
                  ? "bg-blue-600 text-white"
                  : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                }`}
              onClick={() => setActiveTab("visitors")}
            >
              Visitors
            </button>
          </div>

          {activeTab === "leads" ? (
            <div className="overflow-x-auto">
              {loading ? (
                <div className="p-6 text-center">Loading leads...</div>
              ) : leads.length === 0 ? (
                <div className="p-6 text-center">No leads found</div>
              ) : (
                <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                  <thead className="bg-gray-50 dark:bg-gray-700">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                        Name
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                        Email
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                        Phone
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                        Topic
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                        Date
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                    {leads.map((lead) => (
                      <tr key={lead.id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100">
                          {lead.name || "N/A"}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100">
                          {lead.email}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100">
                          {lead.phone}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100">
                          {lead.topic}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100">
                          {lead.createdAt instanceof Date ? lead.createdAt.toLocaleString() : "N/A"}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100">
                          <button
                            onClick={() => handleDeleteLead(lead.id)}
                            className="text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-300"
                          >
                            Delete
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          ) : (
            <div className="overflow-x-auto">
              {loading ? (
                <div className="p-6 text-center">Loading visitors...</div>
              ) : visitors.length === 0 ? (
                <div className="p-6 text-center">No visitor data found</div>
              ) : (
                <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                  <thead className="bg-gray-50 dark:bg-gray-700">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                        IP Address
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                        User Agent
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                        Date & Time
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                    {visitors.map((visitor) => (
                      <tr key={visitor.id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100">
                          {visitor.ipAddress || "N/A"}
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-900 dark:text-gray-100 max-w-xs truncate">
                          {visitor.userAgent || "N/A"}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100">
                          {visitor.timestamp instanceof Date ? visitor.timestamp.toLocaleString() : "N/A"}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100">
                          <button
                            onClick={() => handleDeleteVisitor(visitor.id)}
                            className="text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-300"
                          >
                            Delete
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
