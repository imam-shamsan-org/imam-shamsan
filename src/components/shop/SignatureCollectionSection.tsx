import type { PerfumeProduct } from '@/types/perfume'
import { Container } from '@/components/layout/Container'
import { ArabicText } from '@/components/shared/ArabicText'
import { FadeIn } from '@/components/shared/FadeIn'
import { PerfumeGrid } from '@/components/shop/PerfumeGrid'

interface SignatureCollectionSectionProps {
  perfumes: Array<PerfumeProduct>
  onOrder: (perfume: PerfumeProduct) => void
}

export function SignatureCollectionSection({
  perfumes,
  onOrder,
}: SignatureCollectionSectionProps) {
  return (
    <section id="perfumes" className="py-16">
      <Container>
        <FadeIn className="mb-10 text-center">
          <h2 className="text-3xl font-bold tracking-tight">
            Signature Collection
          </h2>
          <ArabicText as="p" className="text-xl text-muted-foreground mt-1">
            تشكيلة شمسان المميزة
          </ArabicText>
          <p className="mt-3 text-muted-foreground text-sm max-w-xl mx-auto">
            Crafted with the finest ingredients — long-lasting, oil-based,
            skin-safe
          </p>
        </FadeIn>
        <PerfumeGrid perfumes={perfumes} onOrder={onOrder} />
      </Container>
    </section>
  )
}
