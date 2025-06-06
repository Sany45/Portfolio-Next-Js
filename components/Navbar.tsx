"use client"

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import React, { useEffect, useState } from 'react'
import { BiMenu } from 'react-icons/bi'
import { FiMoon, FiSun } from 'react-icons/fi'
import { MdRestaurantMenu } from 'react-icons/md'

const Navbar = () => {

  const [darkMode, setDarkMode] = useState(true)
  const [showMenu, setShowMenu] = useState(false)

  const pathName = usePathname()

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

  useEffect(() => {
    setShowMenu(false)
  }, [pathName])

  const toggleMenu = () => setShowMenu(!showMenu)

  const toggleDarkMode = () => setDarkMode(!darkMode)
  return (
    <nav className="bg-white sticky dark:bg-gray-800 shadow-md p-4 md:sticky top-0 z-50 transition-colors duration-300">
      <div className="container md:flex mx-auto hidden justify-end sm:justify-between items-center">
        {/* <h1 className=" hidden sm:block text-2xl font-bold text-blue-600 dark:text-blue-400">Shahriar Sany</h1> */}
        <h1 className=" hidden sm:block text-2xl font-bold text-gray-600 dark:text-white">{"{S}"}</h1>
        <div className="space-x-4 flex items-center">
          <Link
            href="/#about"
            className="text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors duration-300"
          >
            About
          </Link>
          <Link
            href="/#projects"
            className="text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors duration-300"
          >
            Projects
          </Link>
          <Link
            href="/#contact"
            className="text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors duration-300"
          >
            Contact
          </Link>
          <Link
            href="/blogs"
            className="text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors duration-300"
          >
            Blogs
          </Link>
          <button
            onClick={toggleDarkMode}
            className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors duration-300"
          >
            {darkMode ? <FiSun className="text-yellow-400" /> : <FiMoon className="text-gray-600" />}
          </button>
        </div>
      </div>
      <div className="container md:hidden mx-auto flex justify-between sm:justify-between items-center">
        {/* <h1 className=" hidden sm:block text-2xl font-bold text-blue-600 dark:text-blue-400">Shahriar Sany</h1> */}
        <h1 className=" text-2xl font-bold text-gray-600 dark:text-white">{"{S}"}</h1>
        <div>
          {
            showMenu ?
              <MdRestaurantMenu onClick={toggleMenu} size={30} /> :
              <BiMenu onClick={toggleMenu} size={30} />
          }
        </div>
        <div className={`space-x-4 flex items-center absolute left-0 w-full border-y border-gray-400 dark:bg-gray-800 bg-white z-10 transition-all overflow-hidden bottom-0 translate-y-full 
          ${showMenu ? 'p-4' : 'py-0 h-0 border-0'}
          `}>
          <Link
            href="/#about"
            className="text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors duration-300"
          >
            About
          </Link>
          <Link
            href="/#projects"
            className="text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors duration-300"
          >
            Projects
          </Link>
          <Link
            href="/#contact"
            className="text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors duration-300"
          >
            Contact
          </Link>
          <Link
            href="/blogs"
            className="text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors duration-300"
          >
            Blogs
          </Link>
          <button
            onClick={toggleDarkMode}
            className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors duration-300"
          >
            {darkMode ? <FiSun className="text-yellow-400" /> : <FiMoon className="text-gray-600" />}
          </button>
        </div>
      </div>
    </nav>

  )
}

export default Navbar