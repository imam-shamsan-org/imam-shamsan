import { useCallback, useEffect, useState } from 'react'
import {
  ArrowLeft,
  CheckCircle,
  Loader2,
  Mail,
  MessageSquare,
  Send,
} from 'lucide-react'
import type { Service } from '@/types/service'
import { ArabicText } from '@/components/shared/ArabicText'
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { submitContactForm } from '@/lib/email'

type Step = 'details' | 'form' | 'success'
type FieldErrors = Partial<Record<'name' | 'email' | 'message', string>>

function validateBookingForm(state: {
  name: string
  email: string
  message: string
}): FieldErrors {
  const errors: FieldErrors = {}
  if (!state.name.trim()) errors.name = 'Name is required'
  else if (state.name.trim().length > 200) errors.name = 'Name is too long'

  if (!state.email.trim()) errors.email = 'Email is required'
  else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(state.email))
    errors.email = 'Please enter a valid email'

  if (!state.message.trim()) errors.message = 'Message is required'
  else if (state.message.length > 5000)
    errors.message = 'Message is too long (max 5000 characters)'

  return errors
}

interface ServiceDetailDialogProps {
  service: Service
  open: boolean
  onClose: () => void
}

export function ServiceDetailDialog({
  service,
  open,
  onClose,
}: ServiceDetailDialogProps) {
  const [step, setStep] = useState<Step>('details')
  const [formState, setFormState] = useState({
    name: '',
    email: '',
    phone: '',
    message: '',
  })
  const [status, setStatus] = useState<'idle' | 'sending' | 'error'>('idle')
  const [errorMessage, setErrorMessage] = useState('')
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({})

  // Reset state when dialog opens/closes or service changes
  const resetDialog = useCallback(() => {
    setStep('details')
    setFormState({
      name: '',
      email: '',
      phone: '',
      message: '',
    })
    setStatus('idle')
    setErrorMessage('')
    setFieldErrors({})
  }, [])

  useEffect(() => {
    if (!open) resetDialog()
  }, [open, resetDialog])

  // Auto-close after success
  useEffect(() => {
    if (step !== 'success') return
    const timer = setTimeout(() => {
      onClose()
    }, 2000)
    return () => clearTimeout(timer)
  }, [step, onClose])

  const goToForm = () => {
    setStep('form')
  }

  const goBack = () => {
    setStep('details')
    setFieldErrors({})
    setStatus('idle')
    setErrorMessage('')
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    const errors = validateBookingForm(formState)
    setFieldErrors(errors)
    if (Object.keys(errors).length > 0) return

    setStatus('sending')
    setErrorMessage('')

    try {
      const result = await submitContactForm({
        data: {
          name: formState.name.trim(),
          email: formState.email.trim(),
          phone: formState.phone || undefined,
          service: service.nameEn,
          message: formState.message.trim(),
        },
      })

      if (result.success) {
        setStep('success')
      } else {
        setStatus('error')
        setErrorMessage(result.error || 'Something went wrong')
      }
    } catch {
      setStatus('error')
      setErrorMessage('Failed to send message. Please try again.')
    }
  }

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogHeader>
        <DialogTitle className="text-xl">{service.nameEn}</DialogTitle>
        {service.nameAr && (
          <ArabicText as="p" className="text-sm text-muted-foreground mt-0.5">
            {service.nameAr}
          </ArabicText>
        )}
      </DialogHeader>

      {/* Step 1: Service Details */}
      {step === 'details' && (
        <>
          <DialogContent className="space-y-4">
            {service.description && (
              <p className="text-sm text-muted-foreground leading-relaxed">
                {service.description}
              </p>
            )}

            {/* Price */}
            {service.priceDisplay && (
              <div className="rounded-lg bg-secondary/10 p-3">
                <div>
                  <span className="text-sm font-semibold text-secondary">
                    {service.priceDisplay}
                  </span>
                  {service.priceNote && (
                    <p className="text-xs text-muted-foreground mt-0.5">
                      {service.priceNote}
                    </p>
                  )}
                </div>
              </div>
            )}

            {/* Zelle payment info */}
            <div className="rounded-lg border border-border bg-accent/30 p-4 space-y-2">
              <h4 className="text-sm font-semibold text-foreground">
                Payment via Zelle
              </h4>
              <p className="text-sm text-muted-foreground">
                Send payment via Zelle to:{' '}
                <span className="font-medium text-foreground">
                  MCCGPImamShamsan@gmail.com
                </span>{' '}
                or{' '}
                <span className="font-medium text-foreground">
                  +1 (661) 380-0334
                </span>
              </p>
              <p className="text-xs text-muted-foreground">
                Please include the service name in the Zelle memo. After sending
                payment, use the contact form to confirm your booking.
              </p>
            </div>
          </DialogContent>

          <DialogFooter className="flex-col gap-2 sm:flex-row">
            <Button onClick={goToForm} className="w-full gap-2 sm:w-auto">
              <MessageSquare className="size-4" />
              Book / Inquire
            </Button>
            <a
              href={`mailto:MCCGPImamShamsan@gmail.com?subject=${encodeURIComponent(`Booking: ${service.nameEn}`)}`}
              className="inline-flex items-center justify-center gap-2 rounded-lg border border-border px-4 py-2 text-sm font-medium text-foreground transition-colors hover:bg-accent w-full sm:w-auto"
            >
              <Mail className="size-4" />
              Email Directly
            </a>
          </DialogFooter>
        </>
      )}

      {/* Step 2: Booking Form */}
      {step === 'form' && (
        <>
          <DialogContent>
            <form
              id="service-booking-form"
              onSubmit={handleSubmit}
              className="space-y-4"
            >
              <div>
                <p className="text-xs text-muted-foreground">Booking</p>
                <span className="mt-1 inline-block rounded-full bg-secondary/15 px-3 py-1 text-sm font-medium text-secondary">
                  {service.nameEn}
                </span>
              </div>

              <div className="space-y-2">
                <Label htmlFor="booking-name">Name *</Label>
                <Input
                  id="booking-name"
                  required
                  value={formState.name}
                  onChange={(e) => {
                    setFormState((s) => ({ ...s, name: e.target.value }))
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

              <div className="space-y-2">
                <Label htmlFor="booking-email">Email *</Label>
                <Input
                  id="booking-email"
                  type="email"
                  required
                  value={formState.email}
                  onChange={(e) => {
                    setFormState((s) => ({ ...s, email: e.target.value }))
                    if (fieldErrors.email)
                      setFieldErrors((f) => ({ ...f, email: undefined }))
                  }}
                  placeholder="your@email.com"
                  aria-invalid={!!fieldErrors.email}
                />
                {fieldErrors.email && (
                  <p className="text-xs text-destructive">
                    {fieldErrors.email}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="booking-phone">Phone</Label>
                <Input
                  id="booking-phone"
                  type="tel"
                  value={formState.phone}
                  onChange={(e) =>
                    setFormState((s) => ({ ...s, phone: e.target.value }))
                  }
                  placeholder="(555) 123-4567"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="booking-message">Message *</Label>
                <Textarea
                  id="booking-message"
                  required
                  value={formState.message}
                  onChange={(e) => {
                    setFormState((s) => ({ ...s, message: e.target.value }))
                    if (fieldErrors.message)
                      setFieldErrors((f) => ({ ...f, message: undefined }))
                  }}
                  placeholder="Tell us about your booking needs..."
                  rows={4}
                  aria-invalid={!!fieldErrors.message}
                />
                {fieldErrors.message && (
                  <p className="text-xs text-destructive">
                    {fieldErrors.message}
                  </p>
                )}
              </div>

              {status === 'error' && (
                <p className="text-sm text-destructive">{errorMessage}</p>
              )}
            </form>
          </DialogContent>

          <DialogFooter className="flex-col gap-2 sm:flex-row">
            <Button
              type="button"
              variant="outline"
              onClick={goBack}
              className="w-full gap-2 sm:w-auto"
            >
              <ArrowLeft className="size-4" />
              Back
            </Button>
            <Button
              type="submit"
              form="service-booking-form"
              disabled={status === 'sending'}
              className="w-full gap-2 sm:w-auto"
            >
              {status === 'sending' ? (
                <>
                  <Loader2 className="size-4 animate-spin" />
                  Sending...
                </>
              ) : (
                <>
                  <Send className="size-4" />
                  Send Inquiry
                </>
              )}
            </Button>
          </DialogFooter>
        </>
      )}

      {/* Success State */}
      {step === 'success' && (
        <DialogContent>
          <div className="py-6 text-center">
            <CheckCircle className="mx-auto size-12 text-primary" />
            <h3 className="mt-4 text-lg font-semibold text-foreground">
              Inquiry Sent!
            </h3>
            <p className="mt-2 text-sm text-muted-foreground">
              Thank you for reaching out. Imam Shamsan will respond soon,
              insha'Allah.
            </p>
          </div>
        </DialogContent>
      )}
    </Dialog>
  )
}
