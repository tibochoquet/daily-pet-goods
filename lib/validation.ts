/** Shared across every route that accepts a raw email address from a form. */
export const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

export function isValidEmail(email: unknown): email is string {
  return typeof email === 'string' && EMAIL_PATTERN.test(email.trim())
}
