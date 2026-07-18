/**
 * Central image registry for Daily Pet Goods.
 * All brand images live in /public/assets/images/.
 * Each image is used exactly once - update paths here to swap.
 */

export const brandImages = {
  /** Homepage hero - golden retriever on dark grey lounge bed, grey cat beside him. Used: homepage hero only. */
  heroMain: '/assets/images/heromain.jpeg',

  /** Flat-lay of premium pet accessories: bed, bag, harness, bowls, leash. Used: editorial section homepage. */
  accessories: '/assets/images/accecoires.jpeg',

  /** Lifestyle - golden retriever on cream lounge bed, grey cat on armchair. Used: about page hero. */
  lifestyleHero: '/assets/images/lifestyle-hero.png',

  /** Feeding scene - dog + cat eating from elevated wood/steel feeders. Used: dog bowls category. */
  feedingHero: '/assets/images/feeding-hero.jpg',

  /** Travel scene - woman with golden retriever on harness, car & collapsible bowl. Used: dog travel category. */
  travelHero: '/assets/images/travel-hero.jpg',

  /** Dachshund with elevated wood feeders. Used: /honden hondenbakken section hero. */
  dogBowlsCover: '/assets/images/hondenbakken_cover.png',

  /** Grey cat with mango wood feeding station. Used: /katten kattenbakken section hero. */
  catBowlsCover: '/assets/images/kattenbakken_cover.png',

  /** Golden retrievers in donut/lounge beds. Used: /honden hondenmanden section hero. */
  dogBedsCover: '/assets/images/hondenmanden_cover.png',

  /** Dachshund in car with travel cover & bottle. Used: /honden onderweg section hero. */
  dogTravelCover: '/assets/images/travel_cover.png',

  /** Dachshund beside foldable pool & cooling mats in garden. Used: /honden zwembaden section hero. */
  dogPoolsCover: '/assets/images/zwembaden-koelmat.png',

  /** Tabby cat lying on a cooling mat. Used: /katten koelmatten section hero. */
  catCoolingCover: '/assets/images/koelmatkat.png',

  /** General lifestyle scene - dog bed, cat and bowls. Used: shop page hero. */
  lifestyleGeneral: '/assets/images/vanalles.png',

  /** Golden retriever asleep in a donut bed, feeding station in the background. Used: homepage "Honden" category tile. */
  hondenTile: '/assets/images/honden_cover.png',

  /** Grey British Shorthair beside a mango wood feeding station. Used: homepage "Katten" category tile. */
  kattenTile: '/assets/images/katten_cover.png',
} as const

export type BrandImageKey = keyof typeof brandImages
