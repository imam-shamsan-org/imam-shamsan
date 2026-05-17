export type PerfumeProduct = {
  id: string
  name: string
  nameAr: string
  taglineEn: string
  taglineAr: string
  ingredientsEn: Array<string>
  ingredientsAr: Array<string>
  moodEn: string
  moodAr: string
  colorAccent:
    | 'yellow'
    | 'brown'
    | 'orange'
    | 'teal'
    | 'pink'
    | 'red'
    | 'green'
    | 'blue'
  photo: string | null
  sortOrder: number
}

export type NoteCategory =
  | 'floral'
  | 'fresh-citrus'
  | 'fruity'
  | 'clean'
  | 'warm'
  | 'oriental'
  | 'unique'

export type AvailableNote = {
  id: string
  nameEn: string
  nameAr: string
  category: NoteCategory
}
