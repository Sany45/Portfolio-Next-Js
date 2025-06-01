"use client"

import type React from "react"
import { useState } from "react"
import { motion } from "framer-motion"
import {
  FaUser,
  FaLock,
  FaEye,
  FaEyeSlash,
  FaEdit,
  FaSave,
  FaTimes,
  FaCheck,
  FaClock,
  FaCalendar,
} from "react-icons/fa"
import { MdVerified } from "react-icons/md"
import useAuthStatus from "@/hooks/useAuthStatus"
import { FaShield } from "react-icons/fa6"
import { updateProfile, reauthenticateWithCredential, EmailAuthProvider, updatePassword } from "firebase/auth"
import { auth } from "@/lib/firebase"


export default function AdminPanel() {
  const { isLoading, user } = useAuthStatus()

  // Form states
  const [isEditingProfile, setIsEditingProfile] = useState(false)
  const [isChangingPassword, setIsChangingPassword] = useState(false)
  const [showCurrentPassword, setShowCurrentPassword] = useState(false)
  const [showNewPassword, setShowNewPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)

  // Form data - separate state for name
  const [fullName, setFullName] = useState(user?.displayName || "")

  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  })

  // Loading and success states
  const [isSaving, setIsSaving] = useState(false)
  const [saveSuccess, setSaveSuccess] = useState<string | null>(null)


  const handleProfileSave = async (
    e: React.FormEvent,
    fullName: string,
    setIsSaving: (v: boolean) => void,
    setIsEditingProfile: (v: boolean) => void,
    setSaveSuccess: (v: string | null) => void
  ) => {
    e.preventDefault()
    setIsSaving(true)

    try {
      if (auth.currentUser) {
        await updateProfile(auth.currentUser, { displayName: fullName })
        setIsEditingProfile(false)
        setSaveSuccess("Profile updated successfully!")
      }
    } catch (err) {
      console.error("Profile update error:", err)
      setSaveSuccess("Failed to update profile.")
    } finally {
      setIsSaving(false)
      setTimeout(() => setSaveSuccess(null), 3000)
    }
  }

  const handlePasswordChange = async (
    e: React.FormEvent,
    passwordData: {
      currentPassword: string
      newPassword: string
      confirmPassword: string
    },
    setIsSaving: (v: boolean) => void,
    setIsChangingPassword: (v: boolean) => void,
    setPasswordData: (v: typeof passwordData) => void,
    setSaveSuccess: (v: string | null) => void
  ) => {
    e.preventDefault()
    const { currentPassword, newPassword, confirmPassword } = passwordData

    if (newPassword !== confirmPassword) {
      alert("New passwords don't match!")
      return
    }

    setIsSaving(true)

    try {
      if (auth.currentUser?.email) {
        const credential = EmailAuthProvider.credential(auth.currentUser.email, currentPassword)
        await reauthenticateWithCredential(auth.currentUser, credential)
        await updatePassword(auth.currentUser, newPassword)
        setSaveSuccess("Password changed successfully!")
      }
      setIsChangingPassword(false)
      setPasswordData({ currentPassword: "", newPassword: "", confirmPassword: "" })
    } catch (err) {
      alert("Password update failed. Please check your current password.")
    } finally {
      setIsSaving(false)
      setTimeout(() => setSaveSuccess(null), 3000)
    }
  }


  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    })
  }

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center">
          <div className="w-16 h-16 border-4 border-purple-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400">Loading your dashboard...</p>
        </motion.div>
      </div>
    )
  }

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
        <div className="text-center">
          <p className="text-gray-600 dark:text-gray-400">Please sign in to access the admin panel.</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 transition-colors duration-300">
      {/* Success Message */}
      {saveSuccess && (
        <motion.div
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -50 }}
          className="fixed top-4 left-1/2 transform -translate-x-1/2 bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg z-20 flex items-center space-x-2"
        >
          <FaCheck />
          <span>{saveSuccess}</span>
        </motion.div>
      )}

      <div className="container mx-auto px-4 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="max-w-4xl mx-auto"
        >
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-gray-800 dark:text-white mb-2">Admin Panel</h1>
            <p className="text-gray-600 dark:text-gray-400">Manage your account settings and preferences</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Profile Card */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="lg:col-span-1"
            >
              <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-6">
                <div className="text-center">
                  <div className="relative inline-block mb-4">
                    {
                      user.photoURL ?
                        <img
                          src={user.photoURL || "/placeholder.svg?height=100&width=100"}
                          alt="Profile"
                          className="w-24 h-24 rounded-full border-4 border-purple-500"
                        /> : <FaUser className=" p-4 w-20 h-20 rounded-full border-4 border-purple-500" />
                    }
                    {user.emailVerified && (
                      <div className="absolute -bottom-1 -right-1 bg-green-500 rounded-full p-1">
                        <MdVerified className="text-white text-sm" />
                      </div>
                    )}
                  </div>
                  <h2 className="text-xl font-bold text-gray-800 dark:text-white mb-1">{user.displayName || "User"}</h2>
                  <p className="text-gray-600 dark:text-gray-400 mb-2">{user.email}</p>
                  <div className="flex items-center justify-center space-x-2 mb-4">
                    <FaShield className="text-purple-500" />
                    <span className="text-sm font-medium text-purple-600 dark:text-purple-400">
                      {user.providerData[0]?.providerId === "password" ? "Email User" : "Social Login"}
                    </span>
                  </div>
                </div>

                {/* Account Stats */}
                <div className="space-y-3 pt-4 border-t border-gray-200 dark:border-gray-700">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <FaCalendar className="text-gray-400" />
                      <span className="text-sm text-gray-600 dark:text-gray-400">Joined</span>
                    </div>
                    <span className="text-sm font-medium text-gray-800 dark:text-white">
                      {formatDate(user.metadata.creationTime)}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <FaClock className="text-gray-400" />
                      <span className="text-sm text-gray-600 dark:text-gray-400">Last Login</span>
                    </div>
                    <span className="text-sm font-medium text-gray-800 dark:text-white">
                      {formatDate(user.metadata.lastSignInTime)}
                    </span>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Settings Panel */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="lg:col-span-2 space-y-6"
            >
              {/* Profile Information */}
              <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-6">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-xl font-bold text-gray-800 dark:text-white flex items-center">
                    <FaUser className="mr-2 text-purple-500" />
                    Profile Information
                  </h3>
                  {!isEditingProfile && (
                    <button
                      onClick={() => {
                        setIsEditingProfile(true)
                        setFullName(user.displayName || "")
                      }}
                      className="flex items-center space-x-2 text-purple-600 hover:text-purple-700 dark:text-purple-400 dark:hover:text-purple-300 transition-colors"
                    >
                      <FaEdit />
                      <span>Edit</span>
                    </button>
                  )}
                </div>

                {isEditingProfile ? (
                  <form onSubmit={(e) =>
                    handleProfileSave(e, fullName, setIsSaving, setIsEditingProfile, setSaveSuccess)
                  }>
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                          Full Name
                        </label>
                        <input
                          type="text"
                          value={fullName}
                          onChange={(e) => setFullName(e.target.value)}
                          className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                          Email Address
                        </label>
                        <input
                          type="email"
                          value={user.email || ""}
                          className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-gray-100 dark:bg-gray-600 text-gray-800 dark:text-white focus:outline-none cursor-not-allowed"
                          disabled
                        />
                        <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Email address cannot be changed</p>
                      </div>
                      <div className="flex space-x-3">
                        <motion.button
                          type="submit"
                          disabled={isSaving}
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                          className="flex items-center space-x-2 bg-purple-600 hover:bg-purple-700 disabled:bg-purple-400 text-white px-4 py-2 rounded-lg transition-colors"
                        >
                          {isSaving ? (
                            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                          ) : (
                            <FaSave />
                          )}
                          <span>{isSaving ? "Saving..." : "Save Changes"}</span>
                        </motion.button>
                        <button
                          type="button"
                          onClick={() => setIsEditingProfile(false)}
                          className="flex items-center space-x-2 bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded-lg transition-colors"
                        >
                          <FaTimes />
                          <span>Cancel</span>
                        </button>
                      </div>
                    </div>
                  </form>
                ) : (
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Full Name
                      </label>
                      <p className="text-gray-800 dark:text-white">{user.displayName || "Not set"}</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Email Address
                      </label>
                      <div className="flex items-center space-x-2">
                        <p className="text-gray-800 dark:text-white">{user.email}</p>
                        {user.emailVerified ? (
                          <div className="flex items-center space-x-1 text-green-600 dark:text-green-400">
                            <MdVerified className="text-sm" />
                            <span className="text-xs">Verified</span>
                          </div>
                        ) : (
                          <div className="flex items-center space-x-1 text-yellow-600 dark:text-yellow-400">
                            <span className="text-xs bg-yellow-100 dark:bg-yellow-900 px-2 py-0.5 rounded-full">
                              Not verified
                            </span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Password Change */}
              <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-6">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-xl font-bold text-gray-800 dark:text-white flex items-center">
                    <FaLock className="mr-2 text-purple-500" />
                    Password & Security
                  </h3>
                  {!isChangingPassword && (
                    <button
                      onClick={() => setIsChangingPassword(true)}
                      className="flex items-center space-x-2 text-purple-600 hover:text-purple-700 dark:text-purple-400 dark:hover:text-purple-300 transition-colors"
                    >
                      <FaEdit />
                      <span>Change Password</span>
                    </button>
                  )}
                </div>

                {isChangingPassword ? (
                  <form onSubmit={(e) =>
                    handlePasswordChange(e, passwordData, setIsSaving, setIsChangingPassword, setPasswordData, setSaveSuccess)
                  }>
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                          Current Password
                        </label>
                        <div className="relative">
                          <input
                            type={showCurrentPassword ? "text" : "password"}
                            value={passwordData.currentPassword}
                            onChange={(e) => setPasswordData({ ...passwordData, currentPassword: e.target.value })}
                            className="w-full pr-10 px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                            required
                          />
                          <button
                            type="button"
                            onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                            className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                          >
                            {showCurrentPassword ? <FaEyeSlash /> : <FaEye />}
                          </button>
                        </div>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                          New Password
                        </label>
                        <div className="relative">
                          <input
                            type={showNewPassword ? "text" : "password"}
                            value={passwordData.newPassword}
                            onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })}
                            className="w-full pr-10 px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                            required
                          />
                          <button
                            type="button"
                            onClick={() => setShowNewPassword(!showNewPassword)}
                            className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                          >
                            {showNewPassword ? <FaEyeSlash /> : <FaEye />}
                          </button>
                        </div>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                          Confirm New Password
                        </label>
                        <div className="relative">
                          <input
                            type={showConfirmPassword ? "text" : "password"}
                            value={passwordData.confirmPassword}
                            onChange={(e) => setPasswordData({ ...passwordData, confirmPassword: e.target.value })}
                            className="w-full pr-10 px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                            required
                          />
                          <button
                            type="button"
                            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                            className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                          >
                            {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
                          </button>
                        </div>
                      </div>
                      <div className="flex space-x-3">
                        <motion.button
                          type="submit"
                          disabled={isSaving}
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                          className="flex items-center space-x-2 bg-purple-600 hover:bg-purple-700 disabled:bg-purple-400 text-white px-4 py-2 rounded-lg transition-colors"
                        >
                          {isSaving ? (
                            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                          ) : (
                            <FaSave />
                          )}
                          <span>{isSaving ? "Changing..." : "Change Password"}</span>
                        </motion.button>
                        <button
                          type="button"
                          onClick={() => {
                            setIsChangingPassword(false)
                            setPasswordData({ currentPassword: "", newPassword: "", confirmPassword: "" })
                          }}
                          className="flex items-center space-x-2 bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded-lg transition-colors"
                        >
                          <FaTimes />
                          <span>Cancel</span>
                        </button>
                      </div>
                    </div>
                  </form>
                ) : (
                  <div>
                    <p className="text-gray-600 dark:text-gray-400 mb-4">
                      Keep your account secure by using a strong password and changing it regularly.
                    </p>
                    <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        Password security: <span className="font-medium">Standard</span>
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </motion.div>
          </div>
        </motion.div>
      </div>

    </div>
  )
}
