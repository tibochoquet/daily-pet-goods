import { readFileSync } from 'node:fs'

/** Leest .env.local zonder dotenv, met correcte afhandeling van aanhalingstekens. */
export function readEnvLocal(pad = '.env.local'): Record<string, string> {
  const out: Record<string, string> = {}
  for (const regel of readFileSync(pad, 'utf8').split('\n')) {
    const m = regel.match(/^\s*([A-Za-z_][A-Za-z0-9_]*)\s*=\s*(.*)\s*$/)
    if (!m) continue
    let waarde = m[2].trim()
    if ((waarde.startsWith('"') && waarde.endsWith('"')) || (waarde.startsWith("'") && waarde.endsWith("'"))) {
      waarde = waarde.slice(1, -1)
    }
    out[m[1]] = waarde
  }
  return out
}
