export interface Service {
  id: string
  nameEn: string
  nameAr: string
  description: string
  priceDisplay: string
  priceNote: string
  icon: string
  order: number
  status: 'Active' | 'Inactive'
  inquiryOnly: boolean
  inquiryDescription: string | null
}
