import { cn } from '@/lib/utils'

interface BorderBeamProps {
  className?: string
  /** Size of the beam segment in px */
  size?: number
  /** Rotation duration in seconds */
  duration?: number
  /** Start color (CSS color value) */
  colorFrom?: string
  /** End color (CSS color value) */
  colorTo?: string
  /** Animation delay in seconds */
  delay?: number
}

/**
 * BorderBeam — an animated gradient beam that travels along the border.
 * Place inside a `relative overflow-hidden rounded-*` container.
 */
export function BorderBeam({
  className,
  size = 200,
  duration = 8,
  colorFrom = 'oklch(0.55 0.15 145)',
  colorTo = 'oklch(0.75 0.15 85)',
  delay = 0,
}: BorderBeamProps) {
  return (
    <div
      style={
        {
          '--beam-size': `${size}px`,
          '--beam-duration': `${duration}s`,
          '--beam-delay': `-${delay}s`,
          '--beam-color-from': colorFrom,
          '--beam-color-to': colorTo,
        } as React.CSSProperties
      }
      className={cn(
        'pointer-events-none absolute inset-0 rounded-[inherit]',
        '[mask-clip:padding-box,border-box]',
        '[mask-composite:intersect]',
        '[mask-image:linear-gradient(transparent,transparent),linear-gradient(white,white)]',
        'after:absolute after:aspect-square after:w-[var(--beam-size)]',
        'after:animate-[border-beam_var(--beam-duration)_linear_var(--beam-delay)_infinite]',
        'after:[background:linear-gradient(to_left,var(--beam-color-from),var(--beam-color-to),transparent)]',
        'after:[offset-anchor:90%_50%]',
        'after:[offset-path:rect(0_auto_auto_0_round_12px)]',
        className,
      )}
    />
  )
}
