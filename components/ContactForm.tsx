"use client"

import type React from "react"

import { useState } from "react"
import { db } from "@/lib/firebase"
import { collection, addDoc, serverTimestamp } from "firebase/firestore"
import { FiSend } from "react-icons/fi"

export function ContactForm() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    topic: "",
    message: "",
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [notification, setNotification] = useState<{
    show: boolean
    type: "success" | "error"
    message: string
  }>({
    show: false,
    type: "success",
    message: "",
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const showNotification = (type: "success" | "error", message: string) => {
    setNotification({
      show: true,
      type,
      message,
    })

    // Hide notification after 5 seconds
    setTimeout(() => {
      setNotification((prev) => ({ ...prev, show: false }))
    }, 5000)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!formData.email || !formData.phone || !formData.topic) {
      showNotification("error", "Please fill in all required fields.")
      return
    }

    try {
      setIsSubmitting(true)

      // Add document to Firestore
      await addDoc(collection(db, "portfolio", "shahriar", "contacts"), {
        ...formData,
        createdAt: serverTimestamp(),
      })

      // Reset form
      setFormData({
        name: "",
        email: "",
        phone: "",
        topic: "",
        message: "",
      })

      showNotification("success", "Thank you for reaching out. I'll get back to you soon.")
    } catch (error) {
      showNotification("error", "Your message couldn't be sent. Please try again later.")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="max-w-md mx-auto bg-gray-50 dark:bg-gray-800 rounded-lg shadow-md p-6">
      {notification.show && (
        <div
          className={`mb-4 p-3 rounded-md ${notification.type === "success" ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
            }`}
        >
          {notification.message}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="name" className="block text-sm font-medium mb-1">
            Name
          </label>
          <input
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            placeholder="Your name"
            className="w-full px-3 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200"
          />
        </div>

        <div>
          <label htmlFor="email" className="block text-sm font-medium mb-1">
            Email <span className="text-red-500">*</span>
          </label>
          <input
            id="email"
            name="email"
            type="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="your.email@example.com"
            required
            className="w-full px-3 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200"
          />
        </div>

        <div>
          <label htmlFor="phone" className="block text-sm font-medium mb-1">
            Phone Number <span className="text-red-500">*</span>
          </label>
          <input
            id="phone"
            name="phone"
            type="tel"
            value={formData.phone}
            onChange={handleChange}
            placeholder="+1 (123) 456-7890"
            required
            className="w-full px-3 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200"
          />
        </div>

        <div>
          <label htmlFor="topic" className="block text-sm font-medium mb-1">
            Topic <span className="text-red-500">*</span>
          </label>
          <select
            id="topic"
            name="topic"
            value={formData.topic}
            onChange={handleChange}
            required
            className="w-full px-3 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200"
          >
            <option value="" disabled>
              Select a topic
            </option>
            <option value="Website Development">Website Development</option>
            <option value="Web Application">Web Application</option>
            <option value="E-commerce">E-commerce</option>
            <option value="SEO">SEO</option>
            <option value="Other">Other</option>
          </select>
        </div>

        <div>
          <label htmlFor="message" className="block text-sm font-medium mb-1">
            Message
          </label>
          <textarea
            id="message"
            name="message"
            value={formData.message}
            onChange={handleChange}
            placeholder="Tell me about your project..."
            className="w-full px-3 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200 min-h-[100px]"
          />
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-md transition-colors duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <FiSend className="h-4 w-4" />
          {isSubmitting ? "Sending..." : "Send Message"}
        </button>
      </form>
    </div>
  )
}
