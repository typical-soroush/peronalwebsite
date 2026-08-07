'use client'

import type React from 'react'
import { useCallback, useEffect, useRef, useState } from 'react'

type Tool = 'pencil' | 'brush' | 'eraser' | 'line' | 'rect' | 'ellipse'

const PALETTE = [
  '#000000', '#7f7f7f', '#880015', '#ed1c24', '#ff7f27',
  '#fff200', '#22b14c', '#00a2e8', '#3f48cc', '#a349a4',
  '#ffffff', '#c3c3c3', '#b97a57', '#ffaec9', '#ffc90e',
  '#efe4b0', '#b5e61d', '#99d9ea', '#7092be', '#c8bfe7',
]

const TOOL_META: { id: Tool; label: string; icon: React.ReactNode }[] = [
  { id: 'pencil', label: 'Pencil', icon: <PencilGlyph /> },
  { id: 'brush', label: 'Brush', icon: <BrushGlyph /> },
  { id: 'eraser', label: 'Eraser', icon: <EraserGlyph /> },
  { id: 'line', label: 'Line', icon: <LineGlyph /> },
  { id: 'rect', label: 'Rectangle', icon: <RectGlyph /> },
  { id: 'ellipse', label: 'Ellipse', icon: <EllipseGlyph /> },
]

const SIZES = [2, 4, 8, 14]

