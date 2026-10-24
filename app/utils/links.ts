import type { NavigationMenuItem } from '@nuxt/ui'

export const navLinks: NavigationMenuItem[] = [{
  'label': 'Home',
  'data-testid': 'nav-link-home',
  'icon': 'i-lucide-home',
  'to': '/'
}, {
  'label': 'Subjects',
  'data-testid': 'nav-link-subjects',
  'icon': 'i-lucide-book-open',
  'to': '/subjects'
}, {
  'label': 'Events',
  'data-testid': 'nav-link-events',
  'icon': 'i-lucide-calendar',
  'to': '/events'
}, {
  'label': 'Blog',
  'data-testid': 'nav-link-blog',
  'icon': 'i-lucide-file-text',
  'to': '/blog'
}, {
  'label': 'About',
  'data-testid': 'nav-link-about',
  'icon': 'i-lucide-user',
  'to': '/about'
}]
