import { useState, type ReactNode } from 'react'
import {
  autoUpdate,
  flip,
  FloatingPortal,
  offset,
  safePolygon,
  shift,
  useDismiss,
  useFloating,
  useFocus,
  useHover,
  useInteractions,
  useRole,
} from '@floating-ui/react'

interface Props {
  className: string
  children: ReactNode
  card: ReactNode
  dataAttrs?: Record<string, string>
}

/** Inline chip that shows a floating card on hover/focus. Base for mentions and citations. */
export function HoverChip({ className, children, card, dataAttrs }: Props) {
  const [open, setOpen] = useState(false)
  const { refs, floatingStyles, context } = useFloating({
    open,
    onOpenChange: setOpen,
    placement: 'bottom-start',
    middleware: [offset(6), flip(), shift({ padding: 8 })],
    whileElementsMounted: autoUpdate,
  })
  const { getReferenceProps, getFloatingProps } = useInteractions([
    useHover(context, { delay: { open: 120, close: 0 }, handleClose: safePolygon() }),
    useFocus(context),
    useDismiss(context),
    useRole(context, { role: 'tooltip' }),
  ])

  return (
    <>
      <span ref={refs.setReference} className={className} {...dataAttrs} {...getReferenceProps()}>
        {children}
      </span>
      {open && (
        <FloatingPortal>
          <div ref={refs.setFloating} style={floatingStyles} className="hovercard" {...getFloatingProps()}>
            {card}
          </div>
        </FloatingPortal>
      )}
    </>
  )
}
