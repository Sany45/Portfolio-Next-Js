"use client"
import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { FaBlog, FaImage, FaFileAlt, FaSearch, FaCalendar, FaEye, FaTags, FaFilter, FaTimes } from "react-icons/fa"
import { MdGridView, MdViewList } from "react-icons/md"
import { collection, getDocs, query, where, orderBy } from "firebase/firestore"
import { db } from "@/lib/firebase"
import Link from "next/link"

interface Blog {
  id: string
  title: string
  description: string
  content: string
  type: "text" | "image"
  imageUrl?: string
  tags: string[]
  status: "draft" | "published"
  slug: string
  createdAt: any
  updatedAt: any
  authorId: string
  views: number
  featured: boolean
}

type ViewMode = "grid" | "list"
type FilterType = "all" | "text" | "image"

export default function BlogsPage() {
  const [blogs, setBlogs] = useState<Blog[]>([])
  const [filteredBlogs, setFilteredBlogs] = useState<Blog[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")
  const [activeFilter, setActiveFilter] = useState<FilterType>("all")
  const [viewMode, setViewMode] = useState<ViewMode>("grid")
  const [error, setError] = useState<string | null>(null)

  // Fetch published blogs from Firestore
  useEffect(() => {
    fetchBlogs()
  }, [])

  // Filter blogs based on search and category
  useEffect(() => {
    let filtered = blogs

    // Filter by category
    if (activeFilter !== "all") {
      filtered = filtered.filter((blog) => blog.type === activeFilter)
    }

    // Filter by search query
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase()
      filtered = filtered.filter(
        (blog) =>
          blog.title.toLowerCase().includes(query) ||
          blog.description.toLowerCase().includes(query) ||
          blog.content.toLowerCase().includes(query) ||
          blog.tags.some((tag) => tag.toLowerCase().includes(query)),
      )
    }

    setFilteredBlogs(filtered)
  }, [blogs, searchQuery, activeFilter])

  const fetchBlogs = async () => {
    setIsLoading(true)
    setError(null)
    try {
      // Only fetch published blogs for public view
      const q = query(collection(db, "portfolio", "shahriar", "blogs"), where("status", "==", "published"), orderBy("createdAt", "desc"))
      const querySnapshot = await getDocs(q)
      const blogsData: Blog[] = []

      querySnapshot.forEach((doc) => {
        blogsData.push({
          id: doc.id,
          ...doc.data(),
        } as Blog)
      })

      setBlogs(blogsData)
    } catch (error) {
      console.log(error)
      setError("Failed to load blogs. Please try again later.")
    } finally {
      setIsLoading(false)
    }
  }

  const formatDate = (timestamp: any) => {
    if (!timestamp) return "Unknown"
    const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp)
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    })
  }

  const truncateText = (text: string, maxLength: number) => {
    if (text.length <= maxLength) return text
    return text.substring(0, maxLength) + "..."
  }

  const clearSearch = () => {
    setSearchQuery("")
  }

  const getFilterCounts = () => {
    const textCount = blogs.filter((blog) => blog.type === "text").length
    const imageCount = blogs.filter((blog) => blog.type === "image").length
    return { all: blogs.length, text: textCount, image: imageCount }
  }

  const filterCounts = getFilterCounts()

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
        <div className="container mx-auto px-4 py-16">
          <div className="max-w-6xl mx-auto">
            <div className="text-center">
              <div className="w-16 h-16 border-4 border-purple-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
              <p className="text-gray-600 dark:text-gray-400">Loading amazing blog posts...</p>
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
        <div className="container mx-auto px-4 py-16">
          <div className="max-w-6xl mx-auto">
            <div className="text-center">
              <div className="text-red-500 text-6xl mb-4">⚠️</div>
              <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-2">Oops! Something went wrong</h2>
              <p className="text-gray-600 dark:text-gray-400 mb-6">{error}</p>
              <button
                onClick={fetchBlogs}
                className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-3 rounded-lg transition-colors"
              >
                Try Again
              </button>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 transition-colors duration-300">
      <div className="container mx-auto px-4 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="max-w-6xl mx-auto"
        >
          {/* Header */}
          <div className="text-center mb-12">
            <motion.h1
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className=" text-3xl md:text-5xl font-bold text-gray-800 dark:text-white mb-4 flex items-center justify-center"
            >
              <FaBlog className="mr-4 text-purple-500" />
              Blog Posts
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto"
            >
              Discover insights, stories, and ideas from our collection of blog posts
            </motion.p>
          </div>

          {/* Search and Filters */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-4 sm:p-6 mb-8"
          >
            {/* Search Bar */}
            <div className="relative mb-2 sm:mb-6">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FaSearch className="text-gray-400" />
              </div>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-10 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-purple-500 transition-colors"
                placeholder="Search blogs by title, content, or tags..."
              />
              {searchQuery && (
                <button
                  onClick={clearSearch}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                >
                  <FaTimes />
                </button>
              )}
            </div>

            {/* Filters and View Toggle */}
            <div className="flex flex-col sm:flex-row items-center justify-between space-y-4 sm:space-y-0">
              {/* Category Filters */}
              <div className="flex items-center space-x-2">
                <FaFilter className="sm:block hidden text-gray-500 mr-2" />
                <div className="flex space-x-2 flex-wrap items-end space-y-2 justify-center">
                  <button
                    onClick={() => setActiveFilter("all")}
                    className={` sm:px-4 sm:py-2 py-1 px-2 rounded-lg text-sm font-medium transition-colors ${activeFilter === "all"
                      ? "bg-purple-600 text-white"
                      : "bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600"
                      }`}
                  >
                    All ({filterCounts.all})
                  </button>
                  <button
                    onClick={() => setActiveFilter("text")}
                    className={`sm:px-4 sm:py-2 py-1 px-2 rounded-lg text-sm font-medium transition-colors flex items-center space-x-1 ${activeFilter === "text"
                      ? "bg-green-600 text-white"
                      : "bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600"
                      }`}
                  >
                    <FaFileAlt />
                    <span>Text ({filterCounts.text})</span>
                  </button>
                  <button
                    onClick={() => setActiveFilter("image")}
                    className={`sm:px-4 sm:py-2 py-1 px-2  rounded-lg text-sm font-medium transition-colors flex items-center space-x-1 ${activeFilter === "image"
                      ? "bg-blue-600 text-white"
                      : "bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600"
                      }`}
                  >
                    <FaImage />
                    <span>Image ({filterCounts.image})</span>
                  </button>
                </div>
              </div>

              {/* View Mode Toggle */}
              <div className=" md:flex hidden items-center space-x-2">
                <span className="text-sm text-gray-600 dark:text-gray-400">View:</span>
                <div className="flex bg-gray-200 dark:bg-gray-700 rounded-lg p-1">
                  <button
                    onClick={() => setViewMode("grid")}
                    className={`p-2 rounded-md transition-colors ${viewMode === "grid"
                      ? "bg-white dark:bg-gray-600 text-purple-600 shadow-sm"
                      : "text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200"
                      }`}
                  >
                    <MdGridView />
                  </button>
                  <button
                    onClick={() => setViewMode("list")}
                    className={`p-2 rounded-md transition-colors ${viewMode === "list"
                      ? "bg-white dark:bg-gray-600 text-purple-600 shadow-sm"
                      : "text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200"
                      }`}
                  >
                    <MdViewList />
                  </button>
                </div>
              </div>
            </div>

            {/* Results Count */}
            <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
              <p className="text-sm text-gray-600 dark:text-gray-400">
                {searchQuery ? (
                  <>
                    Found <span className="font-semibold">{filteredBlogs.length}</span> result
                    {filteredBlogs.length !== 1 ? "s" : ""} for "{searchQuery}"
                  </>
                ) : (
                  <>
                    Showing <span className="font-semibold">{filteredBlogs.length}</span> blog
                    {filteredBlogs.length !== 1 ? "s" : ""}
                    {activeFilter !== "all" && (
                      <>
                        {" "}
                        in <span className="font-semibold">{activeFilter}</span> category
                      </>
                    )}
                  </>
                )}
              </p>
            </div>
          </motion.div>

          {/* Blog Posts */}
          {filteredBlogs.length > 0 ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.4 }}
              className={viewMode === "grid" ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8" : "space-y-6"}
            >
              {filteredBlogs.map((blog, index) => (
                <motion.div
                  key={blog.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.1 }}
                  className={`bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 group ${viewMode === "list" ? "flex" : ""
                    }`}
                >
                  {/* Blog Image */}
                  {blog.type === "image" && blog.imageUrl && (
                    <div className={`overflow-hidden ${viewMode === "list" ? "w-64 flex-shrink-0" : "h-48"}`}>
                      <img
                        src={blog.imageUrl || "/placeholder.svg"}
                        alt={blog.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    </div>
                  )}

                  <div className={`p-6 ${viewMode === "list" ? "flex-1" : ""}`}>
                    {/* Blog Type and Status */}
                    <div className="flex items-center justify-between mb-3">
                      <span
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${blog.type === "image"
                          ? "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200"
                          : "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
                          }`}
                      >
                        {blog.type === "image" ? <FaImage className="mr-1" /> : <FaFileAlt className="mr-1" />}
                        {blog.type === "image" ? "Image Blog" : "Text Blog"}
                      </span>
                      {blog.featured && (
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200">
                          ⭐ Featured
                        </span>
                      )}
                    </div>

                    {/* Blog Title */}
                    <Link href={`/blog/${blog.id}`}>
                      <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-3 hover:text-purple-600 dark:hover:text-purple-400 transition-colors cursor-pointer line-clamp-2">
                        {blog.title}
                      </h3>
                    </Link>

                    {/* Blog Description */}
                    <p className="text-gray-600 dark:text-gray-400 text-sm mb-4 line-clamp-3">
                      {truncateText(blog.description, viewMode === "list" ? 200 : 120)}
                    </p>

                    {/* Tags */}
                    {blog.tags && blog.tags.length > 0 && (
                      <div className="flex items-center mb-4">
                        <FaTags className="text-gray-400 mr-2 text-xs" />
                        <div className="flex flex-wrap gap-1">
                          {blog.tags.slice(0, viewMode === "list" ? 5 : 3).map((tag, tagIndex) => (
                            <span
                              key={tagIndex}
                              className="bg-purple-100 dark:bg-purple-900 text-purple-800 dark:text-purple-200 px-2 py-0.5 rounded text-xs"
                            >
                              {tag}
                            </span>
                          ))}
                          {blog.tags.length > (viewMode === "list" ? 5 : 3) && (
                            <span className="text-gray-500 text-xs">
                              +{blog.tags.length - (viewMode === "list" ? 5 : 3)} more
                            </span>
                          )}
                        </div>
                      </div>
                    )}

                    {/* Blog Meta */}
                    <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400 mb-4">
                      <div className="flex items-center">
                        <FaCalendar className="mr-1" />
                        <span>{formatDate(blog.createdAt)}</span>
                      </div>
                      <div className="flex items-center">
                        <FaEye className="mr-1" />
                        <span>{blog.views || 0} views</span>
                      </div>
                    </div>

                    {/* Read More Button */}
                    <Link
                      href={`/blog/${blog.id}`}
                      className="inline-flex items-center text-purple-600 hover:text-purple-700 dark:text-purple-400 dark:hover:text-purple-300 font-medium text-sm transition-colors"
                    >
                      Read More →
                    </Link>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          ) : (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.4 }}
              className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-12 text-center"
            >
              <div className="text-6xl mb-4">🔍</div>
              <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-2">No blogs found</h2>
              <p className="text-gray-600 dark:text-gray-400 mb-6">
                {searchQuery
                  ? `No blogs match your search for "${searchQuery}"`
                  : `No ${activeFilter === "all" ? "" : activeFilter + " "}blogs available at the moment`}
              </p>
              {searchQuery && (
                <button
                  onClick={clearSearch}
                  className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-3 rounded-lg transition-colors"
                >
                  Clear Search
                </button>
              )}
            </motion.div>
          )}
        </motion.div>
      </div>
    </div>
  )
}
