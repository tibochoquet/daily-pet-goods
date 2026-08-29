import { NextResponse } from 'next/server'
import { generateWithdrawalFormText } from '@/lib/withdrawal-form'

/** Serves the model withdrawal form as a downloadable .txt file, generated fresh from lib/business.ts on every request. */
export async function GET() {
  return new NextResponse(generateWithdrawalFormText(), {
    headers: {
      'Content-Type': 'text/plain; charset=utf-8',
      'Content-Disposition': 'attachment; filename="modelformulier-herroeping.txt"',
    },
  })
}
