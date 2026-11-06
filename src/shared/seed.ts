/**
 * Stack-neutral seed document. Each stack converts this into its own storage format,
 * so all stacks start from identical content.
 */

export type Mark = 'bold' | 'italic' | 'highlight'

export type Inline =
  | { text: string; marks?: Mark[] }
  | { link: string; text: string }
  | { mention: string; label: string }
  | { cite: string }

export type Block =
  | { type: 'heading'; level: 1 | 2; text: string }
  | { type: 'paragraph'; content: Inline[] }
  | { type: 'quote'; content: Inline[] }
  | { type: 'image'; src: string; alt: string }

const t = (text: string, ...marks: Mark[]): Inline => ({ text, marks })

export const SEED: Block[] = [
  { type: 'heading', level: 1, text: 'CS 301: Software Engineering (It’s Trivial, Really)' },
  {
    type: 'paragraph',
    content: [
      t('Welcome. I’m told some of you found '),
      t('Hello World', 'bold'),
      t(' challenging. '),
      t('Fascinating.', 'italic'),
      t(' Let’s see if we can keep up today.'),
    ],
  },
  {
    type: 'paragraph',
    content: [
      t('First, '),
      { mention: 'c-di', label: 'Dependency injection' },
      t('. '),
      t('You pass the thing in instead of building it inside.', 'highlight'),
      t(' That is the entire concept. People write books about it, which tells you everything about people.'),
    ],
  },
  {
    type: 'paragraph',
    content: [
      t('Questions go to '),
      { mention: 'u-natarajan', label: 'Priya Natarajan' },
      t(', not to '),
      { mention: 'u-okafor', label: 'Jordan Okafor' },
      t('. Priya has, at minimum, read the syllabus.'),
    ],
  },
  { type: 'heading', level: 2, text: 'Estimation, or: Arithmetic for Beginners' },
  {
    type: 'paragraph',
    content: [
      t('Your project is late? Add more engineers. '),
      t('Wrong.', 'bold'),
      t(' Adding people to a late project makes it later '),
      { cite: 'brooks1975' },
      t('. This has been known since before your parents met, yet here we are.'),
    ],
  },
  {
    type: 'paragraph',
    content: [
      t('And stop micro-optimizing your for-loops. '),
      t('Premature optimization is the root of all evil', 'highlight'),
      { cite: 'knuth1974' },
      t('. I optimize only when necessary, which, given my code, is never.'),
    ],
  },
  {
    type: 'quote',
    content: [
      t('Your system’s architecture mirrors your team’s communication '),
      { cite: 'conway1968' },
      t('. I have seen your group chats. It explains a great deal.'),
    ],
  },
  {
    type: 'paragraph',
    content: [
      t('Homework: read '),
      { link: 'https://en.wikipedia.org/wiki/Considered_harmful', text: 'the original “considered harmful” essay' },
      t(' '),
      { cite: 'dijkstra1968' },
      t('. It is two pages. Pace yourselves. Then learn '),
      { mention: 'c-bigo', label: 'Big-O notation' },
      t(' — '),
      t('it fits on an index card', 'italic'),
      t('.'),
    ],
  },
  { type: 'image', src: '/sample.svg', alt: 'Architecture diagram the professor drew in 30 seconds' },
]
