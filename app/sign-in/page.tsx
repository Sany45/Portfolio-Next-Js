"use client"

import { useEffect, useState } from "react"
import { motion } from "framer-motion"
import Link from "next/link"
import { useRouter } from "next/navigation"
import Navbar from "../../components/Navbar"
import { signIn, forgotPassword } from "@/lib/helper"
import { FiAlertCircle, FiMoon, FiSun } from "react-icons/fi"
import { BsArrowRight, BsMailbox } from "react-icons/bs"
import { BiLock } from "react-icons/bi"
import { IoAlertCircle } from "react-icons/io5"
// import { Mail, Lock, ArrowRight, AlertCircle } from 'lucide-react'

export default function Login() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [showForgotPassword, setShowForgotPassword] = useState(false)
  const [resetEmailSent, setResetEmailSent] = useState(false)
  const [resetEmail, setResetEmail] = useState("")
  const [resetEmailError, setResetEmailError] = useState("")
  const router = useRouter()

  const handleLogin = async (e: any) => {
    e.preventDefault()
    setLoading(true)
    setError("")

    if (email !== 'shahriarsany57@gmail.com') {
      setLoading(false)
      return alert('Wrong Email Address')
    }

    const result = await signIn(email, password)

    if (result.success) {
      router.push("/admin-panel")
    } else {
      setError(result.error)
      setLoading(false)
    }
  }

  const handleForgotPassword = async (e: any) => {
    e.preventDefault()
    setLoading(true)
    setResetEmailError("")

    if (!resetEmail.trim()) {
      setResetEmailError("Please enter your email address")
      setLoading(false)
      return
    }

    const result = await forgotPassword(resetEmail)

    if (result.success) {
      setResetEmailSent(true)
    } else {
      setResetEmailError(result.error)
    }

    setLoading(false)
  }


  // Dark theme changing functionality
  const [darkMode, setDarkMode] = useState(true)
  useEffect(() => {

    console.log(document.documentElement.classList)
    if (typeof (window) == 'undefined') {
      return
    }
    if (darkMode) {
      document.documentElement.classList.add("dark")
    } else {
      document.documentElement.classList.remove("dark")
    }
  }, [darkMode])
  const toggleDarkMode = () => setDarkMode(!darkMode)

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">

      <div className="pt-24 pb-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="bg-white dark:bg-gray-800 rounded-xl p-8 shadow-lg relative"
          >
            <button
              onClick={toggleDarkMode}
              className=" absolute top-4 right-4 p-2 text-xl rounded-full bg-gray-300 hover:bg-gray-400 dark:bg-gray-900 dark:hover:bg-gray-600 transition-colors duration-300"
            >
              {darkMode ? <FiSun className="text-yellow-400" /> : <FiMoon className="text-gray-600" />}
            </button>
            {!showForgotPassword ? (
              <>
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-6 text-center">Sign in</h1>
                {error && (
                  <div className="mb-6 p-3 bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-800 rounded-lg flex items-start">
                    <FiAlertCircle className="h-5 w-5 text-red-500 dark:text-red-400 mr-2 mt-0.5 flex-shrink-0" />
                    <p className="text-red-600 dark:text-red-400 text-sm">{error}</p>
                  </div>
                )}

                <form onSubmit={handleLogin} className="space-y-6">
                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Email
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <BsMailbox className="h-5 w-5 text-gray-400" />
                      </div>
                      <input
                        id="email"
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        className="w-full pl-10 px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-pink-500 dark:focus:ring-gray-400 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                        placeholder="Enter your email"
                      />
                    </div>
                  </div>

                  <div>
                    <label htmlFor="password" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Password
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <BiLock className="h-5 w-5 text-gray-400" />
                      </div>
                      <input
                        id="password"
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        className="w-full pl-10 px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-pink-500 dark:focus:ring-gray-400 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                        placeholder="Enter your password"
                      />
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <input
                        id="remember-me"
                        name="remember-me"
                        type="checkbox"
                        className="h-4 w-4 text-pink-500 dark:text-gray-400 focus:ring-pink-500 dark:focus:ring-gray-400 border-gray-300 dark:border-gray-600 rounded"
                      />
                      <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-700 dark:text-gray-300">
                        Remember me
                      </label>
                    </div>

                    <button
                      type="button"
                      onClick={() => setShowForgotPassword(true)}
                      className="text-sm font-medium text-pink-500 dark:text-gray-400 hover:text-pink-600 dark:hover:text-gray-300"
                    >
                      Forgot password?
                    </button>
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full btn-primary disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
                  >
                    {loading ? (
                      <>
                        <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-white mr-2"></div>
                        Signing in...
                      </>
                    ) : (
                      <>
                        Sign in <BsArrowRight className="ml-2 h-5 w-5" />
                      </>
                    )}
                  </button>
                </form>

                {/* <div className="mt-6 text-center">
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Don't have an account?{" "}
                    <Link
                      href="/signup"
                      className="font-medium text-pink-500 dark:text-gray-400 hover:text-pink-600 dark:hover:text-gray-300"
                    >
                      Sign up
                    </Link>
                  </p>
                </div> */}
              </>
            ) : (
              <>
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-6 text-center">Reset Password</h1>

                {resetEmailSent ? (
                  <div className="text-center">
                    <div className="mb-6 p-4 bg-green-50 dark:bg-green-900/30 border border-green-200 dark:border-green-800 rounded-lg">
                      <p className="text-green-600 dark:text-green-400">
                        Password reset email sent! Check your inbox for instructions.
                      </p>
                    </div>
                    <button
                      onClick={() => {
                        setShowForgotPassword(false)
                        setResetEmailSent(false)
                        setResetEmail("")
                      }}
                      className="btn-primary"
                    >
                      Back to Login
                    </button>
                  </div>
                ) : (
                  <>
                    <p className="mb-6 text-gray-600 dark:text-gray-400">
                      Enter your email address and we'll send you a link to reset your password.
                    </p>

                    {resetEmailError && (
                      <div className="mb-6 p-3 bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-800 rounded-lg flex items-start">
                        <IoAlertCircle className="h-5 w-5 text-red-500 dark:text-red-400 mr-2 mt-0.5 flex-shrink-0" />
                        <p className="text-red-600 dark:text-red-400 text-sm">{resetEmailError}</p>
                      </div>
                    )}

                    <form onSubmit={handleForgotPassword} className="space-y-6">
                      <div>
                        <label htmlFor="reset-email" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                          Email
                        </label>
                        <div className="relative">
                          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <BsMailbox className="h-5 w-5 text-gray-400" />
                          </div>
                          <input
                            id="reset-email"
                            type="email"
                            value={resetEmail}
                            onChange={(e) => setResetEmail(e.target.value)}
                            required
                            className="w-full pl-10 px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-pink-500 dark:focus:ring-gray-400 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                            placeholder="Enter your email"
                          />
                        </div>
                      </div>

                      <div className="flex space-x-4">
                        <button
                          type="button"
                          onClick={() => setShowForgotPassword(false)}
                          className="w-1/2 btn-secondary"
                        >
                          Back
                        </button>
                        <button
                          type="submit"
                          disabled={loading}
                          className="w-1/2 btn-primary disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
                        >
                          {loading ? (
                            <>
                              <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-white mr-2"></div>
                              Sending...
                            </>
                          ) : (
                            "Send Reset Link"
                          )}
                        </button>
                      </div>
                    </form>
                  </>
                )}
              </>
            )}
          </motion.div>
        </div>
      </div>
    </div>
  )
}
