import { createServerFn } from '@tanstack/react-start'
import { z } from 'zod'
import { SHOP_NOTE_MAX_LENGTH } from '@/lib/constants'

const contactFormSchema = z.object({
  name: z.string().min(1).max(200),
  email: z.string().email().max(320),
  phone: z.string().max(30).optional(),
  service: z.string().max(200).optional(),
  project: z.string().max(200).optional(),
  case: z.string().max(200).optional(),
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

function buildSubject(data: ContactFormData): string {
  if (data.project) {
    return data.case
      ? `New Contribution: ${data.project} — ${data.case} — from ${data.name}`
      : `New Contribution: ${data.project} — from ${data.name}`
  }
  if (data.service) {
    return `New Inquiry: ${data.service} — from ${data.name}`
  }
  return `New Message from ${data.name}`
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
        subject: buildSubject(data),
        html: `
          <h2>New Contact Form Submission</h2>
          <p><strong>Name:</strong> ${escapeHtml(data.name)}</p>
          <p><strong>Email:</strong> ${escapeHtml(data.email)}</p>
          ${data.phone ? `<p><strong>Phone:</strong> ${escapeHtml(data.phone)}</p>` : ''}
          ${data.service ? `<p><strong>Service:</strong> ${escapeHtml(data.service)}</p>` : ''}
          ${data.project ? `<p><strong>Project / Initiative:</strong> ${escapeHtml(data.project)}</p>` : ''}
          ${data.case ? `<p><strong>Case:</strong> ${escapeHtml(data.case)}</p>` : ''}
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

// ── Shop Orders ──────────────────────────────────────────────

const shopOrderSchema = z.object({
  name: z.string().min(1).max(200),
  email: z.string().email().max(320),
  phone: z.string().max(30).optional(),
  category: z.string().max(100),
  item: z.string().max(300),
  details: z.string().max(1000),
  note: z.string().trim().max(SHOP_NOTE_MAX_LENGTH).optional(),
  attachment: z.object({
    filename: z.string().max(255),
    content: z.string(),
    mimeType: z.enum(['application/pdf', 'image/png']),
  }),
})

type ShopOrderData = z.infer<typeof shopOrderSchema>

async function sendShopOrderEmail(
  data: ShopOrderData,
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
        subject: `New Shop Order – ${escapeHtml(data.item)} — from ${escapeHtml(data.name)}`,
        html: `
          <h2>New Shop Order</h2>
          <p><strong>Name:</strong> ${escapeHtml(data.name)}</p>
          <p><strong>Email:</strong> ${escapeHtml(data.email)}</p>
          ${data.phone ? `<p><strong>Phone:</strong> ${escapeHtml(data.phone)}</p>` : ''}
          <p><strong>Category:</strong> ${escapeHtml(data.category)}</p>
          <p><strong>Item:</strong> ${escapeHtml(data.item)}</p>
          <p><strong>Details:</strong> ${escapeHtml(data.details)}</p>
          ${data.note ? `<p><strong>Note:</strong> ${escapeHtml(data.note).replace(/\n/g, '<br>')}</p>` : ''}
          <p><em>Receipt: ${escapeHtml(data.attachment.filename)}</em></p>
        `,
        reply_to: data.email,
        attachments: [
          {
            filename: data.attachment.filename,
            content: data.attachment.content,
          },
        ],
      }),
    })

    if (!response.ok) {
      const error = await response.text()
      console.error('Resend API error:', error)
      return { success: false, error: 'Failed to send email' }
    }

    return { success: true }
  } catch (error) {
    console.error('Error sending shop order email:', error)
    return { success: false, error: 'Failed to send email' }
  }
}

export const submitShopOrder = createServerFn({
  method: 'POST',
})
  .inputValidator(shopOrderSchema)
  .handler(async ({ data }) => {
    return sendShopOrderEmail(data)
  })
