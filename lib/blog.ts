import type { BlogPost } from './types'

export const blogPosts: BlogPost[] = [
  {
    slug: 'best-dog-bowl-for-large-dogs',
    title: 'The Best Dog Bowl for Large Dogs: What to Look For in 2024',
    excerpt:
      'Large dogs need more than just a big bowl. The right size, material, and height can make mealtimes healthier and more enjoyable. Here\'s everything you need to know.',
    content: '',
    category: 'Dog Feeding',
    image: 'https://images.unsplash.com/photo-1587300003388-59208cc962cb?w=1200&q=80',
    publishedAt: '2024-03-15',
    readTime: 6,
    tags: ['dog bowls', 'large dogs', 'feeding'],
  },
  {
    slug: 'elevated-dog-bowl-benefits',
    title: 'Why Vets Recommend Elevated Dog Bowls (And Who They\'re Best For)',
    excerpt:
      'Raised feeders aren\'t just a style choice — for certain dogs, they can genuinely improve digestion and reduce joint pain. We break down the science.',
    content: '',
    category: 'Dog Feeding',
    image: 'https://images.unsplash.com/photo-1601758174114-e711c0cbaa69?w=1200&q=80',
    publishedAt: '2024-03-08',
    readTime: 7,
    tags: ['elevated bowls', 'digestion', 'joint health'],
  },
  {
    slug: 'best-dog-bed-for-senior-dogs',
    title: 'The Best Dog Beds for Senior Dogs: Comfort That Supports Their Joints',
    excerpt:
      'Older dogs need more support as their bodies change. We look at what makes a dog bed genuinely good for seniors — and which styles to avoid.',
    content: '',
    category: 'Dog Beds',
    image: 'https://images.unsplash.com/photo-1541781774459-bb2af2f05b55?w=1200&q=80',
    publishedAt: '2024-02-28',
    readTime: 8,
    tags: ['senior dogs', 'dog beds', 'joint support'],
  },
  {
    slug: 'how-to-choose-a-dog-pool',
    title: 'How to Choose the Right Dog Pool: A Size Guide for Every Breed',
    excerpt:
      'Not all dog pools are created equal. The right size, depth, and material matter — especially for active dogs. Here\'s how to pick the perfect summer splash zone.',
    content: '',
    category: 'Dog Outdoor',
    image: 'https://images.unsplash.com/photo-1548199973-03cce0bbc87b?w=1200&q=80',
    publishedAt: '2024-02-19',
    readTime: 5,
    tags: ['dog pools', 'summer', 'outdoor'],
  },
  {
    slug: 'dog-travel-accessories',
    title: '10 Dog Travel Accessories Every Owner Should Have',
    excerpt:
      'Whether it\'s a road trip or a weekend hike, the right gear makes travelling with your dog safer and more enjoyable for both of you.',
    content: '',
    category: 'Dog Travel',
    image: 'https://images.unsplash.com/photo-1452570053594-1b985d6ea890?w=1200&q=80',
    publishedAt: '2024-02-10',
    readTime: 6,
    tags: ['travel', 'accessories', 'road trips'],
  },
  {
    slug: 'cat-feeding-station-ideas',
    title: 'Cat Feeding Station Ideas: How to Make Mealtimes Stylish and Stress-Free',
    excerpt:
      'A good feeding station isn\'t just about aesthetics — it can reduce whisker fatigue, prevent food competition, and keep your floor clean. Here are our favourite setups.',
    content: '',
    category: 'Cat Feeding',
    image: 'https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?w=1200&q=80',
    publishedAt: '2024-01-30',
    readTime: 5,
    tags: ['cat feeding', 'cat bowls', 'interior'],
  },
  {
    slug: 'best-bowls-for-messy-eaters',
    title: 'Best Dog Bowls for Messy Eaters: Stop the Food Scatter',
    excerpt:
      'Some dogs treat mealtimes like a food flinging contest. The right bowl design can genuinely reduce the mess — here\'s what works.',
    content: '',
    category: 'Dog Feeding',
    image: 'https://images.unsplash.com/photo-1534361960057-19f4434e03ee?w=1200&q=80',
    publishedAt: '2024-01-22',
    readTime: 5,
    tags: ['dog bowls', 'messy eaters', 'feeding tips'],
  },
  {
    slug: 'dog-feeding-guide-by-breed',
    title: 'Dog Feeding Guide by Breed: How Much, How Often, and Which Bowl',
    excerpt:
      'Feeding requirements vary enormously between breeds. We cover portion sizes, feeding frequency, and the right bowl setup for 20 popular breeds.',
    content: '',
    category: 'Dog Feeding',
    image: 'https://images.unsplash.com/photo-1583511655857-d19b40a7a54e?w=1200&q=80',
    publishedAt: '2024-01-14',
    readTime: 10,
    tags: ['feeding guide', 'dog breeds', 'nutrition'],
  },
]

export function getBlogPostBySlug(slug: string): BlogPost | undefined {
  return blogPosts.find((post) => post.slug === slug)
}

export function getRecentBlogPosts(count = 3): BlogPost[] {
  return blogPosts.slice(0, count)
}
