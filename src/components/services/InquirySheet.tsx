import { useCallback, useEffect, useState } from 'react'
import { Check, Loader2, Send } from 'lucide-react'
import { Dialog } from '@/components/ui/dialog'
import { BorderBeam } from '@/components/ui/border-beam'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { ArabicText } from '@/components/shared/ArabicText'
import { submitContactForm } from '@/lib/email'
import { PERSON_NAME } from '@/lib/constants'

interface InquirySheetProps {
  open: boolean
  onClose: () => void
  serviceName: string
  serviceNameAr?: string
  inquiryDescription?: string | null
  personName?: string
}

type FieldErrors = Partial<Record<'name' | 'email', string>>
type FormStatus = 'idle' | 'sending' | 'error' | 'success'

export function InquirySheet({
  open,
  onClose,
  serviceName,
  serviceNameAr,
  inquiryDescription,
  personName = PERSON_NAME,
}: InquirySheetProps) {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [phone, setPhone] = useState('')
  const [message, setMessage] = useState('')
  const [status, setStatus] = useState<FormStatus>('idle')
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({})
  const [errorMessage, setErrorMessage] = useState('')

  const reset = useCallback(() => {
    setName('')
    setEmail('')
    setPhone('')
    setMessage('')
    setStatus('idle')
    setFieldErrors({})
    setErrorMessage('')
  }, [])

  useEffect(() => {
    if (!open) reset()
  }, [open, reset])

  function handleClose() {
    if (status === 'sending') return
    onClose()
  }

  function validate(): FieldErrors {
    const errors: FieldErrors = {}
    if (!name.trim()) errors.name = 'Name is required'
    else if (name.trim().length > 200) errors.name = 'Name is too long'
    if (!email.trim()) errors.email = 'Email is required'
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))
      errors.email = 'Please enter a valid email'
    return errors
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
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
          phone: phone.trim() || undefined,
          service: serviceName,
          message: message.trim() || `Inquiry about: ${serviceName}`,
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

  const hasDescription = !!inquiryDescription

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      className={hasDescription ? 'max-w-3xl' : 'max-w-lg'}
    >
      <div
        className={
          hasDescription
            ? 'grid grid-cols-1 md:grid-cols-2 md:divide-x divide-border'
            : ''
        }
      >
        {/* Left panel — service description */}
        {hasDescription && (
          <div className="relative overflow-hidden rounded-t-xl md:rounded-l-xl md:rounded-tr-none p-6 bg-primary/5 ring-1 ring-primary/15">
            <BorderBeam size={150} duration={6} />

            <div className="mb-5">
              <p className="text-xs uppercase tracking-wider text-muted-foreground mb-2">
                Service
              </p>
              <span className="inline-flex items-center rounded-full bg-secondary/15 px-3 py-1 text-sm font-semibold text-secondary">
                {serviceName}
              </span>
              {serviceNameAr && (
                <ArabicText
                  as="p"
                  className="text-sm text-muted-foreground mt-1"
                >
                  {serviceNameAr}
                </ArabicText>
              )}
            </div>

            <p className="text-sm leading-relaxed text-foreground/85 whitespace-pre-line">
              {inquiryDescription}
            </p>

            <div aria-hidden="true" className="mt-6 flex items-center gap-3 opacity-30">
              <div className="h-px flex-1 bg-secondary" />
              <div className="size-1.5 rounded-full bg-secondary" />
              <div className="h-px flex-1 bg-secondary" />
            </div>
            <p className="mt-3 text-xs text-muted-foreground">
              Fill in the form to begin your inquiry — {personName} will be in
              touch shortly, insha'Allah.
            </p>
          </div>
        )}

        {/* Right panel — form */}
        <div className="p-6">
          {/* Service badge — always visible, including on success screen (C1 fix) */}
          {!hasDescription && (
            <div className="mb-4">
              <p className="text-xs uppercase tracking-wider text-muted-foreground mb-2">
                Service
              </p>
              <span className="inline-flex items-center rounded-full bg-secondary/15 px-3 py-1 text-sm font-semibold text-secondary">
                {serviceName}
              </span>
              {serviceNameAr && (
                <ArabicText
                  as="p"
                  className="text-sm text-muted-foreground mt-1"
                >
                  {serviceNameAr}
                </ArabicText>
              )}
            </div>
          )}

          <h3 className="mb-4 text-base font-semibold text-foreground">
            Send an Inquiry
          </h3>

          {status === 'success' ? (
            <div className="flex flex-col items-center py-8 text-center gap-4">
              <div className="flex size-12 items-center justify-center rounded-full bg-primary/10">
                <Check className="size-6 text-primary" />
              </div>
              <div>
                <p className="text-base font-semibold text-foreground">
                  Inquiry Sent!
                </p>
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
              className="flex flex-col gap-4"
            >
              {/* Name */}
              <div className="space-y-1.5">
                <Label htmlFor="inq-name">
                  Name <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="inq-name"
                  value={name}
                  onChange={(e) => {
                    setName(e.target.value)
                    if (fieldErrors.name)
                      setFieldErrors((f) => ({ ...f, name: undefined }))
                  }}
                  placeholder="Your full name"
                  autoComplete="name"
                  maxLength={200}
                  aria-invalid={!!fieldErrors.name}
                  aria-describedby={
                    fieldErrors.name ? 'inq-name-err' : undefined
                  }
                />
                {fieldErrors.name && (
                  <p
                    id="inq-name-err"
                    role="alert"
                    className="text-xs text-destructive"
                  >
                    {fieldErrors.name}
                  </p>
                )}
              </div>

              {/* Email */}
              <div className="space-y-1.5">
                <Label htmlFor="inq-email">
                  Email <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="inq-email"
                  type="email"
                  inputMode="email"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value)
                    if (fieldErrors.email)
                      setFieldErrors((f) => ({ ...f, email: undefined }))
                  }}
                  placeholder="you@example.com"
                  autoComplete="email"
                  maxLength={320}
                  aria-invalid={!!fieldErrors.email}
                  aria-describedby={
                    fieldErrors.email ? 'inq-email-err' : undefined
                  }
                />
                {fieldErrors.email && (
                  <p
                    id="inq-email-err"
                    role="alert"
                    className="text-xs text-destructive"
                  >
                    {fieldErrors.email}
                  </p>
                )}
              </div>

              {/* Phone */}
              <div className="space-y-1.5">
                <Label htmlFor="inq-phone">
                  Phone{' '}
                  <span className="text-xs font-normal text-muted-foreground">
                    (optional)
                  </span>
                </Label>
                <Input
                  id="inq-phone"
                  type="tel"
                  inputMode="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="+1 (555) 000-0000"
                  autoComplete="tel"
                  maxLength={30}
                />
              </div>

              {/* Message */}
              <div className="space-y-1.5">
                <Label htmlFor="inq-message">
                  Message{' '}
                  <span className="text-xs font-normal text-muted-foreground">
                    (optional)
                  </span>
                </Label>
                <Textarea
                  id="inq-message"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder={`Any details about your ${serviceName} inquiry…`}
                  className="min-h-[80px] resize-none"
                  maxLength={5000}
                />
              </div>

              {status === 'error' && (
                <p role="alert" className="text-sm text-destructive">
                  {errorMessage}
                </p>
              )}

              <Button
                type="submit"
                disabled={status === 'sending'}
                className="w-full gap-2"
              >
                {status === 'sending' ? (
                  <>
                    <Loader2 className="size-4 animate-spin" />
                    Sending…
                  </>
                ) : (
                  <>
                    <Send className="size-4" />
                    Send Inquiry
                  </>
                )}
              </Button>
            </form>
          )}
        </div>
      </div>
    </Dialog>
  )
}
