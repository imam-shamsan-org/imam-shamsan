import { cn } from '@/lib/utils'

interface MarqueeProps {
  className?: string
  reverse?: boolean
  pauseOnHover?: boolean
  children: React.ReactNode
  speed?: number
}

/**
 * Marquee — infinitely scrolling container.
 * Duplicates children for seamless loop.
 */
export function Marquee({
  className,
  reverse = false,
  pauseOnHover = true,
  children,
  speed = 40,
}: MarqueeProps) {
  return (
    <div
      style={{ '--marquee-duration': `${speed}s` } as React.CSSProperties}
      className={cn(
        'group flex overflow-hidden [--gap:2rem]',
        '[mask-image:linear-gradient(to_right,transparent,white_10%,white_90%,transparent)]',
        className,
      )}
    >
      {[0, 1].map((i) => (
        <div
          key={i}
          className={cn(
            'flex shrink-0 items-center gap-[var(--gap)]',
            'animate-[marquee-scroll_var(--marquee-duration)_linear_infinite]',
            reverse && '[animation-direction:reverse]',
            pauseOnHover && 'group-hover:[animation-play-state:paused]',
          )}
        >
          {children}
        </div>
      ))}
    </div>
  )
}
