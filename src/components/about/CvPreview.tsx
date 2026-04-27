import { useState } from 'react'
import { Download, ExternalLink, FileText } from 'lucide-react'
import { Button, buttonVariants } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { FadeIn } from '@/components/shared/FadeIn'

interface CvPreviewProps {
  cvUrl: string
}

/** First page of a Cloudinary-hosted PDF as an 800px JPG */
function getCvThumbnailUrl(url: string): string {
  return url.replace(/\/upload\//, '/upload/f_jpg,pg_1,w_800,q_auto/')
}

/** Force-download URL via Cloudinary fl_attachment flag */
function getCvDownloadUrl(url: string): string {
  return url.replace(/\/upload\//, '/upload/fl_attachment/')
}

const isCloudinary = (url: string) =>
  url.includes('res.cloudinary.com')

export function CvPreview({ cvUrl }: CvPreviewProps) {
  const [open, setOpen] = useState(false)
  const [thumbError, setThumbError] = useState(false)

  const thumbnailUrl = isCloudinary(cvUrl) ? getCvThumbnailUrl(cvUrl) : null
  const downloadUrl = isCloudinary(cvUrl) ? getCvDownloadUrl(cvUrl) : cvUrl

  return (
    <FadeIn>
      <div className="space-y-5">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold tracking-tight text-foreground">
            Curriculum Vitae
          </h2>
          <a
            href={downloadUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
          >
            <Download className="size-4" />
            Download PDF
          </a>
        </div>

        {/* Preview card — partial first page with gradient fade */}
        {thumbnailUrl && !thumbError ? (
          <button
            onClick={() => setOpen(true)}
            className="w-full group cursor-pointer text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring rounded-xl"
            aria-label="View full curriculum vitae"
          >
            <div className="relative overflow-hidden rounded-xl border border-border shadow-sm transition-shadow group-hover:shadow-md">
              <img
                src={thumbnailUrl}
                alt="CV — first page preview"
                loading="lazy"
                onError={() => setThumbError(true)}
                className="w-full object-cover object-top"
                style={{ maxHeight: '300px' }}
              />
              {/* Gradient fade revealing the document teaser */}
              <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-background via-background/70 to-transparent" />
              {/* Persistent CTA */}
              <div className="absolute inset-x-0 bottom-5 flex justify-center transition-opacity group-hover:opacity-0">
                <span className="rounded-full border border-border bg-background/80 px-4 py-1.5 text-sm text-muted-foreground backdrop-blur-sm">
                  Click to view full CV
                </span>
              </div>
              {/* Hover CTA */}
              <div className="absolute inset-x-0 bottom-5 flex justify-center opacity-0 transition-opacity group-hover:opacity-100">
                <span className="rounded-full bg-primary px-4 py-1.5 text-sm font-medium text-primary-foreground shadow-sm">
                  View Full CV
                </span>
              </div>
            </div>
          </button>
        ) : (
          /* Fallback when no Cloudinary thumbnail */
          <button
            onClick={() => setOpen(true)}
            className="flex w-full items-center gap-4 rounded-xl border border-border bg-card p-6 text-left transition-colors hover:bg-muted/50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          >
            <div className="flex size-14 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
              <FileText className="size-7" />
            </div>
            <div>
              <p className="font-semibold text-foreground">
                Curriculum Vitae — Dr. Shamsan Al-Jabi
              </p>
              <p className="mt-0.5 text-sm text-muted-foreground">
                Click to view full PDF
              </p>
            </div>
          </button>
        )}

        {/* Action row */}
        <div className="flex flex-wrap gap-3">
          <Button onClick={() => setOpen(true)} className="gap-2">
            <FileText className="size-4" />
            View Full CV
          </Button>
          <a
            href={downloadUrl}
            target="_blank"
            rel="noopener noreferrer"
            className={cn(buttonVariants({ variant: 'outline' }), 'gap-2')}
          >
            <Download className="size-4" />
            Download PDF
          </a>
        </div>
      </div>

      {/* Full PDF viewer */}
      <Dialog
        open={open}
        onClose={() => setOpen(false)}
        className="max-w-4xl"
      >
        <DialogHeader className="flex flex-row items-start justify-between pr-12">
          <div>
            <DialogTitle>Curriculum Vitae</DialogTitle>
            <p className="mt-0.5 text-sm text-muted-foreground">
              Dr. Shamsan Al-Jabi
            </p>
          </div>
          <a
            href={cvUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex shrink-0 items-center gap-1.5 text-sm font-medium text-primary hover:text-primary/80 transition-colors"
          >
            <ExternalLink className="size-4" />
            Open in new tab
          </a>
        </DialogHeader>
        <DialogContent className="pb-6">
          <iframe
            src={cvUrl}
            title="Curriculum Vitae"
            className="w-full rounded-lg border border-border"
            style={{ height: '72vh' }}
          />
          {/* Mobile fallback — iframes don't render PDFs on iOS Safari */}
          <p className="mt-3 text-center text-xs text-muted-foreground sm:hidden">
            PDF not displaying?{' '}
            <a
              href={cvUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary underline underline-offset-2"
            >
              Open in browser
            </a>
          </p>
        </DialogContent>
      </Dialog>
    </FadeIn>
  )
}
