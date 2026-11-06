import { ReactNodeViewRenderer, ReactRenderer } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import Highlight from '@tiptap/extension-highlight'
import Image from '@tiptap/extension-image'
import Mention, { type MentionNodeAttrs } from '@tiptap/extension-mention'
import type { SuggestionOptions } from '@tiptap/suggestion'
import { getEntity, searchEntities, type Entity } from '../../shared/entities'
import { safeLinkUrl } from '../../shared/url'
import { MentionList, type MentionListHandle } from './MentionList'
import { MentionView } from './MentionView'
import { Citation } from './Citation'

type MentionAttrs = MentionNodeAttrs

const suggestion: Omit<SuggestionOptions<Entity, MentionAttrs>, 'editor'> = {
  char: '@',
  items: ({ query }) => searchEntities(query),
  render: () => {
    let renderer: ReactRenderer<MentionListHandle> | null = null

    const place = (rect: DOMRect | null | undefined) => {
      if (!renderer || !rect) return
      const el = renderer.element as HTMLElement
      el.style.position = 'fixed'
      el.style.left = `${rect.left}px`
      el.style.top = `${rect.bottom + 4}px`
      el.style.zIndex = '50'
    }

    return {
      onStart: (props) => {
        renderer = new ReactRenderer(MentionList, { props, editor: props.editor })
        document.body.appendChild(renderer.element)
        place(props.clientRect?.())
      },
      onUpdate: (props) => {
        renderer?.updateProps(props)
        place(props.clientRect?.())
      },
      onKeyDown: ({ event }) => {
        if (event.key === 'Escape') return false
        return renderer?.ref?.onKeyDown(event) ?? false
      },
      onExit: () => {
        renderer?.element.remove()
        renderer?.destroy()
        renderer = null
      },
    }
  },
}

/** Shared by the editor and the static renderer so both agree on the schema. */
export const extensions = [
  StarterKit.configure({
    link: {
      openOnClick: false,
      defaultProtocol: 'https',
      isAllowedUri: (url) => safeLinkUrl(url) !== null,
    },
  }),
  Highlight,
  Image,
  Mention.extend({
    addNodeView() {
      return ReactNodeViewRenderer(MentionView)
    },
    // Markdown round-trip (used only when the Markdown extension is loaded):
    // `:mention[Label]{#id}` — same directive syntax remark-directive parses.
    markdownTokenizer: {
      name: 'mention',
      level: 'inline',
      start: (src: string) => src.indexOf(':mention'),
      tokenize(src: string) {
        const m = /^:mention(?:\[([^\]]*)\])?\{#([\w-]+)\}/.exec(src)
        if (m) return { type: 'mention', raw: m[0], id: m[2], label: m[1] ?? '' }
      },
    },
    parseMarkdown: (token, h) =>
      h.createNode('mention', { id: token.id, label: token.label || getEntity(token.id)?.label || token.id }),
    renderMarkdown: (node) => `:mention[${node.attrs?.label ?? ''}]{#${node.attrs?.id ?? ''}}`,
  }).configure({ suggestion }),
  Citation,
]
