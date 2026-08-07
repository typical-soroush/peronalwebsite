'use client'

import type React from 'react'
import { useCallback, useEffect, useRef, useState } from 'react'

type XpWindowProps = {
  title: string
  icon?: React.ReactNode
  zIndex: number
  active: boolean
  initial: { x: number; y: number; width: number; height: number }
  onFocus: () => void
  onClose: () => void
  onMinimize: () => void
  children: React.ReactNode
}

export function XpWindow({
  title,
  icon,
  zIndex,
  active,
  initial,
  onFocus,
  onClose,
  onMinimize,
  children,
}: XpWindowProps) {
  const [pos, setPos] = useState({ x: initial.x, y: initial.y })
  const [maximized, setMaximized] = useState(false)
  const drag = useRef<{ dx: number; dy: number } | null>(null)

  const onPointerDown = useCallback(
    (e: React.PointerEvent) => {
      if (maximized) return
      onFocus()
      drag.current = { dx: e.clientX - pos.x, dy: e.clientY - pos.y }
      ;(e.target as HTMLElement).setPointerCapture(e.pointerId)
    },
    [maximized, onFocus, pos.x, pos.y],
  )

  const onPointerMove = useCallback((e: React.PointerEvent) => {
    if (!drag.current) return
    const x = e.clientX - drag.current.dx
    const y = e.clientY - drag.current.dy
    // keep the title bar reachable
    setPos({
      x: Math.max(-initial.width + 120, Math.min(x, window.innerWidth - 120)),
      y: Math.max(0, Math.min(y, window.innerHeight - 80)),
    })
  }, [initial.width])

  const onPointerUp = useCallback((e: React.PointerEvent) => {
    drag.current = null
    ;(e.target as HTMLElement).releasePointerCapture(e.pointerId)
  }, [])

  // recenter if window is resized very small
  useEffect(() => {
    const onResize = () => {
      setPos((p) => ({
        x: Math.min(p.x, Math.max(0, window.innerWidth - 160)),
        y: Math.min(p.y, Math.max(0, window.innerHeight - 80)),
      }))
    }
    window.addEventListener('resize', onResize)
    return () => window.removeEventListener('resize', onResize)
  }, [])

  const style: React.CSSProperties = maximized
    ? { left: 0, top: 0, width: '100%', height: 'calc(100% - 40px)', zIndex }
    : {
        left: pos.x,
        top: pos.y,
        width: initial.width,
        height: initial.height,
        zIndex,
      }

  return (
    <div
      className="xp-window absolute flex flex-col"
      style={style}
      onPointerDown={onFocus}
      role="dialog"
      aria-label={title}
    >
      {/* Title bar */}
      <div
        className={`xp-titlebar flex h-[30px] shrink-0 items-center gap-1.5 px-1.5 ${
          active ? '' : 'xp-titlebar-inactive'
        }`}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
        onDoubleClick={() => setMaximized((m) => !m)}
        style={{ cursor: maximized ? 'default' : 'grab' }}
      >
        {icon ? <span className="ml-0.5 grid place-items-center">{icon}</span> : null}
        <span className="truncate pr-2 text-[13px] font-bold text-white drop-shadow-[1px_1px_1px_rgba(0,0,0,0.5)]">
          {title}
        </span>
        <div className="ml-auto flex items-center gap-1">
          <button
            aria-label="Minimize"
            className="xp-caption-btn xp-caption-min"
            onClick={(e) => {
              e.stopPropagation()
              onMinimize()
            }}
          >
            <span className="mt-1.5 h-[3px] w-2.5 bg-white" />
          </button>
          <button
            aria-label={maximized ? 'Restore' : 'Maximize'}
            className="xp-caption-btn xp-caption-max"
            onClick={(e) => {
              e.stopPropagation()
              setMaximized((m) => !m)
            }}
          >
            <span className="h-2.5 w-2.5 border border-white border-t-2" />
          </button>
          <button
            aria-label="Close"
            className="xp-caption-btn xp-caption-close text-[13px]"
            onClick={(e) => {
              e.stopPropagation()
              onClose()
            }}
          >
            ✕
          </button>
        </div>
      </div>

      {/* Body */}
      <div className="xp-scroll flex-1 overflow-auto p-3 text-[13px] text-black">
        {children}
      </div>
    </div>
  )
}
