export type Project = {
  id: string
  name: string
  /** short label shown under the desktop icon */
  shortName: string
  tagline: string
  description: string
  tech: string[]
  year: string
  image: string
  liveUrl: string
  sourceUrl: string
  /** hex accent used for the folder/icon tint */
  accent: string
}

export const projects: Project[] = [
  {
    id: 'bench',
    name: 'Bench',
    shortName: 'Bench',
    tagline: 'Book a bench, build something.',
    description:
      'Bench is a marketplace for idle workshop hours. Shop owners rent out the hours their equipment sits still, and makers book the tools and space they don’t own — by the hour, not by the year. Covers wood, ceramics, glass, metal, and jewelry across a Toronto pilot, with per-session booking and a signed waiver on every booking. No memberships, no leases.',
    tech: ['React', 'TypeScript', 'Tailwind CSS', 'Supabase'],
    year: '2025',
    image: '/projects/bench.png',
    liveUrl: 'https://bench-by-the-hour.lovable.app',
    sourceUrl: 'https://bench-by-the-hour.lovable.app',
    accent: '#b5502f',
  },
]
