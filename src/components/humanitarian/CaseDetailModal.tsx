import { Heart } from 'lucide-react'
import type { HumanitarianCase } from '@/types/humanitarian'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { ContributeDialog } from '@/components/humanitarian/ContributeDialog'
import { getPosterFullUrl, isPdfUrl } from '@/lib/cloudinary'

interface CaseDetailModalProps {
  case_: HumanitarianCase | null
  projectTitle: string
  open: boolean
  onClose: () => void
  personName?: string
}

export function CaseDetailModal({
  case_: c,
  projectTitle,
  open,
  onClose,
  personName,
}: CaseDetailModalProps) {
  if (!c) return null

  const hasPoster = Boolean(c.posterUrl)
  const pdf = hasPoster && isPdfUrl(c.posterUrl!)

  return (
    <Dialog open={open} onClose={onClose} className="max-w-2xl">
      <DialogHeader>
        <DialogTitle className="flex items-center gap-2 pr-6">
          <span className="truncate">
            Case #{c.caseNumber} — {c.title}
          </span>
        </DialogTitle>
      </DialogHeader>

      <DialogContent className="space-y-5">
        {/* Poster */}
        {hasPoster && (
          <div className="rounded-lg overflow-hidden border border-border">
            {pdf ? (
              <iframe
                src={c.posterUrl!}
                title={c.title}
                className="w-full h-[70vh]"
              />
            ) : (
              <img
                src={getPosterFullUrl(c.posterUrl!)}
                alt={c.title}
                className="w-full h-auto"
                loading="lazy"
              />
            )}
          </div>
        )}

        {/* Contribute button */}
        <div className="flex justify-center">
          <ContributeDialog
            trigger={
              <Button className="gap-2 px-6">
                <Heart className="size-4" />
                Sponsor This Case
              </Button>
            }
            projectTitle={projectTitle}
            caseTitle={c.title}
            personName={personName}
          />
        </div>
      </DialogContent>
    </Dialog>
  )
}
