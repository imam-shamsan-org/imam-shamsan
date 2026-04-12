import { useState } from 'react'
import { Link } from '@tanstack/react-router'
import {
  BookOpen,
  FileText,
  Heart,
  Home,
  Image,
  Mail,
  Menu,
  Mic,
  Moon,
  Play,
  Sun,
  Users,
  X,
} from 'lucide-react'
import { Container } from './Container'
import { ThemeToggle } from './ThemeToggle'
import { Button } from '@/components/ui/button'
import { useTheme } from '@/lib/theme'

const navLinks = [
  { to: '/', label: 'Home' },
  { to: '/about', label: 'About' },
  { to: '/services', label: 'Services' },
  { to: '/writings', label: 'Writings' },
  { to: '/sermons', label: 'Sermons' },
  { to: '/media', label: 'Media' },
  { to: '/gallery', label: 'Gallery' },
  { to: '/humanitarian', label: 'Humanitarian Aid' },
  { to: '/contact', label: 'Contact' },
] as const

const mobileIcons: Record<string, React.ElementType> = {
  '/': Home,
  '/about': Users,
  '/services': FileText,
  '/writings': BookOpen,
  '/sermons': Mic,
  '/media': Play,
  '/gallery': Image,
  '/humanitarian': Heart,
  '/contact': Mail,
}

function MobileMenu() {
  const [open, setOpen] = useState(false)
  const { theme, toggleTheme } = useTheme()

  return (
    <div className="md:hidden relative">
      <Button
        variant="ghost"
        size="icon-sm"
        onClick={() => setOpen(!open)}
        className="text-muted-foreground hover:text-foreground"
        aria-label="Menu"
      >
        {open ? <X className="size-5" /> : <Menu className="size-5" />}
      </Button>

      {open && (
        <>
          <div
            className="fixed inset-0 top-16 bg-background/80 backdrop-blur-sm z-40"
            onClick={() => setOpen(false)}
          />
          <div className="absolute right-0 top-2 w-56 bg-popover border border-border rounded-lg shadow-lg z-50 py-2 animate-in fade-in slide-in-from-top-2 duration-200">
            {navLinks.map((link) => {
              const Icon = mobileIcons[link.to] || Home
              return (
                <Link
                  key={link.to}
                  to={link.to}
                  onClick={() => setOpen(false)}
                  className="flex items-center gap-3 px-4 py-2.5 text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-muted transition-colors [&.active]:text-primary [&.active]:bg-primary/10 [&.active]:font-semibold"
                >
                  <Icon className="size-4" />
                  {link.label}
                </Link>
              )
            })}
            <div className="h-px bg-border my-2" />
            <button
              onClick={() => {
                toggleTheme()
                setOpen(false)
              }}
              className="flex items-center gap-3 w-full px-4 py-2.5 text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-muted transition-colors text-left"
            >
              {theme === 'light' ? (
                <Moon className="size-4" />
              ) : (
                <Sun className="size-4" />
              )}
              {theme === 'light' ? 'Dark Mode' : 'Light Mode'}
            </button>
          </div>
        </>
      )}
    </div>
  )
}

interface HeaderProps {
  logoUrl?: string
  personName?: string
}

export function Header({
  logoUrl,
  personName = 'Dr. Imam Shamsan',
}: HeaderProps) {
  // Split on last space so prefix ("Imam" / "Dr.") is bold and last name is secondary
  const lastSpaceIndex = personName.lastIndexOf(' ')
  const namePrefix =
    lastSpaceIndex > -1 ? personName.slice(0, lastSpaceIndex) : personName
  const nameSuffix =
    lastSpaceIndex > -1 ? personName.slice(lastSpaceIndex + 1) : ''

  return (
    <header className="sticky top-0 z-50 border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <Container>
        <div className="flex h-16 items-center justify-between gap-4">
          <Link
            to="/"
            className={`flex items-center ${logoUrl ? '' : 'gap-2'} text-xl font-semibold text-primary hover:text-primary/90 transition-colors shrink-0`}
          >
            {logoUrl ? (
              <>
                <img
                  src={logoUrl}
                  alt={personName}
                  className="h-18 w-auto object-cover object-center"
                />
                <span>
                  <span className="text-sm font-bold mr-1">
                    {namePrefix.toUpperCase()}
                  </span>
                  <span className="text-sm font-normal text-secondary">
                    {nameSuffix.toUpperCase()}
                  </span>
                </span>
              </>
            ) : (
              <>
                <span className="font-bold">{namePrefix.toUpperCase()}</span>
                <span className="font-normal text-secondary">
                  {nameSuffix.toUpperCase()}
                </span>
              </>
            )}
          </Link>

          <nav className="flex items-center gap-1">
            {navLinks.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                className="hidden md:flex items-center h-8 px-3 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors rounded-md hover:bg-muted [&.active]:text-primary [&.active]:bg-primary/10 [&.active]:font-semibold"
              >
                {link.label}
              </Link>
            ))}

            <div className="hidden md:block w-px h-5 bg-border mx-1" />
            <div className="hidden md:block">
              <ThemeToggle />
            </div>

            <MobileMenu />
          </nav>
        </div>
      </Container>
    </header>
  )
}
