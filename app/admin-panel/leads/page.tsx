"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import Navbar from "../../../components/Navbar"
import AdminSidebar from "../../../components/AdminSidebar"
import { collection, getDocs, query, orderBy, deleteDoc, doc } from "firebase/firestore"
import { db } from "@/lib/firebase"
import {
  FiUser,
  FiMail,
  FiPhone,
  FiMessageSquare,
  FiCalendar,
  FiTrash2,
  FiEye,
  FiDownload,
  FiSearch,
  FiFilter,
} from "react-icons/fi"

export default function LeadsPage() {
  const [leads, setLeads] = useState<any>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [filterBy, setFilterBy] = useState("all")
  const [sortBy, setSortBy] = useState("newest")

  useEffect(() => {
    fetchLeads()
  }, [])

  const fetchLeads = async () => {
    try {
      setLoading(true)
      const leadsQuery = query(collection(db, "portfolio", "shahriar", "contacts"), orderBy("createdAt", "desc"))
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

  const handleDeleteLead = async (id: string) => {
    if (confirm("Are you sure you want to delete this lead?")) {
      try {
        await deleteDoc(doc(db, "portfolio", "shahriar", "contacts", id))
        setLeads(leads.filter((lead: { id: string }) => lead.id !== id))
      } catch (error) {
        console.error("Error deleting lead:", error)
        alert("Error deleting lead")
      }
    }
  }

  const handleViewDetails = (lead: any) => {
    alert(
      `Lead Details:\n\nName: ${lead.name || "N/A"}\nEmail: ${lead.email || "N/A"}\nPhone: ${lead.phone || "N/A"}\nTopic: ${lead.topic || "N/A"}\nSubmitted: ${lead.createdAt instanceof Date ? lead.createdAt.toLocaleString() : "N/A"}`,
    )
  }

  const exportToCSV = () => {
    const headers = ["Name", "Email", "Phone", "Topic", "Created At"]
    const csvContent = [
      headers.join(","),
      ...filteredAndSortedLeads.map((lead: any) =>
        [
          lead.name || "",
          lead.email || "",
          lead.phone || "",
          lead.topic || "",
          lead.createdAt instanceof Date ? lead.createdAt.toLocaleDateString() : "",
        ].join(","),
      ),
    ].join("\n")

    const blob = new Blob([csvContent], { type: "text/csv" })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = "leads.csv"
    a.click()
    window.URL.revokeObjectURL(url)
  }

  // Filter and sort leads
  const filteredAndSortedLeads = leads
    .filter((lead: any) => {
      const matchesSearch =
        lead.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        lead.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        lead.phone?.includes(searchTerm) ||
        lead.topic?.toLowerCase().includes(searchTerm.toLowerCase())

      if (filterBy === "all") return matchesSearch
      if (filterBy === "recent") {
        const weekAgo = new Date()
        weekAgo.setDate(weekAgo.getDate() - 7)
        return matchesSearch && lead.createdAt > weekAgo
      }

      return matchesSearch
    })
    .sort((a: any, b: any) => {
      if (sortBy === "newest") return b.createdAt - a.createdAt
      if (sortBy === "oldest") return a.createdAt - b.createdAt
      if (sortBy === "name") return (a.name || "").localeCompare(b.name || "")
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
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Leads Management</h1>
                <p className="text-gray-600 dark:text-gray-400">
                  Manage and track your dating profile leads ({leads.length} total)
                </p>
              </div>
              <button onClick={exportToCSV} className="mt-4 sm:mt-0 btn-primary flex items-center">
                <FiDownload className="h-4 w-4 mr-2" />
                Export CSV
              </button>
            </div>
          </motion.div>

          {/* Filters and Search */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg mb-8"
          >
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Search */}
              <div className="relative">
                <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                <input
                  type="text"
                  placeholder="Search leads..."
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
                  <option value="all">All Leads</option>
                  <option value="recent">Recent (7 days)</option>
                  {/* <option value="coffee">Coffee Dates</option>
                  <option value="dinner">Dinner Dates</option>
                  <option value="activity">Activity Dates</option> */}
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
                <option value="name">Name A-Z</option>
              </select>
            </div>
          </motion.div>

          {/* Summary Stats */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6"
          >
            <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg">
              <div className="flex items-center">
                <div className="p-3 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
                  <FiUser className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Leads</p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">{leads.length}</p>
                </div>
              </div>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg">
              <div className="flex items-center">
                <div className="p-3 bg-green-100 dark:bg-green-900/30 rounded-lg">
                  <FiCalendar className="h-6 w-6 text-green-600 dark:text-green-400" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400">This Week</p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">
                    {
                      leads.filter((lead: any) => {
                        const weekAgo = new Date()
                        weekAgo.setDate(weekAgo.getDate() - 7)
                        return lead.createdAt > weekAgo
                      }).length
                    }
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg">
              <div className="flex items-center">
                <div className="p-3 bg-purple-100 dark:bg-purple-900/30 rounded-lg">
                  <FiMessageSquare className="h-6 w-6 text-purple-600 dark:text-purple-400" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Most Popular</p>
                  <p className="text-lg font-bold text-gray-900 dark:text-white">
                    {(leads.reduce((acc: any, lead: any) => {
                      acc[lead.datePreference] = (acc[lead.datePreference] || 0) + 1
                      return acc
                    }, {}) &&
                      Object.entries(
                        leads.reduce((acc: any, lead: any) => {
                          acc[lead.datePreference] = (acc[lead.datePreference] || 0) + 1
                          return acc
                        }, {}),
                      ).sort(([, a]: any, [, b]: any) => b - a)[0]?.[0]) ||
                      "N/A"}
                  </p>
                </div>
              </div>
            </div>
          </motion.div>


          {/* Leads Table */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="bg-white mt-8 dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden"
          >
            {filteredAndSortedLeads.length === 0 ? (
              <div className="p-12 text-center">
                <FiUser className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">No leads found</h3>
                <p className="text-gray-600 dark:text-gray-400">
                  {searchTerm ? "Try adjusting your search criteria" : "No leads have been submitted yet"}
                </p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                  <thead className="bg-gray-50 dark:bg-gray-700">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                        <div className="flex items-center">
                          <FiUser className="h-4 w-4 mr-2" />
                          Contact Info
                        </div>
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                        <div className="flex items-center">
                          <FiMessageSquare className="h-4 w-4 mr-2" />
                          Topic
                        </div>
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                        <div className="flex items-center">
                          <FiCalendar className="h-4 w-4 mr-2" />
                          Date
                        </div>
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                    {filteredAndSortedLeads.map((lead: any, index: number) => (
                      <motion.tr
                        key={lead.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3, delay: index * 0.05 }}
                        className="hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                      >
                        <td className="px-6 py-4">
                          <div className="space-y-1">
                            <div className="flex items-center text-sm font-medium text-gray-900 dark:text-gray-100">
                              <FiUser className="h-4 w-4 mr-2 text-gray-400" />
                              {lead.name || "N/A"}
                            </div>
                            <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                              <FiMail className="h-4 w-4 mr-2" />
                              {lead.email}
                            </div>
                            <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                              <FiPhone className="h-4 w-4 mr-2" />
                              {lead.phone}
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="text-sm text-gray-900 dark:text-gray-100">{lead.topic || "N/A"}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100">
                          {lead.createdAt instanceof Date ? lead.createdAt.toLocaleDateString() : "N/A"}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex space-x-2">
                            <button
                              onClick={() => handleViewDetails(lead)}
                              className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 p-1 rounded"
                              title="View Details"
                            >
                              <FiEye className="h-4 w-4" />
                            </button>
                            <button
                              onClick={() => handleDeleteLead(lead.id)}
                              className="text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-300 p-1 rounded"
                              title="Delete Lead"
                            >
                              <FiTrash2 className="h-4 w-4" />
                            </button>
                          </div>
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
