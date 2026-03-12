import { Link } from '@tanstack/react-router'
import { Youtube, Facebook, Instagram, Mail } from 'lucide-react'
import { Container } from './Container'
import type { SiteSettings } from '@/types/settings'

interface FooterProps {
  settings?: SiteSettings
}

export function Footer({ settings }: FooterProps) {
  const youtubeUrl = settings?.youtube_url?.value || 'https://www.youtube.com/channel/UCHsyLCyXVM8L25qwS7h9Gjg'
  const facebookUrl = settings?.facebook_url?.value || 'https://www.facebook.com/shamsan.aljabi.2025'
  const instagramUrl = settings?.instagram_url?.value || 'https://www.instagram.com/dr.sham_san/'
  return (
    <footer className="mt-auto border-t-2 border-secondary/30 bg-muted/30 py-8">
      <Container>
        <div className="grid grid-cols-1 gap-8 sm:grid-cols-3">
          {/* Brand */}
          <div>
            <Link
              to="/"
              className="text-lg font-semibold text-primary"
            >
              Imam Dr. Shamsan Al-Jabi
            </Link>
            <p className="mt-1 font-arabic text-sm text-muted-foreground" dir="rtl">
              الدكتور. شمسان الجابي
            </p>
            <p className="mt-2 text-sm text-muted-foreground">
              Islamic Scholar, Educator & Community Leader
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-sm font-semibold text-foreground">
              Quick Links
            </h3>
            <ul className="mt-2 space-y-1">
              {[
                { to: '/about', label: 'About' },
                { to: '/services', label: 'Services' },
                { to: '/writings', label: 'Writings' },
                { to: '/contact', label: 'Contact' },
              ].map((link) => (
                <li key={link.to}>
                  <Link
                    to={link.to}
                    className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Social / Contact */}
          <div>
            <h3 className="text-sm font-semibold text-foreground">
              Connect
            </h3>
            <div className="mt-2 flex gap-3">
              <a
                href={youtubeUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-muted-foreground hover:text-foreground transition-colors"
                aria-label="YouTube"
              >
                <Youtube className="size-5" />
              </a>
              <a
                href={facebookUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-muted-foreground hover:text-foreground transition-colors"
                aria-label="Facebook"
              >
                <Facebook className="size-5" />
              </a>
              <a
                href={instagramUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-muted-foreground hover:text-foreground transition-colors"
                aria-label="Instagram"
              >
                <Instagram className="size-5" />
              </a>
              <a
                href="mailto:MCCGPImamShamsan@gmail.com"
                className="text-muted-foreground hover:text-foreground transition-colors"
                aria-label="Email"
              >
                <Mail className="size-5" />
              </a>
            </div>
            <p className="mt-3 text-sm text-muted-foreground">
              MCCGPImamShamsan@gmail.com
            </p>
          </div>
        </div>

        <div className="mt-8 flex items-center justify-center gap-3 opacity-30">
          <div className="h-px w-16 bg-secondary" />
          <div className="size-1.5 rounded-full bg-secondary" />
          <div className="h-px w-16 bg-secondary" />
        </div>
        <div className="mt-4 text-center text-sm text-muted-foreground">
          &copy; {new Date().getFullYear()} Imam Dr. Shamsan Al-Jabi. All
          rights reserved.
        </div>
      </Container>
    </footer>
  )
}
