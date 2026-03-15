import { useEffect, useLayoutEffect, useRef, useState } from 'react'

interface FadeInProps {
  children: React.ReactNode
  delay?: number        // ms stagger delay
  distance?: number     // px to slide from (default 20)
  className?: string
}

/**
 * Fades in + slides up its children when they enter the viewport.
 *
 * useLayoutEffect sets opacity:0 synchronously after DOM commit but BEFORE
 * the browser paints — guaranteeing the invisible state is visible on screen.
 * useEffect then fires AFTER that first paint and triggers the transition.
 */
export function FadeIn({ children, delay = 0, distance = 20, className }: FadeInProps) {
  const ref = useRef<HTMLDivElement>(null)
  const [visible, setVisible] = useState(false)
  const [mounted, setMounted] = useState(false)

  // Runs synchronously after commit but before browser paint.
  // This means opacity:0 is applied to the DOM and painted before useEffect runs.
  useLayoutEffect(() => {
    setMounted(true)
  }, [])

  // Runs after the browser has painted opacity:0 — safe to trigger the transition.
  useEffect(() => {
    if (!mounted) return
    const el = ref.current
    if (!el) return

    const rect = el.getBoundingClientRect()
    const isInView = rect.top < window.innerHeight && rect.bottom > 0

    if (isInView) {
      // Browser already painted opacity:0, so setting visible now will transition correctly.
      setVisible(true)
      return
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true)
          observer.disconnect()
        }
      },
      { threshold: 0.08 },
    )
    observer.observe(el)
    return () => observer.disconnect()
  }, [mounted])

  return (
    <div
      ref={ref}
      className={className}
      style={
        mounted
          ? {
              opacity: visible ? 1 : 0,
              transform: visible ? 'translateY(0px)' : `translateY(${distance}px)`,
              transition: `opacity 0.5s ease ${delay}ms, transform 0.5s ease ${delay}ms`,
            }
          : undefined
      }
    >
      {children}
    </div>
  )
}
