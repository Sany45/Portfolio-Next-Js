"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import Navbar from "../../../components/Navbar"
import AdminSidebar from "../../../components/AdminSidebar"
import {
  FiGlobe,
  FiMonitor,
  FiCalendar,
  FiTrash2,
  FiDownload,
  FiSearch,
  FiFilter,
  FiMapPin,
  FiClock,
  FiTrendingUp,
  FiEye,
} from "react-icons/fi"
import { collection, getDocs, query, orderBy, deleteDoc, doc, getFirestore } from "firebase/firestore"
import { db } from "@/lib/firebase"

export default function VisitorsPage() {
  const [visitors, setVisitors] = useState<any>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [filterBy, setFilterBy] = useState("all")
  const [sortBy, setSortBy] = useState("newest")

  useEffect(() => {
    fetchVisitors()
  }, [])

  const fetchVisitors = async () => {
    try {
      setLoading(true)
      const visitorsQuery = query(collection(db, "portfolio", "shahriar", "visitors"), orderBy("timestamp", "desc"))
      const querySnapshot = await getDocs(visitorsQuery)

      const visitorsData = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
        timestamp: doc.data().timestamp?.toDate?.() || new Date(),
      }))

      setVisitors(visitorsData)
    } catch (error) {
      console.error("Error fetching visitors:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleDeleteVisitor = async (id: any) => {
    if (confirm("Are you sure you want to delete this visitor record?")) {
      try {
        await deleteDoc(doc(db, "portfolio", "shahriar", "visitors", id))
        setVisitors(visitors.filter((visitor: any) => visitor.id !== id))
      } catch (error) {
        console.error("Error deleting visitor record:", error)
        alert("Error deleting visitor record")
      }
    }
  }

  const exportToCSV = () => {
    const headers = ["IP Address", "Location", "Device", "Browser", "Page", "Duration", "Timestamp"]
    const csvContent = [
      headers.join(","),
      ...filteredAndSortedVisitors.map((visitor: any) =>
        [
          visitor.ipAddress || "",
          visitor.location || "",
          visitor.device || "",
          visitor.browser || "",
          visitor.page || "",
          visitor.duration || "",
          visitor.timestamp instanceof Date ? visitor.timestamp.toLocaleString() : "",
        ].join(","),
      ),
    ].join("\n")

    const blob = new Blob([csvContent], { type: "text/csv" })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = "visitors.csv"
    a.click()
    window.URL.revokeObjectURL(url)
  }

  // Filter and sort visitors
  const filteredAndSortedVisitors = visitors
    .filter((visitor: any) => {
      const matchesSearch =
        visitor.ipAddress?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        visitor.location?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        visitor.browser?.toLowerCase().includes(searchTerm.toLowerCase())

      if (filterBy === "all") return matchesSearch
      if (filterBy === "today") {
        const today = new Date()
        today.setHours(0, 0, 0, 0)
        return matchesSearch && visitor.timestamp >= today
      }
      if (filterBy === "mobile") {
        return matchesSearch && visitor.device === "Mobile"
      }
      if (filterBy === "desktop") {
        return matchesSearch && visitor.device === "Desktop"
      }

      return matchesSearch
    })
    .sort((a: any, b: any) => {
      if (sortBy === "newest") return b.timestamp - a.timestamp
      if (sortBy === "oldest") return a.timestamp - b.timestamp
      if (sortBy === "duration") return b.duration?.localeCompare(a.duration) || 0
      return 0
    })

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        <div className="pt-24 flex justify-center items-center min-h-[60vh]">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-pink-500 dark:border-gray-400"></div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">

      <div className="pt-24 pb-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="mb-8"
          >
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Visitor Analytics</h1>
                <p className="text-gray-600 dark:text-gray-400">
                  Track and analyze your website visitors ({visitors.length} total)
                </p>
              </div>
              <button onClick={exportToCSV} className="mt-4 sm:mt-0 btn-primary flex items-center">
                <FiDownload className="h-4 w-4 mr-2" />
                Export CSV
              </button>
            </div>
          </motion.div>

          {/* Analytics Cards */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8"
          >
            <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg">
              <div className="flex items-center">
                <div className="p-3 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
                  <FiEye className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Visitors</p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">{visitors.length}</p>
                </div>
              </div>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg">
              <div className="flex items-center">
                <div className="p-3 bg-green-100 dark:bg-green-900/30 rounded-lg">
                  <FiClock className="h-6 w-6 text-green-600 dark:text-green-400" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Today's Visitors</p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">
                    {
                      visitors.filter((visitor: any) => {
                        const today = new Date()
                        today.setHours(0, 0, 0, 0)
                        return visitor.timestamp >= today
                      }).length
                    }
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg">
              <div className="flex items-center">
                <div className="p-3 bg-purple-100 dark:bg-purple-900/30 rounded-lg">
                  <FiMonitor className="h-6 w-6 text-purple-600 dark:text-purple-400" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Desktop</p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">
                    {visitors.filter((v: any) => v.device === "Desktop").length}
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg">
              <div className="flex items-center">
                <div className="p-3 bg-orange-100 dark:bg-orange-900/30 rounded-lg">
                  <FiTrendingUp className="h-6 w-6 text-orange-600 dark:text-orange-400" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Mobile</p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">
                    {visitors.filter((v: any) => v.device === "Mobile").length}
                  </p>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Filters and Search */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg mb-8"
          >
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Search */}
              <div className="relative">
                <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                <input
                  type="text"
                  placeholder="Search visitors..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-pink-500 dark:focus:ring-gray-400 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                />
              </div>

              {/* Filter */}
              <div className="relative">
                <FiFilter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                <select
                  value={filterBy}
                  onChange={(e) => setFilterBy(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-pink-500 dark:focus:ring-gray-400 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                >
                  <option value="all">All Visitors</option>
                  <option value="today">Today</option>
                  <option value="mobile">Mobile Only</option>
                  <option value="desktop">Desktop Only</option>
                </select>
              </div>

              {/* Sort */}
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-pink-500 dark:focus:ring-gray-400 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              >
                <option value="newest">Newest First</option>
                <option value="oldest">Oldest First</option>
                <option value="duration">By Duration</option>
              </select>
            </div>
          </motion.div>

          {/* Visitors Table */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden"
          >
            {filteredAndSortedVisitors.length === 0 ? (
              <div className="p-12 text-center">
                <FiGlobe className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">No visitors found</h3>
                <p className="text-gray-600 dark:text-gray-400">
                  {searchTerm ? "Try adjusting your search criteria" : "No visitor data available"}
                </p>
              </div>
            ) : (
              <div className="">
                <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                  <thead className="bg-gray-50 dark:bg-gray-700">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                        <div className="flex items-center">
                          <FiGlobe className="h-4 w-4 mr-2" />
                          Visitor Info
                        </div>
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                        <div className="flex items-center">
                          <FiMapPin className="h-4 w-4 mr-2" />
                          Location & Device
                        </div>
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                        <div className="flex items-center">
                          <FiMonitor className="h-4 w-4 mr-2" />
                          Activity
                        </div>
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                        <div className="flex items-center">
                          <FiCalendar className="h-4 w-4 mr-2" />
                          Time
                        </div>
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                    {filteredAndSortedVisitors.map((visitor: any, index: number) => (
                      <motion.tr
                        key={visitor.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3, delay: index * 0.05 }}
                        className="hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                      >
                        <td className="px-6 py-4">
                          <div className="space-y-1">
                            <div className="flex items-center text-sm font-medium text-gray-900 dark:text-gray-100">
                              <FiGlobe className="h-4 w-4 mr-2 text-gray-400" />
                              {visitor.ipAddress || "N/A"}
                            </div>
                            <div className="text-xs text-gray-600 dark:text-gray-400 max-w-xs truncate">
                              {visitor.userAgent || "N/A"}
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="space-y-1">
                            <div className="text-sm text-gray-900 dark:text-gray-100">
                              {visitor.location || "Unknown"}
                            </div>
                            <div className="text-sm text-gray-600 dark:text-gray-400">
                              {visitor.device || "Unknown"} • {visitor.browser || "Unknown"}
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="space-y-1">
                            <div className="text-sm text-gray-900 dark:text-gray-100">Page: {visitor.page || "/"}</div>
                            <div className="text-sm text-gray-600 dark:text-gray-400">
                              Referrer: {visitor.referrer || "Direct"}
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100">
                          {visitor.timestamp instanceof Date ? visitor.timestamp.toLocaleString() : "N/A"}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <button
                            onClick={() => handleDeleteVisitor(visitor.id)}
                            className="text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-300 p-1 rounded"
                            title="Delete Visitor Record"
                          >
                            <FiTrash2 className="h-4 w-4" />
                          </button>
                        </td>
                      </motion.tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </motion.div>
        </div>
      </div>
    </div>
  )
}
