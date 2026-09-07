'use client'

import { useEffect } from 'react'

/**
 * Plays a short, percussive Windows XP-style "click" on every user click.
 *
 * The sound is synthesized with the Web Audio API (a fast filtered noise burst
 * plus a soft tonal thump) so it needs no audio asset. The AudioContext is
 * created lazily on the first gesture to satisfy browser autoplay policies.
 */
export function ClickSound() {
  useEffect(() => {
    type WebkitWindow = Window & {
      webkitAudioContext?: typeof AudioContext
    }
    const Ctor =
      window.AudioContext ?? (window as WebkitWindow).webkitAudioContext
    if (!Ctor) return

    let ctx: AudioContext | null = null

    const play = () => {
      if (!ctx) ctx = new Ctor()
      if (ctx.state === 'suspended') void ctx.resume()

      const now = ctx.currentTime
      const master = ctx.createGain()
      master.gain.value = 0.28
      master.connect(ctx.destination)

      // Noise burst — the crisp "tick".
      const frames = Math.floor(ctx.sampleRate * 0.03)
      const buffer = ctx.createBuffer(1, frames, ctx.sampleRate)
      const data = buffer.getChannelData(0)
      for (let i = 0; i < frames; i++) {
        data[i] = (Math.random() * 2 - 1) * (1 - i / frames)
      }
      const noise = ctx.createBufferSource()
      noise.buffer = buffer

      const bandpass = ctx.createBiquadFilter()
      bandpass.type = 'bandpass'
      bandpass.frequency.value = 2600
      bandpass.Q.value = 0.9

      const noiseGain = ctx.createGain()
      noiseGain.gain.setValueAtTime(0.9, now)
      noiseGain.gain.exponentialRampToValueAtTime(0.001, now + 0.05)

      noise.connect(bandpass)
      bandpass.connect(noiseGain)
      noiseGain.connect(master)

      // Soft tonal thump for body.
      const osc = ctx.createOscillator()
      osc.type = 'sine'
      osc.frequency.setValueAtTime(320, now)
      osc.frequency.exponentialRampToValueAtTime(140, now + 0.04)
      const oscGain = ctx.createGain()
      oscGain.gain.setValueAtTime(0.35, now)
      oscGain.gain.exponentialRampToValueAtTime(0.001, now + 0.06)
      osc.connect(oscGain)
      oscGain.connect(master)

      noise.start(now)
      noise.stop(now + 0.05)
      osc.start(now)
      osc.stop(now + 0.06)
    }

    window.addEventListener('pointerdown', play)
    return () => window.removeEventListener('pointerdown', play)
  }, [])

  return null
}
