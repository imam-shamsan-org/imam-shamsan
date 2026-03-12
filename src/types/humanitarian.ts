export interface HumanitarianProject {
  id: string
  slug: string
  title: string
  titleAr: string
  description: string
  descriptionAr: string
  category: 'Medical' | 'Food' | 'Water' | 'Education' | 'Family' | 'Religious'
  icon: string
  coverImage: string
  hasCases: boolean
  sortOrder: number
  status: 'Active' | 'Completed' | 'Paused'
}

import type { ContentBlock } from '@/types/article'

export interface HumanitarianCase {
  id: string
  slug: string
  caseNumber: number
  title: string
  projectId: string
  content: ContentBlock[]
  needsItems: string[]
  urgency: 'Urgent' | 'High' | 'Ongoing'
  targetAmount: number | null
  monthlyAmount: number | null
  familySize: number | null
  patientPhoto: string
  status: 'Published' | 'Funded' | 'Draft'
}
