import type { NavigationMenuItem } from '@nuxt/ui'

export const navLinks: NavigationMenuItem[] = [{
  label: 'Home',
  icon: 'i-lucide-home',
  to: '/'
}, {
  label: 'Subjects',
  icon: 'i-lucide-book-open',
  to: '/subjects'
}, {
  label: 'Events',
  icon: 'i-lucide-calendar',
  to: '/events'
}, {
  label: 'Blog',
  icon: 'i-lucide-file-text',
  to: '/blog'
}, {
  label: 'About',
  icon: 'i-lucide-user',
  to: '/about'
}]
