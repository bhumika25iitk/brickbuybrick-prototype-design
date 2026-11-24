import type { Property } from './types'

export const LAKH = 100_000
export const CRORE = 10_000_000
export const INTEREST_RATE = 8.6
export const STAMP_DUTY_PCT = 0.06
export const REGISTRATION_PCT = 0.01
export const GST_ON_BROKERAGE = 0.18
export const LOAN_TO_VALUE = 0.75

export function formatINR(value: number, opts: { long?: boolean } = {}) {
  const sign = value < 0 ? '-' : ''
  const v = Math.abs(value)
  if (v >= CRORE) {
    const cr = (v / CRORE).toFixed(2).replace(/\.?0+$/, '')
    return `${sign}Rs ${cr} Cr`
  }
  if (v >= LAKH) {
    const l = (v / LAKH).toFixed(1).replace(/\.0$/, '')
    return `${sign}Rs ${l}${opts.long ? ' Lakh' : ' L'}`
  }
  return `${sign}Rs ${Math.round(v).toLocaleString('en-IN')}`
}

export function formatRupees(value: number) {
  return `Rs ${Math.round(value).toLocaleString('en-IN')}`
}

export function formatRent(value: number) {
  const v = Math.abs(value)
  if (v >= LAKH) {
    const l = (v / LAKH).toFixed(1).replace(/\.0$/, '')
    return `Rs ${l} L/mo`
  }
  return `Rs ${Math.round(v / 1000)}k/mo`
}

export function costBreakdown(p: Property) {
  const base = p.basePrice
  const stampDuty = base * STAMP_DUTY_PCT
  const registration = base * REGISTRATION_PCT
  const brokerage = base * p.rep.brokeragePct
  const gst = brokerage * GST_ON_BROKERAGE
  const other = p.otherCharges
  const allIn = base + stampDuty + registration + brokerage + gst + other
  return { base, stampDuty, registration, brokerage, gst, other, allIn }
}

export function capCost(p: Property, includeStamp: boolean) {
  const c = costBreakdown(p)
  return includeStamp ? c.allIn : c.allIn - c.stampDuty - c.registration
}

export function tenureForAge(age: string) {
  if (age === '35+') return 20
  if (age === '31-35') return 25
  return 30
}

export function monthlyEmi(principal: number, years: number, rate = INTEREST_RATE) {
  const r = rate / 12 / 100
  const n = years * 12
  return (principal * r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1)
}

export function loanFor(p: Property) {
  return p.basePrice * LOAN_TO_VALUE
}

export function emiFor(p: Property, age: string) {
  return monthlyEmi(loanFor(p), tenureForAge(age))
}

export function downPaymentFor(p: Property) {
  return costBreakdown(p).allIn - loanFor(p)
}
