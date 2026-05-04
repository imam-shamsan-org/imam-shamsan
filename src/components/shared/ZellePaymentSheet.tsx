import { useCallback, useEffect, useRef, useState } from 'react'
import {
  Check,
  Copy,
  FileText,
  Loader2,
  Send,
  Trash2,
  Upload,
} from 'lucide-react'
import { Dialog } from '@/components/ui/dialog'
import { BorderBeam } from '@/components/ui/border-beam'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { ArabicText } from '@/components/shared/ArabicText'
import { submitContactForm } from '@/lib/email'
import { PERSON_NAME, ZELLE_EMAIL, ZELLE_PHONE, ZELLE_QR_URL } from '@/lib/constants'

const MAX_FILE_BYTES = 3 * 1024 * 1024
const ALLOWED_MIME_TYPES = ['application/pdf', 'image/png'] as const
type AllowedMimeType = (typeof ALLOWED_MIME_TYPES)[number]

function isAllowedMime(t: string): t is AllowedMimeType {
  return (ALLOWED_MIME_TYPES as ReadonlyArray<string>).includes(t)
}

type Attachment = {
  filename: string
  content: string
  mimeType: AllowedMimeType
}

type ServiceContext = {
  mode: 'service'
  serviceName: string
  serviceNameAr?: string
  priceDisplay?: string
  priceNote?: string
}

type ContributionContext = {
  mode: 'contribution'
  projectTitle: string
  caseTitle?: string
}

export type ZellePaymentSheetProps = {
  open: boolean
  onClose: () => void
  personName?: string
} & (ServiceContext | ContributionContext)

type FieldErrors = Partial<Record<'name' | 'email' | 'message' | 'file', string>>
type FormStatus = 'idle' | 'sending' | 'error' | 'success'
type CopyFeedback = { type: 'email' | 'phone'; ok: boolean } | null

function buildSubject(ctx: ServiceContext | ContributionContext): string {
  if (ctx.mode === 'service') {
    return `Booking: ${ctx.serviceName}`.slice(0, 200)
  }
  const base = ctx.caseTitle
    ? `Contribution Interest: ${ctx.caseTitle} (${ctx.projectTitle})`
    : `Contribution Interest: ${ctx.projectTitle}`
  return base.slice(0, 200)
}

function buildMessage(
  ctx: ServiceContext | ContributionContext,
  userMessage: string,
  caseInput: string,
): string {
  if (ctx.mode === 'service') return userMessage.trim()
  const resolvedCase = ctx.caseTitle ?? caseInput.trim()
  const contextLine = resolvedCase
    ? `Initiative: ${ctx.projectTitle}\nCase: ${resolvedCase}`
    : `Initiative: ${ctx.projectTitle}`
  return userMessage.trim()
    ? `${contextLine}\n\n${userMessage.trim()}`
    : `I am interested in contributing to:\n${contextLine}`
}

const STEPS = [
  'Send payment via Zelle',
  'Fill in your details →',
  'Imam confirms your booking',
] as const

