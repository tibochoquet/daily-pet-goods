import type { BlogPost } from './types'

/**
 * Empty on purpose - the previous placeholder posts were fake/AI-sample
 * content, not real articles, and were pulled before launch. Add real
 * posts here as they're written.
 */
export const blogPosts: BlogPost[] = []

export function getBlogPostBySlug(slug: string): BlogPost | undefined {
  return blogPosts.find((post) => post.slug === slug)
}
