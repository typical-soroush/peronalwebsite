'use client'

import type React from 'react'
import { projects } from '@/lib/projects'
import {
  FolderIcon,
  MailIcon,
  PaintIcon,
  RageBaitIcon,
  RecycleIcon,
  ResumeIcon,
  UserIcon,
} from './xp-icons'

type StartMenuProps = {
  onLaunch: (id: string) => void
  onClose: () => void
  userName: string
  onLogin: () => void
  onLogout: () => void
}

function MenuItem({
  icon,
  title,
  subtitle,
  onClick,
}: {
  icon: React.ReactNode
  title: string
  subtitle?: string
  onClick: () => void
}) {
  return (
    <button
      className="flex w-full items-center gap-2.5 rounded-sm px-2 py-1.5 text-left hover:bg-[#2f71cd] hover:text-white"
      onClick={onClick}
    >
      <span className="grid h-8 w-8 shrink-0 place-items-center">{icon}</span>
      <span className="flex flex-col">
        <span className="text-[12px] font-bold leading-tight">{title}</span>
        {subtitle ? (
          <span className="text-[11px] leading-tight opacity-70">{subtitle}</span>
        ) : null}
      </span>
    </button>
  )
}

export function StartMenu({
  onLaunch,
  onClose,
  userName,
  onLogin,
  onLogout,
}: StartMenuProps) {
  const go = (id: string) => {
    onLaunch(id)
    onClose()
  }
  const isGuest = userName === 'Guest'

  return (
    <div
      className="xp-startmenu absolute bottom-10 left-0 z-[9999] w-[380px]"
      onClick={(e) => e.stopPropagation()}
    >
      {/* Header — user profile */}
      <div className="xp-startmenu-header flex items-center gap-2.5 px-3 py-2">
        <div className="grid h-10 w-10 shrink-0 place-items-center overflow-hidden rounded-sm border border-white/60 bg-white/25">
          <img
            src="/xp-avatar.png"
            alt=""
            aria-hidden="true"
            className="h-full w-full object-cover"
          />
        </div>
        <span className="text-[15px] font-bold text-white drop-shadow-[1px_1px_1px_rgba(0,0,0,0.5)]">
          {userName}
        </span>
      </div>

      {/* Columns */}
      <div className="grid grid-cols-[1fr_150px]">
        {/* Left: programs */}
        <div className="flex flex-col gap-0.5 bg-white p-2 text-black">
          <p className="px-2 pb-1 text-[11px] font-bold text-neutral-500">
            My Products
          </p>
          {projects.map((p) => (
            <MenuItem
              key={p.id}
              icon={<FolderIcon size={30} accent={p.accent} />}
              title={p.name}
              subtitle={p.tagline}
              onClick={() => go(p.id)}
            />
          ))}
        </div>

        {/* Right: places */}
        <div className="flex flex-col gap-0.5 border-l border-[#a7c1e8] bg-[#d3e5fa] p-2 text-[#0a3a80]">
          <MenuItem
            icon={<UserIcon size={28} />}
            title="About Me"
            onClick={() => go('about')}
          />
          <MenuItem
            icon={<MailIcon size={28} />}
            title="Contact"
            onClick={() => go('contact')}
          />
          <MenuItem
            icon={<ResumeIcon size={28} />}
            title="Resume"
            onClick={() => go('resume')}
          />
          <MenuItem
            icon={<PaintIcon size={28} />}
            title="Paint"
            onClick={() => go('paint')}
          />
          <MenuItem
            icon={<RageBaitIcon size={28} />}
            title="Rage Bait"
            onClick={() => go('ragebait')}
          />
          <div className="my-1 border-t border-[#a7c1e8]" />
          <MenuItem
            icon={<RecycleIcon size={28} />}
            title="Recycle Bin"
            onClick={() => go('recycle')}
          />
        </div>
      </div>

      {/* Footer */}
      <div className="xp-startmenu-header flex items-center justify-end gap-4 px-3 py-1.5">
        <button
          className="flex items-center gap-1.5 text-[12px] text-white hover:underline"
          onClick={() => {
            if (isGuest) onLogin()
            else onLogout()
            onClose()
          }}
        >
          <span className="grid h-6 w-6 place-items-center rounded-sm bg-[#3c9d1c] text-white">
            {isGuest ? '→' : '←'}
          </span>
          {isGuest ? 'Log On' : 'Log Off'}
        </button>
        <button
          className="flex items-center gap-1.5 text-[12px] text-white hover:underline"
          onClick={onClose}
        >
          <span className="grid h-6 w-6 place-items-center rounded-sm bg-[#e8792a] text-white">
            ⏻
          </span>
          Turn Off
        </button>
      </div>
    </div>
  )
}
