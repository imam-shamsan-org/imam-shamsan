import type { PerfumeProduct } from '@/types/perfume'
import { ArabicText } from '@/components/shared/ArabicText'
import { Button } from '@/components/ui/button'
import { getOptimizedUrl, getSrcSet } from '@/lib/cloudinary'

const COLOR_HEX_MAP: Record<PerfumeProduct['colorAccent'], string> = {
  yellow: '#facc15',
  brown: '#92400e',
  orange: '#fb923c',
  teal: '#2dd4bf',
  pink: '#f472b6',
  red: '#f87171',
  green: '#22c55e',
  blue: '#3b82f6',
}

interface PerfumeCardProps {
  perfume: PerfumeProduct
  onOrder: () => void
}

export function PerfumeCard({ perfume, onOrder }: PerfumeCardProps) {
  return (
    <div className="group ring-1 ring-foreground/10 bg-card rounded-xl overflow-hidden hover:ring-primary/30 hover:shadow-lg transition-all duration-200 flex flex-col cursor-pointer">
      <div
        className="h-1 w-full shrink-0"
        style={{ backgroundColor: COLOR_HEX_MAP[perfume.colorAccent] }}
      />

      {perfume.photo && (
        <div className="aspect-[4/5] w-full overflow-hidden bg-muted">
          <img
            src={getOptimizedUrl(perfume.photo, 'perfume-card')}
            srcSet={getSrcSet(perfume.photo, 'perfume-card')}
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            alt={perfume.name}
            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
            loading="lazy"
          />
        </div>
      )}

      <div className="flex flex-col gap-4 p-5 flex-1">
        <div>
          <h3 className="font-semibold text-base leading-snug">{perfume.name}</h3>
          <ArabicText
            as="p"
            className="text-sm text-muted-foreground mt-0.5 text-right"
          >
            {perfume.nameAr}
          </ArabicText>
        </div>

        <p className="text-sm text-muted-foreground italic leading-relaxed">
          {perfume.taglineEn}
        </p>

        <div className="flex flex-wrap gap-1.5">
          {perfume.ingredientsEn.map((note) => (
            <span
              key={note}
              className="inline-flex items-center rounded-full bg-muted px-2.5 py-0.5 text-xs text-muted-foreground"
            >
              {note}
            </span>
          ))}
        </div>

        <span className="inline-flex items-center self-start rounded-full border border-border px-2.5 py-0.5 text-xs text-muted-foreground gap-1.5">
          {perfume.moodEn}
          <span className="text-foreground/20">·</span>
          <ArabicText as="span">{perfume.moodAr}</ArabicText>
        </span>

        <Button onClick={onOrder} className="mt-auto w-full" size="sm">
          Order Now | اطلب الآن
        </Button>
      </div>
    </div>
  )
}
