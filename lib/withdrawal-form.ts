import { business } from './business'

/**
 * The statutory Dutch/EU model withdrawal form (Bijlage I, deel B van
 * Richtlijn 2011/83/EU / het ACM-modelformulier voor herroeping). This is
 * fixed, standardized template text every webshop uses verbatim - not
 * bespoke legal copy - only the trader's own details are filled in here.
 * Generated from lib/business.ts so the page and the download always
 * match and never drift out of sync with each other.
 */
export function generateWithdrawalFormText(): string {
  const addressLine = business.address ?? '[TODO: geografisch adres nog invullen]'

  return `Modelformulier voor herroeping
(dit formulier alleen invullen en terugzenden als u de overeenkomst wilt herroepen)

Aan:
${business.tradingName} (handelend onder de naam ${business.brandName})
${addressLine}
${business.email}

Ik/Wij (*) deel/delen (*) u hierbij mede dat ik/wij (*) onze overeenkomst betreffende
de verkoop van de volgende goederen herroep/herroepen (*):

Besteld op (*)/ontvangen op (*): _______________________

Naam consument(en): _______________________

Adres consument(en): _______________________

Handtekening van consument(en) (alleen wanneer dit formulier op papier wordt ingediend):
_______________________

Datum: _______________________

(*) Doorhalen wat niet van toepassing is.
`
}
