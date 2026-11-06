import { createElement, type ReactNode } from 'react'
import { CitationChip } from '../../shared/CitationChip'
import { MentionChip } from '../../shared/MentionChip'
import { safeImageUrl, safeLinkUrl } from '../../shared/url'

/**
 * Standalone renderer: BlockNote block JSON -> React, without loading the editor.
 * Loosely typed on purpose — it reads stored JSON, which may come from anywhere.
 */

type Json = Record<string, unknown>
type SBlock = { type: string; props?: Json; content?: unknown; children?: SBlock[] }
type SInline = { type: string; text?: string; styles?: Json; href?: string; content?: SInline[]; props?: Json }

function renderInline(node: SInline, key: number): ReactNode {
  switch (node.type) {
    case 'text': {
      const s = node.styles ?? {}
      let out: ReactNode = node.text ?? ''
      if (s.code) out = <code>{out}</code>
      if (s.backgroundColor && s.backgroundColor !== 'default') out = <mark>{out}</mark>
      if (s.strike) out = <s>{out}</s>
      if (s.underline) out = <u>{out}</u>
      if (s.italic) out = <em>{out}</em>
      if (s.bold) out = <strong>{out}</strong>
      return <span key={key}>{out}</span>
    }
    case 'link': {
      const href = safeLinkUrl(node.href)
      const children = node.content?.map(renderInline)
      return href ? (
        <a key={key} href={href} target="_blank" rel="noopener noreferrer">
          {children}
        </a>
      ) : (
        <span key={key}>{children}</span>
      )
    }
    case 'mention':
      return <MentionChip key={key} id={String(node.props?.id ?? '')} label={String(node.props?.label ?? '')} />
    case 'citation':
      return <CitationChip key={key} sourceId={String(node.props?.sourceId ?? '')} />
    default:
      return null
  }
}

function renderBlock(block: SBlock, key: number): ReactNode {
  const inline = Array.isArray(block.content) ? (block.content as SInline[]).map(renderInline) : null
  const children = block.children?.length ? (
    <div className="bn-r-children">{block.children.map(renderBlock)}</div>
  ) : null

  let el: ReactNode
  switch (block.type) {
    case 'heading': {
      const level = Math.min(Math.max(Number(block.props?.level) || 1, 1), 6)
      el = createElement(`h${level}`, null, inline)
      break
    }
    case 'paragraph':
      el = <p>{inline}</p>
      break
    case 'quote':
      el = <blockquote>{inline}</blockquote>
      break
    case 'bulletListItem':
      el = <ul><li>{inline}</li></ul>
      break
    case 'numberedListItem':
      el = <ol><li>{inline}</li></ol>
      break
    case 'image': {
      const src = safeImageUrl(String(block.props?.url ?? ''))
      const caption = String(block.props?.caption ?? '')
      el = src ? (
        <figure>
          <img src={src} alt={caption} />
          {caption && <figcaption>{caption}</figcaption>}
        </figure>
      ) : null
      break
    }
    default:
      el = inline ? <p>{inline}</p> : null
  }
  return (
    <div key={key}>
      {el}
      {children}
    </div>
  )
}

export function BlockNoteRenderer({ blocks }: { blocks: SBlock[] }) {
  return <>{blocks.map(renderBlock)}</>
}
