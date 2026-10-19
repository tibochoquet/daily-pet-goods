/**
 * Instellingen rond reviews, op één plek.
 *
 * De termijn stond eerder alleen in de cron-route. Hij komt ook terug in
 * wat we klanten vertellen, dus hij hoort hier te staan en nergens
 * anders hardgecodeerd te worden.
 */

/** Aantal dagen na verzending voordat we om een review vragen. */
export const REVIEW_REQUEST_DAYS_AFTER_SHIPPING = 5

/** Hoeveel reviewmails de cron per keer verstuurt, oudste eerst. */
export const REVIEW_EMAILS_PER_CRON_RUN = 15

/** Resend staat een paar mails per seconde toe; dit houdt daar ruim marge op. */
export const REVIEW_EMAIL_PAUSE_MS = 400

export const REVIEW_STATUSES = ['pending', 'published', 'rejected'] as const
export type ReviewStatus = (typeof REVIEW_STATUSES)[number]

/** Wat we aan foto's accepteren. Serverside gecontroleerd, niet alleen in de browser. */
export const PHOTO_MAX_BYTES = 5 * 1024 * 1024
export const PHOTO_TYPES = ['image/jpeg', 'image/png', 'image/heic', 'image/heif', 'image/webp'] as const

export function isAllowedPhotoType(type: string): boolean {
  return (PHOTO_TYPES as readonly string[]).includes(type.toLowerCase())
}

export const MAX_NAME_LENGTH = 80
export const MAX_TEXT_LENGTH = 2000
