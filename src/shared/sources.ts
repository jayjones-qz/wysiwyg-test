export interface Source {
  id: string
  short: string
  title: string
  author: string
  year: number
  /** The idea the source is cited for (paraphrased unless quoted). */
  definition: string
  profNote: string
}

export const SOURCES: Source[] = [
  {
    id: 'brooks1975',
    short: 'Brooks 1975',
    title: 'The Mythical Man-Month',
    author: 'Frederick P. Brooks Jr.',
    year: 1975,
    definition: 'Brooks’s law: adding people to a late software project makes it later.',
    profNote: 'An entire book to say what I figured out in kindergarten group work.',
  },
  {
    id: 'knuth1974',
    short: 'Knuth 1974',
    title: 'Structured Programming with go to Statements',
    author: 'Donald E. Knuth',
    year: 1974,
    definition: '“Premature optimization is the root of all evil (or at least most of it) in programming.”',
    profNote: 'Knuth is nearly as good at this as I am.',
  },
  {
    id: 'conway1968',
    short: 'Conway 1968',
    title: 'How Do Committees Invent?',
    author: 'Melvin E. Conway',
    year: 1968,
    definition: 'Conway’s law: organizations design systems that mirror their own communication structures.',
    profNote: 'Which explains every group project you have ever submitted.',
  },
  {
    id: 'dijkstra1968',
    short: 'Dijkstra 1968',
    title: 'Go To Statement Considered Harmful',
    author: 'Edsger W. Dijkstra',
    year: 1968,
    definition: 'Argues that unrestricted goto makes program behavior hard to reason about; favors structured control flow.',
    profNote: 'Two pages long. Some of you still won’t finish it.',
  },
]

const byId = new Map(SOURCES.map((s) => [s.id, s]))

export function getSource(id: string | null | undefined): Source | undefined {
  return id ? byId.get(id) : undefined
}
