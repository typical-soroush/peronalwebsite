'use client'

import { useState } from 'react'

type LoginDialogProps = {
  currentName: string
  onLogin: (name: string) => void
  onClose: () => void
}

export function LoginDialog({ currentName, onLogin, onClose }: LoginDialogProps) {
  const [name, setName] = useState(currentName === 'Guest' ? '' : currentName)

  const submit = () => {
    const trimmed = name.trim()
    onLogin(trimmed.length ? trimmed : 'Guest')
  }

  return (
    <div
      className="absolute inset-0 z-[10000] grid place-items-center bg-black/30"
      onClick={onClose}
    >
      <div
        className="xp-window w-[340px]"
        role="dialog"
        aria-modal="true"
        aria-label="Log On to Windows"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Title bar */}
        <div className="xp-titlebar flex items-center justify-between px-2 py-1">
          <span className="text-[12px] font-bold text-white drop-shadow-[1px_1px_1px_rgba(0,0,0,0.5)]">
            Log On to Windows
          </span>
          <button
            aria-label="Close"
            className="xp-caption-btn xp-caption-close text-[11px]"
            onClick={onClose}
          >
            x
          </button>
        </div>

        {/* Body */}
        <div className="flex flex-col gap-3 p-4">
          <div className="flex items-center gap-3">
            <img
              src="/xp-about.png"
              alt=""
              aria-hidden="true"
              className="h-12 w-12 rounded-sm border border-[#7f9db9] bg-white object-contain p-0.5"
            />
            <p className="text-[12px] leading-relaxed text-neutral-700">
              Type a user name to personalize your session, or continue as{' '}
              <span className="font-bold">Guest</span>.
            </p>
          </div>

          <label className="flex flex-col gap-1 text-[12px] text-neutral-700">
            User name:
            <input
              autoFocus
              value={name}
              maxLength={24}
              placeholder="Guest"
              onChange={(e) => setName(e.target.value)}
              onKeyDown={(e) => {
                if (e.nativeEvent.isComposing || e.keyCode === 229) return
                if (e.key === 'Enter') submit()
              }}
              className="xp-inset rounded-sm px-2 py-1 text-[13px] text-black outline-none"
            />
          </label>

          <div className="mt-1 flex justify-end gap-2">
            <button
              className="xp-button min-w-[72px] text-[12px]"
              onClick={submit}
            >
              Log On
            </button>
            <button
              className="xp-button min-w-[72px] text-[12px]"
              onClick={onClose}
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
