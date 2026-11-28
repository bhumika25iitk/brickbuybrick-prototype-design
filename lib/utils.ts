import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

const BASE_PATH = process.env.NODE_ENV === 'production' ? '/brickbuybrick-prototype-design' : ''

export function assetPath(src: string) {
  if (!src.startsWith('/')) return src
  if (BASE_PATH && src.startsWith(BASE_PATH)) return src
  return `${BASE_PATH}${src}`
}
