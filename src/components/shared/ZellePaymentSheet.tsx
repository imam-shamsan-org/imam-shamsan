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
import { cn } from '@/lib/utils'
import {
  PERSON_NAME,
  ZELLE_EMAIL,
  ZELLE_PHONE,
  ZELLE_QR_URL,
} from '@/lib/constants'

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

type FieldErrors = Partial<
  Record<'name' | 'email' | 'message' | 'file' | 'waiver', string>
>
type FormStatus = 'idle' | 'sending' | 'error' | 'success'
type CopyFeedback = { type: 'email' | 'phone'; ok: boolean } | null


const STEPS = [
  'Send payment via Zelle using the QR code, email, or phone number',
  'Fill in your details and attach your Zelle payment receipt',
  'Submit — Imam will confirm your booking shortly',
] as const

const WAIVER_CLAUSES = [
  {
    n: 1,
    title: 'Voluntary Participation',
    body: 'I am voluntarily requesting Ruqyah services of my own free will and accept full responsibility for my participation.',
  },
  {
    n: 2,
    title: 'Nature of Service',
    body: "I understand that Ruqyah is a religious/spiritual practice based on the Qur'an and authentic supplications. It is not a medical, psychological, or psychiatric service, and no diagnosis, treatment, or medical advice is being provided.",
  },
  {
    n: 3,
    title: 'No Medical Replacement',
    body: 'I acknowledge that this service does not replace professional healthcare, and I agree to seek appropriate licensed medical or mental health care when needed.',
  },
  {
    n: 4,
    title: 'Assumption of Risk & Liability Waiver',
    body: 'I assume full responsibility for any outcomes resulting from my participation. To the fullest extent permitted under Pennsylvania law, I release, waive, and hold harmless the service provider from any and all claims, liabilities, damages, or losses arising from or related to this service.',
  },
  {
    n: 5,
    title: 'No Guarantee of Results',
    body: 'I understand that outcomes may vary and no guarantees of specific results are made.',
  },
  {
    n: 6,
    title: 'Service Fee',
    body: 'I agree to pay a fee of $100 USD for the service provided. This fee reflects the time and effort of the practitioner and is non-refundable unless otherwise stated.',
  },
  {
    n: 7,
    title: 'Accuracy of Information',
    body: 'I confirm that all information I provide is accurate and complete, and I accept responsibility for any false or misleading information.',
  },
  {
    n: 8,
    title: 'Privacy & Confidentiality',
    body: "My personal information will be handled with reasonable care and used only for service-related purposes, in accordance with the website's Privacy Policy. While confidentiality is respected, I understand that absolute security of online communications cannot be guaranteed.",
  },
  {
    n: 9,
    title: 'Session Conduct',
    body: 'I agree to behave respectfully and follow all instructions provided. The service provider reserves the right to refuse or terminate service if inappropriate behavior occurs.',
  },
  {
    n: 11,
    title: 'Governing Law',
    body: 'This agreement shall be governed by and interpreted in accordance with the laws of the Commonwealth of Pennsylvania, USA.',
  },
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
  const [waiverAccepted, setWaiverAccepted] = useState(false)
  const [hasScrolledWaiver, setHasScrolledWaiver] = useState(false)
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
    setWaiverAccepted(false)
    setHasScrolledWaiver(false)
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

  function handleWaiverScroll(e: React.UIEvent<HTMLDivElement>) {
    if (hasScrolledWaiver) return
    const el = e.currentTarget
    if (el.scrollHeight - el.scrollTop <= el.clientHeight + 4) {
      setHasScrolledWaiver(true)
    }
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
    if (!attachment) errors.file = 'Please upload your payment receipt'
    if (ctx.mode === 'service') {
      if (!message.trim()) errors.message = 'Message is required'
      else if (message.length > 5000)
        errors.message = 'Message is too long (max 5000 characters)'
      if (!waiverAccepted)
        errors.waiver =
          'You must read and accept the service agreement to proceed'
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

    const resolvedCase =
      ctx.mode === 'contribution' ? (ctx.caseTitle ?? caseInput.trim()) : ''

    try {
      const result = await submitContactForm({
        data: {
          name: name.trim(),
          email: email.trim(),
          phone: ctx.mode === 'service' ? phone || undefined : undefined,
          ...(ctx.mode === 'service'
            ? { service: ctx.serviceName, message: message.trim() }
            : {
                project: ctx.projectTitle,
                ...(resolvedCase ? { case: resolvedCase } : {}),
                message: message.trim() || 'No additional message.',
              }),
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

  const canSubmit =
    name.trim().length > 0 &&
    email.trim().length > 0 &&
    !!attachment &&
    (ctx.mode !== 'service' ||
      (message.trim().length > 0 && waiverAccepted))

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

          <div className="flex items-center gap-2 mb-4">
            <span className="flex size-5 shrink-0 items-center justify-center rounded-full bg-primary text-xs font-bold text-primary-foreground">
              1
            </span>
            <h3 className="text-base font-semibold text-foreground">
              Send Payment via Zelle
            </h3>
          </div>

          {/* QR code */}
          <div className="mb-5 flex flex-col items-center gap-2">
            <img
              src={ZELLE_QR_URL}
              alt="Scan to pay via Zelle"
              className="w-36 h-36 rounded-lg border border-border object-contain bg-white p-1"
            />
            <p className="text-xs text-muted-foreground">
              Scan with your Zelle app
            </p>
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
                {copyFeedback.ok
                  ? 'Copied!'
                  : 'Copy failed — please copy manually'}
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
                {copyFeedback.ok
                  ? 'Copied!'
                  : 'Copy failed — please copy manually'}
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
            <form
              onSubmit={handleSubmit}
              className="flex h-full flex-col gap-4"
            >
              <div className="flex items-center gap-2">
                <span className="flex size-5 shrink-0 items-center justify-center rounded-full bg-primary text-xs font-bold text-primary-foreground">
                  2
                </span>
                <h3 className="text-base font-semibold text-foreground">
                  {ctx.mode === 'service'
                    ? 'Confirm Your Booking'
                    : 'Your Details'}
                </h3>
              </div>

              <div className="rounded-lg border border-secondary/30 bg-secondary/8 px-3 py-2.5 text-sm text-foreground">
                <span className="font-medium">After sending payment,</span> fill
                in your details and attach your Zelle receipt — both are
                required to confirm your booking.
              </div>

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
                  <p className="text-xs text-destructive">
                    {fieldErrors.email}
                  </p>
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
                  Payment Receipt *{' '}
                  <span className="font-normal text-muted-foreground">
                    (PDF or PNG · max 3 MB)
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
                    {fileReading
                      ? 'Reading file…'
                      : 'Attach your Zelle receipt (click or drag)'}
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

              {/* Waiver (service mode only) */}
              {ctx.mode === 'service' && (
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label className="text-sm">
                      Service Agreement & Waiver *
                    </Label>
                    {!hasScrolledWaiver && (
                      <span className="text-xs text-muted-foreground">
                        ↓ Scroll to read
                      </span>
                    )}
                  </div>

                  <div className="relative">
                    <div
                      className="max-h-44 overflow-y-auto rounded-lg border border-border bg-muted/30 p-3 text-xs leading-relaxed"
                      onScroll={handleWaiverScroll}
                    >
                      <p className="mb-1 text-sm font-semibold text-foreground">
                        Ruqyah Service Agreement, Consent & Liability Waiver
                      </p>
                      <p className="mb-3 text-muted-foreground">
                        (Pennsylvania, USA)
                      </p>
                      <div className="space-y-3">
                        {WAIVER_CLAUSES.map(({ n, title, body }) => (
                          <div key={n}>
                            <p className="font-medium text-foreground">
                              {n}. {title}
                            </p>
                            <p className="mt-0.5 text-muted-foreground">
                              {body}
                            </p>
                          </div>
                        ))}
                      </div>
                    </div>
                    {!hasScrolledWaiver && (
                      <div className="pointer-events-none absolute bottom-0 left-0 right-0 h-8 rounded-b-lg bg-gradient-to-t from-muted/80 to-transparent" />
                    )}
                  </div>

                  <div className="flex items-start gap-2.5 pt-0.5">
                    <input
                      type="checkbox"
                      id="zps-waiver"
                      checked={waiverAccepted}
                      onChange={(e) => {
                        setWaiverAccepted(e.target.checked)
                        if (fieldErrors.waiver)
                          setFieldErrors((f) => ({ ...f, waiver: undefined }))
                      }}
                      disabled={!hasScrolledWaiver}
                      className="mt-0.5 size-4 shrink-0 cursor-pointer accent-primary disabled:cursor-not-allowed disabled:opacity-40"
                    />
                    <div className="space-y-0.5">
                      <label
                        htmlFor="zps-waiver"
                        className={cn(
                          'text-sm leading-snug',
                          hasScrolledWaiver
                            ? 'cursor-pointer text-foreground'
                            : 'cursor-not-allowed text-muted-foreground',
                        )}
                      >
                        I confirm that I have read, understood, and agree to all
                        of the above terms
                      </label>
                      <ArabicText
                        as="p"
                        className="text-xs text-muted-foreground"
                      >
                        قرأت الشروط وأوافق عليها
                      </ArabicText>
                      {!hasScrolledWaiver && (
                        <p className="text-xs text-muted-foreground">
                          Scroll through the agreement above to enable
                        </p>
                      )}
                    </div>
                  </div>

                  {fieldErrors.waiver && (
                    <p className="text-xs text-destructive">
                      {fieldErrors.waiver}
                    </p>
                  )}
                </div>
              )}

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
                  disabled={status === 'sending' || fileReading || !canSubmit}
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
