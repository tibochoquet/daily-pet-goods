'use client'

import { createContext, useContext, useState, type ReactNode } from 'react'

/**
 * Onthoudt welke maat de bezoeker koos, zodat hij die houdt als hij naar
 * dezelfde jas in een andere kleur gaat.
 *
 * Elke kleur is een eigen pagina - zo blijft elke kleur vindbaar in het
 * overzicht en in Google - maar een nieuwe pagina betekent een nieuwe
 * React-boom, en dus een maatkiezer die weer op de eerste maat staat.
 * Dat is precies het moment waarop iemand denkt "waar is mijn jas
 * gebleven": de foto's verschillen per maat, dus je kijkt ineens naar
 * een chihuahua in plaats van een schnauzer.
 *
 * Dit hangt daarom boven de route, in de layout: die blijft staan
 * terwijl de pagina eronder wisselt. Bewust geen sessionStorage of
 * ?maat= in de URL. Die worden ook bij een gewone paginalading gelezen,
 * en dan toont de server een andere maat dan de browser er daarna van
 * maakt - een verschil dat React bij hydratie opmerkt. Deze waarde
 * bestaat alleen na een klik, en dan is er geen hydratie meer.
 *
 * De keuze geldt alleen binnen één kleurgroep, en dus niet voor de rest
 * van de winkel. Anders zou een bezoeker die hier M koos, een heel
 * andere jas geopend zien op M - en als die maat daar uitverkocht is,
 * landt hij op "Tijdelijk uitverkocht" terwijl hij niet eens om die maat
 * gevraagd heeft.
 */
interface MaatKeuze {
  /** `color.group` van het product waar de maat gekozen is. */
  groep: string
  /** Het label zoals het in de kiezer staat: "M", of "S (25 cm)". */
  maat: string
}

const SizeMemory = createContext<{
  keuze: MaatKeuze | null
  onthoudMaat: (keuze: MaatKeuze) => void
} | null>(null)

export function SizeMemoryProvider({ children }: { children: ReactNode }) {
  const [keuze, setKeuze] = useState<MaatKeuze | null>(null)
  return <SizeMemory.Provider value={{ keuze, onthoudMaat: setKeuze }}>{children}</SizeMemory.Provider>
}

/**
 * Null buiten de provider, zodat een component die hem toevallig mist
 * gewoon zijn eigen eerste maat kiest in plaats van stuk te lopen.
 */
export function useSizeMemory() {
  return useContext(SizeMemory)
}
