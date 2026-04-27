export const TITLE_PREFIX = 'Dr. Imam'
export const PERSON_NAME = `${TITLE_PREFIX} Shamsan`
export const PERSON_NAME_FULL = `${TITLE_PREFIX} Shamsan Al-Jabi`
export const PERSON_NAME_AR = 'الشيخ الدكتور شمسان الجابي'

/** Gallery image categories matching Notion's Category select property */
export const GALLERY_CATEGORIES = [
  'All',
  'Events',
  'Conferences',
  'Community',
  'Scholars',
  'Programs',
  'Flyers',
] as const

/** Article categories matching Notion's Category select property */
export const ARTICLE_CATEGORIES = [
  'Islamic Knowledge',
  'Quran/Hadith Commentary',
  'Ramadan/Eid',
  'Personal Reflections',
  'Islamic History',
] as const

/** Supported article languages */
export const ARTICLE_LANGUAGES = [
  'All',
  'English',
  'Arabic',
  'Bilingual',
] as const
