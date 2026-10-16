/** Bedragen altijd in centen, zoals Stripe ze ook geeft. */
export type Cents = number;

export interface Address {
  name: string;
  line1: string;
  line2?: string | null;
  postalCode: string;
  city: string;
  country: string; // 'NL' | 'BE'
}

export interface OrderItem {
  name: string;
  variant?: string | null; // bijv. 'Maat M'
  quantity: number;
  unitAmount: Cents;
  imageUrl?: string | null; // absoluut, of een pad als '/assets/products/…/img_1.jpg'
  slug?: string | null; // voor de reviewlink, bijv. 'verhoogde-hondenbak'
}

export interface OrderEmailData {
  orderNumber: string;
  placedAt: Date | string;
  firstName: string;
  email: string;
  shippingAddress: Address;
  items: OrderItem[];
  subtotal: Cents;
  shippingCost: Cents; // 0 = gratis
  discount?: Cents | null;
  total: Cents;
  /** Alleen invullen zodra je niet meer onder de KOR valt; dan verschijnt de btw-regel vanzelf. */
  vatAmount?: Cents | null;
  paymentMethod?: string | null; // 'iDEAL', 'Bancontact', 'Klarna', 'Visa •••• 4242'
  petType?: 'hond' | 'kat' | null; // bepaalt foto en tekst bij het cadeautje in de doos
  orderUrl: string; // deep link naar /mijn-bestelling
}

export interface ShipmentData {
  carrier: string; // 'DHL' | 'DPD' | 'PostNL'
  trackingNumber: string;
  trackingUrl: string;
  expectedDelivery?: Date | string | null;
}

export interface ReviewInviteData {
  /** Getokeniseerde link naar /review, gekoppeld aan deze bestelling (geverifieerde koper). */
  reviewUrl: string;
  unsubscribeUrl: string;
}

export interface RenderedEmail {
  subject: string;
  preheader: string;
  html: string;
  text: string;
}
