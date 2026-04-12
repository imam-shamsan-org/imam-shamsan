import { createServerFn } from '@tanstack/react-start'
import { z } from 'zod'

const contactFormSchema = z.object({
  name: z.string().min(1).max(200),
  email: z.string().email().max(320),
  phone: z.string().max(30).optional(),
  service: z.string().max(200).optional(),
  eventLocation: z.string().max(500).optional(),
  message: z.string().min(1).max(5000),
  attachment: z
    .object({
      filename: z.string().max(255),
      content: z.string(), // base64
      mimeType: z.enum(['application/pdf', 'image/png']),
    })
    .optional(),
})

type ContactFormData = z.infer<typeof contactFormSchema>

/** Escape HTML special characters to prevent injection in email body */
function escapeHtml(str: string): string {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;')
}

async function sendContactEmail(
  data: ContactFormData,
): Promise<{ success: boolean; error?: string }> {
  const resendApiKey = process.env.RESEND_API_KEY
  const contactEmail = process.env.CONTACT_EMAIL || 'mccgpimamshamsan@gmail.com'

  if (!resendApiKey) {
    console.error('RESEND_API_KEY not configured')
    return { success: false, error: 'Email service not configured' }
  }

  try {
    const response = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${resendApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: `Dr. Imam Shamsan Website <onboarding@resend.dev>`,
        to: contactEmail,
        subject: data.service
          ? `New Inquiry: ${escapeHtml(data.service)} - from ${escapeHtml(data.name)}`
          : `New Message from ${escapeHtml(data.name)}`,
        html: `
          <h2>New Contact Form Submission</h2>
          <p><strong>Name:</strong> ${escapeHtml(data.name)}</p>
          <p><strong>Email:</strong> ${escapeHtml(data.email)}</p>
          ${data.phone ? `<p><strong>Phone:</strong> ${escapeHtml(data.phone)}</p>` : ''}
          ${data.service ? `<p><strong>Service:</strong> ${escapeHtml(data.service)}</p>` : ''}
          ${data.eventLocation ? `<p><strong>Event Location:</strong> ${escapeHtml(data.eventLocation)}</p>` : ''}
          <p><strong>Message:</strong></p>
          <p>${escapeHtml(data.message).replace(/\n/g, '<br>')}</p>
          ${data.attachment ? `<p><em>Attachment: ${escapeHtml(data.attachment.filename)}</em></p>` : ''}
        `,
        reply_to: data.email,
        ...(data.attachment
          ? {
              attachments: [
                {
                  filename: data.attachment.filename,
                  content: data.attachment.content,
                },
              ],
            }
          : {}),
      }),
    })

    if (!response.ok) {
      const error = await response.text()
      console.error('Resend API error:', error)
      return { success: false, error: 'Failed to send email' }
    }

    return { success: true }
  } catch (error) {
    console.error('Error sending email:', error)
    return { success: false, error: 'Failed to send email' }
  }
}

export const submitContactForm = createServerFn({
  method: 'POST',
})
  .inputValidator(contactFormSchema)
  .handler(async ({ data }) => {
    return sendContactEmail(data)
  })
