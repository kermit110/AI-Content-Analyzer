import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

/**
 * Utility function to merge Tailwind CSS classes
 * Combines clsx for conditional classes and tailwind-merge for deduplication
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// Usage examples:
// cn('px-2 py-1', 'bg-red-500', { 'text-white': true })
// cn('px-2 py-1', condition && 'bg-blue-500')
// cn('px-2', 'px-4') // Results in 'px-4' (tailwind-merge deduplicates)