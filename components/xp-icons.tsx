import type React from 'react'

type IconProps = { size?: number; accent?: string }

/** Classic Windows XP opened-folder icon (bitmap). */
export function FolderIcon({ size = 44 }: IconProps) {
  return (
    <img
      src="/xp-folder.png"
      width={size}
      height={size}
      alt=""
      aria-hidden="true"
      draggable={false}
      className="pointer-events-none select-none object-contain"
      style={{ width: size, height: size }}
    />
  )
}

/** "Resume" — modern XP documents folder (bitmap). */
export function ResumeIcon({ size = 44 }: IconProps) {
  return (
    <img
      src="/xp-resume.png"
      width={size}
      height={size}
      alt=""
      aria-hidden="true"
      draggable={false}
      className="pointer-events-none select-none object-contain"
      style={{ width: size, height: size }}
    />
  )
}

/** "About Me" — Counter-Strike logo mark (bitmap). */
export function UserIcon({ size = 44 }: IconProps) {
  return (
    <img
      src="/xp-about.png"
      width={size}
      height={size}
      alt=""
      aria-hidden="true"
      draggable={false}
      className="pointer-events-none select-none object-contain"
      style={{ width: size, height: size }}
    />
  )
}

/** "Contact" — classic Windows XP "My Computer" icon (bitmap). */
export function MailIcon({ size = 44 }: IconProps) {
  return (
    <img
      src="/xp-computer.png"
      width={size}
      height={size}
      alt=""
      aria-hidden="true"
      draggable={false}
      className="pointer-events-none select-none object-contain"
      style={{ width: size, height: size }}
    />
  )
}

/** Recycle Bin — glassy Windows XP bin (bitmap). */
export function RecycleIcon({ size = 44 }: IconProps) {
  return (
    <img
      src="/xp-recycle.png"
      width={size}
      height={size}
      alt=""
      aria-hidden="true"
      draggable={false}
      className="pointer-events-none select-none object-contain"
      style={{ width: size, height: size }}
    />
  )
}

/** "Paint" — classic MS Paint XP logo (bitmap). */
export function PaintIcon({ size = 44 }: IconProps) {
  return (
    <img
      src="/xp-paint.png"
      width={size}
      height={size}
      alt=""
      aria-hidden="true"
      draggable={false}
      className="pointer-events-none select-none object-contain"
      style={{ width: size, height: size }}
    />
  )
}

/** "Rage Bait" — a shiny disc (nods to the DVD screensaver). */
export function RageBaitIcon({ size = 44 }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 48 48" aria-hidden="true">
      <defs>
        <radialGradient id="rb-disc" cx="38%" cy="34%" r="70%">
          <stop offset="0" stopColor="#ffffff" />
          <stop offset="0.35" stopColor="#8fd0ff" />
          <stop offset="0.7" stopColor="#3b6fe0" />
          <stop offset="1" stopColor="#122a7a" />
        </radialGradient>
      </defs>
      <circle cx="24" cy="24" r="19" fill="url(#rb-disc)" stroke="#0a1f5c" strokeWidth="1.2" />
      <circle cx="24" cy="24" r="10" fill="#0a1230" opacity="0.35" />
      <circle cx="24" cy="24" r="5" fill="#fff" stroke="#0a1f5c" strokeWidth="1" />
      <circle cx="24" cy="24" r="2" fill="#0a1230" />
      <path d="M13 15a15 15 0 0 1 12-4" fill="none" stroke="#ffffff" strokeWidth="2" strokeLinecap="round" opacity="0.8" />
    </svg>
  )
}

/** Small window glyph used in the taskbar / title bars. */
export function WindowGlyph({ size = 16 }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 16 16" aria-hidden="true">
      <rect x="1" y="2" width="14" height="12" rx="1.5" fill="#fff" stroke="#0a3aa0" />
      <rect x="1" y="2" width="14" height="4" rx="1.5" fill="#2a72e5" />
    </svg>
  )
}

/** Start-flag logo mark (simplified four-pane flag). */
export function StartFlag({ size = 22 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" aria-hidden="true">
      <g transform="rotate(-8 12 12)">
        <path d="M3 4c3-1 6-1 9 0v6c-3-1-6-1-9 0Z" fill="#f24d3d" />
        <path d="M12 4c3 1 6 1 9 0v6c-3 1-6 1-9 0Z" fill="#78c800" />
        <path d="M3 11c3-1 6-1 9 0v6c-3-1-6-1-9 0Z" fill="#2b8fea" />
        <path d="M12 11c3 1 6 1 9 0v6c-3 1-6 1-9 0Z" fill="#ffc60b" />
      </g>
    </svg>
  )
}
