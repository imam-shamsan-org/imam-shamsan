import { Link } from '@tanstack/react-router'
import { ArrowRight } from 'lucide-react'
import { Container } from '@/components/layout/Container'
import { Button } from '@/components/ui/button'
import { ArabicText } from '@/components/shared/ArabicText'
import { CloudinaryImage } from '@/components/shared/CloudinaryImage'
import type { SiteSettings } from '@/types/settings'

interface HeroSectionProps {
  settings: SiteSettings
}

export function HeroSection({ settings }: HeroSectionProps) {
  const profileImage = settings.profile_img?.value
  return (
    <section className="bg-gradient-to-b from-primary/15 via-accent/40 to-background py-16 md:py-24">
      <Container>
        <div className="mx-auto max-w-3xl text-center">
          {profileImage && (
            <div className="mb-6 flex justify-center">
              <CloudinaryImage
                src={profileImage}
                alt="Imam Dr. Shamsan Al-Jabi"
                preset="avatar"
                className="size-32 rounded-full ring-2 ring-secondary/50 sm:size-40"
              />
            </div>
          )}
          <h1 className="text-[clamp(1.75rem,5vw,3.75rem)] font-bold tracking-tight text-foreground sm:whitespace-nowrap">
            Imam Dr. <span className="text-primary">Shamsan&nbsp;Al-Jabi</span>
          </h1>
          <ArabicText
            as="h1"
            className="mt-3 text-2xl text-secondary sm:text-3xl"
          >
            الدكتور. شمسان الجابي
          </ArabicText>
          <p className="mt-6 text-lg text-muted-foreground md:text-xl">
            Islamic Scholar, Educator & Community Leader. Dedicated to spreading
            authentic Islamic knowledge and serving the Muslim community.
          </p>
          <div className="mt-8 flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Link to="/about">
              <Button size="lg" className="gap-2">
                Learn More
                <ArrowRight className="size-4" />
              </Button>
            </Link>
            <Link to="/services">
              <Button size="lg" variant="outline" className="gap-2">
                Book a Service
              </Button>
            </Link>
          </div>
        </div>
      </Container>
      <div className="mt-10 flex items-center justify-center gap-3 opacity-40">
        <div className="h-px w-16 bg-secondary" />
        <div className="size-1.5 rounded-full bg-secondary" />
        <div className="h-px w-16 bg-secondary" />
      </div>
    </section>
  )
}
