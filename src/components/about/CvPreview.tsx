import { Download, ExternalLink, FileText } from 'lucide-react'
import { buttonVariants } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { FadeIn } from '@/components/shared/FadeIn'

interface CvPreviewProps {
  cvUrl: string
}

function getCvThumbnailUrl(url: string): string {
  return url.replace(/\/upload\//, '/upload/f_jpg,pg_1,w_800,q_auto/')
}

function getCvDownloadUrl(url: string): string {
  return url.replace(/\/upload\//, '/upload/fl_attachment/')
}

const isCloudinary = (url: string) => url.includes('res.cloudinary.com')

export function CvPreview({ cvUrl }: CvPreviewProps) {
  const thumbnailUrl = isCloudinary(cvUrl) ? getCvThumbnailUrl(cvUrl) : null
  const downloadUrl = isCloudinary(cvUrl) ? getCvDownloadUrl(cvUrl) : cvUrl

  return (
    <FadeIn>
      <div className="space-y-5">
        <h2 className="text-2xl font-bold tracking-tight text-foreground">
          Curriculum Vitae
        </h2>

        {/* First page — full image */}
        {thumbnailUrl ? (
          <div className="overflow-hidden rounded-xl border border-border shadow-sm">
            <img
              src={thumbnailUrl}
              alt="CV — first page"
              loading="lazy"
              className="w-full"
            />
          </div>
        ) : (
          <div className="flex items-center gap-4 rounded-xl border border-border bg-card p-6">
            <div className="flex size-12 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
              <FileText className="size-6" />
            </div>
            <p className="font-medium text-foreground">
              Curriculum Vitae — Dr. Shamsan Al-Jabi
            </p>
          </div>
        )}

        {/* Actions */}
        <div className="flex flex-wrap gap-3">
          <a
            href={cvUrl}
            target="_blank"
            rel="noopener noreferrer"
            className={cn(buttonVariants({ variant: 'default', size: 'lg' }), 'gap-2')}
          >
            <ExternalLink className="size-4" />
            View CV
          </a>
          <a
            href={downloadUrl}
            target="_blank"
            rel="noopener noreferrer"
            className={cn(buttonVariants({ variant: 'outline', size: 'lg' }), 'gap-2')}
          >
            <Download className="size-4" />
            Download
          </a>
        </div>
      </div>
    </FadeIn>
  )
}
