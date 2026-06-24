import Image from 'next/image'
import { Star } from 'lucide-react'

const reviews = [
  {
    id: '1',
    author: 'Lotte V.',
    location: 'Amsterdam',
    rating: 5,
    text: 'The mango wood bowl is even more beautiful in real life. My golden retriever loves it and it looks stunning in our kitchen. Already ordered one for my parents.',
    product: 'Mango Wood Dog Bowl 1L',
    avatar: 'https://i.pravatar.cc/60?img=11',
  },
  {
    id: '2',
    author: 'Thomas K.',
    location: 'Rotterdam',
    rating: 5,
    text: 'The elevated feeder has made such a difference. Our vet recommended raising food height for our older lab, and this fits perfectly under the kitchen counter.',
    product: 'Elevated Dog Feeder L',
    avatar: 'https://i.pravatar.cc/60?img=15',
  },
  {
    id: '3',
    author: 'Sophie M.',
    location: 'Utrecht',
    rating: 5,
    text: 'The Sambo dog bed is the first bed our rescue dog has stayed on all night! The removable cover is great for washing and the colour matches our interior perfectly.',
    product: 'Sambo Dog Bed — Sage',
    avatar: 'https://i.pravatar.cc/60?img=21',
  },
  {
    id: '4',
    author: 'Bas de W.',
    location: 'Den Haag',
    rating: 5,
    text: 'The foldable pool is brilliant. Takes 2 minutes to set up, my border collie was in it immediately. Ordered the 120 cm and it\'s perfect for him.',
    product: 'Foldable Dog Pool 120 cm',
    avatar: 'https://i.pravatar.cc/60?img=32',
  },
  {
    id: '5',
    author: 'Emma N.',
    location: 'Eindhoven',
    rating: 5,
    text: 'The cat feeder looks so much nicer than the plastic ones. My two cats took to it immediately, and I love how it fits in with my home decor.',
    product: 'Double Mango Wood Cat Feeder',
    avatar: 'https://i.pravatar.cc/60?img=44',
  },
  {
    id: '6',
    author: 'Joost P.',
    location: 'Groningen',
    rating: 4,
    text: 'Great travel water bottle — one-handed use works exactly as described. Essential for long hikes with my vizsla. The carabiner is sturdy and the seal is leak-proof.',
    product: 'Travel Water Bottle',
    avatar: 'https://i.pravatar.cc/60?img=53',
  },
]

export default function CustomerReviews() {
  return (
    <section className="py-16 md:py-24 bg-[#2C4A3E]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <p className="text-sm font-semibold text-[#C8745A] uppercase tracking-wider mb-2">Reviews</p>
          <h2 className="font-serif text-3xl md:text-4xl font-bold text-white">
            What pet owners say
          </h2>
          <div className="flex items-center justify-center gap-2 mt-4">
            <div className="flex items-center gap-1">
              {[1, 2, 3, 4, 5].map((i) => (
                <Star key={i} size={16} className="fill-[#C8745A] text-[#C8745A]" />
              ))}
            </div>
            <span className="text-white/70 text-sm">4.8 average · 1,200+ reviews on Bol.com</span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {reviews.map((review) => (
            <div
              key={review.id}
              className="bg-white/10 backdrop-blur-sm border border-white/15 rounded-2xl p-5 hover:bg-white/15 transition-colors"
            >
              <div className="flex items-center gap-1 mb-3">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star
                    key={i}
                    size={14}
                    className={i < review.rating ? 'fill-[#C8745A] text-[#C8745A]' : 'fill-white/20 text-white/20'}
                  />
                ))}
              </div>
              <p className="text-white/90 text-sm leading-relaxed mb-4">"{review.text}"</p>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <Image
                    src={review.avatar}
                    alt={review.author}
                    width={36}
                    height={36}
                    className="rounded-full"
                  />
                  <div>
                    <p className="text-white font-medium text-sm">{review.author}</p>
                    <p className="text-white/50 text-xs">{review.location}</p>
                  </div>
                </div>
                <span className="text-white/40 text-xs text-right max-w-[120px] leading-tight">
                  {review.product}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
