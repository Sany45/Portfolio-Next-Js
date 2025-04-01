"use client"

import { useState, useEffect, useRef } from "react"

interface Position {
  x: number
  y: number
}

const CustomCursor = () => {
  const [dotPosition, setDotPosition] = useState<Position>({ x: 0, y: 0 })
  const [circlePosition, setCirclePosition] = useState<Position>({ x: 0, y: 0 })
  const [isPointer, setIsPointer] = useState<boolean>(false)
  const [isVisible, setIsVisible] = useState<boolean>(false)

  // Use refs to store the animation frame ID
  const animationFrameId = useRef<number | null>(null)

  useEffect(() => {
    const updatePosition = (e: MouseEvent) => {
      // Update dot position immediately
      setDotPosition({ x: e.clientX, y: e.clientY })

      // Check if cursor is over a clickable element
      const target = e.target as HTMLElement
      const isClickable =
        target.tagName.toLowerCase() === "button" ||
        target.tagName.toLowerCase() === "a" ||
        target.tagName.toLowerCase() === "input" ||
        target.tagName.toLowerCase() === "textarea" ||
        target.tagName.toLowerCase() === "select" ||
        target.closest("button") ||
        target.closest("a") ||
        window.getComputedStyle(target).cursor === "pointer"

      setIsPointer(isClickable ? true : false)
    }

    const handleMouseEnter = () => {
      setIsVisible(true)
    }

    const handleMouseLeave = () => {
      setIsVisible(false)
    }

    // Set up the animation loop for the trailing effect
    const animateCircle = () => {
      setCirclePosition((prevPos) => {
        // Calculate the distance between the dot and circle
        const dx = dotPosition.x - prevPos.x
        const dy = dotPosition.y - prevPos.y

        // Move the circle 15% of the way to the dot position each frame
        // Adjust this value to control the trailing speed (lower = more delay)
        const easing = 0.15

        return {
          x: prevPos.x + dx * easing,
          y: prevPos.y + dy * easing,
        }
      })

      animationFrameId.current = requestAnimationFrame(animateCircle)
    }

    // Start the animation
    animationFrameId.current = requestAnimationFrame(animateCircle)

    // Add event listeners
    window.addEventListener("mousemove", updatePosition)
    document.addEventListener("mouseenter", handleMouseEnter)
    document.addEventListener("mouseleave", handleMouseLeave)

    // Clean up
    return () => {
      window.removeEventListener("mousemove", updatePosition)
      document.removeEventListener("mouseenter", handleMouseEnter)
      document.removeEventListener("mouseleave", handleMouseLeave)
      if (animationFrameId.current) {
        cancelAnimationFrame(animationFrameId.current)
      }
    }
  }, [dotPosition])

  const cursorSize = isPointer ? "90px" : "60px"
  const dotSize = isPointer ? "12px" : "7px"

  return (
    <>
      {/* Outer circle - follows with delay */}
      <div
        className={`hidden md:block fixed pointer-events-none z-50 rounded-full transition-all duration-200 ease-out bg-stone-800 dark:bg-white`}
        style={{
          left: `${circlePosition.x}px`,
          top: `${circlePosition.y}px`,
          width: cursorSize,
          height: cursorSize,
          opacity: isVisible && isPointer ? 0.3 : 0.6,
          transform: "translate(-50%, -50%)",
          transitionProperty: "width, height, opacity",
        }}
      />

      {/* Inner dot - moves immediately */}
      <div
        className={`hidden md:block fixed pointer-events-none z-50 rounded-full bg-stone-800 dark:bg-white `}
        style={{
          left: `${dotPosition.x}px`,
          top: `${dotPosition.y}px`,
          width: dotSize,
          height: dotSize,
          opacity: isVisible && isPointer ? 1 : 1,
          transform: "translate(-50%, -50%)",
        }}
      />
    </>
  )
}

export default CustomCursor