export function PaintApp() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null)
  const wrapRef = useRef<HTMLDivElement | null>(null)
  const ctxRef = useRef<CanvasRenderingContext2D | null>(null)
  const snapshot = useRef<ImageData | null>(null)
  const drawing = useRef(false)
  const start = useRef({ x: 0, y: 0 })
  const last = useRef({ x: 0, y: 0 })
  const cssSize = useRef({ w: 0, h: 0 })

  const [tool, setTool] = useState<Tool>('pencil')
  const [color, setColor] = useState('#000000')
  const [size, setSize] = useState(2)
  const [coords, setCoords] = useState<{ x: number; y: number } | null>(null)
  const [fileOpen, setFileOpen] = useState(false)

  // keep latest values available inside pointer handlers
  const toolRef = useRef(tool)
  const colorRef = useRef(color)
  const sizeRef = useRef(size)
  toolRef.current = tool
  colorRef.current = color
  sizeRef.current = size

  const fillWhite = useCallback((ctx: CanvasRenderingContext2D) => {
    ctx.save()
    ctx.fillStyle = '#ffffff'
    ctx.fillRect(0, 0, cssSize.current.w, cssSize.current.h)
    ctx.restore()
  }, [])

  // Size the canvas to its container (crisp via devicePixelRatio), preserving art.
  useEffect(() => {
    const canvas = canvasRef.current
    const wrap = wrapRef.current
    if (!canvas || !wrap) return

    const resize = () => {
      const dpr = window.devicePixelRatio || 1
      const w = Math.max(1, wrap.clientWidth)
      const h = Math.max(1, wrap.clientHeight)
      if (w === cssSize.current.w && h === cssSize.current.h) return

      // copy existing bitmap
      const prev = document.createElement('canvas')
      prev.width = canvas.width
      prev.height = canvas.height
      const pctx = prev.getContext('2d')
      if (pctx && canvas.width > 0) pctx.drawImage(canvas, 0, 0)
      const oldW = cssSize.current.w

      canvas.width = Math.floor(w * dpr)
      canvas.height = Math.floor(h * dpr)
      canvas.style.width = `${w}px`
      canvas.style.height = `${h}px`
      cssSize.current = { w, h }

      const ctx = canvas.getContext('2d')
      if (!ctx) return
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
      ctx.lineCap = 'round'
      ctx.lineJoin = 'round'
      fillWhite(ctx)
      if (oldW > 0) ctx.drawImage(prev, 0, 0, prev.width / dpr, prev.height / dpr)
      ctxRef.current = ctx
    }

    resize()
    const ro = new ResizeObserver(resize)
    ro.observe(wrap)
    return () => ro.disconnect()
  }, [fillWhite])

  const posFromEvent = (e: React.PointerEvent) => {
    const canvas = canvasRef.current!
    const r = canvas.getBoundingClientRect()
    return { x: e.clientX - r.left, y: e.clientY - r.top }
  }

  const strokeStyleFor = (ctx: CanvasRenderingContext2D) => {
    const t = toolRef.current
    ctx.lineWidth = t === 'eraser' ? Math.max(sizeRef.current, 10) : sizeRef.current
    ctx.strokeStyle = t === 'eraser' ? '#ffffff' : colorRef.current
    ctx.fillStyle = t === 'eraser' ? '#ffffff' : colorRef.current
  }

  const onPointerDown = (e: React.PointerEvent) => {
    const ctx = ctxRef.current
    if (!ctx) return
    e.preventDefault()
    ;(e.target as HTMLElement).setPointerCapture(e.pointerId)
    drawing.current = true
    const p = posFromEvent(e)
    start.current = p
    last.current = p
    strokeStyleFor(ctx)
    // snapshot for shape/line preview
    snapshot.current = ctx.getImageData(0, 0, canvasRef.current!.width, canvasRef.current!.height)

    if (toolRef.current === 'pencil' || toolRef.current === 'brush' || toolRef.current === 'eraser') {
      // dot on a single click
      ctx.beginPath()
      ctx.arc(p.x, p.y, ctx.lineWidth / 2, 0, Math.PI * 2)
      ctx.fill()
    }
  }

  const onPointerMove = (e: React.PointerEvent) => {
    const ctx = ctxRef.current
    if (!ctx) return
    const p = posFromEvent(e)
    setCoords({ x: Math.round(p.x), y: Math.round(p.y) })
    if (!drawing.current) return
    const t = toolRef.current

    if (t === 'pencil' || t === 'brush' || t === 'eraser') {
      ctx.beginPath()
      ctx.moveTo(last.current.x, last.current.y)
      ctx.lineTo(p.x, p.y)
      ctx.stroke()
      last.current = p
      return
    }

    // shapes: restore snapshot then draw preview
    if (snapshot.current) ctx.putImageData(snapshot.current, 0, 0)
    strokeStyleFor(ctx)
    const s = start.current
    ctx.beginPath()
    if (t === 'line') {
      ctx.moveTo(s.x, s.y)
      ctx.lineTo(p.x, p.y)
      ctx.stroke()
    } else if (t === 'rect') {
      ctx.strokeRect(s.x, s.y, p.x - s.x, p.y - s.y)
    } else if (t === 'ellipse') {
      ctx.ellipse(
        (s.x + p.x) / 2,
        (s.y + p.y) / 2,
        Math.abs(p.x - s.x) / 2,
        Math.abs(p.y - s.y) / 2,
        0,
        0,
        Math.PI * 2,
      )
      ctx.stroke()
    }
  }

  const endStroke = (e: React.PointerEvent) => {
    if (!drawing.current) return
    drawing.current = false
    snapshot.current = null
    try {
      ;(e.target as HTMLElement).releasePointerCapture(e.pointerId)
    } catch {}
  }

  const clearCanvas = () => {
    const ctx = ctxRef.current
    if (ctx) fillWhite(ctx)
    setFileOpen(false)
  }

  const download = (type: 'image/jpeg' | 'image/png') => {
    const canvas = canvasRef.current
    if (!canvas) return
    const link = document.createElement('a')
    link.download = type === 'image/jpeg' ? 'untitled.jpg' : 'untitled.png'
    link.href = canvas.toDataURL(type, 0.95)
    link.click()
    setFileOpen(false)
  }

  const menus = ['File', 'Edit', 'View', 'Image', 'Colors', 'Help']

  return (
    <div
      className="-m-3 flex h-[calc(100%+1.5rem)] w-[calc(100%+1.5rem)] flex-col overflow-hidden bg-[#ece9d8] font-sans text-[12px] text-black"
      onClick={() => fileOpen && setFileOpen(false)}
    >
      {/* Menu bar */}
      <div className="relative flex shrink-0 items-center gap-0.5 border-b border-[#aca899] bg-[#ece9d8] px-1 py-0.5">
        {menus.map((m) => (
          <button
            key={m}
            className={`rounded-sm px-2 py-0.5 text-[12px] hover:bg-[#316ac5] hover:text-white ${
              m === 'File' && fileOpen ? 'bg-[#316ac5] text-white' : ''
            }`}
            onClick={(e) => {
              e.stopPropagation()
              if (m === 'File') setFileOpen((o) => !o)
            }}
          >
            <span className="underline decoration-1 underline-offset-2">{m[0]}</span>
            {m.slice(1)}
          </button>
        ))}

        {fileOpen ? (
          <div
            className="xp-inset absolute left-1 top-[26px] z-20 w-52 rounded-sm border border-[#aca899] bg-[#f4f3ee] py-1 shadow-[2px_2px_6px_rgba(0,0,0,0.35)]"
            onClick={(e) => e.stopPropagation()}
          >
            <MenuRow label="New / Clear" onClick={clearCanvas} />
            <div className="my-1 border-t border-[#d9d6cb]" />
            <MenuRow label="Save as JPG" onClick={() => download('image/jpeg')} />
            <MenuRow label="Save as PNG" onClick={() => download('image/png')} />
          </div>
        ) : null}
      </div>

      {/* Middle: toolbar + canvas */}
      <div className="flex min-h-0 flex-1">
        {/* Left tool palette */}
        <div className="flex w-[58px] shrink-0 flex-col items-center gap-2 border-r border-[#aca899] bg-[#ece9d8] py-2">
          <div className="grid grid-cols-2 gap-1">
            {TOOL_META.map((t) => (
              <button
                key={t.id}
                title={t.label}
                aria-label={t.label}
                aria-pressed={tool === t.id}
                className={`grid h-6 w-6 place-items-center border ${
                  tool === t.id
                    ? 'border-[#7f7f7f] bg-white shadow-[inset_1px_1px_2px_rgba(0,0,0,0.3)]'
                    : 'border-transparent hover:border-[#7f9db9] hover:bg-[#dfe6f2]'
                }`}
                onClick={() => setTool(t.id)}
              >
                {t.icon}
              </button>
            ))}
          </div>

          {/* Line/brush width selector (like Paint's option box) */}
          <div className="xp-inset mt-1 flex w-11 flex-col items-center gap-1.5 rounded-sm p-1.5">
            {SIZES.map((s) => (
              <button
                key={s}
                aria-label={`Size ${s}`}
                aria-pressed={size === s}
                className={`flex h-4 w-full items-center justify-center ${
                  size === s ? 'bg-[#316ac5]' : 'hover:bg-[#dfe6f2]'
                }`}
                onClick={() => setSize(s)}
              >
                <span
                  className="rounded-full"
                  style={{
                    width: `${Math.min(s + 2, 16)}px`,
                    height: `${Math.max(2, s / 2)}px`,
                    background: size === s ? '#fff' : '#000',
                    borderRadius: '9999px',
                  }}
                />
              </button>
            ))}
          </div>
        </div>

        {/* Canvas area */}
        <div className="min-w-0 flex-1 bg-[#808080] p-2">
          <div
            ref={wrapRef}
            className="relative h-full w-full border border-[#000] bg-white"
          >
            <canvas
              ref={canvasRef}
              className="absolute inset-0 block touch-none"
              style={{ cursor: 'crosshair' }}
              onPointerDown={onPointerDown}
              onPointerMove={onPointerMove}
              onPointerUp={endStroke}
              onPointerLeave={(e) => {
                setCoords(null)
                endStroke(e)
              }}
            />
          </div>
        </div>
      </div>

      {/* Color palette */}
      <div className="flex shrink-0 items-center gap-2 border-t border-[#aca899] bg-[#ece9d8] px-2 py-1.5">
        <div
          className="grid h-9 w-9 shrink-0 place-items-center border border-[#808080] bg-white"
          title="Current color"
        >
          <span
            className="h-6 w-6 border border-[#404040]"
            style={{ background: color }}
          />
        </div>
        <div className="grid grid-flow-col grid-rows-2 gap-0.5">
          {PALETTE.map((c) => (
            <button
              key={c}
              aria-label={`Color ${c}`}
              className="h-4 w-4 border border-[#808080] transition-transform hover:scale-110"
              style={{ background: c }}
              onClick={() => {
                setColor(c)
                if (toolRef.current === 'eraser') setTool('pencil')
              }}
            />
          ))}
        </div>
      </div>

      {/* Status bar */}
      <div className="flex shrink-0 items-center justify-between border-t border-[#aca899] bg-[#ece9d8] px-2 py-0.5 text-[11px] text-neutral-700">
        <span className="xp-inset rounded-sm px-2 py-0.5">
          For Help, use the File menu to save your masterpiece.
        </span>
        <span className="xp-inset rounded-sm px-2 py-0.5 tabular-nums">
          {coords ? `${coords.x}, ${coords.y} px` : ''}
        </span>
      </div>
    </div>
  )
}

