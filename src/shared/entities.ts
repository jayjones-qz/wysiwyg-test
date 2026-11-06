// Synthetic demo data only — no real users.
export type EntityKind = 'user' | 'concept'

export interface Entity {
  id: string
  kind: EntityKind
  label: string
  description: string
}

export const ENTITIES: Entity[] = [
  { id: 'u-vane', kind: 'user', label: 'Prof. Ellsworth Vane', description: 'Instructor, CS 301. Finds all of this very easy.' },
  { id: 'u-natarajan', kind: 'user', label: 'Priya Natarajan', description: 'Teaching assistant. Actually answers email.' },
  { id: 'u-okafor', kind: 'user', label: 'Jordan Okafor', description: 'Student · asked “what’s a variable” in week 9' },
  {
    id: 'c-di',
    kind: 'concept',
    label: 'Dependency injection',
    description: 'Pass dependencies in instead of constructing them inside. Yes, that is the whole idea.',
  },
  {
    id: 'c-bigo',
    kind: 'concept',
    label: 'Big-O notation',
    description: 'Describes how cost grows with input size. If you need a second slide, see me.',
  },
  {
    id: 'c-techdebt',
    kind: 'concept',
    label: 'Technical debt',
    description: 'The future cost of shortcuts taken now. Your entire codebase, in other words.',
  },
  {
    id: 'c-cap',
    kind: 'concept',
    label: 'CAP theorem',
    description: 'A distributed store can’t guarantee consistency, availability and partition tolerance all at once.',
  },
]

const byId = new Map(ENTITIES.map((e) => [e.id, e]))

export function getEntity(id: string | null | undefined): Entity | undefined {
  return id ? byId.get(id) : undefined
}

export function searchEntities(query: string, limit = 6): Entity[] {
  const q = query.trim().toLowerCase()
  return ENTITIES.filter((e) => e.label.toLowerCase().includes(q)).slice(0, limit)
}
