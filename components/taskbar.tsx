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
        <Clock />
      </div>
    </div>
  )
}
