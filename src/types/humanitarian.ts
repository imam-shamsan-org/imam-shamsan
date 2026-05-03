export interface HumanitarianProject {
  id: string
  slug: string
  title: string
  titleAr: string
  description: string
  descriptionAr: string
  category:
    | 'Medical'
    | 'Food'
    | 'Water'
    | 'Education'
    | 'Family'
    | 'Religious'
    | 'Qurbani'
  icon: string
  hasCases: boolean
  sortOrder: number
  status: 'Active' | 'Completed' | 'Paused'
}

export interface HumanitarianCase {
  id: string
  slug: string
  caseNumber: number
  title: string
  projectId: string
  urgency: 'Urgent' | 'High' | 'Ongoing'
  posterUrl: string | null
  status: 'Published' | 'Funded' | 'Draft'
}
