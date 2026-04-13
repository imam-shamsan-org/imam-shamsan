import type { ContentBlock, RichTextItem } from '@/types/article'
import { cn } from '@/lib/utils'
import { getOptimizedUrl } from '@/lib/cloudinary'

/** Map Notion text/background color names to Tailwind classes */
const notionColorMap: Record<string, string> = {
  gray: 'text-muted-foreground',
  brown: 'text-amber-700 dark:text-amber-400',
  orange: 'text-orange-600 dark:text-orange-400',
  yellow: 'text-yellow-600 dark:text-yellow-400',
  green: 'text-green-600 dark:text-green-400',
  blue: 'text-blue-600 dark:text-blue-400',
  purple: 'text-purple-600 dark:text-purple-400',
  pink: 'text-pink-600 dark:text-pink-400',
  red: 'text-red-600 dark:text-red-400',
  gray_background: 'bg-muted rounded px-0.5',
  brown_background: 'bg-amber-100 dark:bg-amber-900/40 rounded px-0.5',
  orange_background: 'bg-orange-100 dark:bg-orange-900/40 rounded px-0.5',
  yellow_background: 'bg-yellow-100 dark:bg-yellow-900/40 rounded px-0.5',
  green_background: 'bg-green-100 dark:bg-green-900/40 rounded px-0.5',
  blue_background: 'bg-blue-100 dark:bg-blue-900/40 rounded px-0.5',
  purple_background: 'bg-purple-100 dark:bg-purple-900/40 rounded px-0.5',
  pink_background: 'bg-pink-100 dark:bg-pink-900/40 rounded px-0.5',
  red_background: 'bg-red-100 dark:bg-red-900/40 rounded px-0.5',
}

/**
 * Returns true only if the block is predominantly Arabic text (>30% of
 * non-whitespace characters are Arabic). This prevents symbols like ﷺ (U+FDFA)
 * inside an otherwise-English sentence from triggering RTL layout.
 */
function containsArabic(text: string): boolean {
  const arabicChars = (
    text.match(/[\u0600-\u06FF\u0750-\u077F\u08A0-\u08FF\uFB50-\uFDFF\uFE70-\uFEFF]/g) || []
  ).length
  const nonWhitespace = text.replace(/\s/g, '').length
  return nonWhitespace > 0 && arabicChars / nonWhitespace > 0.3
}

/** Get the full plain text from a block (including rich text items) */
function getBlockText(block: ContentBlock): string {
  if (block.richText && block.richText.length > 0) {
    return block.richText.map((item) => item.text).join('')
  }
  return block.content || ''
}

function renderRichText(items: Array<RichTextItem>): Array<React.ReactNode> {
  return items.map((item, i) => {
    let node: React.ReactNode = item.text

    if (item.href) {
      node = (
        <a
          href={item.href}
          target="_blank"
          rel="noopener noreferrer"
          className="text-primary hover:text-primary/80 underline underline-offset-2"
        >
          {node}
        </a>
      )
    }

    if (item.bold) node = <strong>{node}</strong>
    if (item.italic) node = <em>{node}</em>
    if (item.underline) node = <u>{node}</u>
    if (item.strikethrough) node = <s>{node}</s>
    if (item.code) {
      node = (
        <code className="rounded bg-muted px-1.5 py-0.5 text-sm font-mono">
          {node}
        </code>
      )
    }

    if (item.color && notionColorMap[item.color]) {
      node = <span className={notionColorMap[item.color]}>{node}</span>
    }

    return <span key={i}>{node}</span>
  })
}

