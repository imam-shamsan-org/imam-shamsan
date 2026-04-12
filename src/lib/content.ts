import type { ContentBlock } from '@/types/article'

/**
 * Split blocks into sections by heading_2.
 * The first section (before any h2) is the "intro" section.
 * Each subsequent section starts with a heading_2 block.
 */
export function splitIntoSections(blocks: Array<ContentBlock>): {
  intro: Array<ContentBlock>
  sections: Array<{ heading: ContentBlock; blocks: Array<ContentBlock> }>
} {
  const intro: Array<ContentBlock> = []
  const sections: Array<{
    heading: ContentBlock
    blocks: Array<ContentBlock>
  }> = []
  let current: { heading: ContentBlock; blocks: Array<ContentBlock> } | null =
    null

  for (const block of blocks) {
    if (block.type === 'heading_2') {
      if (current) sections.push(current)
      current = { heading: block, blocks: [] }
    } else if (current) {
      current.blocks.push(block)
    } else {
      intro.push(block)
    }
  }
  if (current) sections.push(current)

  return { intro, sections }
}

/**
 * Check if a section's body is a list of h3 + paragraph pairs (card-style content).
 * Returns the pairs if so, null otherwise.
 */
export function extractCards(
  blocks: Array<ContentBlock>,
): Array<{ title: string; description: Array<ContentBlock> }> | null {
  // Filter out empty paragraphs
  const meaningful = blocks.filter(
    (b) => b.type !== 'paragraph' || (b.content && b.content.trim() !== ''),
  )

  if (meaningful.length < 2) return null

  // Check if the pattern is h3, then content blocks, then h3, then content blocks...
  const cards: Array<{ title: string; description: Array<ContentBlock> }> = []
  let i = 0

  while (i < meaningful.length) {
    if (meaningful[i].type !== 'heading_3') return null
    const title = meaningful[i].content || ''
    const descBlocks: Array<ContentBlock> = []
    i++
    while (i < meaningful.length && meaningful[i].type !== 'heading_3') {
      descBlocks.push(meaningful[i])
      i++
    }
    if (descBlocks.length === 0) return null
    cards.push({ title, description: descBlocks })
  }

  return cards.length >= 2 ? cards : null
}

/**
 * Determine if cards should render as a compact grid or full-width stacked blocks.
 * Short descriptions -> grid cards. Longer descriptions -> stacked blocks.
 */
export function isCompactCards(
  cards: Array<{ title: string; description: Array<ContentBlock> }>,
): boolean {
  const avgLen =
    cards.reduce((sum, c) => {
      const text = c.description.map((b) => b.content || '').join(' ')
      return sum + text.length
    }, 0) / cards.length
  return avgLen < 120 && cards.length <= 4
}
