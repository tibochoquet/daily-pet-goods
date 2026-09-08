'use client'

import { useEffect } from 'react'
import { trackConversion, PURCHASE_CONVERSION } from '@/lib/gtag'

interface ConversionTrackerProps {
  value: number
  transactionId: string
}

/**
 * Fires the Google Ads purchase conversion once per mount. Safe to fire on
 * every load of the success page, even a reload or a revisit - Google Ads
 * deduplicates conversions by transaction_id, so repeating the same order
 * reference never double-counts it.
 */
export default function ConversionTracker({ value, transactionId }: ConversionTrackerProps) {
  useEffect(() => {
    trackConversion(PURCHASE_CONVERSION, value, 'EUR', transactionId)
  }, [value, transactionId])

  return null
}
