import type { ReactNode } from 'react'

interface Props {
  label: string
  active?: boolean
  onClick: () => void
  children: ReactNode
}

export function ToolbarButton({ label, active, onClick, children }: Props) {
  return (
    <button
      type="button"
      className="tb-btn"
      title={label}
      aria-label={label}
      aria-pressed={active}
      // Keep editor selection when clicking toolbar buttons.
      onMouseDown={(e) => e.preventDefault()}
      onClick={onClick}
    >
      {children}
    </button>
  )
}
