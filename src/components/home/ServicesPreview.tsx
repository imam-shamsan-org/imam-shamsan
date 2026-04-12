import { Link } from '@tanstack/react-router'
import { ArrowRight } from 'lucide-react'
import type { Service } from '@/types/service'
import type { SiteSettings } from '@/types/settings'
import { Container } from '@/components/layout/Container'
import { ServiceCard } from '@/components/services/ServiceCard'
import { FadeIn } from '@/components/shared/FadeIn'
import { PERSON_NAME } from '@/lib/constants'

interface ServicesPreviewProps {
  services: Array<Service>
  settings?: SiteSettings
}

export function ServicesPreview({
  services,
  settings: _settings,
}: ServicesPreviewProps) {
  if (!services.length) return null
  const personName = PERSON_NAME

  return (
    <section className="py-10 md:py-16">
      <Container>
        <FadeIn className="mb-8 flex items-center justify-between">
          <div>
            <div className="flex items-center gap-3 mb-1">
              <div className="h-6 w-[3px] rounded-full bg-secondary opacity-70" />
              <h2 className="text-2xl font-bold text-foreground md:text-3xl">
                Services
              </h2>
            </div>
            <p className="mt-1 text-muted-foreground pl-[18px]">
              Book Islamic services with {personName}
            </p>
          </div>
          <Link
            to="/services"
            className="hidden text-sm font-medium text-primary hover:text-primary/80 transition-colors sm:flex items-center gap-1"
          >
            View all
            <ArrowRight className="size-4" />
          </Link>
        </FadeIn>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {services.slice(0, 6).map((service, i) => (
            <FadeIn key={service.id} delay={i * 80}>
              <ServiceCard service={service} personName={personName} />
            </FadeIn>
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
