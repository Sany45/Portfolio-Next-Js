"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"

const AnimatedCursor = () => {
  // Typing innerPosition and outerPosition
  const [innerPosition, setInnerPosition] = useState<{ x: number; y: number }>({ x: 0, y: 0 })
  const [outerPosition, setOuterPosition] = useState<{ x: number; y: number }>({ x: 0, y: 0 })
  const [isMouseOut, setIsMouseOut] = useState<boolean>(true)
  const [isHovering, setIsHovering] = useState<boolean>(false)

  useEffect(() => {
    // Typing the event for mousemove
    const updateInnerPosition = (e: MouseEvent) => {
      setInnerPosition({ x: e.clientX, y: e.clientY })
      setTimeout(() => {
        setOuterPosition({ x: e.clientX, y: e.clientY })
      }, 200)
    }

    // Typing the event for mouseover
    const updateHoverStatus = (hovering: boolean) => {
      setIsHovering(hovering)
    }

    window.addEventListener("mousemove", updateInnerPosition)

    // Typing the event for mouseover
    const handleMouseOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement
      updateHoverStatus(target.matches('a, button, [role="button"], input, select, textarea'))
    }

    const handleMouseOut = () => updateHoverStatus(false)

    document.body.addEventListener("mouseover", handleMouseOver)
    document.body.addEventListener("mouseout", handleMouseOut)

    return () => {
      window.removeEventListener("mousemove", updateInnerPosition)
      document.body.removeEventListener("mouseover", handleMouseOver)
      document.body.removeEventListener("mouseout", handleMouseOut)
    }
  }, [])

  useEffect(() => {
    // Typing mouse events
    const handleMouseEnter = () => setIsMouseOut(false)
    const handleMouseLeave = () => setIsMouseOut(true)

    document.body.addEventListener("mouseenter", handleMouseEnter)
    document.body.addEventListener("mouseleave", handleMouseLeave)

    return () => {
      document.body.removeEventListener("mouseenter", handleMouseEnter)
      document.body.removeEventListener("mouseleave", handleMouseLeave)
    }
  }, [])

  return (
    <div className={`${isMouseOut ? 'opacity-0' : 'opacity-100'} transition-all duration-200`}>
      <div
        className="fixed pointer-events-none z-50"
        style={{
          left: `${innerPosition.x}px`,
          top: `${innerPosition.y}px`,
        }}
      >
        <motion.div
          className="relative"
          animate={{
            scale: isHovering ? 1.5 : 1,
          }}
          transition={{
            type: "spring",
            stiffness: 300,
            damping: 100,
          }}
        >
          <div
            className="absolute -translate-x-1/2 -translate-y-1/2 rounded-full bg-sky-500 backdrop-blur h-2 w-2"
          // style={{ width: "8px", height: "8px" }}
          />
        </motion.div>
      </div>
      <div
        className="fixed pointer-events-none z-50"
        style={{
          left: `${outerPosition.x}px`,
          top: `${outerPosition.y}px`,
        }}
      >
        <motion.div
          className="relative"
          animate={{
            scale: isHovering ? 2 : 1,
          }}
          transition={{
            type: "spring",
            stiffness: 300,
            damping: 30,
          }}
        >
          <div
            className="absolute -translate-x-1/2 -translate-y-1/2 rounded-full bg-teal-500 backdrop-blur-xl opacity-40 h-12 w-12"
          />
        </motion.div>
      </div>
    </div>
  )
}

export default AnimatedCursor
