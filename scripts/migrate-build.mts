/**
 * Draait de migraties tijdens een build, maar alleen waar dat veilig is.
 *
 * Het buildcommando stond op `npm run db:migrate && npm run build`, en
 * dat liep bij elke build - ook die van een previewdeploy. Omdat Preview
 * dezelfde DATABASE_URL had als Production, heeft een previewbuild de
 * migraties tegen de productiedatabase gedraaid. Dat is goed afgelopen,
 * want het waren alleen nieuwe tabellen, maar het had net zo goed een
 * ALTER TABLE kunnen zijn.
 *
 * Regel: alleen een productiebuild migreert. Een previewbuild slaat het
 * over, tenzij je er bewust ALLOW_PREVIEW_MIGRATE=1 bij zet - dat doe je
 * pas als Preview een eigen database heeft.
 */
import { spawnSync } from 'node:child_process'

const omgeving = process.env.VERCEL_ENV || 'lokaal'
const magToch = process.env.ALLOW_PREVIEW_MIGRATE === '1'

function hostVan(url: string | undefined): string {
  return url?.match(/@([^/]+)\//)?.[1] ?? '(geen url)'
}

function migreer(): never {
  const url = process.env.DATABASE_URL?.trim()
  if (!url) {
    console.error('Geen DATABASE_URL om tegen te migreren.')
    process.exit(1)
  }
  process.env.DATABASE_URL = url
  // Zonder deze regel is een mislukte migratie in de buildlog niet te
  // duiden: je ziet alleen "exited with 1" zonder te weten waarheen.
  console.log(`Migreren tegen: ${hostVan(url)}`)
  const r = spawnSync('npx', ['drizzle-kit', 'migrate'], { stdio: 'inherit' })
  if (r.status !== 0) {
    console.error(`Migreren mislukt tegen ${hostVan(url)} (exitcode ${r.status}).`)
  }
  process.exit(r.status ?? 1)
}

if (omgeving === 'production') {
  console.log('Productiebuild: migraties worden toegepast.')
  migreer()
}

if (omgeving === 'preview') {
  if (magToch) {
    if (!process.env.PREVIEW_DATABASE_URL?.trim()) {
      console.error(
        'ALLOW_PREVIEW_MIGRATE=1 staat aan, maar PREVIEW_DATABASE_URL ontbreekt.\n' +
          'Dan zou deze previewbuild migreren tegen de productiedatabase. Geweigerd.'
      )
      process.exit(1)
    }
    console.log('Previewbuild met eigen database: migraties worden toegepast.')
    process.env.DATABASE_URL = process.env.PREVIEW_DATABASE_URL.trim()
    migreer()
  }
  console.log(
    'Previewbuild: migraties overgeslagen.\n' +
      'Zet ALLOW_PREVIEW_MIGRATE=1 op Preview zodra die omgeving een eigen database heeft.'
  )
  process.exit(0)
}

// Lokaal of een onbekende omgeving: gewoon draaien, daar kies je zelf
// welke database in DATABASE_URL staat.
console.log(`Omgeving "${omgeving}": migraties worden toegepast.`)
migreer()
