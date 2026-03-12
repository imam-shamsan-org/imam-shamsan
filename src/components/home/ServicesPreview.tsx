import { Link } from '@tanstack/react-router'
import { ArrowRight } from 'lucide-react'
import { Container } from '@/components/layout/Container'
import { ServiceCard } from '@/components/services/ServiceCard'
import type { Service } from '@/types/service'

interface ServicesPreviewProps {
  services: Service[]
}

export function ServicesPreview({ services }: ServicesPreviewProps) {
  if (!services.length) return null

  return (
    <section className="py-16">
      <Container>
        <div className="mb-8 flex items-center justify-between">
          <div>
            <div className="flex items-center gap-3 mb-1">
              <div className="h-6 w-[3px] rounded-full bg-secondary opacity-70" />
              <h2 className="text-2xl font-bold text-foreground md:text-3xl">
                Services
              </h2>
            </div>
            <p className="mt-1 text-muted-foreground pl-[18px]">
              Book Islamic services with Imam Shamsan
            </p>
          </div>
          <Link
            to="/services"
            className="hidden text-sm font-medium text-primary hover:text-primary/80 transition-colors sm:flex items-center gap-1"
          >
            View all
            <ArrowRight className="size-4" />
          </Link>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {services.slice(0, 6).map((service) => (
            <ServiceCard key={service.id} service={service} />
          ))}
        </div>

        <div className="mt-8 text-center sm:hidden">
          <Link to="/services">
            <button className="text-sm font-medium text-primary hover:text-primary/80 transition-colors inline-flex items-center gap-1">
              View All Services
              <ArrowRight className="size-4" />
            </button>
          </Link>
        </div>
      </Container>
    </section>
  )
}
