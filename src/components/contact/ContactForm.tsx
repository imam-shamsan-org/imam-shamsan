import { useRef, useState } from 'react'
import { CheckCircle, Loader2, Send, Upload, X } from 'lucide-react'
import type { Service } from '@/types/service'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Button } from '@/components/ui/button'
import { submitContactForm } from '@/lib/email'

interface ContactFormProps {
  services: Array<Service>
  preselectedService?: string
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

function toSlug(name: string): string {
  return name
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .replace(/\s+/g, '-')
}

export function ContactForm({
  services,
  preselectedService,
  personName = 'Dr. Imam Shamsan',
}: ContactFormProps) {
  const matchedService = preselectedService
    ? (services.find((s) => toSlug(s.nameEn) === preselectedService)?.nameEn ??
      '')
    : ''

  const [formState, setFormState] = useState({
    name: '',
    email: '',
    phone: '',
    service: matchedService,
    eventLocation: '',
    message: '',
  })
  const [status, setStatus] = useState<'idle' | 'sending' | 'sent' | 'error'>(
    'idle',
  )
  const [errorMessage, setErrorMessage] = useState('')
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({})
  const [attachment, setAttachment] = useState<File | null>(null)
  const [attachmentError, setAttachmentError] = useState('')
  const fileInputRef = useRef<HTMLInputElement>(null)

  const toBase64 = (file: File): Promise<string> =>
    new Promise((resolve, reject) => {
      const reader = new FileReader()
      reader.onload = () => resolve((reader.result as string).split(',')[1])
      reader.onerror = reject
      reader.readAsDataURL(file)
    })

  const handleFileChange = (file: File | null) => {
    setAttachmentError('')
    if (!file) {
      setAttachment(null)
      return
    }
    const allowedTypes = ['application/pdf', 'image/png']
    if (!allowedTypes.includes(file.type)) {
      setAttachmentError('Only PDF or PNG files are accepted.')
      setAttachment(null)
      return
    }
    if (file.size > 5 * 1024 * 1024) {
      setAttachmentError('File must be smaller than 5MB.')
      setAttachment(null)
      return
    }
    setAttachment(file)
  }

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    const file = e.dataTransfer.files.item(0)
    handleFileChange(file)
  }

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    const errors = validateForm(formState)
    setFieldErrors(errors)
    if (Object.keys(errors).length > 0) return

    setStatus('sending')
    setErrorMessage('')

    try {
      const attachmentPayload = attachment
        ? {
            filename: attachment.name,
            content: await toBase64(attachment),
            mimeType: attachment.type as 'application/pdf' | 'image/png',
          }
        : undefined

      const result = await submitContactForm({
        data: {
          name: formState.name.trim(),
          email: formState.email.trim(),
          phone: formState.phone || undefined,
          service: formState.service || undefined,
          eventLocation: formState.eventLocation || undefined,
          message: formState.message.trim(),
          attachment: attachmentPayload,
        },
      })

      if (result.success) {
        setStatus('sent')
        setFormState({
          name: '',
          email: '',
          phone: '',
          service: '',
          eventLocation: '',
          message: '',
        })
        setFieldErrors({})
        setAttachment(null)
        setAttachmentError('')
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
            value={formState.phone}
            onChange={(e) =>
              setFormState((s) => ({ ...s, phone: e.target.value }))
            }
            placeholder="(555) 123-4567"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="service">Service (optional)</Label>
          <Select
            id="service"
            value={formState.service || null}
            onValueChange={(value) =>
              setFormState((s) => ({ ...s, service: value ?? '' }))
            }
          >
            <SelectTrigger>
              <SelectValue placeholder="Select a service..." />
            </SelectTrigger>
            <SelectContent>
              {services.map((s) => (
                <SelectItem key={s.id} value={s.nameEn}>
                  {s.nameEn}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
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
          aria-invalid={!!fieldErrors.message}
        />
        {fieldErrors.message && (
          <p className="text-xs text-destructive">{fieldErrors.message}</p>
        )}
      </div>

      <div className="space-y-2">
        <Label>Attach Receipt (optional)</Label>
        <input
          ref={fileInputRef}
          type="file"
          accept="application/pdf,image/png"
          className="sr-only"
          aria-label="Upload receipt file"
          onChange={(e) => handleFileChange(e.target.files?.[0] ?? null)}
        />
        {attachment ? (
          <div className="flex items-center justify-between rounded-lg border border-border bg-accent/30 px-4 py-3">
            <span className="truncate text-sm text-foreground">
              {attachment.name}
            </span>
            <button
              type="button"
              aria-label="Remove attachment"
              onClick={() => {
                setAttachment(null)
                setAttachmentError('')
                if (fileInputRef.current) fileInputRef.current.value = ''
              }}
              className="ml-3 shrink-0 rounded-sm text-muted-foreground transition-colors hover:text-destructive focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            >
              <X className="size-4" />
            </button>
          </div>
        ) : (
          <div
            role="button"
            tabIndex={0}
            aria-label="Upload receipt — click or drag and drop"
            onDrop={handleDrop}
            onDragOver={handleDragOver}
            onClick={() => fileInputRef.current?.click()}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault()
                fileInputRef.current?.click()
              }
            }}
            className="flex cursor-pointer flex-col items-center gap-2 rounded-lg border-2 border-dashed border-border px-6 py-6 text-center transition-colors hover:border-primary hover:bg-accent/30 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          >
            <Upload className="size-6 text-muted-foreground" />
            <span className="text-sm font-medium text-foreground">
              Click to browse or drag and drop
            </span>
            <span className="text-xs text-muted-foreground">
              PDF or PNG, max 5MB
            </span>
          </div>
        )}
        {attachmentError && (
          <p className="text-xs text-destructive">{attachmentError}</p>
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
