import type { AvailableNote, NoteCategory } from '@/types/perfume'

export const NOTE_CATEGORIES: Array<{
  id: NoteCategory
  nameEn: string
  nameAr: string
}> = [
  { id: 'floral', nameEn: 'Floral', nameAr: 'زهرية' },
  { id: 'fresh-citrus', nameEn: 'Fresh & Citrus', nameAr: 'منعشة' },
  { id: 'fruity', nameEn: 'Fruity', nameAr: 'فاكهية' },
  { id: 'clean', nameEn: 'Clean', nameAr: 'نظيفة' },
  { id: 'warm', nameEn: 'Warm & Sweet', nameAr: 'دافئة' },
  { id: 'oriental', nameEn: 'Oriental / Luxury', nameAr: 'شرقية' },
  { id: 'unique', nameEn: 'Unique', nameAr: 'مميزة' },
]

export const AVAILABLE_NOTES: Array<AvailableNote> = [
  // Floral
  { id: 'jasmine', nameEn: 'Jasmine', nameAr: 'ياسمين', category: 'floral' },
  { id: 'lavender', nameEn: 'Lavender', nameAr: 'خزامى', category: 'floral' },
  { id: 'rose', nameEn: 'Rose', nameAr: 'ورد', category: 'floral' },
  {
    id: 'cherry-blossom',
    nameEn: 'Cherry Blossom',
    nameAr: 'زهر الكرز',
    category: 'floral',
  },
  {
    id: 'magnolia',
    nameEn: 'Magnolia',
    nameAr: 'ماغنوليا',
    category: 'floral',
  },

  // Fresh & Citrus
  {
    id: 'lemongrass',
    nameEn: 'Lemongrass',
    nameAr: 'حشيشة الليمون',
    category: 'fresh-citrus',
  },
  {
    id: 'lemon',
    nameEn: 'Lemon',
    nameAr: 'ليمون',
    category: 'fresh-citrus',
  },
  {
    id: 'sweet-orange',
    nameEn: 'Sweet Orange',
    nameAr: 'برتقال حلو',
    category: 'fresh-citrus',
  },

  // Fruity
  {
    id: 'strawberry',
    nameEn: 'Strawberry',
    nameAr: 'فراولة',
    category: 'fruity',
  },
  {
    id: 'blueberry',
    nameEn: 'Blueberry',
    nameAr: 'توت أزرق',
    category: 'fruity',
  },
  { id: 'cherry', nameEn: 'Cherry', nameAr: 'كرز', category: 'fruity' },
  {
    id: 'passion-fruit',
    nameEn: 'Passion Fruit',
    nameAr: 'فاكهة العاطفة',
    category: 'fruity',
  },

  // Clean
  {
    id: 'white-musk',
    nameEn: 'White Musk',
    nameAr: 'مسك أبيض',
    category: 'clean',
  },

  // Warm & Sweet
  {
    id: 'warm-vanilla-sugar',
    nameEn: 'Warm Vanilla Sugar',
    nameAr: 'سكر الفانيليا الدافئ',
    category: 'warm',
  },
  { id: 'vanilla', nameEn: 'Vanilla', nameAr: 'فانيليا', category: 'warm' },
  {
    id: 'coconut-vanilla',
    nameEn: 'Coconut Vanilla',
    nameAr: 'جوز الهند والفانيليا',
    category: 'warm',
  },
  {
    id: 'helichrysum',
    nameEn: 'Helichrysum',
    nameAr: 'هيليكريسم',
    category: 'warm',
  },

  // Oriental / Luxury
  { id: 'oud', nameEn: 'Oud', nameAr: 'عود', category: 'oriental' },
  {
    id: 'frankincense',
    nameEn: 'Frankincense',
    nameAr: 'لبان',
    category: 'oriental',
  },

  // Unique
  { id: 'coffee', nameEn: 'Coffee', nameAr: 'قهوة', category: 'unique' },
]
