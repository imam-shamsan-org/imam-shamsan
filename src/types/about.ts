import type { ContentBlock } from './article'

export interface AboutPage {
  id: string
  title: string
  subtitleAr: string
  content: Array<ContentBlock>
}
