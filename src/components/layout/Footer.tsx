import { Link } from '@tanstack/react-router'
import { Download, Facebook, Instagram, Mail, Youtube } from 'lucide-react'
import { Container } from './Container'
import type { SiteSettings } from '@/types/settings'
import { PERSON_NAME_AR, PERSON_NAME_FULL } from '@/lib/constants'

interface FooterProps {
  settings?: SiteSettings
}

export function Footer({ settings }: FooterProps) {
  const personName = PERSON_NAME_FULL
  const cvUrl = settings?.cvUrl?.value
  const cvDownloadUrl = cvUrl?.includes('res.cloudinary.com')
    ? cvUrl.replace(/\/upload\//, '/upload/fl_attachment/')
    : cvUrl
  const youtubeUrl =
    settings?.youtube_url?.value ||
    'https://www.youtube.com/channel/UCHsyLCyXVM8L25qwS7h9Gjg'
  const facebookUrl =
    settings?.facebook_url?.value ||
    'https://www.facebook.com/shamsan.aljabi.2025'
  const instagramUrl =
    settings?.instagram_url?.value || 'https://www.instagram.com/dr.sham_san/'
  return (
    <footer className="mt-auto border-t-2 border-secondary/30 bg-muted/30 py-8">
      <Container>
        <div className="grid grid-cols-1 gap-8 sm:grid-cols-3">
          {/* Brand */}
          <div>
            <Link to="/" className="text-lg font-semibold text-primary">
              {personName}
            </Link>
            <p
              className="mt-1 font-arabic text-sm text-muted-foreground"
              dir="rtl"
            >
              {PERSON_NAME_AR}
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
              {cvDownloadUrl && (
                <li>
                  <a
                    href={cvDownloadUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors"
                  >
                    <Download className="size-3.5" />
                    Download CV
                  </a>
                </li>
              )}
            </ul>
          </div>

          {/* Social / Contact */}
          <div>
            <h3 className="text-sm font-semibold text-foreground">Connect</h3>
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
        <div className="mt-4 flex flex-col items-center gap-2 text-center text-sm text-muted-foreground sm:flex-row sm:justify-center sm:gap-4">
          <span>
            &copy; {new Date().getFullYear()} {personName}. All rights reserved.
          </span>
          <span className="flex gap-4">
            <Link
              to="/terms"
              className="hover:text-foreground transition-colors"
            >
              Terms & Conditions
            </Link>
            <Link
              to="/privacy"
              className="hover:text-foreground transition-colors"
            >
              Privacy Policy
            </Link>
          </span>
        </div>
      </Container>
    </footer>
  )
}
