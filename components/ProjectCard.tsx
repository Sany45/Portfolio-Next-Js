"use client"

import { motion } from "framer-motion"
import { ImArrowUpRight2 } from "react-icons/im"
import Link from "next/link"
import Image from "next/image"

export function ProjectCard({
  title,
  description,
  link,
  image,
  hoverDuration,
}: {
  title: string
  description: string
  link: string
  image: any
  hoverDuration?: string
}) {
  return (
    <motion.div
      className="bg-white dark:bg-gray-700 p-6 rounded-lg shadow-lg overflow-hidden transition-colors duration-300 group"
      whileHover={{ scale: 1.05 }}
      transition={{ type: "spring", stiffness: 300 }}
    >
      <div className="w-full h-48 overflow-hidden rounded-md mb-4 relative bg-green-700">
        <Image
          src={image || "/placeholder.svg"}
          alt={title}
          className="absolute top-0 group-hover:top-full group-hover:-translate-y-full bg-green-500 w-full object-cover ease-linear"
          style={{ transitionDuration: hoverDuration ? hoverDuration : "3s" }}
        />
      </div>
      <h3 className="text-2xl font-bold text-gray-800 dark:text-white mb-3">{title}</h3>
      <p className="text-gray-600 dark:text-gray-300 mb-4">{description}</p>
      <div className="flex flex-col items-start space-y-2">
        <Link
          href={link}
          target="_blank"
          className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors duration-300 flex items-center justify-center"
        >
          Live Site <ImArrowUpRight2 className="ml-2" />
        </Link>
      </div>
    </motion.div>
  )
}

