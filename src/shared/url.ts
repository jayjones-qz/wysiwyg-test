const LINK_PROTOCOLS = ['http:', 'https:', 'mailto:']
const IMAGE_PROTOCOLS = ['http:', 'https:']

function check(raw: string | null | undefined, protocols: string[]): string | null {
  const value = raw?.trim()
  if (!value) return null
  // Allow same-origin relative paths like /sample.svg
  if (value.startsWith('/') && !value.startsWith('//')) return value
  try {
    const url = new URL(value)
    return protocols.includes(url.protocol) ? url.href : null
  } catch {
    return null
  }
}

export const safeLinkUrl = (raw: string | null | undefined) => check(raw, LINK_PROTOCOLS)
export const safeImageUrl = (raw: string | null | undefined) => check(raw, IMAGE_PROTOCOLS)

export function promptUrl(kind: 'link' | 'image'): string | null {
  const raw = window.prompt(kind === 'link' ? 'Link URL (https://…)' : 'Image URL (https://… or /sample.svg)')
  if (raw === null) return null
  const url = kind === 'link' ? safeLinkUrl(raw) : safeImageUrl(raw)
  if (!url) window.alert('Rejected: only http(s)' + (kind === 'link' ? '/mailto' : '') + ' URLs are allowed.')
  return url
}
