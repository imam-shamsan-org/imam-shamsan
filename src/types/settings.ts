export interface SiteSettingEntry {
  value: string
  updatedAt: string
  duration?: string
}

export type SiteSettings = Record<string, SiteSettingEntry>
