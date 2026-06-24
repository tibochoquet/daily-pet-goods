/**
 * Central image registry for Daily Pet Goods.
 * All brand images live in /public/assets/images/.
 * Each image is used exactly once — update paths here to swap.
 */

export const brandImages = {
  /** Homepage hero — golden retriever on dark grey lounge bed, grey cat beside him. Used: homepage hero only. */
  heroMain: '/assets/images/heromain.jpeg',

  /** Flat-lay of premium pet accessories: bed, bag, harness, bowls, leash. Used: editorial section homepage. */
  accessories: '/assets/images/accecoires.jpeg',

  /** Lifestyle — golden retriever on cream lounge bed, grey cat on armchair. Used: about page hero. */
  lifestyleHero: '/assets/images/lifestyle-hero.png',

  /** Feeding scene — dog + cat eating from elevated wood/steel feeders. Used: dog bowls category. */
  feedingHero: '/assets/images/feeding-hero.jpg',

  /** Travel scene — woman with golden retriever on harness, car & collapsible bowl. Used: dog travel category. */
  travelHero: '/assets/images/travel-hero.jpg',
} as const

export type BrandImageKey = keyof typeof brandImages
