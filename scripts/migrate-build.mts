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

function migreer(): never {
  const r = spawnSync('npx', ['drizzle-kit', 'migrate'], { stdio: 'inherit' })
  process.exit(r.status ?? 1)
}

if (omgeving === 'production') {
  console.log('Productiebuild: migraties worden toegepast.')
  migreer()
}

if (omgeving === 'preview') {
  if (magToch) {
    if (!process.env.PREVIEW_DATABASE_URL) {
      console.error(
        'ALLOW_PREVIEW_MIGRATE=1 staat aan, maar PREVIEW_DATABASE_URL ontbreekt.\n' +
          'Dan zou deze previewbuild migreren tegen de productiedatabase. Geweigerd.'
      )
      process.exit(1)
    }
    console.log('Previewbuild met eigen database: migraties worden toegepast.')
    process.env.DATABASE_URL = process.env.PREVIEW_DATABASE_URL
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