function MenuRow({ label, onClick }: { label: string; onClick: () => void }) {
  return (
    <button
      className="block w-full px-3 py-1 text-left text-[12px] hover:bg-[#316ac5] hover:text-white"
      onClick={onClick}
    >
      {label}
    </button>
  )
}

/* ---------- tiny tool glyphs ---------- */

function PencilGlyph() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" aria-hidden="true">
      <path d="M11 2l3 3-7 7-3 1 1-3z" fill="#f0c060" stroke="#7a5a10" strokeWidth="0.8" />
      <path d="M11 2l3 3-1.5 1.5-3-3z" fill="#d0d0d0" stroke="#7a7a7a" strokeWidth="0.6" />
    </svg>
  )
}
function BrushGlyph() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" aria-hidden="true">
      <rect x="9" y="1.5" width="2.4" height="8" rx="1" transform="rotate(45 10 5)" fill="#a0703a" />
      <path d="M3 11l3 3c1.5-.5 2.5-1.5 2-3l-2-2c-1.5-.5-2.5.5-3 2z" fill="#111" />
    </svg>
  )
}
function EraserGlyph() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" aria-hidden="true">
      <rect x="2" y="7" width="9" height="6" rx="1" transform="rotate(-25 6 10)" fill="#ff9bd0" stroke="#b03a70" strokeWidth="0.8" />
    </svg>
  )
}
function LineGlyph() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" aria-hidden="true">
      <line x1="3" y1="13" x2="13" y2="3" stroke="#111" strokeWidth="1.6" />
    </svg>
  )
}
function RectGlyph() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" aria-hidden="true">
      <rect x="2.5" y="4" width="11" height="8" fill="none" stroke="#111" strokeWidth="1.4" />
    </svg>
  )
}
function EllipseGlyph() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" aria-hidden="true">
      <ellipse cx="8" cy="8" rx="6" ry="4.5" fill="none" stroke="#111" strokeWidth="1.4" />
    </svg>
  )
}
