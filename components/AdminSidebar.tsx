"use client"

import { useEffect, useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import Link from "next/link"
import { usePathname } from "next/navigation"
import {
  FiHome,
  FiUsers,
  FiEye,
  FiBarChart,
  FiSettings,
  FiImage,
  FiCalendar,
  FiMail,
  FiTrendingUp,
  FiPieChart,
  FiMenu,
  FiX,
  FiChevronRight,
  FiLogOut,
  FiSun,
  FiMoon,
} from "react-icons/fi"
import { signOut } from "@/lib/helper"
import { useRouter } from "next/navigation"
import { MdContentPaste } from "react-icons/md"

export default function AdminSidebar() {
  const [isOpen, setIsOpen] = useState(false)
  const [isCollapsed, setIsCollapsed] = useState(false)
  const pathname = usePathname()
  const router = useRouter()

  const navigationItems = [
    {
      title: "Dashboard",
      href: "/admin-panel",
      icon: FiHome,
      badge: null,
    },
    {
      title: "Leads",
      href: "/admin-panel/leads",
      icon: FiUsers,
      // badge: "12",
    },
    {
      title: "Visitors",
      href: "/admin-panel/visitors",
      icon: FiEye,
      // badge: "245",
    },
    {
      title: "Blogs",
      href: "/admin-panel/blogs",
      icon: MdContentPaste,
      // badge: "245",
    },
    // {
    //   title: "Analytics",
    //   href: "/admin-panel/analytics",
    //   icon: FiBarChart,
    //   badge: null,
    // },
    // {
    //   title: "Performance",
    //   href: "/admin-panel/performance",
    //   icon: FiTrendingUp,
    //   badge: null,
    // },
    // {
    //   title: "Reports",
    //   href: "/admin-panel/reports",
    //   icon: FiPieChart,
    //   badge: null,
    // },
    // {
    //   title: "Gallery",
    //   href: "/admin-panel/gallery",
    //   icon: FiImage,
    //   badge: null,
    // },
    // {
    //   title: "Appointments",
    //   href: "/admin-panel/appointments",
    //   icon: FiCalendar,
    //   badge: "3",
    // },
    // {
    //   title: "Messages",
    //   href: "/admin-panel/messages",
    //   icon: FiMail,
    //   badge: "8",
    // },
    // {
    //   title: "Settings",
    //   href: "/admin-panel/settings",
    //   icon: FiSettings,
    //   badge: null,
    // },
  ]

  const handleSignOut = async () => {
    const result = await signOut()
    if (result.success) {
      router.push("/login")
    }
  }

  const toggleSidebar = () => {
    setIsOpen(!isOpen)
  }

  const toggleCollapse = () => {
    setIsCollapsed(!isCollapsed)
    if (isOpen) setIsOpen(false)
  }

  const sidebarVariants = {
    open: {
      x: 0,
      transition: {
        // type: "spring",
        // stiffness: 500,
        // damping: 50,
        duration: 0.2,
        delay: 0.5,
        // ease: [0, 0.71, 0.2, 1.01],
      },
    },
    closed: {
      x: "-100%",
      transition: {
        // type: "spring",
        // stiffness: 500,
        // damping: 50,
        duration: 0.2,
        delay: 0.5,
        // ease: [0, 0.71, 0.2, 1.01],
      },
    },
  }

  const itemVariants = {
    open: {
      opacity: 1,
      x: 0,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 10,
      },
    },
    closed: {
      opacity: 0,
      x: -20,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 10,
      },
    },
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
    <div className=" ">
      {/* Mobile Menu Button */}
      <button
        onClick={toggleSidebar}
        className="lg:hidden fixed top-10 left-4 z-50 p-2 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700"
      >
        <FiMenu className="h-6 w-6 text-gray-600 dark:text-gray-400" />
      </button>

      {/* Desktop Collapse Button */}
      <button
        onClick={toggleCollapse}
        className="hidden lg:block fixed top-10 left-4 z-50 p-2 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700"
      >
        <FiMenu className="h-6 w-6 text-gray-600 dark:text-gray-400" />
      </button>

      {/* Mobile Overlay */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="lg:hidden fixed inset-0 bg-black/50 z-40"
            onClick={toggleSidebar}
          />
        )}
      </AnimatePresence>

      {/* Sidebar */}
      <motion.aside
        variants={sidebarVariants}
        initial="closed"
        animate={isOpen || !isCollapsed ? "open" : "closed"}
        className={`fixed top-0 left-0 h-dvh bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 z-50 shadow-xl lg:shadow-none transition-all duration-300 ${isCollapsed && !isOpen ? "lg:w-16" : "w-64"
          }`}
      >
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="p-4 border-b border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-between">
              {(!isCollapsed || isOpen) && (
                <motion.h2
                  variants={itemVariants}
                  className="text-lg font-semibold text-gray-800 dark:text-white">
                  Admin Panel
                </motion.h2>
              )}
              <button
                onClick={toggleDarkMode}
                className={` text-xl rounded-full bg-gray-300 hover:bg-gray-400 dark:bg-gray-900 dark:hover:bg-gray-600 transition-colors duration-300 ${isCollapsed ? 'p-0' : 'p-2'}`}
              >
                {darkMode ? <FiSun className="text-yellow-400" /> : <FiMoon className="text-gray-600" />}
              </button>
              <button
                onClick={isOpen ? toggleSidebar : toggleCollapse}
                className="p-1 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
              >
                {isOpen ? (
                  <FiX className="h-5 w-5 text-gray-600 dark:text-gray-400" />
                ) : (
                  <FiChevronRight
                    className={`h-5 w-5 text-gray-600 dark:text-gray-400 transition-transform ${isCollapsed ? "rotate-0" : "rotate-180"
                      }`}
                  />
                )}
              </button>
            </div>
          </div>

          {/* Navigation */}
          <nav className="flex-1 p-4 space-y-2">
            {navigationItems.map((item: any, index) => {
              const isActive = pathname === item.href
              const Icon = item.icon

              return (
                <motion.div
                  key={item.href}
                  variants={itemVariants}
                  initial="closed"
                  animate={!isCollapsed || isOpen ? "open" : "closed"}
                  transition={{ delay: index * 0.05 }}
                >
                  <Link
                    href={item.href}
                    onClick={() => isOpen && toggleSidebar()}
                    className={`flex items-center px-3 py-2 rounded-lg transition-all duration-200 group relative ${isActive
                      ? "bg-blue-100 dark:bg-gray-700 text-blue-600 dark:text-gray-200"
                      : "text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 hover:text-gray-900 dark:hover:text-gray-200"
                      }`}
                  >
                    <Icon className={`h-5 w-5 ${isCollapsed && !isOpen ? "mx-auto" : "mr-3"} flex-shrink-0`} />

                    {(!isCollapsed || isOpen) && (
                      <>
                        <span className="font-medium truncate">{item.title}</span>
                        {item.badge && (
                          <span className="ml-auto bg-blue-500 dark:bg-gray-600 text-white text-xs px-2 py-1 rounded-full">
                            {item?.badge}
                          </span>
                        )}
                      </>
                    )}

                    {/* Tooltip for collapsed state */}
                    {isCollapsed && !isOpen && (
                      <div className="absolute left-full ml-2 px-2 py-1 bg-gray-900 dark:bg-gray-700 text-white text-sm rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap z-50">
                        {item.title}
                        {item.badge && (
                          <span className="ml-2 bg-blue-500 dark:bg-gray-600 text-white text-xs px-1 py-0.5 rounded">
                            {item?.badge}
                          </span>
                        )}
                      </div>
                    )}
                  </Link>
                </motion.div>
              )
            })}
          </nav>

          {/* Footer */}
          <div className="p-4 border-t border-gray-200 dark:border-gray-700">
            <motion.button
              variants={itemVariants}
              onClick={handleSignOut}
              className={`flex items-center w-full px-3 py-2 text-white hover:bg-indigo-500 bg-indigo-600 rounded-lg transition-colors duration-200  ${isCollapsed && !isOpen ? "justify-center" : ""
                }`}
            >
              <FiLogOut className={`h-5 w-5 ${isCollapsed && !isOpen ? "" : "mr-3"}`} />
              {(!isCollapsed || isOpen) && <span className="font-medium">Sign Out</span>}
            </motion.button>
          </div>
        </div>
      </motion.aside>

      {/* Main Content Spacer */}
      <div className={`transition-all duration-300 ${isCollapsed ? "lg:ml-16" : "lg:ml-64"}`} />
    </div>
  )
}
