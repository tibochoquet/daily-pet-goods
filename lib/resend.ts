import 'server-only'
import { Resend } from 'resend'

/**
 * Eén plek voor het versturen van mail.
 *
 * `resend.emails.send()` gooit niet bij een fout - het levert gewoon
 * `{ data: null, error }` op. Een try/catch eromheen mist dat dus
 * stilletjes; de fout moet expliciet gecontroleerd worden. Dat is de
 * reden dat deze functie bestaat en niemand de SDK rechtstreeks
 * aanroept.
 */
export async function sendResendEmail(payload: Parameters<Resend['emails']['send']>[0]) {
  const resend = new Resend(process.env.RESEND_API_KEY)
  const { error } = await resend.emails.send(payload)
  if (error) {
    throw new Error(`Resend gaf een fout terug: ${error.message}`)
  }
}
