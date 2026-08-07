'use client'

import { useCallback, useEffect, useMemo, useState } from 'react'
import { projects } from '@/lib/projects'
import { DesktopIcon } from './desktop-icon'
import { LoginDialog } from './login-dialog'
import { PaintApp } from './paint-app'
import { RageBaitApp } from './ragebait-app'
import { StartMenu } from './start-menu'
import { Taskbar, type TaskItem } from './taskbar'
import { WelcomeScreen } from './welcome-screen'
import {
  AboutContent,
  ContactContent,
  ProjectContent,
  ResumeContent,
} from './window-contents'
import {
  FolderIcon,
  MailIcon,
  PaintIcon,
  RageBaitIcon,
  RecycleIcon,
  ResumeIcon,
  UserIcon,
  WindowGlyph,
} from './xp-icons'
import { XpWindow } from './xp-window'

type AppMeta = {
  title: string
  width: number
  height: number
  accent?: string
  render: () => React.ReactNode
}

/** Registry of everything that can be opened as a window. */
function useApps(): Record<string, AppMeta> {
  return useMemo(() => {
    const apps: Record<string, AppMeta> = {
      about: {
        title: 'About Me',
        width: 460,
        height: 440,
        render: () => <AboutContent />,
      },
      contact: {
        title: 'Contact — Address Book',
        width: 420,
        height: 380,
        render: () => <ContactContent />,
      },
      resume: {
        title: 'Resume — Soroush Amirostovar',
        width: 500,
        height: 560,
        render: () => <ResumeContent />,
      },
      paint: {
        title: 'untitled - Paint',
        width: 640,
        height: 480,
        render: () => <PaintApp />,
      },
      ragebait: {
        title: 'Rage Bait — DVD',
        width: 620,
        height: 460,
        render: () => <RageBaitApp />,
      },
      recycle: {
        title: 'Recycle Bin',
        width: 380,
        height: 260,
        render: () => (
          <div className="grid h-full place-items-center text-center text-neutral-600">
            <div>
              <RecycleIcon size={56} />
              <p className="mt-3 text-[13px]">The Recycle Bin is empty.</p>
              <p className="text-[11px] text-neutral-400">
                No abandoned side-projects here. Yet.
              </p>
            </div>
          </div>
        ),
      },
    }
    for (const p of projects) {
      apps[p.id] = {
        title: `${p.name} — Properties`,
        width: 560,
        height: 540,
        accent: p.accent,
        render: () => <ProjectContent project={p} />,
      }
    }
    return apps
  }, [])
}

type WinState = { id: string; minimized: boolean; ox: number; oy: number }

const ICON_COL_X = 12
const ICON_START_Y = 12
const ICON_STEP_Y = 84

