import Link from 'next/link'
import React, { useEffect, useState } from 'react'
import { BiMenu } from 'react-icons/bi'
import { FiMoon, FiSun } from 'react-icons/fi'

const Navbar = () => {

  const [darkMode, setDarkMode] = useState(true)
  const [showMenu, setShowMenu] = useState(false)

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

  const toggleMenu = () => setShowMenu(!showMenu)

  const toggleDarkMode = () => setDarkMode(!darkMode)
  return (
    <nav className="bg-white relative dark:bg-black shadow-md p-4 md:sticky top-0 z-20 transition-colors duration-300">
      <div className="container md:flex mx-auto hidden justify-end sm:justify-between items-center">
        {/* <h1 className=" hidden sm:block text-2xl font-bold text-blue-600 dark:text-blue-400">Shahriar Sany</h1> */}
        <h1 className=" hidden sm:block text-2xl font-bold text-blue-600 dark:text-blue-400">{"{A}"}</h1>
        <div className="space-x-4 flex items-center">
          <Link
            href="#about"
            className="text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors duration-300"
          >
            About
          </Link>
          <Link
            href="#projects"
            className="text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors duration-300"
          >
            Projects
          </Link>
          <Link
            href="#contact"
            className="text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors duration-300"
          >
            Contact
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
        <h1 className=" text-2xl font-bold text-gray-600 dark:text-white">{"{A}"}</h1>
        <div>
          <BiMenu onClick={toggleMenu} size={30} />
        </div>
        <div className={`space-x-4 flex items-center absolute left-0 w-full p-4 border-y mb-2 border-gray-400 dark:bg-black bg-white z-10 transition-all
          ${showMenu ? 'bottom-0 translate-y-full' : 'top-0 -translate-y-full'}
          `}>
          <Link
            href="#about"
            className="text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors duration-300"
          >
            About
          </Link>
          <Link
            href="#projects"
            className="text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors duration-300"
          >
            Projects
          </Link>
          <Link
            href="#contact"
            className="text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors duration-300"
          >
            Contact
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