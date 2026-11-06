import { SEED, type Inline } from '../../shared/seed'

const WRAP = { bold: '**', italic: '*', highlight: '==' } as const

function inline(node: Inline): string {
  if ('mention' in node) return `:mention{#${node.mention}}`
  if ('cite' in node) return `:cite{#${node.cite}}`
  if ('link' in node) return `[${node.text}](${node.link})`
  return (node.marks ?? []).reduce((s, m) => `${WRAP[m]}${s}${WRAP[m]}`, node.text)
}

export const SEED_MARKDOWN = SEED.map((b) => {
  switch (b.type) {
    case 'heading':
      return `${'#'.repeat(b.level)} ${b.text}`
    case 'paragraph':
      return b.content.map(inline).join('')
    case 'quote':
      return `> ${b.content.map(inline).join('')}`
    case 'image':
      return `![${b.alt}](${b.src})`
  }
}).join('\n\n') + '\n'
