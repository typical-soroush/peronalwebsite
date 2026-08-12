'use client'

import Image from 'next/image'
import type { Project } from '@/lib/projects'

function XpButton({
  children,
  href,
}: {
  children: React.ReactNode
  href: string
}) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="xp-button inline-flex items-center gap-1.5 text-[12px] font-normal"
    >
      {children}
    </a>
  )
}

export function ProjectContent({ project }: { project: Project }) {
  return (
    <div className="flex flex-col gap-3">
      <div className="xp-inset overflow-hidden rounded-sm">
        <Image
          src={project.image || '/placeholder.svg'}
          alt={`Screenshot of ${project.name}`}
          width={720}
          height={420}
          className="h-auto w-full"
          priority
        />
      </div>

      <div className="flex items-baseline justify-between gap-2">
        <h1 className="text-[18px] font-bold" style={{ color: project.accent }}>
          {project.name}
        </h1>
        <span className="text-[11px] text-neutral-600">{project.year}</span>
      </div>
      <p className="text-[13px] font-bold text-neutral-800">{project.tagline}</p>
      <p className="leading-relaxed text-neutral-800">{project.description}</p>

      <div className="flex flex-wrap gap-1.5">
        {project.tech.map((t) => (
          <span
            key={t}
            className="xp-inset rounded-sm px-2 py-0.5 text-[11px] text-neutral-700"
          >
            {t}
          </span>
        ))}
      </div>

      <div className="mt-1 flex gap-2 border-t border-neutral-400/60 pt-3">
        <XpButton href={project.liveUrl}>Visit Site</XpButton>
        <XpButton href={project.sourceUrl}>View Source</XpButton>
      </div>
    </div>
  )
}

export function AboutContent() {
  return (
    <div className="flex flex-col gap-3 leading-relaxed">
      <div className="flex items-center gap-3 border-b border-neutral-400/60 pb-3">
        <div className="grid h-16 w-16 place-items-center overflow-hidden rounded-sm border border-neutral-400/60 bg-white">
          <img
            src="/xp-about.png"
            alt=""
            aria-hidden="true"
            className="h-full w-full object-contain p-1"
          />
        </div>
        <div>
          <h1 className="text-[18px] font-bold text-[#0a3aa0]">
            Soroush Amirostovar
          </h1>
          <p className="text-[12px] text-neutral-600">
            This Website is depiction of ADHD with a touch of caffeine
          </p>
        </div>
      </div>
      <p>
        {'I build things; systems, tools, furniture, Lego, occasionally an argument.'}
      </p>
      <p>
        {'By day I work in fintech, which mostly includes finding where things '}
        {'break before they do. Outside that, I build for the sake of it: '}
        {'dashboards that score ideas, a coffee table with joints I probably '}
        {'overengineered, essays that take longer to finish than they should.'}
      </p>
      <p>
        {'I like restraint. Fewer moving parts, sharper idea. This is where I '}
        {'put the things I make.'}
      </p>
    </div>
  )
}

