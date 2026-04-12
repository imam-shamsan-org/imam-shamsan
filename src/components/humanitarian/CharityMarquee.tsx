import { Marquee } from '@/components/ui/marquee'

const quotes = [
  {
    ar: 'الصَّدَقَةُ تُطْفِئُ الْخَطِيئَةَ كَمَا يُطْفِئُ الْمَاءُ النَّارَ',
    en: '"Charity extinguishes sin as water extinguishes fire." — Prophet Muhammad ﷺ',
  },
  {
    ar: 'مَنْ كَانَ فِي حَاجَةِ أَخِيهِ كَانَ اللَّهُ فِي حَاجَتِهِ',
    en: '"Whoever helps his brother, Allah will help him." — Prophet Muhammad ﷺ',
  },
  {
    ar: 'الصَّدَقَةُ لَا تَنْقُصُ مِنْ مَالٍ',
    en: '"Charity does not decrease wealth." — Prophet Muhammad ﷺ',
  },
  {
    ar: 'خَيْرُ النَّاسِ أَنْفَعُهُمْ لِلنَّاسِ',
    en: '"The best people are those most beneficial to others." — Prophet Muhammad ﷺ',
  },
  {
    ar: 'إِنَّ اللَّهَ مَعَ الصَّابِرِينَ',
    en: '"Indeed, Allah is with the patient." — Quran 2:153',
  },
]

export function CharityMarquee() {
  return (
    <div className="bg-muted/50 border-y border-border py-5">
      <Marquee speed={90} pauseOnHover>
        {quotes.map((quote, i) => (
          <div key={i} className="flex items-center gap-6 px-6 py-1">
            <span
              dir="rtl"
              lang="ar"
              className="font-arabic text-sm text-secondary whitespace-nowrap"
            >
              {quote.ar}
            </span>
            <span className="text-muted-foreground mx-2 opacity-40">✦</span>
            <span className="text-sm text-muted-foreground italic whitespace-nowrap">
              {quote.en}
            </span>
            <span className="text-muted-foreground mx-2 opacity-40">✦</span>
          </div>
        ))}
      </Marquee>
    </div>
  )
}
