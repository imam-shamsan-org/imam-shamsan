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
import type { AvailableNote, PerfumeProduct } from '@/types/perfume'
import { Dialog } from '@/components/ui/dialog'
import { BorderBeam } from '@/components/ui/border-beam'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { ArabicText } from '@/components/shared/ArabicText'
import { submitShopOrder } from '@/lib/email'
import {
  PERSON_NAME,
  SHOP_NOTE_MAX_LENGTH,
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

export type PerfumeOrderDialogProps =
  | {
      mode: 'signature'
      perfume: PerfumeProduct
      open: boolean
      onClose: () => void
    }
  | {
      mode: 'custom'
      selectedNotes: Array<AvailableNote>
      open: boolean
      onClose: () => void
    }

type FieldErrors = Partial<Record<'name' | 'email' | 'file', string>>
type FormStatus = 'idle' | 'sending' | 'error' | 'success'
type CopyFeedback = { type: 'email' | 'phone'; ok: boolean } | null

const STEPS = [
  'Send payment via Zelle using the QR code, email, or phone number',
  'Fill in your details and attach your Zelle payment receipt',
  'Submit — Imam will confirm your order shortly',
] as const

export function PerfumeOrderDialog(props: PerfumeOrderDialogProps) {
  const { open, onClose } = props

  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [phone, setPhone] = useState('')
  const [customerNote, setCustomerNote] = useState('')
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
    setCustomerNote('')
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

  const handleClose = useCallback(() => {
    if (status === 'sending') return
    onClose()
  }, [status, onClose])

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
        mimeType: file.type as AllowedMimeType,
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

    const item =
      props.mode === 'signature' ? props.perfume.name : 'Custom Blend'

    const details =
      props.mode === 'signature'
        ? `${props.perfume.name} (${props.perfume.nameAr})`
        : `Selected notes: ${props.selectedNotes.map((n) => n.nameEn).join(', ')}`

    try {
      const result = await submitShopOrder({
        data: {
          name: name.trim(),
          email: email.trim(),
          phone: phone || undefined,
          note: customerNote.trim() || undefined,
          category: 'Perfumes',
          item,
          details,
          attachment: attachment!,
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

  return (
    <Dialog open={open} onClose={handleClose} className="max-w-3xl">
      <div className="grid grid-cols-1 md:grid-cols-2 md:divide-x divide-border">
        {/* Left: Zelle info */}
        <div className="relative overflow-hidden rounded-t-xl md:rounded-l-xl md:rounded-tr-none p-6 bg-primary/5 ring-1 ring-primary/15">
          <BorderBeam size={150} duration={6} />

          {/* Context badge */}
          <div className="mb-5">
            <p className="text-xs uppercase tracking-wider text-muted-foreground mb-2">
              {props.mode === 'signature' ? 'Signature Scent' : 'Custom Blend'}
            </p>
            {props.mode === 'signature' ? (
              <div className="space-y-1">
                <span className="inline-flex items-center rounded-full bg-secondary/15 px-3 py-1 text-sm font-semibold text-secondary">
                  {props.perfume.name}
                </span>
                <ArabicText as="p" className="text-sm text-muted-foreground">
                  {props.perfume.nameAr}
                </ArabicText>
              </div>
            ) : (
              <div className="flex flex-wrap gap-1.5 mt-1">
                {props.selectedNotes.map((note) => (
                  <span
                    key={note.id}
                    className="inline-flex items-center rounded-full bg-secondary/15 px-2.5 py-0.5 text-xs font-medium text-secondary"
                  >
                    {note.nameEn}
                    {' / '}
                    <ArabicText as="span" className="ml-1 text-xs">
                      {note.nameAr}
                    </ArabicText>
                  </span>
                ))}
              </div>
            )}
          </div>

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
            {STEPS.map((step, i) => (
              <li
                key={step}
                className="flex items-start gap-2.5 text-sm text-muted-foreground"
              >
                <span className="mt-0.5 flex size-5 shrink-0 items-center justify-center rounded-full bg-primary/15 text-xs font-semibold text-primary">
                  {i + 1}
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
                  Order Sent!{' '}
                  <ArabicText as="span" className="text-lg font-semibold">
                    تم إرسال طلبك
                  </ArabicText>
                </h3>
                <p className="mt-1 text-sm text-muted-foreground">
                  {PERSON_NAME} will be in touch soon, insha'Allah.
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
                  Your Details
                </h3>
              </div>

              <div className="rounded-lg border border-secondary/30 bg-secondary/8 px-3 py-2.5 text-sm text-foreground">
                <span className="font-medium">After sending payment,</span> fill
                in your details and attach your Zelle receipt — both are
                required to confirm your order.
              </div>

              {/* Name */}
              <div className="space-y-1.5">
                <Label htmlFor="pod-name">Name *</Label>
                <Input
                  id="pod-name"
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
                <Label htmlFor="pod-email">Email *</Label>
                <Input
                  id="pod-email"
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

              {/* Phone */}
              <div className="space-y-1.5">
                <Label htmlFor="pod-phone">
                  Phone{' '}
                  <span className="font-normal text-muted-foreground">
                    (optional)
                  </span>
                </Label>
                <Input
                  id="pod-phone"
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="(555) 123-4567"
                />
              </div>

              {/* Note */}
              <div className="space-y-1.5">
                <Label htmlFor="pod-note">
                  Note{' '}
                  <span className="font-normal text-muted-foreground">
                    (optional)
                  </span>
                </Label>
                <Textarea
                  id="pod-note"
                  value={customerNote}
                  onChange={(e) => setCustomerNote(e.target.value)}
                  placeholder="Any additional details or requests..."
                  rows={3}
                  maxLength={SHOP_NOTE_MAX_LENGTH}
                  aria-describedby="pod-note-count"
                />
                <p
                  id="pod-note-count"
                  aria-live="polite"
                  className="text-xs text-muted-foreground text-right"
                >
                  {customerNote.length}/{SHOP_NOTE_MAX_LENGTH}
                </p>
              </div>

              {/* Upload receipt */}
              <div className="space-y-1.5">
                <Label htmlFor="pod-file">
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
                    htmlFor="pod-file"
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
                      id="pod-file"
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
                      Place Order
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
