"use client"

import type React from "react"
import { motion } from "framer-motion"
import { FaGithub, FaLinkedin, FaTwitter, FaInstagram, FaDribbble, FaArrowUp, FaHeart } from "react-icons/fa"
import { HiOutlineCode, HiOutlineLightBulb, HiOutlineSparkles } from "react-icons/hi"
import Link from "next/link"

const Footer = () => {
  const currentYear = new Date().getFullYear()

  const navigationLinks = [
    { name: "About", href: "/about" },
    { name: "Projects", href: "/projects" },
    { name: "Services", href: "/services" },
    { name: "Blog", href: "/blog" },
  ]

  const legalLinks = [
    { name: "Privacy Policy", href: "/privacy" },
    { name: "Terms of Service", href: "/terms" },
    { name: "Cookies", href: "/cookies" },
  ]

  const socialLinks = [
    { name: "GitHub", icon: FaGithub, href: "https://github.com", color: "hover:text-gray-900 dark:hover:text-white" },
    { name: "LinkedIn", icon: FaLinkedin, href: "https://linkedin.com", color: "hover:text-blue-600" },
    { name: "Twitter", icon: FaTwitter, href: "https://twitter.com", color: "hover:text-blue-400" },
    { name: "Instagram", icon: FaInstagram, href: "https://instagram.com", color: "hover:text-pink-500" },
    { name: "Dribbble", icon: FaDribbble, href: "https://dribbble.com", color: "hover:text-pink-400" },
  ]

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" })
  }

  return (
    <footer className="bg-gray-800 dark:bg-gray-900 text-white py-8 transition-colors duration-300">
      <div className="container mx-auto text-center">
        <p>&copy; {new Date().getFullYear()} Shahriar Sany. All rights reserved.</p>
        <p className="mt-2 text-sm text-gray-400">Crafted with passion and powered by Next.js</p>
      </div>
    </footer>

    // <footer className="bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-800 transition-colors duration-300">
    //   <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
    //     {/* Main Footer Content */}
    //     <div className="py-12">
    //       <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
    //         {/* Brand Section */}
    //         <motion.div
    //           initial={{ opacity: 0, y: 20 }}
    //           whileInView={{ opacity: 1, y: 0 }}
    //           transition={{ duration: 0.5 }}
    //           viewport={{ once: true }}
    //           className="lg:col-span-2"
    //         >
    //           <div className="flex items-center space-x-2 mb-4">
    //             <div className="w-8 h-8 bg-gradient-to-br from-purple-600 to-blue-600 rounded-lg flex items-center justify-center">
    //               <HiOutlineCode className="text-white text-lg" />
    //             </div>
    //             <h3 className="text-xl font-bold text-gray-900 dark:text-white">Shahriar Sany</h3>
    //           </div>
    //           <p className="text-gray-600 dark:text-gray-400 mb-6 max-w-md leading-relaxed">
    //             Crafting digital experiences with passion and precision. Transforming ideas into beautiful, functional
    //             solutions that make a difference.
    //           </p>

    //           {/* Inspirational Quote */}
    //           <div className="flex items-start space-x-3 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
    //             <HiOutlineLightBulb className="text-yellow-500 text-xl mt-0.5 flex-shrink-0" />
    //             <div>
    //               <p className="text-sm text-gray-700 dark:text-gray-300 italic">
    //                 "Innovation distinguishes between a leader and a follower."
    //               </p>
    //               <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">— Steve Jobs</p>
    //             </div>
    //           </div>
    //         </motion.div>

    //         {/* Navigation Links */}
    //         <motion.div
    //           initial={{ opacity: 0, y: 20 }}
    //           whileInView={{ opacity: 1, y: 0 }}
    //           transition={{ duration: 0.5, delay: 0.1 }}
    //           viewport={{ once: true }}
    //         >
    //           <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
    //             <HiOutlineSparkles className="text-purple-500 mr-2" />
    //             Explore
    //           </h4>
    //           <ul className="space-y-3">
    //             {navigationLinks.map((link, index) => (
    //               <motion.li
    //                 key={link.name}
    //                 initial={{ opacity: 0, x: -10 }}
    //                 whileInView={{ opacity: 1, x: 0 }}
    //                 transition={{ duration: 0.3, delay: index * 0.1 }}
    //                 viewport={{ once: true }}
    //               >
    //                 <Link
    //                   href={link.href}
    //                   className="text-gray-600 dark:text-gray-400 hover:text-purple-600 dark:hover:text-purple-400 transition-colors duration-300 flex items-center group"
    //                 >
    //                   <span className="w-1.5 h-1.5 bg-purple-500 rounded-full mr-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></span>
    //                   {link.name}
    //                 </Link>
    //               </motion.li>
    //             ))}
    //           </ul>
    //         </motion.div>

    //         {/* Legal Links */}
    //         <motion.div
    //           initial={{ opacity: 0, y: 20 }}
    //           whileInView={{ opacity: 1, y: 0 }}
    //           transition={{ duration: 0.5, delay: 0.2 }}
    //           viewport={{ once: true }}
    //         >
    //           <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Legal</h4>
    //           <ul className="space-y-3">
    //             {legalLinks.map((link, index) => (
    //               <motion.li
    //                 key={link.name}
    //                 initial={{ opacity: 0, x: -10 }}
    //                 whileInView={{ opacity: 1, x: 0 }}
    //                 transition={{ duration: 0.3, delay: index * 0.1 }}
    //                 viewport={{ once: true }}
    //               >
    //                 <Link
    //                   href={link.href}
    //                   className="text-gray-600 dark:text-gray-400 hover:text-purple-600 dark:hover:text-purple-400 transition-colors duration-300 flex items-center group"
    //                 >
    //                   <span className="w-1.5 h-1.5 bg-purple-500 rounded-full mr-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></span>
    //                   {link.name}
    //                 </Link>
    //               </motion.li>
    //             ))}
    //           </ul>
    //         </motion.div>
    //       </div>
    //     </div>

    //     {/* Social Links Section */}
    //     <motion.div
    //       initial={{ opacity: 0, y: 20 }}
    //       whileInView={{ opacity: 1, y: 0 }}
    //       transition={{ duration: 0.5, delay: 0.3 }}
    //       viewport={{ once: true }}
    //       className="py-6 border-t border-gray-200 dark:border-gray-800"
    //     >
    //       <div className="flex flex-col sm:flex-row items-center justify-between space-y-4 sm:space-y-0">
    //         <div className="flex items-center space-x-1 text-gray-600 dark:text-gray-400">
    //           <span>Follow my journey</span>
    //           <motion.div
    //             animate={{ rotate: [0, 10, -10, 0] }}
    //             transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY, repeatDelay: 3 }}
    //           >
    //             <span>👋</span>
    //           </motion.div>
    //         </div>

    //         <div className="flex items-center space-x-4">
    //           {socialLinks.map((social, index) => (
    //             <motion.a
    //               key={social.name}
    //               href={social.href}
    //               target="_blank"
    //               rel="noopener noreferrer"
    //               className={`text-gray-500 dark:text-gray-400 ${social.color} transition-all duration-300 transform hover:scale-110`}
    //               whileHover={{ y: -2 }}
    //               whileTap={{ scale: 0.95 }}
    //               initial={{ opacity: 0, scale: 0 }}
    //               whileInView={{ opacity: 1, scale: 1 }}
    //               transition={{ duration: 0.3, delay: index * 0.1 }}
    //               viewport={{ once: true }}
    //               aria-label={social.name}
    //             >
    //               <social.icon className="text-xl" />
    //             </motion.a>
    //           ))}
    //         </div>
    //       </div>
    //     </motion.div>

    //     {/* Bottom Section */}
    //     <motion.div
    //       initial={{ opacity: 0 }}
    //       whileInView={{ opacity: 1 }}
    //       transition={{ duration: 0.5, delay: 0.4 }}
    //       viewport={{ once: true }}
    //       className="py-6 border-t border-gray-200 dark:border-gray-800"
    //     >
    //       <div className="flex flex-col sm:flex-row items-center justify-between space-y-4 sm:space-y-0">
    //         <div className="flex items-center space-x-2 text-gray-600 dark:text-gray-400">
    //           <span>© {currentYear} Shahriar Sany. Made with</span>
    //           <motion.div
    //             animate={{ scale: [1, 1.2, 1] }}
    //             transition={{ duration: 1, repeat: Number.POSITIVE_INFINITY, repeatDelay: 2 }}
    //           >
    //             <FaHeart className="text-red-500" />
    //           </motion.div>
    //           <span>and lots of ☕</span>
    //         </div>

    //         <motion.button
    //           onClick={scrollToTop}
    //           className="flex items-center space-x-2 text-gray-600 dark:text-gray-400 hover:text-purple-600 dark:hover:text-purple-400 transition-colors duration-300 group"
    //           whileHover={{ y: -2 }}
    //           whileTap={{ scale: 0.95 }}
    //         >
    //           <span className="text-sm">Back to top</span>
    //           <FaArrowUp className="text-sm group-hover:transform group-hover:-translate-y-1 transition-transform duration-300" />
    //         </motion.button>
    //       </div>
    //     </motion.div>
    //   </div>
    // </footer>
  )
}

export default Footer
