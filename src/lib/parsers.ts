import type { BlockObjectResponse } from '@notionhq/client/build/src/api-endpoints'
import type { ContentBlock, RichTextItem } from '@/types/article'

/**
 * Extract rich text items with formatting from a Notion rich_text array
 */
function parseRichText(
  richTexts: Array<Record<string, unknown>>,
): Array<RichTextItem> {
  return richTexts.map((rt) => {
    const text = rt as {
      plain_text: string
      href: string | null
      annotations: {
        bold: boolean
        italic: boolean
        underline: boolean
        strikethrough: boolean
        code: boolean
        color: string
      }
    }

    return {
      text: text.plain_text,
      bold: text.annotations.bold || undefined,
      italic: text.annotations.italic || undefined,
      underline: text.annotations.underline || undefined,
      strikethrough: text.annotations.strikethrough || undefined,
      code: text.annotations.code || undefined,
      color:
        text.annotations.color !== 'default'
          ? text.annotations.color
          : undefined,
      href: text.href || undefined,
    }
  })
}

/**
 * Get plain text content from a block
 */
function getBlockPlainText(block: Record<string, unknown>): string {
  const richTextTypes = [
    'paragraph',
    'heading_1',
    'heading_2',
    'heading_3',
    'bulleted_list_item',
    'numbered_list_item',
    'quote',
    'callout',
    'toggle',
    'to_do',
  ]

  const blockType = block.type as string

  for (const type of richTextTypes) {
    if (blockType === type) {
      const data = block[type] as
        | { rich_text?: Array<{ plain_text: string }> }
        | undefined
      if (data?.rich_text) {
        return data.rich_text.map((t) => t.plain_text).join('')
      }
    }
  }

  return ''
}

/**
 * Get rich text array from a block
 */
function getBlockRichText(
  block: Record<string, unknown>,
): Array<Record<string, unknown>> {
  const blockType = block.type as string
  const data = block[blockType] as
    | { rich_text?: Array<Record<string, unknown>> }
    | undefined
  return data?.rich_text || []
}

/**
 * Get the image URL from an image block (prefers external/Cloudinary URLs)
 */
function getImageFromBlock(block: Record<string, unknown>): {
  url: string
  caption: string
} {
  const imageData = block.image as
    | {
        type: string
        file?: { url: string }
        external?: { url: string }
        caption?: Array<{ plain_text: string }>
      }
    | undefined

  if (!imageData) return { url: '', caption: '' }

  let url = ''
  if (imageData.type === 'external' && imageData.external) {
    url = imageData.external.url
  } else if (imageData.type === 'file' && imageData.file) {
    url = imageData.file.url
  }

  const caption = imageData.caption?.map((c) => c.plain_text).join('') || ''

  return { url, caption }
}

/**
 * Parse a single Notion block into a ContentBlock
 */
function parseBlock(block: BlockObjectResponse): ContentBlock {
  const b = block as unknown as Record<string, unknown>
  const blockType = b.type as string

  const base: ContentBlock = {
    id: block.id,
    type: blockType,
    content: getBlockPlainText(b),
    richText: parseRichText(getBlockRichText(b)),
  }

  switch (blockType) {
    case 'heading_1':
      return { ...base, level: 1 }
    case 'heading_2':
      return { ...base, level: 2 }
    case 'heading_3':
      return { ...base, level: 3 }

    case 'image': {
      const { url, caption } = getImageFromBlock(b)
      return { ...base, imageUrl: url, caption }
    }

    case 'code': {
      const codeData = b.code as
        | { language?: string; rich_text?: Array<{ plain_text: string }> }
        | undefined
      return {
        ...base,
        content: codeData?.rich_text?.map((t) => t.plain_text).join('') || '',
        codeLanguage: codeData?.language || 'plain text',
      }
    }

    case 'callout': {
      const calloutData = b.callout as
        | { icon?: { type: string; emoji?: string } }
        | undefined
      return {
        ...base,
        icon:
          calloutData?.icon?.type === 'emoji'
            ? calloutData.icon.emoji
            : undefined,
      }
    }

    case 'embed': {
      const embedData = b.embed as { url?: string } | undefined
      return { ...base, content: embedData?.url || '' }
    }

    case 'video': {
      const videoData = b.video as
        | { type: string; external?: { url: string } }
        | undefined
      return {
        ...base,
        content:
          videoData?.type === 'external' ? videoData.external?.url || '' : '',
      }
    }

    case 'bookmark': {
      const bookmarkData = b.bookmark as { url?: string } | undefined
      return { ...base, content: bookmarkData?.url || '' }
    }

    default:
      return base
  }
}

/**
 * Parse all Notion blocks into ContentBlock array
 * This is the generic block renderer for blog articles, sermon summaries, etc.
 */
export function parseBlocksToContent(
  blocks: Array<BlockObjectResponse>,
): Array<ContentBlock> {
  return blocks.map(parseBlock)
}
