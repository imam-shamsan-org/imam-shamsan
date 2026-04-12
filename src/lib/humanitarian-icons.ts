import {
  Baby,
  BookOpen,
  BriefcaseMedical,
  Building2,
  ChefHat,
  CircleDot,
  Drill,
  Droplets,
  GraduationCap,
  HandHeart,
  Heart,
  HeartPulse,
  Home,
  Moon,
  ScrollText,
  ShieldAlert,
  Shirt,
  Soup,
  Star,
  Stethoscope,
  Syringe,
  Tent,
  Truck,
  Users,
  Utensils,
  Wheat,
} from 'lucide-react'
import type { LucideIcon } from 'lucide-react'
import type { HumanitarianProject } from '@/types/humanitarian'

/**
 * Maps the string value stored in the Notion `Icon` field to a Lucide icon component.
 * The Imam sets one of these keys in the "Icon" text property of each project.
 *
 * Full list of supported keys:
 *   stethoscope, droplets, utensils, graduation-cap, home, book-open, truck,
 *   heart, users, hand-heart, wheat, chef-hat, shield-alert, baby, moon, star,
 *   building, shirt, syringe, heart-pulse, tent, soup, drill, scroll, rings,
 *   medical-bag
 */
export const iconRegistry: Record<string, LucideIcon> = {
  stethoscope: Stethoscope,
  droplets: Droplets,
  utensils: Utensils,
  'graduation-cap': GraduationCap,
  home: Home,
  'book-open': BookOpen,
  truck: Truck,
  heart: Heart,
  users: Users,
  'hand-heart': HandHeart,
  wheat: Wheat,
  'chef-hat': ChefHat,
  'shield-alert': ShieldAlert,
  baby: Baby,
  moon: Moon,
  star: Star,
  building: Building2,
  shirt: Shirt,
  syringe: Syringe,
  'heart-pulse': HeartPulse,
  tent: Tent,
  soup: Soup,
  drill: Drill,
  scroll: ScrollText,
  rings: CircleDot,
  'medical-bag': BriefcaseMedical,
}

/** Category-based fallback icons when the Icon field is empty or unrecognised */
const categoryDefaults: Record<HumanitarianProject['category'], LucideIcon> = {
  Medical: Stethoscope,
  Food: Utensils,
  Water: Droplets,
  Education: GraduationCap,
  Family: Home,
  Religious: BookOpen,
}

/**
 * Returns the best Lucide icon for a project.
 * Priority: explicit icon key → category default
 */
export function getProjectIcon(
  iconKey: string | undefined,
  category: HumanitarianProject['category'],
): LucideIcon {
  if (iconKey) {
    const found = iconRegistry[iconKey.toLowerCase().trim()]
    if (found) return found
  }
  return categoryDefaults[category]
}
