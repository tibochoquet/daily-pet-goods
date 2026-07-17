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

  /** Category tile — dachshund with elevated wood feeders. Used: homepage "Shop per categorie" tile. */
  dogBowlsCover: '/assets/images/hondenbakken_cover.png',

  /** Category tile — grey cat with mango wood feeding station. Used: homepage "Shop per categorie" tile. */
  catBowlsCover: '/assets/images/kattenbakken_cover.png',

  /** Category tile — golden retrievers in donut/lounge beds. Used: homepage "Shop per categorie" tile. */
  dogBedsCover: '/assets/images/hondenmanden_cover.png',

  /** Category tile — dachshund in car with travel cover & bottle. Used: homepage "Shop per categorie" tile. */
  dogTravelCover: '/assets/images/travel_cover.png',

  /** Category tile — dachshund beside foldable pool & cooling mats in garden. Used: homepage "Shop per categorie" tile. */
  dogPoolsCover: '/assets/images/zwembaden-koelmat.png',

  /** Category tile — tabby cat lying on a cooling mat. Used: homepage "Shop per categorie" cat cooling tile. */
  catCoolingCover: '/assets/images/koelmatkat.png',

  /** General lifestyle scene — dog bed, cat and bowls. Used: WhyChooseUs section background. */
  lifestyleGeneral: '/assets/images/vanalles.png',
} as const

export type BrandImageKey = keyof typeof brandImages
