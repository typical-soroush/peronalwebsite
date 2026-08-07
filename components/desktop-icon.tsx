'use client'

import type React from 'react'
import { useRef } from 'react'

type DesktopIconProps = {
  label: string
  icon: React.ReactNode
  selected: boolean
  x: number
  y: number
  onSelect: () => void
  onOpen: () => void
  onMove: (x: number, y: number) => void
  onDragStart: () => void
}

const ICON_WIDTH = 84
const DRAG_THRESHOLD = 4

export function DesktopIcon({
  label,
  icon,
  selected,
  x,
  y,
  onSelect,
  onOpen,
  onMove,
  onDragStart,
}: DesktopIconProps) {
  // Tracks pointer bookkeeping across the drag lifecycle without re-rendering.
  const drag = useRef({
    pointerId: -1,
    startX: 0,
    startY: 0,
    originX: 0,
    originY: 0,
    moved: false,
  })

  const handlePointerDown = (e: React.PointerEvent<HTMLButtonElement>) => {
    if (e.button !== 0) return
    e.stopPropagation()
    onSelect()
    onDragStart()
    drag.current = {
      pointerId: e.pointerId,
      startX: e.clientX,
      startY: e.clientY,
      originX: x,
      originY: y,
      moved: false,
    }
    e.currentTarget.setPointerCapture(e.pointerId)
  }

  const handlePointerMove = (e: React.PointerEvent<HTMLButtonElement>) => {
    const d = drag.current
    if (d.pointerId !== e.pointerId) return
    const dx = e.clientX - d.startX
    const dy = e.clientY - d.startY
    if (!d.moved && Math.hypot(dx, dy) < DRAG_THRESHOLD) return
    d.moved = true
    // Clamp within the viewport so icons can't be lost off-screen.
    const maxX = window.innerWidth - ICON_WIDTH
    const maxY = window.innerHeight - 110
    const nextX = Math.max(0, Math.min(maxX, d.originX + dx))
    const nextY = Math.max(0, Math.min(maxY, d.originY + dy))
    onMove(nextX, nextY)
  }

  const endDrag = (e: React.PointerEvent<HTMLButtonElement>) => {
    if (drag.current.pointerId !== e.pointerId) return
    if (e.currentTarget.hasPointerCapture(e.pointerId)) {
      e.currentTarget.releasePointerCapture(e.pointerId)
    }
    drag.current.pointerId = -1
  }

  return (
    <button
      className={`absolute flex w-[84px] flex-col items-center gap-1 rounded p-1.5 text-center touch-none ${
        selected ? 'xp-icon-selected' : ''
      }`}
      style={{ left: x, top: y }}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={endDrag}
      onPointerCancel={endDrag}
      onClick={(e) => e.stopPropagation()}
      onDoubleClick={(e) => {
        e.stopPropagation()
        onOpen()
      }}
    >
      <span className="xp-icon-img grid h-11 w-11 place-items-center">
        {icon}
      </span>
      <span className="xp-icon-label text-[12px] leading-tight text-pretty">
        {label}
      </span>
    </button>
  )
}
