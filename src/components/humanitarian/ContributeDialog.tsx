import { useState } from 'react'
import { Heart, Send } from 'lucide-react'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { submitContactForm } from '@/lib/email'

interface ContributeDialogProps {
  trigger: React.ReactNode
  projectTitle: string
  caseTitle?: string
}

export function ContributeDialog({
  trigger,
  projectTitle,
  caseTitle,
}: ContributeDialogProps) {
  const [open, setOpen] = useState(false)
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [caseInput, setCaseInput] = useState('')
  const [message, setMessage] = useState('')
  const [status, setStatus] = useState<'idle' | 'sending' | 'sent' | 'error'>(
    'idle',
  )

  const resolvedCase = caseTitle ?? caseInput.trim()

  const subject = resolvedCase
    ? `Contribution Interest: ${resolvedCase} (${projectTitle})`
    : `Contribution Interest: ${projectTitle}`

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setStatus('sending')
    try {
      const contextLine = resolvedCase
        ? `Initiative: ${projectTitle}\nCase: ${resolvedCase}`
        : `Initiative: ${projectTitle}`
      const result = await submitContactForm({
        data: {
          name,
          email,
          service: subject,
          message: message
            ? `${contextLine}\n\n${message}`
            : `I am interested in contributing to:\n${contextLine}`,
        },
      })
      setStatus(result.success ? 'sent' : 'error')
    } catch {
      setStatus('error')
    }
  }

  function handleClose() {
    setOpen(false)
    // reset editable fields only — keep pre-filled ones intact
    if (!caseTitle) setCaseInput('')
    setName('')
    setEmail('')
    setMessage('')
    setStatus('idle')
  }

  return (
    <>
      <span
        onClick={() => setOpen(true)}
        className="contents"
        role="button"
        tabIndex={0}
        onKeyDown={(e) => e.key === 'Enter' && setOpen(true)}
      >
        {trigger}
      </span>

      <Dialog open={open} onClose={handleClose}>
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Heart className="size-5 text-primary" />
            Contribute to This Initiative
          </DialogTitle>
          <DialogDescription>
            Fill in your details and Imam Shamsan will be in touch, insha'Allah.
          </DialogDescription>
        </DialogHeader>

        <DialogContent>
          {status === 'sent' ? (
            <div className="py-6 text-center">
              <div className="inline-flex size-12 items-center justify-center rounded-full bg-primary/10 mb-3">
                <Heart className="size-6 text-primary" />
              </div>
              <p className="font-medium text-foreground">Message Sent</p>
              <p className="text-sm text-muted-foreground mt-1">
                Imam Shamsan will be in touch with you soon, insha'Allah.
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Initiative — shown as gold pill */}
              <div className="space-y-1.5">
                <p className="text-xs text-muted-foreground">Initiative</p>
                <div>
                  <span className="inline-flex items-center rounded-full bg-secondary/15 px-3 py-1 text-sm font-medium text-secondary">
                    {projectTitle}
                  </span>
                </div>
              </div>

              {/* Case — gold pill if pre-filled, optional input otherwise */}
              {caseTitle ? (
                <div className="space-y-1.5">
                  <p className="text-xs text-muted-foreground">Case</p>
                  <div>
                    <span className="inline-flex items-center rounded-full bg-secondary/15 px-3 py-1 text-sm font-medium text-secondary">
                      {caseTitle}
                    </span>
                  </div>
                </div>
              ) : (
                <div className="space-y-1.5">
                  <Label
                    htmlFor="contrib-case"
                    className="flex items-center gap-1.5"
                  >
                    Specific Case
                    <span className="text-muted-foreground font-normal">
                      (optional)
                    </span>
                  </Label>
                  <Input
                    id="contrib-case"
                    value={caseInput}
                    onChange={(e) => setCaseInput(e.target.value)}
                    placeholder="e.g. Case #3 — Ahmad's family"
                  />
                </div>
              )}

              {/* Name */}
              <div className="space-y-1.5">
                <Label htmlFor="contrib-name">Your Name</Label>
                <Input
                  id="contrib-name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Your full name"
                  required
                />
              </div>

              {/* Email */}
              <div className="space-y-1.5">
                <Label htmlFor="contrib-email">Email Address</Label>
                <Input
                  id="contrib-email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  required
                />
              </div>

              {/* Message */}
              <div className="space-y-1.5">
                <Label htmlFor="contrib-message">
                  Message{' '}
                  <span className="text-muted-foreground font-normal">
                    (optional)
                  </span>
                </Label>
                <Textarea
                  id="contrib-message"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Any questions or details about your contribution..."
                  rows={3}
                />
              </div>

              {status === 'error' && (
                <p className="text-sm text-destructive">
                  Something went wrong. Please contact us directly.
                </p>
              )}

              <DialogFooter className="px-0 pb-0 pt-2">
                <Button variant="outline" type="button" onClick={handleClose}>
                  Cancel
                </Button>
                <Button type="submit" disabled={status === 'sending'}>
                  <Send className="size-4" />
                  {status === 'sending' ? 'Sending...' : 'Send Message'}
                </Button>
              </DialogFooter>
            </form>
          )}
        </DialogContent>
      </Dialog>
    </>
  )
}
