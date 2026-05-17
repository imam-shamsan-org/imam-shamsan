import type { PerfumeProduct } from '@/types/perfume'
import { ArabicText } from '@/components/shared/ArabicText'
import { Button } from '@/components/ui/button'

const COLOR_MAP: Record<PerfumeProduct['colorAccent'], string> = {
  yellow: 'bg-yellow-400',
  brown: 'bg-amber-800',
  orange: 'bg-orange-400',
  teal: 'bg-teal-400',
  pink: 'bg-pink-400',
  red: 'bg-red-400',
  green: 'bg-green-500',
  blue: 'bg-blue-500',
}

interface PerfumeCardProps {
  perfume: PerfumeProduct
  onOrder: () => void
}

export function PerfumeCard({ perfume, onOrder }: PerfumeCardProps) {
  return (
    <div className="ring-1 ring-foreground/10 bg-card rounded-xl p-5 hover:ring-primary/30 hover:shadow-md transition-all flex flex-col gap-3">
      <div className="flex items-center gap-2">
        <span
          className={`size-3 rounded-full shrink-0 ${COLOR_MAP[perfume.colorAccent]}`}
        />
        <div className="min-w-0">
          <h3 className="font-semibold text-base leading-snug truncate">
            {perfume.name}
          </h3>
          <ArabicText
            as="p"
            className="text-sm text-muted-foreground leading-snug"
          >
            {perfume.nameAr}
          </ArabicText>
        </div>
      </div>

      <div>
        <p className="text-sm text-muted-foreground italic">
          {perfume.taglineEn}
        </p>
        <ArabicText as="p" className="text-sm text-muted-foreground italic">
          {perfume.taglineAr}
        </ArabicText>
      </div>

      <div>
        <p className="text-sm text-foreground/80">
          {perfume.ingredientsEn.join(' · ')}
        </p>
        <ArabicText as="p" className="text-sm text-foreground/70">
          {perfume.ingredientsAr.join(' · ')}
        </ArabicText>
      </div>

      <div className="flex items-center gap-2 flex-wrap">
        <span className="inline-flex items-center rounded-full border border-border px-2.5 py-0.5 text-xs text-muted-foreground">
          {perfume.moodEn}
        </span>
        <ArabicText
          as="span"
          className="inline-flex items-center rounded-full border border-border px-2.5 py-0.5 text-xs text-muted-foreground"
        >
          {perfume.moodAr}
        </ArabicText>
      </div>

      <Button onClick={onOrder} className="mt-auto w-full" size="sm">
        Order Now | اطلب الآن
      </Button>
    </div>
  )
}
