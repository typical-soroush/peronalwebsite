'use client'

import { useCallback, useEffect, useRef, useState } from 'react'

const COLORS = [
  '#ff3b30', // red
  '#ff9500', // orange
  '#ffcc00', // yellow
  '#34c759', // green
  '#00c7be', // teal
  '#0a84ff', // blue
  '#5e5ce6', // indigo
  '#bf5af2', // purple
  '#ff2d55', // pink
]

const LOGO_W = 150
const LOGO_H = 150
const SPEED = 2.6 // constant px per frame
// Radius of the invisible "magnetic" field around each corner.
const CORNER_R = 150
// How hard the corner pushes the logo away.
const REPEL = 0.9

type Vec = { x: number; y: number }

export function RageBaitApp() {
  const containerRef = useRef<HTMLDivElement>(null)
  const logoRef = useRef<HTMLDivElement>(null)

  // Live physics state kept in refs so the animation loop never gets stale.
  const size = useRef({ w: 0, h: 0 })
  const pos = useRef<Vec>({ x: 40, y: 40 })
  const vel = useRef<Vec>({ x: SPEED, y: SPEED })
  const dragging = useRef(false)
  const dragOffset = useRef<Vec>({ x: 0, y: 0 })
  const pointer = useRef<Vec>({ x: 0, y: 0 })
  const lastPointer = useRef<Vec>({ x: 0, y: 0 })

  const [color, setColor] = useState(COLORS[0])
  const [grabbing, setGrabbing] = useState(false)
  const [nudged, setNudged] = useState(false)
  const [showPopup, setShowPopup] = useState(false)
  const grabCount = useRef(0)
  const colorIndex = useRef(0)

  const cycleColor = useCallback(() => {
    colorIndex.current = (colorIndex.current + 1) % COLORS.length
    setColor(COLORS[colorIndex.current])
  }, [])

  // Sum of repulsion vectors from every corner the logo is currently near.
  const cornerForce = useCallback((cx: number, cy: number) => {
    const { w, h } = size.current
    const maxX = w - LOGO_W
    const maxY = h - LOGO_H
    // Logo center relative to each of the 4 corners.
    const corners = [
      { x: 0, y: 0 },
      { x: maxX, y: 0 },
      { x: 0, y: maxY },
      { x: maxX, y: maxY },
    ]
    let fx = 0
    let fy = 0
    let near = false
    for (const c of corners) {
      const dx = cx - c.x
      const dy = cy - c.y
      const d = Math.hypot(dx, dy)
      if (d < CORNER_R) {
        near = true
        const strength = (CORNER_R - d) / CORNER_R // 0..1, stronger up close
        const nx = dx / (d || 1)
        const ny = dy / (d || 1)
        fx += nx * strength
        fy += ny * strength
      }
    }
    return { fx, fy, near }
  }, [])

  useEffect(() => {
    const el = containerRef.current
    if (!el) return

    const measure = () => {
      const r = el.getBoundingClientRect()
      size.current = { w: r.width, h: r.height }
      // keep logo inside after resize
      pos.current.x = Math.max(0, Math.min(pos.current.x, r.width - LOGO_W))
      pos.current.y = Math.max(0, Math.min(pos.current.y, r.height - LOGO_H))
    }
    measure()
    const ro = new ResizeObserver(measure)
    ro.observe(el)

    let raf = 0
    let nearFlash = false

    const step = () => {
      const { w, h } = size.current
      const maxX = w - LOGO_W
      const maxY = h - LOGO_H

      if (w > 0 && h > 0) {
        if (dragging.current) {
          // Follow the pointer, but the corner field resists.
          let tx = pointer.current.x - dragOffset.current.x
          let ty = pointer.current.y - dragOffset.current.y
          tx = Math.max(0, Math.min(tx, maxX))
          ty = Math.max(0, Math.min(ty, maxY))
          const cx = tx + LOGO_W / 2
          const cy = ty + LOGO_H / 2
          const { fx, fy, near } = cornerForce(cx, cy)
          // Push the target back out of the corner — the "magnetic" resist.
          tx += fx * CORNER_R * REPEL
          ty += fy * CORNER_R * REPEL
          tx = Math.max(0, Math.min(tx, maxX))
          ty = Math.max(0, Math.min(ty, maxY))
          pos.current.x = tx
          pos.current.y = ty
          if (near !== nearFlash) {
            nearFlash = near
            setNudged(near)
          }
        } else {
          // Free-flight bounce.
          let { x, y } = pos.current
          x += vel.current.x
          y += vel.current.y

          let hit = false
          if (x <= 0) {
            x = 0
            vel.current.x = Math.abs(vel.current.x)
            hit = true
          } else if (x >= maxX) {
            x = maxX
            vel.current.x = -Math.abs(vel.current.x)
            hit = true
          }
          if (y <= 0) {
            y = 0
            vel.current.y = Math.abs(vel.current.y)
            hit = true
          } else if (y >= maxY) {
            y = maxY
            vel.current.y = -Math.abs(vel.current.y)
            hit = true
          }

          // Corner repulsion steers the trajectory away before it arrives.
          const cx = x + LOGO_W / 2
          const cy = y + LOGO_H / 2
          const { fx, fy, near } = cornerForce(cx, cy)
          if (near) {
            vel.current.x += fx * REPEL
            vel.current.y += fy * REPEL
          }

          // Normalize back to constant speed so energy never runs away.
          const mag = Math.hypot(vel.current.x, vel.current.y) || 1
          vel.current.x = (vel.current.x / mag) * SPEED
          vel.current.y = (vel.current.y / mag) * SPEED

          pos.current.x = x
          pos.current.y = y
          if (hit) cycleColor()
          if (near !== nearFlash) {
            nearFlash = near
            setNudged(near)
          }
        }

        if (logoRef.current) {
          logoRef.current.style.transform = `translate3d(${pos.current.x}px, ${pos.current.y}px, 0)`
        }
      }
      raf = requestAnimationFrame(step)
    }
    raf = requestAnimationFrame(step)

    return () => {
      cancelAnimationFrame(raf)
      ro.disconnect()
    }
  }, [cornerForce, cycleColor])

  const onPointerDown = useCallback((e: React.PointerEvent) => {
    e.stopPropagation()
    dragging.current = true
    setGrabbing(true)
    grabCount.current += 1
    if (grabCount.current === 4) setShowPopup(true)
    const rect = containerRef.current!.getBoundingClientRect()
    const px = e.clientX - rect.left
    const py = e.clientY - rect.top
    pointer.current = { x: px, y: py }
    lastPointer.current = { x: px, y: py }
    dragOffset.current = { x: px - pos.current.x, y: py - pos.current.y }
    ;(e.target as HTMLElement).setPointerCapture(e.pointerId)
  }, [])

  const onPointerMove = useCallback((e: React.PointerEvent) => {
    if (!dragging.current) return
    const rect = containerRef.current!.getBoundingClientRect()
    lastPointer.current = pointer.current
    pointer.current = { x: e.clientX - rect.left, y: e.clientY - rect.top }
  }, [])

  const onPointerUp = useCallback((e: React.PointerEvent) => {
    if (!dragging.current) return
    dragging.current = false
    setGrabbing(false)
    setNudged(false)
    // Fling: launch in the direction of the last drag movement.
    let dx = pointer.current.x - lastPointer.current.x
    let dy = pointer.current.y - lastPointer.current.y
    if (Math.hypot(dx, dy) < 0.5) {
      // Released without moving — send it off at a jaunty angle.
      dx = Math.random() > 0.5 ? 1 : -1
      dy = Math.random() > 0.5 ? 1 : -1
    }
    const mag = Math.hypot(dx, dy) || 1
    vel.current = { x: (dx / mag) * SPEED, y: (dy / mag) * SPEED }
    ;(e.target as HTMLElement).releasePointerCapture(e.pointerId)
  }, [])

  return (
    <div className="relative -m-3 h-[calc(100%+1.5rem)] w-[calc(100%+1.5rem)] overflow-hidden bg-black">
      <div ref={containerRef} className="absolute inset-0">
        <div
          ref={logoRef}
          onPointerDown={onPointerDown}
          onPointerMove={onPointerMove}
          onPointerUp={onPointerUp}
          className="absolute left-0 top-0 touch-none select-none"
          style={{
            width: LOGO_W,
            height: LOGO_H,
            cursor: grabbing ? 'grabbing' : 'grab',
            backgroundColor: color,
            WebkitMaskImage: 'url(/dvd-logo.png)',
            maskImage: 'url(/dvd-logo.png)',
            WebkitMaskRepeat: 'no-repeat',
            maskRepeat: 'no-repeat',
            WebkitMaskSize: 'contain',
            maskSize: 'contain',
            WebkitMaskPosition: 'center',
            maskPosition: 'center',
            filter: nudged
              ? 'drop-shadow(0 0 12px rgba(255,255,255,0.6))'
              : 'none',
            transition: 'filter 120ms ease',
          }}
          aria-label="Bouncing DVD logo — try to get it into a corner"
          role="img"
        />

        {/* Taunting hint */}
        <div className="pointer-events-none absolute bottom-2 left-0 right-0 text-center text-[11px] font-bold uppercase tracking-widest text-white/40">
          waiting for it to hit the corner...
        </div>

        {/* Fourth-grab popup */}
        {showPopup ? (
          <div className="absolute inset-0 z-10 grid place-items-center bg-black/40">
            <div className="xp-window w-[300px] font-sans">
              <div className="xp-titlebar flex items-center justify-between rounded-t-[7px] px-2 py-1">
                <span className="text-[12px] font-bold text-white drop-shadow-[1px_1px_1px_rgba(0,0,0,0.5)]">
                  Rage Bait
                </span>
                <button
                  onClick={() => setShowPopup(false)}
                  className="xp-caption-btn xp-caption-close text-[11px]"
                  aria-label="Close"
                >
                  x
                </button>
              </div>
              <div className="flex flex-col gap-3 p-4">
                <p className="text-[13px] italic leading-relaxed text-neutral-800">
                  {'"maybe not today, maybe not tomorrow, but one day..."'}
                </p>
                <div className="flex justify-center">
                  <button
                    onClick={() => setShowPopup(false)}
                    className="xp-button min-w-[72px] text-[12px]"
                  >
                    OK
                  </button>
                </div>
              </div>
            </div>
          </div>
        ) : null}
      </div>
    </div>
  )
}
