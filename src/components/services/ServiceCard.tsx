import { useState } from 'react'
import { ArrowRight } from 'lucide-react'
import { ServiceDetailDialog } from './ServiceDetailDialog'
import type { Service } from '@/types/service'
import { ArabicText } from '@/components/shared/ArabicText'

interface ServiceCardProps {
  service: Service
}

export function ServiceCard({ service }: ServiceCardProps) {
  const [open, setOpen] = useState(false)

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="group flex flex-col rounded-xl ring-1 ring-foreground/10 bg-card p-5 transition-all hover:ring-primary/30 hover:shadow-md h-full min-h-[160px] text-left w-full cursor-pointer"
      >
        <div className="mb-3">
          <h3 className="text-base font-semibold text-foreground group-hover:text-primary transition-colors">
            {service.nameEn}
          </h3>
          {service.nameAr && (
            <ArabicText as="p" className="text-sm text-muted-foreground mt-0.5">
              {service.nameAr}
            </ArabicText>
          )}
        </div>

        {service.description && (
          <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
            {service.description}
          </p>
        )}

        <div className="mt-auto pt-3 border-t border-border">
          <div className="flex items-center justify-end">
            <span className="flex shrink-0 items-center gap-1 text-xs font-medium text-primary">
              View Details
              <ArrowRight className="size-3 transition-transform group-hover:translate-x-0.5" />
            </span>
          </div>
        </div>
      </button>

      <ServiceDetailDialog
        service={service}
        open={open}
        onClose={() => setOpen(false)}
      />
    </>
  )
}
