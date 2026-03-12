import { cn } from '@/lib/utils'

interface ShimmerButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  shimmerColor?: string
  shimmerSize?: string
  shimmerDuration?: string
  borderRadius?: string
  background?: string
  children: React.ReactNode
}

/**
 * ShimmerButton — a button with a shimmering light sweep effect.
 */
export function ShimmerButton({
  shimmerColor = 'rgba(255,255,255,0.3)',
  shimmerSize = '0.1em',
  shimmerDuration = '2s',
  borderRadius = '8px',
  background = 'oklch(0.45 0.15 145)',
  className,
  children,
  ...props
}: ShimmerButtonProps) {
  return (
    <button
      style={
        {
          '--shimmer-color': shimmerColor,
          '--shimmer-size': shimmerSize,
          '--shimmer-duration': shimmerDuration,
          '--border-radius': borderRadius,
          '--btn-bg': background,
        } as React.CSSProperties
      }
      className={cn(
        'relative cursor-pointer overflow-hidden whitespace-nowrap',
        'px-5 py-2.5 text-sm font-medium text-white',
        'rounded-[var(--border-radius)]',
        'bg-[var(--btn-bg)]',
        'transition-all duration-300 hover:scale-[1.02] hover:shadow-lg',
        'active:scale-[0.98]',
        'disabled:pointer-events-none disabled:opacity-50',
        // shimmer layer
        'before:absolute before:inset-0',
        'before:-translate-x-full before:animate-[shimmer-sweep_var(--shimmer-duration)_linear_infinite]',
        'before:bg-[linear-gradient(90deg,transparent,var(--shimmer-color),transparent)]',
        className,
      )}
      {...props}
    >
      {children}
    </button>
  )
}
