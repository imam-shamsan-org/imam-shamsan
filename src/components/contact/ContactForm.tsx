import { useState } from 'react'
import { CheckCircle, Loader2, Send } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import { submitContactForm } from '@/lib/email'

interface ContactFormProps {
  personName?: string
}

type FieldErrors = Partial<Record<'name' | 'email' | 'message', string>>

function validateForm(state: {
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

export function ContactForm({
  personName = 'Dr. Imam Shamsan',
}: ContactFormProps) {
  const [formState, setFormState] = useState({
    name: '',
    email: '',
    phone: '',
    eventLocation: '',
    message: '',
  })
  const [status, setStatus] = useState<'idle' | 'sending' | 'sent' | 'error'>(
    'idle',
  )
  const [errorMessage, setErrorMessage] = useState('')
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({})

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    const errors = validateForm(formState)
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
          eventLocation: formState.eventLocation || undefined,
          message: formState.message.trim(),
        },
      })

      if (result.success) {
        setStatus('sent')
        setFormState({
          name: '',
          email: '',
          phone: '',
          eventLocation: '',
          message: '',
        })
        setFieldErrors({})
      } else {
        setStatus('error')
        setErrorMessage(result.error || 'Something went wrong')
      }
    } catch {
      setStatus('error')
      setErrorMessage('Failed to send message. Please try again.')
    }
  }

  if (status === 'sent') {
    return (
      <div className="rounded-xl bg-accent/50 p-8 text-center">
        <CheckCircle className="mx-auto size-12 text-primary" />
        <h3 className="mt-4 text-xl font-semibold text-foreground">
          Message Sent!
        </h3>
        <p className="mt-2 text-muted-foreground">
          Thank you for reaching out. {personName} will respond to your inquiry
          soon, insha'Allah.
        </p>
        <Button
          variant="outline"
          className="mt-4"
          onClick={() => setStatus('idle')}
        >
          Send Another Message
        </Button>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="name">Name *</Label>
          <Input
            id="name"
            required
            value={formState.name}
            onChange={(e) => {
              setFormState((s) => ({ ...s, name: e.target.value }))
              if (fieldErrors.name)
                setFieldErrors((f) => ({ ...f, name: undefined }))
            }}
            placeholder="Your full name"
            autoComplete="name"
            maxLength={200}
            aria-invalid={!!fieldErrors.name}
          />
          {fieldErrors.name && (
            <p className="text-xs text-destructive">{fieldErrors.name}</p>
          )}
        </div>
        <div className="space-y-2">
          <Label htmlFor="email">Email *</Label>
          <Input
            id="email"
            type="email"
            inputMode="email"
            required
            value={formState.email}
            onChange={(e) => {
              setFormState((s) => ({ ...s, email: e.target.value }))
              if (fieldErrors.email)
                setFieldErrors((f) => ({ ...f, email: undefined }))
            }}
            placeholder="your@email.com"
            autoComplete="email"
            maxLength={320}
            aria-invalid={!!fieldErrors.email}
          />
          {fieldErrors.email && (
            <p className="text-xs text-destructive">{fieldErrors.email}</p>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="phone">Phone</Label>
          <Input
            id="phone"
            type="tel"
            inputMode="tel"
            value={formState.phone}
            onChange={(e) =>
              setFormState((s) => ({ ...s, phone: e.target.value }))
            }
            placeholder="(555) 123-4567"
            autoComplete="tel"
            maxLength={30}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="eventLocation">Event Location</Label>
          <Input
            id="eventLocation"
            value={formState.eventLocation}
            onChange={(e) =>
              setFormState((s) => ({ ...s, eventLocation: e.target.value }))
            }
            placeholder="Address or venue name (if applicable)"
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="message">Message *</Label>
        <Textarea
          id="message"
          required
          value={formState.message}
          onChange={(e) => {
            setFormState((s) => ({ ...s, message: e.target.value }))
            if (fieldErrors.message)
              setFieldErrors((f) => ({ ...f, message: undefined }))
          }}
          placeholder={`How can ${personName} help you?`}
          rows={5}
          maxLength={5000}
          aria-invalid={!!fieldErrors.message}
        />
        {fieldErrors.message && (
          <p className="text-xs text-destructive">{fieldErrors.message}</p>
        )}
      </div>

      {status === 'error' && (
        <p className="text-sm text-destructive">{errorMessage}</p>
      )}

      <Button
        type="submit"
        size="lg"
        disabled={status === 'sending'}
        className="w-full gap-2"
      >
        {status === 'sending' ? (
          <>
            <Loader2 className="size-4 animate-spin" />
            Sending...
          </>
        ) : (
          <>
            <Send className="size-4" />
            Send Message
          </>
        )}
      </Button>
    </form>
  )
}
