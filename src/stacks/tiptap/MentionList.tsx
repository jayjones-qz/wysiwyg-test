import { forwardRef, useImperativeHandle, useState } from 'react'
import type { SuggestionProps } from '@tiptap/suggestion'
import type { MentionNodeAttrs } from '@tiptap/extension-mention'
import type { Entity } from '../../shared/entities'

export interface MentionListHandle {
  onKeyDown: (event: KeyboardEvent) => boolean
}

type Props = SuggestionProps<Entity, MentionNodeAttrs>

export const MentionList = forwardRef<MentionListHandle, Props>(function MentionList({ items, command }, ref) {
  const [index, setIndex] = useState(0)
  // Reset selection when the item list changes (render-phase state adjustment).
  const [prevItems, setPrevItems] = useState(items)
  if (prevItems !== items) {
    setPrevItems(items)
    setIndex(0)
  }

  const select = (i: number) => {
    const item = items[i]
    if (item) command({ id: item.id, label: item.label })
  }

  useImperativeHandle(ref, () => ({
    onKeyDown: (event) => {
      if (!items.length) return false
      if (event.key === 'ArrowDown') {
        setIndex((i) => (i + 1) % items.length)
        return true
      }
      if (event.key === 'ArrowUp') {
        setIndex((i) => (i + items.length - 1) % items.length)
        return true
      }
      if (event.key === 'Enter' || event.key === 'Tab') {
        select(index)
        return true
      }
      return false
    },
  }))

  if (!items.length) return <div className="suggest suggest--empty">No matches</div>
  return (
    <ul className="suggest" role="listbox">
      {items.map((item, i) => (
        <li
          key={item.id}
          role="option"
          aria-selected={i === index}
          onMouseDown={(e) => e.preventDefault()}
          onClick={() => select(i)}
        >
          <span>{item.label}</span>
          <span className="suggest__kind">{item.kind}</span>
        </li>
      ))}
    </ul>
  )
})
