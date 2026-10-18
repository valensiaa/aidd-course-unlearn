/**
 * Split a heading so its last `count` words can get the brand gradient,
 * e.g. "How Mentora works" → { lead: 'How Mentora', highlight: 'works' }.
 */
export function highlightTitle(title: string, count = 1) {
  const words = title.split(' ')
  const split = Math.max(words.length - count, 0)
  return {
    lead: words.slice(0, split).join(' '),
    highlight: words.slice(split).join(' ')
  }
}
