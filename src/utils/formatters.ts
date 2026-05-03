import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatPrice(price: number): string {
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(price)
}

export function formatChange(change: number): string {
  const sign = change >= 0 ? '+' : ''
  return `${sign}${change.toFixed(2)}`
}

export function formatPercent(pct: number): string {
  const sign = pct >= 0 ? '+' : ''
  return `${sign}${pct.toFixed(2)}%`
}

export function formatVolume(vol: number): string {
  if (vol >= 1_000_000_000) return `${(vol / 1_000_000_000).toFixed(2)}B`
  if (vol >= 1_000_000) return `${(vol / 1_000_000).toFixed(2)}M`
  if (vol >= 1_000) return `${(vol / 1_000).toFixed(1)}K`
  return String(vol)
}

export function formatMarketCap(mc: number): string {
  if (mc >= 1_000_000_000_000) return `$${(mc / 1_000_000_000_000).toFixed(2)}T`
  if (mc >= 1_000_000_000) return `$${(mc / 1_000_000_000).toFixed(2)}B`
  if (mc >= 1_000_000) return `$${(mc / 1_000_000).toFixed(2)}M`
  return `$${mc.toLocaleString()}`
}

export function formatTimeAgo(timestamp: number): string {
  const now = Date.now()
  const ts = timestamp > 1e12 ? timestamp : timestamp * 1000
  const diff = Math.floor((now - ts) / 1000)
  if (diff < 60) return `${diff}s ago`
  if (diff < 3600) return `${Math.floor(diff / 60)}m ago`
  if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`
  return `${Math.floor(diff / 86400)}d ago`
}

export function colorClass(value: number) {
  return value >= 0 ? 'text-up' : 'text-down'
}

export function bgColorClass(value: number) {
  return value >= 0 ? 'bg-up/10 text-up' : 'bg-down/10 text-down'
}
