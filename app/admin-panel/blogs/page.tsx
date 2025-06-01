"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import {
  FaBlog,
  FaImage,
  FaFileAlt,
  FaSave,
  FaTimes,
  FaUpload,
  FaCheck,
  FaExclamationTriangle,
  FaTrash,
  FaEye,
  FaCalendar,
  FaTags,
} from "react-icons/fa"
import { MdAdd } from "react-icons/md"
import { collection, addDoc, serverTimestamp, getDocs, deleteDoc, doc, query, orderBy, onSnapshot } from "firebase/firestore"
import { db } from "@/lib/firebase"
import { uploadImageryImage } from "@/lib/actions"
import Link from "next/link"

interface BlogData {
  title: string
  description: string
  content: string
  type: "text" | "image"
  imageUrl?: string
  tags: string[]
  status: "draft" | "published"
  slug: string
}

interface Blog extends BlogData {
  id: string
  createdAt: any
  updatedAt: any
  authorId: string
  views: number
  featured: boolean
}

export default function BlogsAdmin() {
  const [isCreating, setIsCreating] = useState(false)
  const [blogType, setBlogType] = useState<"text" | "image">("text")
  const [isUploading, setIsUploading] = useState(false)
  const [isSaving, setSaving] = useState(false)
  const [isLoadingBlogs, setIsLoadingBlogs] = useState(true)
  const [isDeleting, setIsDeleting] = useState<string | null>(null)
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null)
  const [blogs, setBlogs] = useState<Blog[]>([])

  // Form data
  const [blogData, setBlogData] = useState<BlogData>({
    title: "",
    description: "",
    content: "",
    type: "text",
    imageUrl: "",
    tags: [],
    status: "draft",
    slug: "",
  })

  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [previewUrl, setPreviewUrl] = useState<string>("")
  const [tagInput, setTagInput] = useState("")

  // Fetch blogs from Firestore
  useEffect(() => {
    fetchBlogs()
  }, [])


  const fetchBlogs = () => {
    setIsLoadingBlogs(true)

    try {
      const q = query(
        collection(db, "portfolio", "shahriar", "blogs"),
        orderBy("createdAt", "desc")
      )

      const unsubscribe = onSnapshot(q, (querySnapshot) => {
        const blogsData: Blog[] = []
        querySnapshot.forEach((doc) => {
          blogsData.push({
            id: doc.id,
            ...doc.data(),
          } as Blog)
        })
        setBlogs(blogsData)
        setIsLoadingBlogs(false)
      }, (error) => {
        console.error("Error fetching blogs:", error)
        setMessage({
          type: "error",
          text: "Failed to fetch blogs. Please refresh the page.",
        })
        setIsLoadingBlogs(false)
      })

      // Optionally return unsubscribe to use in cleanup (e.g., useEffect)
      return unsubscribe

    } catch (error) {
      console.error("Error setting up snapshot listener:", error)
      setMessage({
        type: "error",
        text: "Failed to set up real-time listener.",
      })
      setIsLoadingBlogs(false)
    }
  }


  const deleteBlog = async (blogId: string) => {
    if (!confirm("Are you sure you want to delete this blog? This action cannot be undone.")) {
      return
    }

    setIsDeleting(blogId)
    try {
      await deleteDoc(doc(db, "portfolio", "shahriar", "blogs", blogId))
      // setBlogs(blogs.filter((blog) => blog.id !== blogId))
      setMessage({
        type: "success",
        text: "Blog deleted successfully!",
      })
      setTimeout(() => setMessage(null), 3000)
    } catch (error) {
      console.error("Error deleting blog:", error)
      setMessage({
        type: "error",
        text: "Failed to delete blog. Please try again.",
      })
      setTimeout(() => setMessage(null), 3000)
    } finally {
      setIsDeleting(null)
    }
  }

  const generateSlug = (title: string) => {
    return title
      .toLowerCase()
      .replace(/[^a-z0-9 -]/g, "")
      .replace(/\s+/g, "-")
      .replace(/-+/g, "-")
      .trim()
  }

  const handleTitleChange = (title: string) => {
    setBlogData({
      ...blogData,
      title,
      slug: generateSlug(title),
    })
  }

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setSelectedFile(file)
      const url = URL.createObjectURL(file)
      setPreviewUrl(url)
    }
  }

  const addTag = () => {
    if (tagInput.trim() && !blogData.tags.includes(tagInput.trim())) {
      setBlogData({
        ...blogData,
        tags: [...blogData.tags, tagInput.trim()],
      })
      setTagInput("")
    }
  }

  const removeTag = (tagToRemove: string) => {
    setBlogData({
      ...blogData,
      tags: blogData.tags.filter((tag) => tag !== tagToRemove),
    })
  }

  const handleImageUpload = async () => {
    if (!selectedFile) return null

    setIsUploading(true)
    try {
      const formData = new FormData()
      formData.append("file", selectedFile)
      formData.append("category", "blog")
      formData.append("title", blogData.title)

      const result = await uploadImageryImage(formData)

      if (result.success) {
        return result.url
      } else {
        throw new Error(result.error)
      }
    } catch (error) {
      console.error("Error uploading image:", error)
      throw error
    } finally {
      setIsUploading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent, status: "draft" | "published") => {
    e.preventDefault()
    setSaving(true)

    try {
      let imageUrl: any = ""

      // Upload image if it's an image blog and file is selected
      if (blogType === "image" && selectedFile) {
        imageUrl = await handleImageUpload()
      }

      // Prepare blog data for Firestore
      const blogToSave = {
        ...blogData,
        type: blogType,
        imageUrl: imageUrl || blogData.imageUrl,
        status,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
        authorId: "current-user-id", // You'll get this from your auth context
        views: 0,
        featured: false,
      }

      // Save to Firestore
      const docRef = await addDoc(collection(db, "portfolio", "shahriar", "blogs"), blogToSave)

      setMessage({
        type: "success",
        text: `Blog ${status === "published" ? "published" : "saved as draft"} successfully!`,
      })

      // Reset form
      setBlogData({
        title: "",
        description: "",
        content: "",
        type: "text",
        imageUrl: "",
        tags: [],
        status: "draft",
        slug: "",
      })
      setSelectedFile(null)
      setPreviewUrl("")
      setIsCreating(false)

      // Refresh blogs list
      fetchBlogs()

      // Clear message after 3 seconds
      setTimeout(() => setMessage(null), 3000)
    } catch (error) {
      console.error("Error saving blog:", error)
      setMessage({
        type: "error",
        text: "Failed to save blog. Please try again.",
      })
      setTimeout(() => setMessage(null), 3000)
    } finally {
      setSaving(false)
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 transition-colors duration-300">
      {/* Success/Error Message */}
      {message && (
        <motion.div
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -50 }}
          className={`fixed top-4 left-1/2 transform -translate-x-1/2 px-6 py-3 rounded-lg shadow-lg z-20 flex items-center space-x-2 ${message.type === "success" ? "bg-green-500 text-white" : "bg-red-500 text-white"
            }`}
        >
          {message.type === "success" ? <FaCheck /> : <FaExclamationTriangle />}
          <span>{message.text}</span>
        </motion.div>
      )}

      <div className="container mx-auto px-4 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="max-w-6xl mx-auto"
        >
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-4xl font-bold text-gray-800 dark:text-white mb-2 flex items-center">
                <FaBlog className="mr-3 text-purple-500" />
                Blog Management
              </h1>
              <p className="text-gray-600 dark:text-gray-400">Create and manage your blog posts</p>
            </div>

            {!isCreating && (
              <motion.button
                onClick={() => setIsCreating(true)}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="flex items-center space-x-2 bg-purple-600 hover:bg-purple-700 text-white px-6 py-3 rounded-lg shadow-md transition-colors"
              >
                <MdAdd className="text-xl" />
                <span>New Blog Post</span>
              </motion.button>
            )}
          </div>

          {isCreating ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3 }}
              className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8"
            >
              {/* Blog Type Selection */}
              <div className="mb-8">
                <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-4">Choose Blog Type</h3>
                <div className="grid grid-cols-2 gap-4">
                  <motion.button
                    onClick={() => setBlogType("text")}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className={`p-6 rounded-lg border-2 transition-all ${blogType === "text"
                      ? "border-purple-500 bg-purple-50 dark:bg-purple-900/20"
                      : "border-gray-300 dark:border-gray-600 hover:border-purple-300"
                      }`}
                  >
                    <FaFileAlt
                      className={`text-3xl mb-3 mx-auto ${blogType === "text" ? "text-purple-500" : "text-gray-400"}`}
                    />
                    <h4 className="font-semibold text-gray-800 dark:text-white">Text Blog</h4>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">Create a text-based blog post</p>
                  </motion.button>

                  <motion.button
                    onClick={() => setBlogType("image")}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className={`p-6 rounded-lg border-2 transition-all ${blogType === "image"
                      ? "border-purple-500 bg-purple-50 dark:bg-purple-900/20"
                      : "border-gray-300 dark:border-gray-600 hover:border-purple-300"
                      }`}
                  >
                    <FaImage
                      className={`text-3xl mb-3 mx-auto ${blogType === "image" ? "text-purple-500" : "text-gray-400"}`}
                    />
                    <h4 className="font-semibold text-gray-800 dark:text-white">Image Blog</h4>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">Create an image-focused blog post</p>
                  </motion.button>
                </div>
              </div>

              {/* Blog Form */}
              <form onSubmit={(e) => e.preventDefault()}>
                <div className="space-y-6">
                  {/* Title */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Blog Title *
                    </label>
                    <input
                      type="text"
                      value={blogData.title}
                      onChange={(e) => handleTitleChange(e.target.value)}
                      className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                      placeholder="Enter your blog title..."
                      required
                    />
                    {blogData.slug && (
                      <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Slug: {blogData.slug}</p>
                    )}
                  </div>

                  {/* Description */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Description *
                    </label>
                    <textarea
                      value={blogData.description}
                      onChange={(e) => setBlogData({ ...blogData, description: e.target.value })}
                      rows={3}
                      className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                      placeholder="Brief description of your blog post..."
                      required
                    />
                  </div>

                  {/* Image Upload for Image Blogs */}
                  {blogType === "image" && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Featured Image *
                      </label>
                      <div className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-6">
                        {previewUrl ? (
                          <div className="text-center">
                            <img
                              src={previewUrl || "/placeholder.svg"}
                              alt="Preview"
                              className="max-w-full h-48 object-cover rounded-lg mx-auto mb-4"
                            />
                            <button
                              type="button"
                              onClick={() => {
                                setSelectedFile(null)
                                setPreviewUrl("")
                              }}
                              className="text-red-500 hover:text-red-700 text-sm"
                            >
                              Remove Image
                            </button>
                          </div>
                        ) : (
                          <div className="text-center">
                            <FaUpload className="text-4xl text-gray-400 mx-auto mb-4" />
                            <p className="text-gray-600 dark:text-gray-400 mb-4">Click to upload or drag and drop</p>
                            <input
                              type="file"
                              accept="image/*"
                              onChange={handleFileSelect}
                              className="hidden"
                              id="image-upload"
                            />
                            <label
                              htmlFor="image-upload"
                              className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg cursor-pointer transition-colors"
                            >
                              Choose Image
                            </label>
                          </div>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Content */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Content *</label>
                    <textarea
                      value={blogData.content}
                      onChange={(e) => setBlogData({ ...blogData, content: e.target.value })}
                      rows={12}
                      className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                      placeholder="Write your blog content here..."
                      required
                    />
                  </div>

                  {/* Tags */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Tags</label>
                    <div className="flex space-x-2 mb-2">
                      <input
                        type="text"
                        value={tagInput}
                        onChange={(e) => setTagInput(e.target.value)}
                        onKeyPress={(e) => e.key === "Enter" && (e.preventDefault(), addTag())}
                        className="flex-1 px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                        placeholder="Add a tag..."
                      />
                      <button
                        type="button"
                        onClick={addTag}
                        className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg transition-colors"
                      >
                        Add
                      </button>
                    </div>
                    {blogData.tags.length > 0 && (
                      <div className="flex flex-wrap gap-2">
                        {blogData.tags.map((tag, index) => (
                          <span
                            key={index}
                            className="bg-purple-100 dark:bg-purple-900 text-purple-800 dark:text-purple-200 px-3 py-1 rounded-full text-sm flex items-center space-x-1"
                          >
                            <span>{tag}</span>
                            <button
                              type="button"
                              onClick={() => removeTag(tag)}
                              className="text-purple-600 hover:text-purple-800 dark:text-purple-300 dark:hover:text-purple-100"
                            >
                              <FaTimes className="text-xs" />
                            </button>
                          </span>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Action Buttons */}
                  <div className="flex space-x-4 pt-6 border-t border-gray-200 dark:border-gray-700">
                    <motion.button
                      type="button"
                      onClick={(e) => handleSubmit(e, "draft")}
                      disabled={isSaving || isUploading}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      className="flex items-center space-x-2 bg-gray-600 hover:bg-gray-700 disabled:bg-gray-400 text-white px-6 py-3 rounded-lg transition-colors"
                    >
                      {isSaving ? (
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      ) : (
                        <FaSave />
                      )}
                      <span>{isSaving ? "Saving..." : "Save as Draft"}</span>
                    </motion.button>

                    <motion.button
                      type="button"
                      onClick={(e) => handleSubmit(e, "published")}
                      disabled={isSaving || isUploading || (blogType === "image" && !selectedFile)}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      className="flex items-center space-x-2 bg-purple-600 hover:bg-purple-700 disabled:bg-purple-400 text-white px-6 py-3 rounded-lg transition-colors"
                    >
                      {isUploading ? (
                        <>
                          <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                          <span>Uploading Image...</span>
                        </>
                      ) : isSaving ? (
                        <>
                          <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                          <span>Publishing...</span>
                        </>
                      ) : (
                        <>
                          <FaCheck />
                          <span>Publish</span>
                        </>
                      )}
                    </motion.button>

                    <button
                      type="button"
                      onClick={() => {
                        setIsCreating(false)
                        setBlogData({
                          title: "",
                          description: "",
                          content: "",
                          type: "text",
                          imageUrl: "",
                          tags: [],
                          status: "draft",
                          slug: "",
                        })
                        setSelectedFile(null)
                        setPreviewUrl("")
                      }}
                      className="flex items-center space-x-2 bg-red-500 hover:bg-red-600 text-white px-6 py-3 rounded-lg transition-colors"
                    >
                      <FaTimes />
                      <span>Cancel</span>
                    </button>
                  </div>
                </div>
              </form>
            </motion.div>
          ) : (
            <div>
              {/* Existing Blogs */}
              {isLoadingBlogs ? (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8 text-center"
                >
                  <div className="w-16 h-16 border-4 border-purple-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                  <p className="text-gray-600 dark:text-gray-400">Loading your blogs...</p>
                </motion.div>
              ) : blogs.length > 0 ? (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5 }}>
                  <div className="mb-6">
                    <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-2">Your Blog Posts</h2>
                    <p className="text-gray-600 dark:text-gray-400">
                      {blogs.length} blog{blogs.length !== 1 ? "s" : ""} found
                    </p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {blogs.map((blog, index) => (
                      <motion.div
                        key={blog.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3, delay: index * 0.1 }}
                        className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300"
                      >
                        {/* Blog Image */}
                        {blog.type === "image" && blog.imageUrl && (
                          <div className="h-48 overflow-hidden">
                            <img
                              src={blog.imageUrl || "/placeholder.svg"}
                              alt={blog.title}
                              className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                            />
                          </div>
                        )}

                        <div className="p-6">
                          {/* Blog Type Badge */}
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
                            <span
                              className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${blog.status === "published"
                                ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
                                : "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200"
                                }`}
                            >
                              {blog.status === "published" ? "Published" : "Draft"}
                            </span>
                          </div>

                          {/* Blog Title */}
                          <h3 className="text-lg font-bold text-gray-800 dark:text-white mb-2 line-clamp-2">
                            {blog.title}
                          </h3>

                          {/* Blog Description */}
                          <p className="text-gray-600 dark:text-gray-400 text-sm mb-4 line-clamp-3">
                            {truncateText(blog.description, 120)}
                          </p>

                          {/* Tags */}
                          {blog.tags && blog.tags.length > 0 && (
                            <div className="flex items-center mb-4">
                              <FaTags className="text-gray-400 mr-2 text-xs" />
                              <div className="flex flex-wrap gap-1">
                                {blog.tags.slice(0, 3).map((tag, tagIndex) => (
                                  <span
                                    key={tagIndex}
                                    className="bg-purple-100 dark:bg-purple-900 text-purple-800 dark:text-purple-200 px-2 py-0.5 rounded text-xs"
                                  >
                                    {tag}
                                  </span>
                                ))}
                                {blog.tags.length > 3 && (
                                  <span className="text-gray-500 text-xs">+{blog.tags.length - 3} more</span>
                                )}
                              </div>
                            </div>
                          )}

                          {/* Blog Meta */}
                          <div className="flex items-center text-xs text-gray-500 dark:text-gray-400 mb-4">
                            <FaCalendar className="mr-1" />
                            <span>{formatDate(blog.createdAt)}</span>
                            <span className="mx-2">•</span>
                            <FaEye className="mr-1" />
                            <span>{blog.views || 0} views</span>
                          </div>

                          {/* Action Buttons */}
                          <div className="flex space-x-2">
                            <Link
                              href={`/blog/${blog.id}`}
                              className="flex-1 bg-purple-600 hover:bg-purple-700 text-white text-center py-2 px-3 rounded-lg text-sm transition-colors flex items-center justify-center space-x-1"
                            >
                              <FaEye />
                              <span>View</span>
                            </Link>
                            <button
                              onClick={() => deleteBlog(blog.id)}
                              disabled={isDeleting === blog.id}
                              className="bg-red-500 hover:bg-red-600 disabled:bg-red-400 text-white py-2 px-3 rounded-lg text-sm transition-colors flex items-center justify-center"
                            >
                              {isDeleting === blog.id ? (
                                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                              ) : (
                                <FaTrash />
                              )}
                            </button>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </motion.div>
              ) : (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.5 }}
                  className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8 text-center"
                >
                  <FaBlog className="text-6xl text-purple-500 mx-auto mb-4" />
                  <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-2">No Blog Posts Yet</h2>
                  <p className="text-gray-600 dark:text-gray-400 mb-6">
                    Create your first blog post to get started sharing your thoughts and ideas.
                  </p>
                  <motion.button
                    onClick={() => setIsCreating(true)}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="bg-purple-600 hover:bg-purple-700 text-white px-8 py-3 rounded-lg shadow-md transition-colors"
                  >
                    Create Your First Blog Post
                  </motion.button>
                </motion.div>
              )}
            </div>
          )}
        </motion.div>
      </div>

    </div>
  )
}