export function XpDesktop() {
  const apps = useApps()
  const [windows, setWindows] = useState<WinState[]>([])
  const [startOpen, setStartOpen] = useState(false)
  const [selected, setSelected] = useState<string | null>(null)
  const [openCount, setOpenCount] = useState(0)
  const [userName, setUserName] = useState('Guest')
  const [loginOpen, setLoginOpen] = useState(false)
  const [loggedOff, setLoggedOff] = useState(false)

  const topId = useMemo(() => {
    const visible = windows.filter((w) => !w.minimized)
    return visible.length ? visible[visible.length - 1].id : null
  }, [windows])

  const openWindow = useCallback(
    (id: string) => {
      if (!apps[id]) return
      setWindows((prev) => {
        const existing = prev.find((w) => w.id === id)
        if (existing) {
          // bring to front + unminimize
          return [
            ...prev.filter((w) => w.id !== id),
            { ...existing, minimized: false },
          ]
        }
        const offset = (openCount % 6) * 26
        return [
          ...prev,
          { id, minimized: false, ox: 130 + offset, oy: 48 + offset },
        ]
      })
      setOpenCount((c) => c + 1)
    },
    [apps, openCount],
  )

  const focusWindow = useCallback((id: string) => {
    setWindows((prev) => {
      const w = prev.find((x) => x.id === id)
      if (!w) return prev
      return [...prev.filter((x) => x.id !== id), { ...w, minimized: false }]
    })
  }, [])

  const closeWindow = useCallback((id: string) => {
    setWindows((prev) => prev.filter((w) => w.id !== id))
  }, [])

  const minimizeWindow = useCallback((id: string) => {
    setWindows((prev) =>
      prev.map((w) => (w.id === id ? { ...w, minimized: true } : w)),
    )
  }, [])

  const taskClick = useCallback(
    (id: string) => {
      const w = windows.find((x) => x.id === id)
      if (!w) return
      if (!w.minimized && topId === id) {
        minimizeWindow(id)
      } else {
        focusWindow(id)
      }
    },
    [windows, topId, minimizeWindow, focusWindow],
  )

  const tasks: TaskItem[] = windows.map((w) => ({
    id: w.id,
    title: apps[w.id]?.title ?? w.id,
    active: topId === w.id,
    minimized: w.minimized,
  }))

  const desktopIcons = useMemo(
    () => [
      ...projects.map((p) => ({
        id: p.id,
        label: p.shortName,
        icon: <FolderIcon accent={p.accent} />,
      })),
      { id: 'resume', label: 'Resume', icon: <ResumeIcon /> },
      { id: 'paint', label: 'Paint', icon: <PaintIcon /> },
      { id: 'ragebait', label: 'Rage Bait', icon: <RageBaitIcon /> },
      { id: 'about', label: 'About Me', icon: <UserIcon /> },
      { id: 'contact', label: 'Contact', icon: <MailIcon /> },
      { id: 'recycle', label: 'Recycle Bin', icon: <RecycleIcon /> },
    ],
    [],
  )

  // Free-form position for every desktop icon, laid out in a column initially.
  const [iconPos, setIconPos] = useState<Record<string, { x: number; y: number }>>(
    () =>
      Object.fromEntries(
        desktopIcons.map((ic, i) => [
          ic.id,
          { x: ICON_COL_X, y: ICON_START_Y + i * ICON_STEP_Y },
        ]),
      ),
  )
  // Stacking order so the icon being dragged renders above the others.
  const [iconOrder, setIconOrder] = useState<string[]>(() =>
    desktopIcons.map((ic) => ic.id),
  )

  const moveIcon = useCallback((id: string, x: number, y: number) => {
    setIconPos((prev) => ({ ...prev, [id]: { x, y } }))
  }, [])

  const raiseIcon = useCallback((id: string) => {
    setIconOrder((prev) => [...prev.filter((i) => i !== id), id])
  }, [])

  // Snap corner icons into place once we know the viewport.
  useEffect(() => {
    const ICON_W = 76
    const ICON_H = 88
    const TASKBAR_H = 34
    const place = () => {
      setIconPos((prev) => ({
        ...prev,
        recycle: {
          x: window.innerWidth - ICON_W - 12,
          y: window.innerHeight - TASKBAR_H - ICON_H - 8,
        },
        paint: {
          x: window.innerWidth - ICON_W - 12,
          y: 12,
        },
      }))
    }
    place()
  }, [])

  return (
    <main
      className="xp-desktop relative h-dvh w-full overflow-hidden"
      onClick={() => {
        setSelected(null)
        setStartOpen(false)
      }}
    >
      {/* Desktop icons — freely draggable anywhere on the desktop */}
      {desktopIcons.map((ic) => (
        <div
          key={ic.id}
          style={{ zIndex: 10 + iconOrder.indexOf(ic.id) }}
          className="absolute left-0 top-0"
        >
          <DesktopIcon
            label={ic.label}
            icon={ic.icon}
            selected={selected === ic.id}
            x={iconPos[ic.id]?.x ?? 0}
            y={iconPos[ic.id]?.y ?? 0}
            onSelect={() => setSelected(ic.id)}
            onOpen={() => openWindow(ic.id)}
            onMove={(x, y) => moveIcon(ic.id, x, y)}
            onDragStart={() => raiseIcon(ic.id)}
          />
        </div>
      ))}

      {/* Windows */}
      {windows.map((w, index) => {
        if (w.minimized) return null
        const app = apps[w.id]
        if (!app) return null
        return (
          <XpWindow
            key={w.id}
            title={app.title}
            icon={<WindowGlyph size={15} />}
            zIndex={100 + index}
            active={topId === w.id}
            initial={{ x: w.ox, y: w.oy, width: app.width, height: app.height }}
            onFocus={() => focusWindow(w.id)}
            onClose={() => closeWindow(w.id)}
            onMinimize={() => minimizeWindow(w.id)}
          >
            {app.render()}
          </XpWindow>
        )
      })}

      {/* Start menu */}
      {startOpen ? (
        <StartMenu
          onLaunch={openWindow}
          onClose={() => setStartOpen(false)}
          userName={userName}
          onLogin={() => setLoginOpen(true)}
          onLogout={() => setUserName('Guest')}
          onTurnOff={() => {
            setStartOpen(false)
            setLoggedOff(true)
          }}
        />
      ) : null}

      {/* Log On dialog */}
      {loginOpen ? (
        <LoginDialog
          currentName={userName}
          onLogin={(name) => {
            setUserName(name)
            setLoginOpen(false)
          }}
          onClose={() => setLoginOpen(false)}
        />
      ) : null}

      {/* Taskbar */}
      <Taskbar
        startOpen={startOpen}
        onToggleStart={() => setStartOpen((s) => !s)}
        tasks={tasks}
        onTaskClick={taskClick}
      />

      {/* Log-off / welcome screen */}
      {loggedOff ? (
        <WelcomeScreen onLogOn={() => setLoggedOff(false)} />
      ) : null}
    </main>
  )
}
