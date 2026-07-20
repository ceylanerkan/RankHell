import { clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

// shadcn'in standart className birleştiricisi: koşullu sınıfları düzleştirir
// (clsx) ve çakışan Tailwind sınıflarını çözer (tailwind-merge).
export function cn(...inputs) {
  return twMerge(clsx(inputs))
}
