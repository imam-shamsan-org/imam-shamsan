import type { PerfumeProduct } from '@/types/perfume'
import { PerfumeCard } from '@/components/shop/PerfumeCard'
import { CreateYourOwnCard } from '@/components/shop/CreateYourOwnCard'

interface PerfumeGridProps {
  perfumes: Array<PerfumeProduct>
  onOrder: (perfume: PerfumeProduct) => void
  onCreateYourOwn: () => void
}

export function PerfumeGrid({
  perfumes,
  onOrder,
  onCreateYourOwn,
}: PerfumeGridProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {perfumes.map((perfume) => (
        <PerfumeCard
          key={perfume.id}
          perfume={perfume}
          onOrder={() => onOrder(perfume)}
        />
      ))}
      <CreateYourOwnCard onClick={onCreateYourOwn} />
    </div>
  )
}
