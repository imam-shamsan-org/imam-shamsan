import { ServiceCard } from './ServiceCard'
import { FadeIn } from '@/components/shared/FadeIn'
import type { Service } from '@/types/service'

interface ServiceGridProps {
  services: Service[]
}

export function ServiceGrid({ services }: ServiceGridProps) {
  if (!services.length) {
    return (
      <div className="py-12 text-center text-muted-foreground">
        No services available at this time.
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {services.map((service, i) => (
        <FadeIn key={service.id} delay={i * 80}>
          <ServiceCard service={service} />
        </FadeIn>
      ))}
    </div>
  )
}
