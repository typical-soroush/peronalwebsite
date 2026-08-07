'use client'

type WelcomeScreenProps = {
  onLogOn: () => void
}

/**
 * Full-screen Windows XP welcome / log-on screen, rebranded to
 * "Soroush's Website". Shown after the user picks "Turn Off".
 * Clicking a user tile returns to the desktop.
 */
export function WelcomeScreen({ onLogOn }: WelcomeScreenProps) {
  return (
    <div className="xp-welcome fixed inset-0 z-[100000] flex flex-col font-sans text-white">
      {/* Top hairline */}
      <div className="h-[6px] w-full bg-gradient-to-b from-[#3a72d6] to-[#2b5cbf]" />

      {/* Main split area */}
      <div className="flex flex-1 items-center">
        {/* Left: branding */}
        <div className="flex flex-1 flex-col items-end pr-10">
          <div className="text-right">
            <p className="text-[15px] font-light tracking-wide text-white/90">
              Welcome to
            </p>
            <h1 className="text-[52px] font-bold leading-[1.05] tracking-tight text-white drop-shadow-[2px_2px_2px_rgba(0,0,0,0.25)]">
              Soroush&apos;s
            </h1>
            <h1 className="text-[52px] font-bold leading-[1.05] tracking-tight text-white drop-shadow-[2px_2px_2px_rgba(0,0,0,0.25)]">
              Website
            </h1>
            <p className="mt-6 text-[17px] font-light text-white/95">
              To begin, click your user name
            </p>
          </div>
        </div>

        {/* Divider */}
        <div className="h-[62%] w-px bg-white/40" />

        {/* Right: user tiles */}
        <div className="flex flex-1 flex-col gap-2 pl-10">
          <button
            onClick={onLogOn}
            className="group flex items-center gap-3 rounded-md px-3 py-2 text-left hover:bg-white/10"
          >
            <img
              src="/xp-avatar.png"
              alt=""
              aria-hidden="true"
              className="h-14 w-14 rounded-md border-2 border-white/80 object-cover shadow-md"
            />
            <span className="text-[22px] font-semibold text-white drop-shadow-[1px_1px_1px_rgba(0,0,0,0.35)] group-hover:underline">
              Soroush
            </span>
          </button>

          <button
            onClick={onLogOn}
            className="group flex items-center gap-3 rounded-md px-3 py-2 text-left hover:bg-white/10"
          >
            <span className="grid h-14 w-14 place-items-center rounded-md border-2 border-white/60 bg-white/15 text-[26px] shadow-md">
              ♟
            </span>
            <span className="text-[20px] font-medium text-white/80 group-hover:underline">
              Guest
            </span>
          </button>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="xp-welcome-bar flex items-center justify-between px-6 py-3">
        <button
          onClick={onLogOn}
          className="flex items-center gap-2.5 text-[16px] font-medium text-white hover:underline"
        >
          <img
            src="/xp-turnoff.png"
            alt=""
            aria-hidden="true"
            className="h-8 w-8 object-contain"
          />
          Turn off computer
        </button>
        <p className="max-w-[420px] text-right text-[12px] leading-snug text-white/85">
          After you log on, you can explore my projects. Just click a folder or
          the Start menu.
        </p>
      </div>
    </div>
  )
}
