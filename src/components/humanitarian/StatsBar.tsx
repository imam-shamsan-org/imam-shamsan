import { Heart, Users, HandCoins } from 'lucide-react'
import { NumberTicker } from '@/components/ui/number-ticker'

interface StatItem {
  icon: React.ElementType
  value: number
  suffix?: string
  label: string
}

const stats: StatItem[] = [
  { icon: Heart, value: 9, label: 'Active Initiatives' },
  { icon: Users, value: 200, suffix: '+', label: 'Families Supported' },
  { icon: HandCoins, value: 100, suffix: '%', label: 'Direct to Beneficiaries' },
]

export function StatsBar() {
  return (
    <section className="bg-primary text-primary-foreground py-8">
      <div className="mx-auto max-w-5xl px-4">
        <div className="grid grid-cols-3 gap-4 divide-x divide-primary-foreground/20">
          {stats.map(({ icon: Icon, value, suffix, label }) => (
            <div key={label} className="flex flex-col items-center justify-center gap-1 px-4 text-center">
              <Icon className="size-6 mb-1 opacity-80" />
              <p className="text-2xl font-bold md:text-3xl">
                <NumberTicker value={value} suffix={suffix} className="text-primary-foreground" />
              </p>
              <p className="text-xs font-medium opacity-80 leading-tight">{label}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