export function ZellePaymentSheet({
  open,
  onClose,
  personName = PERSON_NAME,
  ...ctx
}: ZellePaymentSheetProps) {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [phone, setPhone] = useState('')
  const [message, setMessage] = useState('')
  const [caseInput, setCaseInput] = useState('')
  const [attachment, setAttachment] = useState<Attachment | null>(null)
  const [fileReading, setFileReading] = useState(false)
  const [status, setStatus] = useState<FormStatus>('idle')
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({})
  const [errorMessage, setErrorMessage] = useState('')
  const [copyFeedback, setCopyFeedback] = useState<CopyFeedback>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const reset = useCallback(() => {
    setName('')
    setEmail('')
    setPhone('')
    setMessage('')
    setCaseInput('')
    setAttachment(null)
    setFileReading(false)
    setStatus('idle')
    setFieldErrors({})
    setErrorMessage('')
    if (fileInputRef.current) fileInputRef.current.value = ''
  }, [])

  useEffect(() => {
    if (!open) reset()
  }, [open, reset])

  function handleClose() {
    if (status === 'sending') return
    onClose()
  }

  async function copyToClipboard(text: string, type: 'email' | 'phone') {
    try {
      await navigator.clipboard.writeText(text)
      setCopyFeedback({ type, ok: true })
    } catch {
      setCopyFeedback({ type, ok: false })
    }
    setTimeout(() => setCopyFeedback(null), 2000)
  }

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return

    if (!isAllowedMime(file.type)) {
      setFieldErrors((f) => ({
        ...f,
        file: 'Only PDF and PNG files are accepted',
      }))
      if (fileInputRef.current) fileInputRef.current.value = ''
      return
    }
    if (file.size === 0) {
      setFieldErrors((f) => ({ ...f, file: 'File is empty' }))
      if (fileInputRef.current) fileInputRef.current.value = ''
      return
    }
    if (file.size > MAX_FILE_BYTES) {
      setFieldErrors((f) => ({ ...f, file: 'File must be 3 MB or smaller' }))
      if (fileInputRef.current) fileInputRef.current.value = ''
      return
    }

    setFileReading(true)
    setFieldErrors((f) => ({ ...f, file: undefined }))

    const reader = new FileReader()
    reader.onload = () => {
      const dataUrl = reader.result as string
      const base64 = dataUrl.split(',')[1]
      setAttachment({
        filename: file.name,
        content: base64,
        mimeType: file.type,
      })
      setFileReading(false)
    }
    reader.onerror = () => {
      setFieldErrors((f) => ({
        ...f,
        file: 'Failed to read file. Please try again.',
      }))
      setFileReading(false)
      if (fileInputRef.current) fileInputRef.current.value = ''
    }
    reader.readAsDataURL(file)
  }

  function removeAttachment() {
    setAttachment(null)
    setFieldErrors((f) => ({ ...f, file: undefined }))
    if (fileInputRef.current) fileInputRef.current.value = ''
  }

  function validate(): FieldErrors {
    const errors: FieldErrors = {}
    if (!name.trim()) errors.name = 'Name is required'
    else if (name.trim().length > 200) errors.name = 'Name is too long'
    if (!email.trim()) errors.email = 'Email is required'
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))
      errors.email = 'Please enter a valid email'
    if (ctx.mode === 'service') {
      if (!message.trim()) errors.message = 'Message is required'
      else if (message.length > 5000)
        errors.message = 'Message is too long (max 5000 characters)'
    }
    return errors
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (fileReading) {
      setFieldErrors((f) => ({
        ...f,
        file: 'Please wait — file is still being read',
      }))
      return
    }
    const errors = validate()
    setFieldErrors(errors)
    if (Object.keys(errors).length > 0) return

    setStatus('sending')
    setErrorMessage('')

    try {
      const result = await submitContactForm({
        data: {
          name: name.trim(),
          email: email.trim(),
          phone: ctx.mode === 'service' ? phone || undefined : undefined,
          service: buildSubject(ctx),
          message: buildMessage(ctx, message, caseInput),
          ...(attachment ? { attachment } : {}),
        },
      })
      if (result.success) {
        setStatus('success')
      } else {
        setStatus('error')
        setErrorMessage(
          result.error || 'Something went wrong. Please try again.',
        )
      }
    } catch {
      setStatus('error')
      setErrorMessage('Failed to send. Please try again.')
    }
  }

  const contextLabel =
    ctx.mode === 'service' ? ctx.serviceName : ctx.projectTitle
  const contextLabelAr = ctx.mode === 'service' ? ctx.serviceNameAr : undefined
  const messageRequired = ctx.mode === 'service'

  return (
    <Dialog open={open} onClose={handleClose} className="max-w-3xl">
      <div className="grid grid-cols-1 md:grid-cols-2 md:divide-x divide-border">
        {/* Left: Zelle info */}
        <div className="relative overflow-hidden rounded-t-xl md:rounded-l-xl md:rounded-tr-none p-6 bg-primary/5 ring-1 ring-primary/15">
          <BorderBeam size={150} duration={6} />

          {/* Context badge */}
          <div className="mb-5">
            <p className="text-xs uppercase tracking-wider text-muted-foreground mb-2">
              {ctx.mode === 'service' ? 'Service' : 'Initiative'}
            </p>
            <span className="inline-flex items-center rounded-full bg-secondary/15 px-3 py-1 text-sm font-semibold text-secondary">
              {contextLabel}
            </span>
            {contextLabelAr && (
              <ArabicText as="p" className="text-sm text-muted-foreground mt-1">
                {contextLabelAr}
              </ArabicText>
            )}
          </div>

          {/* Price (service mode) */}
          {ctx.mode === 'service' && ctx.priceDisplay && (
            <div className="mb-5 rounded-lg bg-secondary/10 px-3 py-2">
              <span className="text-sm font-semibold text-secondary">
                {ctx.priceDisplay}
              </span>
              {ctx.priceNote && (
                <p className="text-xs text-muted-foreground mt-0.5">
                  {ctx.priceNote}
                </p>
              )}
            </div>
          )}

          <h3 className="text-base font-semibold text-foreground mb-4">
            Pay via Zelle
          </h3>

          {/* QR code */}
          <div className="mb-5 flex flex-col items-center gap-2">
            <img
              src={ZELLE_QR_URL}
              alt="Scan to pay via Zelle"
              className="w-36 h-36 rounded-lg border border-border object-contain bg-white p-1"
            />
            <p className="text-xs text-muted-foreground">Scan with your Zelle app</p>
          </div>

          {/* Email */}
          <div className="mb-3">
            <p className="text-xs text-muted-foreground mb-1.5">Email</p>
            <div className="flex items-center gap-2">
              <code className="flex-1 truncate rounded bg-card/70 px-2 py-1 text-sm font-medium text-foreground">
                {ZELLE_EMAIL}
              </code>
              <button
                type="button"
                onClick={() => copyToClipboard(ZELLE_EMAIL, 'email')}
                aria-label="Copy Zelle email address"
                className="shrink-0 cursor-pointer rounded p-1.5 text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
              >
                {copyFeedback?.type === 'email' && copyFeedback.ok ? (
                  <Check className="size-3.5 text-primary" />
                ) : (
                  <Copy className="size-3.5" />
                )}
              </button>
            </div>
            {copyFeedback?.type === 'email' && (
              <p
                role="status"
                aria-live="polite"
                className={`mt-1 text-xs ${copyFeedback.ok ? 'text-primary' : 'text-destructive'}`}
              >
                {copyFeedback.ok ? 'Copied!' : 'Copy failed — please copy manually'}
              </p>
            )}
          </div>

          {/* Phone */}
          <div className="mb-6">
            <p className="text-xs text-muted-foreground mb-1.5">Phone</p>
            <div className="flex items-center gap-2">
              <code className="flex-1 rounded bg-card/70 px-2 py-1 text-sm font-medium text-foreground">
                {ZELLE_PHONE}
              </code>
              <button
                type="button"
                onClick={() => copyToClipboard(ZELLE_PHONE, 'phone')}
                aria-label="Copy Zelle phone number"
                className="shrink-0 cursor-pointer rounded p-1.5 text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
              >
                {copyFeedback?.type === 'phone' && copyFeedback.ok ? (
                  <Check className="size-3.5 text-primary" />
                ) : (
                  <Copy className="size-3.5" />
                )}
              </button>
            </div>
            {copyFeedback?.type === 'phone' && (
              <p
                role="status"
                aria-live="polite"
                className={`mt-1 text-xs ${copyFeedback.ok ? 'text-primary' : 'text-destructive'}`}
              >
                {copyFeedback.ok ? 'Copied!' : 'Copy failed — please copy manually'}
              </p>
            )}
          </div>

          {/* Steps */}
          <ol className="space-y-2.5">
            {STEPS.map((step) => (
              <li
                key={step}
                className="flex items-start gap-2.5 text-sm text-muted-foreground"
              >
                <span className="mt-0.5 flex size-5 shrink-0 items-center justify-center rounded-full bg-primary/15 text-xs font-semibold text-primary">
                  {STEPS.indexOf(step) + 1}
                </span>
                {step}
              </li>
            ))}
          </ol>
        </div>

        {/* Right: Form */}
        <div className="p-6">
          {status === 'success' ? (
            <div className="flex h-full flex-col items-center justify-center py-8 text-center gap-4">
              <div className="flex size-12 items-center justify-center rounded-full bg-primary/10">
                <Check className="size-6 text-primary" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-foreground">
                  {ctx.mode === 'service' ? 'Booking Sent!' : 'Message Sent!'}
                </h3>
                <p className="mt-1 text-sm text-muted-foreground">
                  {personName} will be in touch with you soon, insha'Allah.
                </p>
              </div>
              <Button variant="outline" onClick={handleClose} className="mt-2">
                Done
              </Button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="flex h-full flex-col gap-4">
              <h3 className="text-base font-semibold text-foreground">
                {ctx.mode === 'service' ? 'Confirm Your Booking' : 'Your Details'}
              </h3>

              {/* Name */}
              <div className="space-y-1.5">
                <Label htmlFor="zps-name">Name *</Label>
                <Input
                  id="zps-name"
                  autoFocus
                  value={name}
                  onChange={(e) => {
                    setName(e.target.value)
                    if (fieldErrors.name)
                      setFieldErrors((f) => ({ ...f, name: undefined }))
                  }}
                  placeholder="Your full name"
                  aria-invalid={!!fieldErrors.name}
                />
                {fieldErrors.name && (
                  <p className="text-xs text-destructive">{fieldErrors.name}</p>
                )}
              </div>

              {/* Email */}
              <div className="space-y-1.5">
                <Label htmlFor="zps-email">Email *</Label>
                <Input
                  id="zps-email"
                  type="email"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value)
                    if (fieldErrors.email)
                      setFieldErrors((f) => ({ ...f, email: undefined }))
                  }}
                  placeholder="you@example.com"
                  aria-invalid={!!fieldErrors.email}
                />
                {fieldErrors.email && (
                  <p className="text-xs text-destructive">{fieldErrors.email}</p>
                )}
              </div>

              {/* Phone (service mode only) */}
              {ctx.mode === 'service' && (
                <div className="space-y-1.5">
                  <Label htmlFor="zps-phone">
                    Phone{' '}
                    <span className="font-normal text-muted-foreground">
                      (optional)
                    </span>
                  </Label>
                  <Input
                    id="zps-phone"
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="(555) 123-4567"
                  />
                </div>
              )}

              {/* Case — pre-filled pill */}
              {ctx.mode === 'contribution' && ctx.caseTitle && (
                <div className="space-y-1">
                  <p className="text-xs text-muted-foreground">Case</p>
                  <span className="inline-flex items-center rounded-full bg-secondary/15 px-3 py-1 text-sm font-medium text-secondary">
                    {ctx.caseTitle}
                  </span>
                </div>
              )}

              {/* Case — optional input */}
              {ctx.mode === 'contribution' && !ctx.caseTitle && (
                <div className="space-y-1.5">
                  <Label htmlFor="zps-case">
                    Specific Case{' '}
                    <span className="font-normal text-muted-foreground">
                      (optional)
                    </span>
                  </Label>
                  <Input
                    id="zps-case"
                    value={caseInput}
                    onChange={(e) => setCaseInput(e.target.value)}
                    placeholder="e.g. Case #3 — Ahmad's family"
                  />
                </div>
              )}

              {/* Message */}
              <div className="space-y-1.5">
                <Label htmlFor="zps-message">
                  Message{' '}
                  {messageRequired ? (
                    '*'
                  ) : (
                    <span className="font-normal text-muted-foreground">
                      (optional)
                    </span>
                  )}
                </Label>
                <Textarea
                  id="zps-message"
                  value={message}
                  onChange={(e) => {
                    setMessage(e.target.value)
                    if (fieldErrors.message)
                      setFieldErrors((f) => ({ ...f, message: undefined }))
                  }}
                  placeholder={
                    ctx.mode === 'service'
                      ? 'Tell us about your booking needs...'
                      : 'Any questions or details about your contribution...'
                  }
                  rows={3}
                  aria-invalid={!!fieldErrors.message}
                />
                {fieldErrors.message && (
                  <p className="text-xs text-destructive">
                    {fieldErrors.message}
                  </p>
                )}
              </div>

              {/* Upload receipt */}
              <div className="space-y-1.5">
                <Label htmlFor="zps-file">
                  Zelle Receipt{' '}
                  <span className="font-normal text-muted-foreground">
                    (optional · PDF or PNG · max 3 MB)
                  </span>
                </Label>
                {attachment ? (
                  <div className="flex items-center gap-2 rounded-lg border border-border bg-accent/30 px-3 py-2">
                    <FileText className="size-4 shrink-0 text-primary" />
                    <span className="flex-1 truncate text-sm text-foreground">
                      {attachment.filename}
                    </span>
                    <button
                      type="button"
                      onClick={removeAttachment}
                      aria-label="Remove attachment"
                      className="shrink-0 cursor-pointer rounded p-1 text-muted-foreground transition-colors hover:text-destructive"
                    >
                      <Trash2 className="size-3.5" />
                    </button>
                  </div>
                ) : (
                  <label
                    htmlFor="zps-file"
                    className="flex cursor-pointer items-center gap-2 rounded-lg border border-dashed border-border px-3 py-3 text-sm text-muted-foreground transition-colors hover:border-primary/50 hover:bg-accent/30"
                  >
                    {fileReading ? (
                      <Loader2 className="size-4 animate-spin text-primary" />
                    ) : (
                      <Upload className="size-4 text-primary" />
                    )}
                    {fileReading ? 'Reading file…' : 'Click to upload or drag and drop'}
                    <input
                      id="zps-file"
                      ref={fileInputRef}
                      type="file"
                      accept=".pdf,.png,application/pdf,image/png"
                      onChange={handleFileChange}
                      className="sr-only"
                    />
                  </label>
                )}
                {fieldErrors.file && (
                  <p className="text-xs text-destructive">{fieldErrors.file}</p>
                )}
              </div>

              {status === 'error' && (
                <p className="text-sm text-destructive">{errorMessage}</p>
              )}

              <div className="mt-auto flex justify-end gap-3 pt-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleClose}
                  disabled={status === 'sending'}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  disabled={status === 'sending' || fileReading}
                  className="gap-2"
                >
                  {status === 'sending' ? (
                    <>
                      <Loader2 className="size-4 animate-spin" />
                      Sending…
                    </>
                  ) : (
                    <>
                      <Send className="size-4" />
                      {ctx.mode === 'service' ? 'Send Booking' : 'Send Message'}
                    </>
                  )}
                </Button>
              </div>
            </form>
          )}
        </div>
      </div>
    </Dialog>
  )
}
