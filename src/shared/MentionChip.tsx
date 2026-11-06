import { getEntity } from './entities'
import { HoverChip } from './HoverChip'

interface Props {
  id: string
  /** Fallback label when the id isn't in the registry. */
  label?: string
}

/** Inline @mention with a hover card. Shared by every stack's editor and renderer. */
export function MentionChip({ id, label }: Props) {
  const entity = getEntity(id)
  return (
    <HoverChip
      className={`mention mention--${entity?.kind ?? 'unknown'}`}
      dataAttrs={{ 'data-entity-id': id }}
      card={
        entity ? (
          <>
            <div className="hovercard__kind">{entity.kind}</div>
            <div className="hovercard__title">{entity.label}</div>
            <div className="hovercard__body">{entity.description}</div>
            <code className="hovercard__id">{entity.id}</code>
          </>
        ) : (
          <div className="hovercard__body">Unknown entity: {id}</div>
        )
      }
    >
      @{entity?.label ?? label ?? id}
    </HoverChip>
  )
}
