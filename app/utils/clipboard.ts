import type { Toast } from '@nuxt/ui/composables/useToast'

export function copyToClipboard(toCopy: string, message: string = 'Copied to clipboard') {
  const toast = useToast()
  navigator.clipboard.writeText(toCopy).then(() => {
    toast.add({ 'title': message, 'color': 'success', 'icon': 'i-lucide-check-circle', 'data-testid': 'toast' } as Partial<Toast>)
  })
}
