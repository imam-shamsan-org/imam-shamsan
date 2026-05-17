import { CheckCircle } from 'lucide-react'
import { Container } from '@/components/layout/Container'
import { ArabicText } from '@/components/shared/ArabicText'
import { FadeIn } from '@/components/shared/FadeIn'

const SELLING_POINTS = [
  { en: 'Oil-based formula', ar: 'تركيبة زيتية' },
  { en: 'Long-lasting scent', ar: 'عطر يدوم طويلاً' },
  { en: 'Spray form', ar: 'بخاخ سهل الاستخدام' },
  { en: 'Natural skin-safe ingredients', ar: 'مكونات طبيعية آمنة للبشرة' },
  { en: 'No harsh chemicals', ar: 'خالٍ من المواد الكيميائية الضارة' },
  { en: 'Natural flower extracts', ar: 'مستخلصات من الأزهار الطبيعية' },
  { en: 'Premium authentic Oud', ar: 'عود أصيل فاخر' },
]

export function WhyShamsan() {
  return (
    <section className="py-16">
      <Container>
        <FadeIn className="mb-10 text-center">
          <h2 className="text-3xl font-bold tracking-tight">
            Why Shamsan? | لماذا شمسان؟
          </h2>
        </FadeIn>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 max-w-2xl mx-auto">
          {SELLING_POINTS.map(({ en, ar }, i) => (
            <FadeIn key={en} delay={i * 60} className="flex items-start gap-3">
              <CheckCircle className="size-5 text-primary shrink-0 mt-0.5" />
              <div>
                <p className="text-sm font-medium">{en}</p>
                <ArabicText as="p" className="text-sm text-muted-foreground">
                  {ar}
                </ArabicText>
              </div>
            </FadeIn>
          ))}
        </div>
      </Container>
    </section>
  )
}