function renderBlock(block: ContentBlock): React.ReactNode {
  const richContent =
    block.richText && block.richText.length > 0
      ? renderRichText(block.richText)
      : block.content

  const blockText = getBlockText(block)
  const isArabicBlock = containsArabic(blockText)
  const arabicDir = isArabicBlock ? 'rtl' : undefined

  let arabicClass = ''
  if (isArabicBlock) {
    switch (block.type) {
      case 'heading_1':
        arabicClass = 'font-arabic-h2'
        break
      case 'heading_2':
        arabicClass = 'font-arabic-h3'
        break
      case 'heading_3':
        arabicClass = 'font-arabic-h4'
        break
      default:
        arabicClass = 'font-arabic'
    }
  }

  switch (block.type) {
    case 'paragraph': {
      const isEmpty =
        !block.content?.trim() &&
        (!block.richText ||
          block.richText.every((rt) => !rt.text || !rt.text.trim()))
      if (isEmpty) {
        return <div key={block.id} className="h-4" />
      }
      return (
        <p
          key={block.id}
          className={cn('leading-relaxed', arabicClass)}
          dir={arabicDir}
        >
          {richContent}
        </p>
      )
    }

    case 'heading_1':
      return (
        <h1
          key={block.id}
          className={cn(
            'text-3xl font-bold tracking-tight mt-8 mb-4',
            arabicClass,
          )}
          dir={arabicDir}
        >
          {richContent}
        </h1>
      )

    case 'heading_2':
      return (
        <h2
          key={block.id}
          className={cn(
            'text-2xl font-bold tracking-tight mt-6 mb-3',
            arabicClass,
          )}
          dir={arabicDir}
        >
          {richContent}
        </h2>
      )

    case 'heading_3':
      return (
        <h3
          key={block.id}
          className={cn('text-xl font-semibold mt-4 mb-2', arabicClass)}
          dir={arabicDir}
        >
          {richContent}
        </h3>
      )

    case 'bulleted_list_item':
    case 'numbered_list_item':
      // Handled by groupBlocks() — shouldn't reach here, but fallback just in case
      return (
        <li key={block.id} className={arabicClass || undefined} dir={arabicDir}>
          {richContent}
        </li>
      )

    case 'quote':
      return (
        <blockquote
          key={block.id}
          className={cn(
            'border-l-4 border-primary/50 pl-4 italic text-muted-foreground my-4',
            arabicClass,
          )}
          dir={arabicDir}
        >
          {richContent}
        </blockquote>
      )

    case 'callout':
      return (
        <div
          key={block.id}
          className={cn(
            'my-4 flex gap-3 rounded-lg bg-accent/50 p-4',
            arabicClass,
          )}
          dir={arabicDir}
        >
          {block.icon && <span className="text-xl">{block.icon}</span>}
          <div className="flex-1">{richContent}</div>
        </div>
      )

    case 'code':
      return (
        <pre
          key={block.id}
          className="my-4 overflow-x-auto rounded-lg bg-muted p-4 text-sm font-mono"
        >
          <code>{block.content}</code>
        </pre>
      )

    case 'image': {
      if (!block.imageUrl) return null
      const inlineImgUrl = getOptimizedUrl(block.imageUrl, 'article-body')
      return (
        <figure key={block.id} className="my-6 flex justify-center">
          <img
            src={inlineImgUrl}
            alt={block.caption || ''}
            className="max-w-full h-auto rounded-lg"
            loading="lazy"
          />
          {block.caption && (
            <figcaption className="mt-2 text-center text-sm text-muted-foreground">
              {block.caption}
            </figcaption>
          )}
        </figure>
      )
    }

    case 'divider':
      return <hr key={block.id} className="my-8 border-border" />

    case 'embed':
    case 'video': {
      const embedUrl = block.content
      if (!embedUrl) return null
      return (
        <div
          key={block.id}
          className="my-6 aspect-video overflow-hidden rounded-lg"
        >
          <iframe
            src={embedUrl}
            title="Embedded content"
            className="h-full w-full"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />
        </div>
      )
    }

    case 'bookmark':
      return block.content ? (
        <a
          key={block.id}
          href={block.content}
          target="_blank"
          rel="noopener noreferrer"
          className="my-4 block rounded-lg border border-border p-4 text-primary hover:bg-muted transition-colors"
        >
          {block.content}
        </a>
      ) : null

    default:
      if (block.content) {
        return (
          <p
            key={block.id}
            className={cn('leading-relaxed', arabicClass)}
            dir={arabicDir}
          >
            {richContent}
          </p>
        )
      }
      return null
  }
}

/**
 * Group consecutive list items into proper <ul>/<ol> containers.
 * Non-list blocks pass through unchanged.
 */
function groupBlocks(blocks: Array<ContentBlock>): Array<React.ReactNode> {
  const result: Array<React.ReactNode> = []
  let i = 0

  while (i < blocks.length) {
    const block = blocks[i]

    if (block.type === 'bulleted_list_item') {
      const items: Array<ContentBlock> = []
      while (i < blocks.length && blocks[i].type === 'bulleted_list_item') {
        items.push(blocks[i])
        i++
      }
      result.push(
        <ul key={items[0].id} className="list-disc space-y-1 pl-6">
          {items.map(renderListItem)}
        </ul>,
      )
    } else if (block.type === 'numbered_list_item') {
      const items: Array<ContentBlock> = []
      while (i < blocks.length && blocks[i].type === 'numbered_list_item') {
        items.push(blocks[i])
        i++
      }
      result.push(
        <ol key={items[0].id} className="list-decimal space-y-1 pl-6">
          {items.map(renderListItem)}
        </ol>,
      )
    } else {
      result.push(renderBlock(block))
      i++
    }
  }

  return result
}

/** Render a list item without the ml-6 / list-style classes (parent handles those). */
function renderListItem(block: ContentBlock): React.ReactNode {
  const richContent =
    block.richText && block.richText.length > 0
      ? renderRichText(block.richText)
      : block.content

  const blockText = getBlockText(block)
  const isArabicBlock = containsArabic(blockText)

  let arabicClass = ''
  if (isArabicBlock) arabicClass = 'font-arabic'

  return (
    <li
      key={block.id}
      className={arabicClass || undefined}
      dir={isArabicBlock ? 'rtl' : undefined}
    >
      {richContent}
    </li>
  )
}

interface ArticleContentProps {
  blocks: Array<ContentBlock>
  isArabic?: boolean
}

export function ArticleContent({ blocks, isArabic }: ArticleContentProps) {
  return (
    <div
      className={cn(
        'prose-custom space-y-4 text-foreground',
        isArabic && 'font-arabic',
      )}
      dir={isArabic ? 'rtl' : 'ltr'}
    >
      {groupBlocks(blocks)}
    </div>
  )
}