export function ResumeContent() {
  const experience = [
    {
      role: 'AML → Investment Compliance',
      org: 'Wealthsimple',
      period: 'Jun 2024 — Present',
      detail:
        'Helped design, build, and user-test a new AI-powered transaction-monitoring tool from concept to rollout. Analyzed 500+ customer interactions to surface the top 3 onboarding pain points, driving a 20% drop in support tickets, and built a CX reporting framework (NPS, CSAT, resolution time). Mapped the account-transfer journey with Product, improving completion rates 25%.',
    },
    {
      role: 'Product Marketing Manager',
      org: 'Crelhub',
      period: 'Jan — Aug 2024',
      detail:
        'Built customer personas from user interviews and behavioural data, lifting retention 18%. Partnered with Product and Engineering on go-to-market for new launches, driving a 30% increase in feature adoption, and synthesized churn data into insights that shaped the Q2 roadmap.',
    },
    {
      role: 'Payment Solution Consultant — eCommerce & Digital',
      org: 'Moneris',
      period: 'Apr — Oct 2023',
      detail:
        'Built business-development strategies for payment solutions from customer insight and competitive analysis, driving 15% growth in client acquisition, and tailored merchant offerings on direct feedback to lift satisfaction scores 12%.',
    },
  ]
  const focusAreas = [
    {
      title: 'Product & Discovery',
      items: [
        'User testing',
        'Journey mapping',
        '0→1 prototyping',
        'Requirements',
        'Voice of customer',
      ],
    },
    {
      title: 'Compliance & Risk',
      items: [
        'AML / STRs',
        'Trade surveillance (UMIR)',
        'Risk scoring',
        'CIRO / OBSI',
        'FINTRAC',
      ],
    },
  ]
  const education = [
    {
      org: 'Toronto Metropolitan University',
      detail: 'BTech',
      year: 'Apr 2022',
    },
    {
      org: 'BrainStation',
      detail: 'Product Management Certification',
      year: '2023',
    },
    {
      org: 'CIRO',
      detail: 'Canadian Investment Regulatory Exam (CIRE)',
      year: 'Apr 2026',
    },
    {
      org: 'Chainalysis',
      detail: 'Cryptocurrency Fundamentals (CCFC)',
      year: '2024',
    },
  ]
  return (
    <div className="flex flex-col gap-3 leading-relaxed">
      <div className="flex items-baseline justify-between gap-2 border-b border-neutral-400/60 pb-2">
        <div>
          <h1 className="text-[18px] font-bold text-[#0a3aa0]">
            Soroush Amirostovar
          </h1>
          <p className="text-[12px] font-bold text-neutral-700">
            Product · Compliance
          </p>
        </div>
        <span className="text-[11px] text-neutral-600">Toronto, ON</span>
      </div>

      <p className="text-[12px] text-neutral-800">
        {
          'A builder who turns ambiguous problems into shipped product. 2+ years at Wealthsimple across anti-money laundering and investment compliance. I take ideas from 0 to validated, kill weak ones fast, and double down on what works.'
        }
      </p>

      <section className="flex flex-col gap-2">
        <h2 className="text-[13px] font-bold text-neutral-800">Experience</h2>
        {experience.map((e) => (
          <div key={e.org} className="xp-inset rounded-sm p-2">
            <div className="flex items-baseline justify-between gap-2">
              <span className="text-[13px] font-bold text-[#0a3aa0]">
                {e.org}
              </span>
              <span className="text-[11px] text-neutral-500">{e.period}</span>
            </div>
            <p className="text-[12px] font-bold text-neutral-800">{e.role}</p>
            <p className="text-[12px] text-neutral-700">{e.detail}</p>
          </div>
        ))}
      </section>

      <section className="flex flex-col gap-2">
        <h2 className="text-[13px] font-bold text-neutral-800">Focus areas</h2>
        {focusAreas.map((f) => (
          <div key={f.title} className="flex flex-col gap-1.5">
            <span className="text-[12px] font-bold text-neutral-700">
              {f.title}
            </span>
            <div className="flex flex-wrap gap-1.5">
              {f.items.map((s) => (
                <span
                  key={s}
                  className="xp-inset rounded-sm px-2 py-0.5 text-[11px] text-neutral-700"
                >
                  {s}
                </span>
              ))}
            </div>
          </div>
        ))}
      </section>

      <section className="flex flex-col gap-2">
        <h2 className="text-[13px] font-bold text-neutral-800">
          Education &amp; certifications
        </h2>
        <div className="xp-inset flex flex-col divide-y divide-neutral-200 rounded-sm">
          {education.map((ed) => (
            <div
              key={ed.org}
              className="flex items-baseline justify-between gap-2 px-3 py-1.5"
            >
              <div>
                <span className="text-[12px] font-bold text-neutral-800">
                  {ed.org}
                </span>
                <span className="text-[12px] text-neutral-600">
                  {' — '}
                  {ed.detail}
                </span>
              </div>
              <span className="text-[11px] text-neutral-500">{ed.year}</span>
            </div>
          ))}
        </div>
      </section>

      <div className="mt-1 flex items-center gap-2 border-t border-neutral-400/60 pt-3">
        <button
          type="button"
          onClick={() =>
            window.dispatchEvent(
              new CustomEvent('xp:open', { detail: 'contact' }),
            )
          }
          className="xp-button inline-flex items-center gap-1.5 text-[12px] font-normal"
        >
          Contact
        </button>
      </div>
    </div>
  )
}

export function ContactContent() {
  const links = [
    {
      label: 'LinkedIn',
      value: 'in/soroush-amirostovar',
      href: 'https://www.linkedin.com/in/soroush-amirostovar-ab5b9a193',
    },
  ]
  return (
    <div className="flex flex-col gap-3">
      <p className="leading-relaxed text-neutral-800">
        {"Want to work together or just say hi? Here's where to find me."}
      </p>
      <div className="xp-inset flex flex-col divide-y divide-neutral-200 rounded-sm">
        {links.map((l) => (
          <a
            key={l.label}
            href={l.href}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-between px-3 py-2 hover:bg-[#e8f0ff]"
          >
            <span className="font-bold text-neutral-700">{l.label}</span>
            <span className="text-[#0a3aa0] underline">{l.value}</span>
          </a>
        ))}
      </div>
      <p className="text-[11px] text-neutral-500">
        Replies usually within a day or two.
      </p>
    </div>
  )
}
