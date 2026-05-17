import { useState } from 'react'
import { createFileRoute } from '@tanstack/react-router'
import { Coffee, Droplet, Footprints, Shirt, ShoppingBag } from 'lucide-react'
import type { AvailableNote, PerfumeProduct } from '@/types/perfume'
import { Container } from '@/components/layout/Container'
import { FadeIn } from '@/components/shared/FadeIn'
import { SignatureCollectionSection } from '@/components/shop/SignatureCollectionSection'
import { CreateYourOwnSection } from '@/components/shop/CreateYourOwnSection'
import { WhyShamsan } from '@/components/shop/WhyShamsan'
import { PerfumeOrderDialog } from '@/components/shop/PerfumeOrderDialog'
import { getPublishedPerfumes } from '@/lib/notion'
import { getBreadcrumbSchema, siteConfig } from '@/lib/seo'

const CATEGORIES = [
  { id: 'perfumes', labelEn: 'Perfumes', labelAr: 'عطور', Icon: null },
  { id: 'hats', labelEn: 'Hats', labelAr: 'قبعات', Icon: ShoppingBag },
  { id: 'thoubs', labelEn: 'Thoubs', labelAr: 'ثياب', Icon: Shirt },
  { id: 'honey', labelEn: 'Honey', labelAr: 'عسل', Icon: Droplet },
  { id: 'coffee', labelEn: 'Coffee', labelAr: 'قهوة', Icon: Coffee },
  {
    id: 'leather-socks',
    labelEn: 'Leather Socks',
    labelAr: 'جوارب جلدية',
    Icon: Footprints,
  },
] as const

type CategoryId = (typeof CATEGORIES)[number]['id']

export const Route = createFileRoute('/shop')({
  loader: async () => {
    const perfumes = await getPublishedPerfumes()
    return { perfumes }
  },
  head: () => ({
    meta: [
      { title: 'Shop | متجر — Imam Shamsan' },
      {
        name: 'description',
        content:
          "Browse SHAMSAN'S Collection — oil-based perfumes crafted with natural ingredients, and more coming soon.",
      },
    ],
    scripts: [
      {
        type: 'application/ld+json',
        children: getBreadcrumbSchema([
          { name: 'Home', url: siteConfig.url },
          { name: 'Shop', url: `${siteConfig.url}/shop` },
        ]),
      },
    ],
  }),
  component: ShopPage,
})

type DialogMode = 'signature' | 'custom' | null

function ShopPage() {
  const { perfumes } = Route.useLoaderData()

  const [activeCategory, setActiveCategory] = useState<CategoryId>('perfumes')
  const [dialogMode, setDialogMode] = useState<DialogMode>(null)
  const [selectedPerfume, setSelectedPerfume] = useState<PerfumeProduct | null>(
    null,
  )
  const [selectedNotes, setSelectedNotes] = useState<Array<AvailableNote>>([])
  const [dialogOpen, setDialogOpen] = useState(false)

  function handleSignatureOrder(perfume: PerfumeProduct) {
    setDialogMode('signature')
    setSelectedPerfume(perfume)
    setDialogOpen(true)
  }

  function handleCustomOrder(notes: Array<AvailableNote>) {
    setDialogMode('custom')
    setSelectedNotes(notes)
    setDialogOpen(true)
  }

  function handleClose() {
    setDialogOpen(false)
  }

  return (
    <>
      {/* Hero */}
      <section className="bg-gradient-to-b from-accent/50 to-background py-8 md:py-12">
        <Container>
          <FadeIn>
            <div className="mx-auto max-w-3xl text-center">
              <h1 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl md:text-5xl">
                <span className="text-primary">Shop</span>
              </h1>
              <p
                dir="rtl"
                lang="ar"
                className="font-arabic mt-2 text-2xl text-muted-foreground"
              >
                متجر
              </p>
              <p className="mt-4 text-lg text-muted-foreground">
                SHAMSAN&apos;S Collection — crafted with care
              </p>
              <div className="mt-6 flex items-center justify-center gap-3 opacity-40">
                <div className="h-px w-16 bg-secondary" />
                <div className="size-1.5 rounded-full bg-secondary" />
                <div className="h-px w-16 bg-secondary" />
              </div>
            </div>
          </FadeIn>
        </Container>
      </section>

      {/* Category tabs */}
      <section className="sticky top-16 z-10 border-b border-border bg-background/95 backdrop-blur-sm py-3">
        <Container>
          <div className="flex gap-2 overflow-x-auto pb-1">
            {CATEGORIES.map((cat) => (
              <button
                key={cat.id}
                type="button"
                onClick={() => setActiveCategory(cat.id)}
                className={[
                  'inline-flex shrink-0 items-center gap-1.5 rounded-full px-4 py-1.5 text-sm font-medium transition-colors',
                  activeCategory === cat.id
                    ? 'bg-primary text-primary-foreground'
                    : 'bg-muted text-muted-foreground hover:bg-accent hover:text-foreground',
                ].join(' ')}
              >
                {cat.labelEn}
                <span dir="rtl" lang="ar" className="font-arabic text-xs opacity-75">
                  {cat.labelAr}
                </span>
              </button>
            ))}
          </div>
        </Container>
      </section>

      {/* Active category content */}
      {activeCategory === 'perfumes' ? (
        <>
          <SignatureCollectionSection
            perfumes={perfumes}
            onOrder={handleSignatureOrder}
          />
          <CreateYourOwnSection onOrder={handleCustomOrder} />
          <WhyShamsan />
        </>
      ) : (
        (() => {
          const cat = CATEGORIES.find((c) => c.id === activeCategory)!
          const Icon = cat.Icon!
          return (
            <section className="py-16">
              <Container>
                <FadeIn>
                  <div className="rounded-xl border border-dashed border-border bg-card/50 p-8 text-center">
                    <Icon className="mx-auto mb-4 size-10 text-muted-foreground/50" />
                    <h2 className="text-xl font-semibold text-foreground">
                      {cat.labelEn}
                    </h2>
                    <p dir="rtl" lang="ar" className="font-arabic mt-1 text-lg text-muted-foreground">
                      {cat.labelAr}
                    </p>
                    <p className="mt-3 text-sm text-muted-foreground">
                      Coming Soon |{' '}
                      <span dir="rtl" lang="ar" className="font-arabic">
                        قريباً
                      </span>
                    </p>
                  </div>
                </FadeIn>
              </Container>
            </section>
          )
        })()
      )}

      {/* Order dialog — rendered once at route level */}
      {dialogOpen && dialogMode === 'signature' && selectedPerfume && (
        <PerfumeOrderDialog
          mode="signature"
          perfume={selectedPerfume}
          open={dialogOpen}
          onClose={handleClose}
        />
      )}
      {dialogOpen && dialogMode === 'custom' && (
        <PerfumeOrderDialog
          mode="custom"
          selectedNotes={selectedNotes}
          open={dialogOpen}
          onClose={handleClose}
        />
      )}
    </>
  )
}
