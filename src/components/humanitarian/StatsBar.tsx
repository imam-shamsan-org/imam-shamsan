import { HandCoins, Heart, Users } from 'lucide-react'

const stats = [
  { icon: Heart, value: '9', label: 'Active Initiatives' },
  { icon: Users, value: '200+', label: 'Families Supported' },
  { icon: HandCoins, value: '100%', label: 'Direct to Beneficiaries' },
]

export function StatsBar() {
  return (
    <section className="bg-primary text-primary-foreground py-8">
      <div className="mx-auto max-w-5xl px-4">
        <div className="grid grid-cols-3 gap-4 divide-x divide-primary-foreground/20">
          {stats.map(({ icon: Icon, value, label }) => (
            <div
              key={label}
              className="flex flex-col items-center justify-center gap-1 px-4 text-center"
            >
              <Icon className="size-6 mb-1 opacity-80" />
              <p className="text-2xl font-bold md:text-3xl">{value}</p>
              <p className="text-xs font-medium opacity-80 leading-tight">
                {label}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
