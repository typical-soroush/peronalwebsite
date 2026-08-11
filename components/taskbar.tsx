'use client'

import { useEffect, useState } from 'react'
import { StartFlag, WindowGlyph } from './xp-icons'

export type TaskItem = {
  id: string
  title: string
  active: boolean
  minimized: boolean
}

function Clock() {
  const [time, setTime] = useState<string | null>(null)

  useEffect(() => {
    const update = () =>
      setTime(
        new Date().toLocaleTimeString([], {
          hour: 'numeric',
          minute: '2-digit',
        }),
      )
    update()
    const id = setInterval(update, 1000 * 10)
    return () => clearInterval(id)
  }, [])

  return (
    <span
      className="text-[12px] text-white"
      suppressHydrationWarning
      aria-label="Current time"
    >
      {time ?? '--:--'}
    </span>
  )
}

function TraySpeaker() {
  const [open, setOpen] = useState(false)
  const [muted, setMuted] = useState(false)
  const [volume, setVolume] = useState(75)

  useEffect(() => {
    if (!open) return
    const close = () => setOpen(false)
    window.addEventListener('click', close)
    return () => window.removeEventListener('click', close)
  }, [open])

  return (
    <div className="relative flex items-center">
      <button
        onClick={(e) => {
          e.stopPropagation()
          setOpen((o) => !o)
        }}
        className="grid h-5 w-5 place-items-center rounded-sm hover:bg-white/20"
        aria-label="Volume — play song"
        aria-haspopup="dialog"
        aria-expanded={open}
      >
        <img
          src="/xp-speaker.png"
          alt=""
          aria-hidden="true"
          className="h-4 w-4 object-contain"
        />
      </button>

      {open ? (
        <div
          className="xp-volume-popup absolute bottom-[calc(100%+8px)] right-0 w-[260px] p-2"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="mb-1 px-1 text-center text-[12px] font-bold text-neutral-700">
            Volume
          </div>

          {muted ? (
            <div className="grid h-[152px] place-items-center rounded-[10px] border border-neutral-400/60 bg-neutral-200 text-center text-[12px] text-neutral-500">
              Muted — check the box
              <br />
              below to resume.
            </div>
          ) : (
            <iframe
              title="Spotify player"
              src="https://open.spotify.com/embed/track/0iPDqpgkWjXmxVTWnCxt0Y?utm_source=generator&autoplay=1"
              width="100%"
              height="152"
              frameBorder="0"
              allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
              loading="lazy"
              className="rounded-[10px]"
            />
          )}

          <div className="mt-2 flex items-center gap-2 px-1">
            <span className="text-[11px] text-neutral-600">Low</span>
            <input
              type="range"
              min={0}
              max={100}
              value={volume}
              onChange={(e) => setVolume(Number(e.target.value))}
              className="xp-volume-slider h-1 flex-1"
              aria-label="Volume level"
            />
            <span className="text-[11px] text-neutral-600">High</span>
          </div>

          <label className="mt-2 flex cursor-pointer items-center gap-1.5 px-1 text-[12px] text-neutral-700">
            <input
              type="checkbox"
              checked={muted}
              onChange={(e) => setMuted(e.target.checked)}
              className="h-3.5 w-3.5"
            />
            Mute
          </label>
        </div>
      ) : null}
    </div>
  )
}

type TaskbarProps = {
  startOpen: boolean
  onToggleStart: () => void
  tasks: TaskItem[]
  onTaskClick: (id: string) => void
}

export function Taskbar({
  startOpen,
  onToggleStart,
  tasks,
  onTaskClick,
}: TaskbarProps) {
  return (
    <div className="xp-taskbar absolute inset-x-0 bottom-0 z-[9998] flex h-10 items-stretch">
      {/* Start button */}
      <button
        className={`xp-start flex items-center gap-1.5 pl-2 pr-5 text-white ${
          startOpen ? 'xp-start-active' : ''
        }`}
        onClick={(e) => {
          e.stopPropagation()
          onToggleStart()
        }}
        aria-haspopup="menu"
        aria-expanded={startOpen}
      >
        <StartFlag size={22} />
        <span className="text-[16px] font-bold italic text-white drop-shadow-[1px_1px_1px_rgba(0,0,0,0.4)]">
          start
        </span>
      </button>

      {/* Running windows */}
      <div className="flex flex-1 items-center gap-1 px-2">
        {tasks.map((t) => (
          <button
            key={t.id}
            className={`xp-task-btn flex h-7 min-w-0 max-w-[180px] items-center gap-1.5 px-2 text-left ${
              t.active && !t.minimized ? 'xp-task-btn-active' : ''
            }`}
            onClick={() => onTaskClick(t.id)}
          >
            <WindowGlyph size={15} />
            <span className="truncate text-[12px]">{t.title}</span>
          </button>
        ))}
      </div>

      {/* System tray */}
      <div className="xp-tray flex items-center gap-2 px-3">
        <TraySpeaker />
        <Clock />
      </div>
    </div>
  )
}
