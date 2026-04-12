import type { ContentBlock } from './article'

export interface SermonSummary {
  id: string
  title: string
  slug: string
  description: string
  youtubeLink?: string
  date: string
  createdAt: string
}

export interface Sermon extends SermonSummary {
  content: Array<ContentBlock>
}
