"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { useParams, useRouter } from "next/navigation"
import { doc, getDoc, updateDoc, increment } from "firebase/firestore"
import { db } from "@/lib/firebase"
import {
  FaCalendar,
  FaEye,
  FaTags,
  FaArrowLeft,
  FaImage,
  FaFileAlt,
  FaClock,
  FaShare,
  FaFacebook,
  FaTwitter,
  FaLinkedin,
  FaLink,
} from "react-icons/fa"
import Footer from "@/components/Footer"
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

export default function BlogPage() {
  const params = useParams()
  const router = useRouter()
  const blogId = params.blogId as string

  const [blog, setBlog] = useState<Blog | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [readingTime, setReadingTime] = useState<number>(0)
  const [showShareOptions, setShowShareOptions] = useState(false)

  useEffect(() => {
    if (blogId) {
      fetchBlog()
    }
  }, [blogId])

  // Calculate reading time
  useEffect(() => {
    if (blog?.content) {
      // Average reading speed: 200 words per minute
      const words = blog.content.trim().split(/\s+/).length
      const time = Math.ceil(words / 200)
      setReadingTime(time)
    }
  }, [blog])

  const fetchBlog = async () => {
    setIsLoading(true)
    setError(null)
    try {
      const docRef = doc(db, "portfolio/shahriar/blogs", blogId)
      const docSnap = await getDoc(docRef)

      if (docSnap.exists()) {
        const blogData = {
          id: docSnap.id,
          ...docSnap.data(),
        } as Blog

        // Only show published blogs unless it's a draft preview
        if (blogData.status !== "published") {
          // For now, we'll show drafts too, but in production you might want to check user permissions
          // setError("This blog post is not available.")
          // return
        }

        setBlog(blogData)

        // Increment view count
        await updateDoc(docRef, {
          views: increment(1),
        })
      } else {
        setError("Blog post not found.")
      }
    } catch (error) {
      console.error("Error fetching blog:", error)
      setError("Failed to load blog post. Please try again later.")
    } finally {
      setIsLoading(false)
    }
  }

  const formatDate = (timestamp: any) => {
    if (!timestamp) return "Unknown"
    const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp)
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    })
  }

  const copyLinkToClipboard = () => {
    const url = window.location.href
    navigator.clipboard.writeText(url)
    alert("Link copied to clipboard!")
    setShowShareOptions(false)
  }

  const shareOnSocialMedia = (platform: string) => {
    const url = encodeURIComponent(window.location.href)
    const title = encodeURIComponent(blog?.title || "")
    let shareUrl = ""

    switch (platform) {
      case "facebook":
        shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${url}`
        break
      case "twitter":
        shareUrl = `https://twitter.com/intent/tweet?url=${url}&text=${title}`
        break
      case "linkedin":
        shareUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${url}`
        break
    }

    if (shareUrl) {
      window.open(shareUrl, "_blank")
    }
    setShowShareOptions(false)
  }

  if (isLoading) {
    return (
      <div className="min-h-[100dvh] bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-purple-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400">Loading blog post...</p>
        </div>
      </div>
    )
  }

  console.log(error, blog)

  if (error || !blog) {
    return (
      <div className="min-h-[100dvh] bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center">
        <div className="max-w-md mx-auto text-center px-4">
          <div className="text-red-500 text-6xl mb-4">⚠️</div>
          <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-2">Oops! Something went wrong</h2>
          <p className="text-gray-600 dark:text-gray-400 mb-6">{error || "Blog post not found"}</p>
          <div className="flex justify-center space-x-4">
            <button
              onClick={() => router.back()}
              className="bg-gray-600 hover:bg-gray-700 text-white px-6 py-3 rounded-lg transition-colors"
            >
              Go Back
            </button>
            <Link
              href="/blogs"
              className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-3 rounded-lg transition-colors"
            >
              Browse All Blogs
            </Link>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-[100dvh] bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 transition-colors duration-300 flex flex-col">
      <div className="flex-grow">
        {/* Back Button */}
        <div className="container mx-auto px-4 py-6">
          <button
            onClick={() => router.back()}
            className="flex items-center text-gray-600 dark:text-gray-400 hover:text-purple-600 dark:hover:text-purple-400 transition-colors"
          >
            <FaArrowLeft className="mr-2" />
            <span>Back</span>
          </button>
        </div>

        {/* Hero Section */}
        {blog.type === "image" && blog.imageUrl && (
          <div className="relative w-full h-[40vh] md:h-[50vh] lg:h-[60vh] overflow-hidden mb-8">
            <div className="absolute inset-0 bg-black/30 z-10"></div>
            <img src={blog.imageUrl || "/placeholder.svg"} alt={blog.title} className="h-full mx-auto object-cover" />
            <div className="absolute inset-0 z-20 flex items-center justify-center">
              <div className="container mx-auto px-4 md:px-8">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5 }}
                  className="max-w-4xl mx-auto text-center"
                >
                  <span
                    className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-500/80 text-white mb-4`}
                  >
                    <FaImage className="mr-2" />
                    Image Blog
                  </span>
                  <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-4 drop-shadow-lg">
                    {blog.title}
                  </h1>
                  <p className="text-lg text-white/90 max-w-2xl mx-auto drop-shadow-md">{blog.description}</p>
                </motion.div>
              </div>
            </div>
          </div>
        )}

        <div className="container mx-auto px-4 py-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="max-w-4xl mx-auto"
          >
            {/* Text Blog Header (when no image) */}
            {blog.type === "text" && (
              <div className="mb-8">
                <div className="flex items-center mb-4">
                  <span
                    className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200`}
                  >
                    <FaFileAlt className="mr-2" />
                    Text Blog
                  </span>
                  {blog.featured && (
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200 ml-2">
                      ⭐ Featured
                    </span>
                  )}
                </div>
                <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-800 dark:text-white mb-4">
                  {blog.title}
                </h1>
                <p className="text-xl text-gray-600 dark:text-gray-400 mb-6">{blog.description}</p>
              </div>
            )}

            {/* Blog Metadata */}
            <div className="flex flex-wrap items-center justify-between mb-8 pb-6 border-b border-gray-200 dark:border-gray-700">
              <div className="flex flex-wrap items-center gap-4 mb-4 md:mb-0">
                <div className="flex items-center text-gray-600 dark:text-gray-400">
                  <FaCalendar className="mr-2" />
                  <span>{formatDate(blog.createdAt)}</span>
                </div>
                <div className="flex items-center text-gray-600 dark:text-gray-400">
                  <FaEye className="mr-2" />
                  <span>{blog.views || 0} views</span>
                </div>
                <div className="flex items-center text-gray-600 dark:text-gray-400">
                  <FaClock className="mr-2" />
                  <span>{readingTime} min read</span>
                </div>
              </div>

              {/* Share Button */}
              <div className="relative">
                <button
                  onClick={() => setShowShareOptions(!showShareOptions)}
                  className="flex items-center space-x-2 bg-purple-100 dark:bg-purple-900/30 hover:bg-purple-200 dark:hover:bg-purple-900/50 text-purple-700 dark:text-purple-300 px-4 py-2 rounded-lg transition-colors"
                >
                  <FaShare />
                  <span>Share</span>
                </button>

                {showShareOptions && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="absolute left-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-lg shadow-lg z-10 overflow-hidden"
                  >
                    <button
                      onClick={() => shareOnSocialMedia("facebook")}
                      className="flex items-center w-full px-4 py-3 text-left hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                    >
                      <FaFacebook className="text-blue-600 mr-3" />
                      <span>Facebook</span>
                    </button>
                    <button
                      onClick={() => shareOnSocialMedia("twitter")}
                      className="flex items-center w-full px-4 py-3 text-left hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                    >
                      <FaTwitter className="text-blue-400 mr-3" />
                      <span>Twitter</span>
                    </button>
                    <button
                      onClick={() => shareOnSocialMedia("linkedin")}
                      className="flex items-center w-full px-4 py-3 text-left hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                    >
                      <FaLinkedin className="text-blue-700 mr-3" />
                      <span>LinkedIn</span>
                    </button>
                    <button
                      onClick={copyLinkToClipboard}
                      className="flex items-center w-full px-4 py-3 text-left hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                    >
                      <FaLink className="text-gray-600 dark:text-gray-400 mr-3" />
                      <span>Copy Link</span>
                    </button>
                  </motion.div>
                )}
              </div>
            </div>

            {/* Tags */}
            {blog.tags && blog.tags.length > 0 && (
              <div className="flex flex-wrap items-center gap-2 mb-8">
                <FaTags className="text-gray-500 dark:text-gray-400" />
                {blog.tags.map((tag, index) => (
                  <span
                    key={index}
                    className="bg-purple-100 dark:bg-purple-900 text-purple-800 dark:text-purple-200 px-3 py-1 rounded-full text-sm"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            )}

            {/* Blog Content */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-6 md:p-8 mb-8">
              {/* If it's an image blog and we already showed the image in hero, we don't need to show it again */}
              {blog.type === "image" && blog.imageUrl && (
                <div className="md:hidden mb-6">
                  <img
                    src={blog.imageUrl || "/placeholder.svg"}
                    alt={blog.title}
                    className="w-full h-auto rounded-lg"
                  />
                </div>
              )}

              {/* Content */}
              <div className="prose prose-lg dark:prose-invert max-w-none">
                {blog.content.split("\n").map((paragraph, index) => (
                  <p key={index} className="mb-4 text-gray-800 dark:text-gray-200">
                    {paragraph}
                  </p>
                ))}
              </div>
            </div>

            {/* Navigation */}
            <div className="flex justify-between items-center mb-8">
              <Link
                href="/blogs"
                className="flex items-center space-x-2 bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 px-6 py-3 rounded-lg transition-colors"
              >
                <FaArrowLeft />
                <span>All Blogs</span>
              </Link>
              <button
                onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
                className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-3 rounded-lg transition-colors"
              >
                Back to Top
              </button>
            </div>
          </motion.div>
        </div>
      </div>

      <Footer />
    </div>
  )
}
