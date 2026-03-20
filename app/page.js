'use client'

import { useState, useEffect, useRef, useCallback } from 'react'

/* ═══════════════════════════════════════════════════════════
   CONSTANTS
═══════════════════════════════════════════════════════════ */
const GAME_SECS   = 60
const ITEM_BASE   = 76   // px — big enough for 4-year-old fingers
const SPAWN_SLOW  = 1400  // ms between spawns (start)
const SPAWN_FAST  = 550   // ms between spawns (end)
const SPEED_SLOW  = 1.6  // px per frame (start)
const SPEED_FAST  = 4.0  // px per frame (end)

const CHARS = [
  {
    id: 'rumi',
    name: 'ルミ',
    nameEn: 'RUMI',
    role: 'リーダー',
    emoji: '👑',
    color: '#C084FC',
    dark: '#6D28D9',
    light: '#F3E8FF',
    bg: 'linear-gradient(160deg, #0f0720 0%, #2a0855 55%, #5b21b6 100%)',
    desc: 'つよくてやさしい\nリーダー！',
    bgAccents: ['👑', '✦', '✦', '💜', '✦'],
  },
  {
    id: 'mira',
    name: 'ミラ',
    nameEn: 'MIRA',
    role: 'ダンサー',
    emoji: '🔥',
    color: '#FB7185',
    dark: '#BE123C',
    light: '#FFF1F2',
    bg: 'linear-gradient(160deg, #1c0507 0%, #4c0519 55%, #9f1239 100%)',
    desc: 'おどりのてんさい！',
    bgAccents: ['🔥', '♪', '♫', '❤️', '♪'],
  },
  {
    id: 'zoey',
    name: 'ゾーイ',
    nameEn: 'ZOEY',
    role: 'ラッパー',
    emoji: '🎤',
    color: '#38BDF8',
    dark: '#0369A1',
    light: '#E0F2FE',
    bg: 'linear-gradient(160deg, #020c1a 0%, #0c2d4c 55%, #075985 100%)',
    desc: 'クールでかわいい\nラッパー！',
    bgAccents: ['🎤', '💎', '✦', '💙', '💎'],
  },
]

const DROP_ITEMS = [
  { emoji: '⭐', pts: 10, glow: '#FFD700' },
  { emoji: '💜', pts: 10, glow: '#C084FC' },
  { emoji: '❤️', pts: 10, glow: '#FB7185' },
  { emoji: '💙', pts: 10, glow: '#38BDF8' },
  { emoji: '🌟', pts: 15, glow: '#FFD700' },
  { emoji: '💫', pts: 15, glow: '#F0ABFC' },
  { emoji: '✨', pts: 10, glow: '#E0F2FE' },
  { emoji: '🎵', pts: 10, glow: '#A78BFA' },
  { emoji: '🎶', pts: 15, glow: '#818CF8' },
  { emoji: '💎', pts: 20, glow: '#93C5FD' },
  { emoji: '🌸', pts: 10, glow: '#FBB6CE' },
  { emoji: '🦋', pts: 20, glow: '#C4B5FD' },
]
const SPECIAL_ITEMS = [
  { emoji: '🌈', pts: 50, glow: '#FFD700' },
  { emoji: '🏆', pts: 50, glow: '#FFD700' },
  { emoji: '🎊', pts: 40, glow: '#FB923C' },
  { emoji: '👑', pts: 40, glow: '#FFD700' },
]

/* ═══════════════════════════════════════════════════════════
   AUDIO ENGINE
═══════════════════════════════════════════════════════════ */
function makeAudio() {
  let ctx = null
  let master = null
  let running = false
  let schedTimer = null
  let nextBeatTime = 0
  let beatCount = 0

  // K-pop melody: C major pentatonic, 16 quarter notes
  const MELODY = [
    659.25, 783.99, 880,    783.99,
    659.25, 587.33, 523.25, 659.25,
    783.99, 880,    1046.5, 880,
    783.99, 659.25, 523.25, 0,
  ]

  function init() {
    if (ctx) return
    ctx = new (window.AudioContext || window.webkitAudioContext)()
    master = ctx.createGain()
    master.gain.value = 0.38
    master.connect(ctx.destination)
  }

  function kick(t) {
    const o = ctx.createOscillator()
    const g = ctx.createGain()
    o.connect(g); g.connect(master)
    o.frequency.setValueAtTime(125, t)
    o.frequency.exponentialRampToValueAtTime(36, t + 0.18)
    g.gain.setValueAtTime(0.95, t)
    g.gain.exponentialRampToValueAtTime(0.001, t + 0.32)
    o.start(t); o.stop(t + 0.32)
  }

  function snare(t) {
    const sz = Math.ceil(ctx.sampleRate * 0.16)
    const buf = ctx.createBuffer(1, sz, ctx.sampleRate)
    const d = buf.getChannelData(0)
    for (let i = 0; i < sz; i++) d[i] = (Math.random() * 2 - 1) * 0.26
    const src = ctx.createBufferSource()
    src.buffer = buf
    const g = ctx.createGain()
    const f = ctx.createBiquadFilter()
    f.type = 'highpass'; f.frequency.value = 1400
    src.connect(f); f.connect(g); g.connect(master)
    g.gain.setValueAtTime(0.62, t)
    g.gain.exponentialRampToValueAtTime(0.001, t + 0.16)
    src.start(t); src.stop(t + 0.16)
  }

  function hat(t, vol = 0.16) {
    const sz = Math.ceil(ctx.sampleRate * 0.048)
    const buf = ctx.createBuffer(1, sz, ctx.sampleRate)
    const d = buf.getChannelData(0)
    for (let i = 0; i < sz; i++) d[i] = Math.random() * 2 - 1
    const src = ctx.createBufferSource()
    src.buffer = buf
    const g = ctx.createGain()
    const f = ctx.createBiquadFilter()
    f.type = 'highpass'; f.frequency.value = 9000
    src.connect(f); f.connect(g); g.connect(master)
    g.gain.setValueAtTime(vol, t)
    g.gain.exponentialRampToValueAtTime(0.001, t + 0.048)
    src.start(t); src.stop(t + 0.048)
  }

  function bass(t, freq) {
    const o = ctx.createOscillator()
    const g = ctx.createGain()
    o.type = 'triangle'
    o.connect(g); g.connect(master)
    o.frequency.value = freq / 2
    g.gain.setValueAtTime(0.18, t)
    g.gain.exponentialRampToValueAtTime(0.001, t + 0.22)
    o.start(t); o.stop(t + 0.22)
  }

  function melNote(t, freq, dur) {
    if (!freq) return
    const o = ctx.createOscillator()
    const g = ctx.createGain()
    o.type = 'sine'
    o.connect(g); g.connect(master)
    o.frequency.value = freq
    g.gain.setValueAtTime(0, t)
    g.gain.linearRampToValueAtTime(0.22, t + 0.04)
    g.gain.setValueAtTime(0.22, t + dur * 0.82)
    g.gain.linearRampToValueAtTime(0.001, t + dur)
    o.start(t); o.stop(t + dur)
  }

  // Beat pattern per 16th note step (0-15 = one bar)
  const PATTERN = [
    ['K', 'H'], ['H'], ['H'],       ['H'],
    ['S', 'H'], ['H'], ['H'],       ['H', 'K'],
    ['K', 'H'], ['H'], ['H'],       ['H'],
    ['S', 'H'], ['H'], ['K', 'H'],  ['H'],
  ]

  const BASS_PAT = [523.25, 0, 0, 0, 392, 0, 0, 0, 440, 0, 0, 0, 523.25, 0, 0, 0]

  function schedule() {
    if (!ctx || !running) return
    const sixteenth = (60 / 128) / 4
    const quarter   = sixteenth * 4

    while (nextBeatTime < ctx.currentTime + 0.1) {
      const step = beatCount % 16

      PATTERN[step].forEach(x => {
        if (x === 'K') kick(nextBeatTime)
        else if (x === 'S') snare(nextBeatTime)
        else hat(nextBeatTime)
      })

      if (BASS_PAT[step]) bass(nextBeatTime, BASS_PAT[step])

      if (beatCount % 4 === 0) {
        const melIdx = (Math.floor(beatCount / 4)) % MELODY.length
        melNote(nextBeatTime, MELODY[melIdx], quarter * 0.88)
      }

      beatCount++
      nextBeatTime += sixteenth
    }
  }

  return {
    start() {
      init()
      if (ctx.state === 'suspended') ctx.resume()
      if (running) return
      running = true
      beatCount = 0
      nextBeatTime = ctx.currentTime + 0.05
      schedTimer = setInterval(() => { if (running) schedule() }, 20)
    },

    stop() {
      running = false
      if (schedTimer) { clearInterval(schedTimer); schedTimer = null }
      if (ctx) ctx.suspend()
    },

    sfxCatch() {
      if (!ctx || ctx.state !== 'running') return
      const t = ctx.currentTime
      const o = ctx.createOscillator()
      const g = ctx.createGain()
      o.type = 'sine'; o.connect(g); g.connect(master)
      o.frequency.setValueAtTime(880, t)
      o.frequency.exponentialRampToValueAtTime(1760, t + 0.12)
      g.gain.setValueAtTime(0.45, t)
      g.gain.exponentialRampToValueAtTime(0.001, t + 0.2)
      o.start(t); o.stop(t + 0.2)
    },

    sfxCombo() {
      if (!ctx || ctx.state !== 'running') return
      const t = ctx.currentTime
      const freqs = [880, 1046.5, 1318.5]
      freqs.forEach((f, i) => {
        const o = ctx.createOscillator()
        const g = ctx.createGain()
        o.type = 'sine'; o.connect(g); g.connect(master)
        o.frequency.value = f
        g.gain.setValueAtTime(0.38, t + i * 0.09)
        g.gain.exponentialRampToValueAtTime(0.001, t + i * 0.09 + 0.18)
        o.start(t + i * 0.09); o.stop(t + i * 0.09 + 0.18)
      })
    },

    sfxSpecial() {
      if (!ctx || ctx.state !== 'running') return
      const t = ctx.currentTime
      const freqs = [523.25, 659.25, 783.99, 1046.5]
      freqs.forEach((f, i) => {
        const o = ctx.createOscillator()
        const g = ctx.createGain()
        o.type = 'sine'; o.connect(g); g.connect(master)
        o.frequency.value = f
        g.gain.setValueAtTime(0.35, t + i * 0.07)
        g.gain.exponentialRampToValueAtTime(0.001, t + i * 0.07 + 0.25)
        o.start(t + i * 0.07); o.stop(t + i * 0.07 + 0.25)
      })
    },

    sfxGameOver() {
      if (!ctx) return
      if (ctx.state === 'suspended') ctx.resume()
      const t = ctx.currentTime + 0.1
      const freqs = [523.25, 659.25, 783.99, 1046.5]
      freqs.forEach((f, i) => {
        const o = ctx.createOscillator()
        const g = ctx.createGain()
        o.type = 'sine'; o.connect(g); g.connect(master)
        o.frequency.value = f
        g.gain.setValueAtTime(0.3, t + i * 0.18)
        g.gain.exponentialRampToValueAtTime(0.001, t + i * 0.18 + 0.4)
        o.start(t + i * 0.18); o.stop(t + i * 0.18 + 0.4)
      })
    },
  }
}

/* ═══════════════════════════════════════════════════════════
   SVG CHARACTERS  (viewBox 0 0 100 160)
═══════════════════════════════════════════════════════════ */

function RumiSVG({ size, animClass }) {
  return (
    <svg
      width={size}
      height={size * 1.6}
      viewBox="0 0 100 160"
      className={animClass}
      style={{ transformOrigin: 'bottom center', display: 'block' }}
    >
      {/* ── HAIR BACK ── */}
      <ellipse cx="50" cy="48" rx="27" ry="31" fill="#1e1040" />
      {/* Long hair sides */}
      <path d="M25 54 Q15 82 17 118 Q23 113 27 92 Q29 72 27 56Z" fill="#2D1B69" />
      <path d="M75 54 Q85 82 83 118 Q77 113 73 92 Q71 72 73 56Z" fill="#2D1B69" />
      {/* Braid detail */}
      <path d="M22 72 Q20 78 22 84 Q24 78 22 72Z" fill="#3b2784" opacity="0.9" />
      <path d="M78 72 Q80 78 78 84 Q76 78 78 72Z" fill="#3b2784" opacity="0.9" />

      {/* ── FACE ── */}
      <circle cx="50" cy="46" r="24" fill="#FDBCB4" />

      {/* ── BANGS ── */}
      <path d="M27 44 Q33 21 50 19 Q67 21 73 44 Q63 29 50 28 Q37 29 27 44Z" fill="#2D1B69" />
      <path d="M27 44 Q23 53 25 60" stroke="#2D1B69" strokeWidth="4.5" fill="none" strokeLinecap="round" />
      <path d="M73 44 Q77 53 75 60" stroke="#2D1B69" strokeWidth="4.5" fill="none" strokeLinecap="round" />

      {/* ── CROWN ── */}
      <path d="M35 22 L40 9 L50 17 L60 9 L65 22 L50 18Z" fill="#FFD700" />
      <path d="M35 22 L65 22" stroke="#FFA500" strokeWidth="1.5" />
      <circle cx="50" cy="16" r="3.5" fill="#EF4444" />
      <circle cx="40" cy="9"  r="2.5" fill="#A855F7" />
      <circle cx="60" cy="9"  r="2.5" fill="#A855F7" />
      <circle cx="35" cy="22" r="2"   fill="#FFD700" />
      <circle cx="65" cy="22" r="2"   fill="#FFD700" />

      {/* ── EYES ── */}
      <ellipse cx="41" cy="44" rx="6.5" ry="7"   fill="white" />
      <ellipse cx="59" cy="44" rx="6.5" ry="7"   fill="white" />
      <ellipse cx="41" cy="45" rx="4.8" ry="5.5" fill="#8B5CF6" />
      <ellipse cx="59" cy="45" rx="4.8" ry="5.5" fill="#8B5CF6" />
      <circle  cx="42" cy="45" r="2.8"  fill="#1a0a3c" />
      <circle  cx="60" cy="45" r="2.8"  fill="#1a0a3c" />
      <circle  cx="43.5" cy="43" r="1.4" fill="white" />
      <circle  cx="61.5" cy="43" r="1.4" fill="white" />
      {/* Eyelashes */}
      <path d="M34 39 Q38 35 42 37" stroke="#1a0a3c" strokeWidth="1.3" fill="none" strokeLinecap="round" />
      <path d="M66 39 Q62 35 58 37" stroke="#1a0a3c" strokeWidth="1.3" fill="none" strokeLinecap="round" />

      {/* ── NOSE & MOUTH ── */}
      <path d="M47 53 Q50 57 53 53" stroke="#E8A090" strokeWidth="1.3" fill="none" strokeLinecap="round" />
      <path d="M43 60 Q50 67 57 60" stroke="#D05060" strokeWidth="2" fill="#FFB5C0" strokeLinecap="round" />

      {/* ── CHEEKS ── */}
      <circle cx="31" cy="56" r="7.5" fill="#FFB5C8" opacity="0.38" />
      <circle cx="69" cy="56" r="7.5" fill="#FFB5C8" opacity="0.38" />

      {/* ── NECK ── */}
      <rect x="43" y="68" width="14" height="8" rx="2" fill="#FDBCB4" />

      {/* ── OUTFIT: purple jacket ── */}
      <path d="M18 78 L35 68 L50 78 L65 68 L82 78 L78 120 L22 120Z" fill="#C084FC" />
      <path d="M40 68 L44 87 L50 78 L56 87 L60 68" fill="#9333EA" />
      <path d="M24 96 L40 96" stroke="#E9D5FF" strokeWidth="1.6" opacity="0.6" />
      <path d="M60 96 L76 96" stroke="#E9D5FF" strokeWidth="1.6" opacity="0.6" />
      <text x="27" y="112" fontSize="8" fill="#FFD700" opacity="0.85">✦</text>
      <text x="60" y="114" fontSize="6" fill="#FFD700" opacity="0.7">✦</text>

      {/* ── SKIRT ── */}
      <path d="M22 120 Q50 136 78 120 L82 152 Q50 162 18 152Z" fill="#9333EA" />
      <path d="M30 134 Q50 142 70 134" stroke="#E9D5FF" strokeWidth="1.4" fill="none" opacity="0.5" />
      <text x="36" y="148" fontSize="7" fill="#F0ABFC" opacity="0.75">✦</text>
      <text x="55" y="152" fontSize="5" fill="#F0ABFC" opacity="0.65">✦</text>

      {/* ── ARMS ── */}
      <path d="M18 80 Q4 93 3 109 Q10 112 16 109 Q17 95 24 88Z" fill="#C084FC" />
      <circle cx="4"  cy="110" r="7" fill="#FDBCB4" />
      <path d="M82 80 Q96 93 97 109 Q90 112 84 109 Q83 95 76 88Z" fill="#C084FC" />
      <circle cx="96" cy="110" r="7" fill="#FDBCB4" />

      {/* ── LEGS & BOOTS ── */}
      <rect x="35" y="149" width="12" height="12" rx="3" fill="#FDBCB4" />
      <rect x="53" y="149" width="12" height="12" rx="3" fill="#FDBCB4" />
      <rect x="32" y="156" width="19" height="7" rx="3.5" fill="#6D28D9" />
      <rect x="50" y="156" width="19" height="7" rx="3.5" fill="#6D28D9" />
    </svg>
  )
}

function MiraSVG({ size, animClass }) {
  return (
    <svg
      width={size}
      height={size * 1.6}
      viewBox="0 0 100 160"
      className={animClass}
      style={{ transformOrigin: 'bottom center', display: 'block', animationDelay: '0.18s' }}
    >
      {/* ── HAIR BACK ── */}
      <ellipse cx="50" cy="46" rx="26" ry="30" fill="#E91E8C" />
      {/* Twin pigtail bases */}
      <ellipse cx="14" cy="33" rx="12" ry="14" fill="#E91E8C" />
      <ellipse cx="86" cy="33" rx="12" ry="14" fill="#E91E8C" />
      <path d="M26 36 Q22 26 14 26 Q6 26 4 34 Q6 42 14 44 Q20 44 24 38Z" fill="#C0166A" />
      <path d="M74 36 Q78 26 86 26 Q94 26 96 34 Q94 42 86 44 Q80 44 76 38Z" fill="#C0166A" />
      {/* Hair ties */}
      <circle cx="24" cy="36" r="5" fill="#FF69B4" />
      <circle cx="76" cy="36" r="5" fill="#FF69B4" />
      <text x="21" y="39" fontSize="5.5" fill="#FFD700" textAnchor="middle">★</text>
      <text x="79" y="39" fontSize="5.5" fill="#FFD700" textAnchor="middle">★</text>

      {/* ── FACE ── */}
      <circle cx="50" cy="46" r="23" fill="#F5CBA7" />

      {/* ── BANGS ── */}
      <path d="M28 42 Q35 20 50 19 Q65 20 72 42 Q62 27 50 26 Q38 27 28 42Z" fill="#C0166A" />

      {/* ── GLASSES ── */}
      <circle cx="40" cy="44" r="8.5" fill="rgba(200,240,255,0.18)" stroke="#DAA520" strokeWidth="1.9" />
      <circle cx="60" cy="44" r="8.5" fill="rgba(200,240,255,0.18)" stroke="#DAA520" strokeWidth="1.9" />
      <path d="M48.5 44 L51.5 44" stroke="#DAA520" strokeWidth="1.7" />
      <path d="M31.5 42 Q28 40 27 39" stroke="#DAA520" strokeWidth="1.7" fill="none" strokeLinecap="round" />
      <path d="M68.5 42 Q72 40 73 39" stroke="#DAA520" strokeWidth="1.7" fill="none" strokeLinecap="round" />

      {/* ── EYES (behind glasses) ── */}
      <ellipse cx="40" cy="45" rx="4.5" ry="5"   fill="#6B0000" />
      <circle  cx="41" cy="45" r="2.6"  fill="#1a0000" />
      <circle  cx="42.5" cy="43" r="1.2" fill="white" />
      <ellipse cx="60" cy="45" rx="4.5" ry="5"   fill="#6B0000" />
      <circle  cx="61" cy="45" r="2.6"  fill="#1a0000" />
      <circle  cx="62.5" cy="43" r="1.2" fill="white" />

      {/* ── EYEBROWS (determined) ── */}
      <path d="M32 36 Q40 32 47 36" stroke="#8B0000" strokeWidth="2.2" fill="none" strokeLinecap="round" />
      <path d="M53 36 Q60 32 68 36" stroke="#8B0000" strokeWidth="2.2" fill="none" strokeLinecap="round" />

      {/* ── NOSE & MOUTH ── */}
      <path d="M47 53 Q50 57 53 53" stroke="#C08060" strokeWidth="1.3" fill="none" />
      <path d="M43 60 Q52 66 59 60" stroke="#C04040" strokeWidth="2"   fill="#E8A080" strokeLinecap="round" />

      {/* ── CHEEKS ── */}
      <circle cx="31" cy="57" r="7" fill="#FFB5A0" opacity="0.32" />
      <circle cx="69" cy="57" r="7" fill="#FFB5A0" opacity="0.32" />

      {/* ── NECK ── */}
      <rect x="43" y="67" width="14" height="8" rx="2" fill="#F5CBA7" />

      {/* ── OUTFIT: black top + yellow skirt ── */}
      <path d="M20 76 L37 66 L50 76 L63 66 L80 76 L77 110 L23 110Z" fill="#1a1a2e" />
      <path d="M39 66 L50 76 L61 66" fill="#0f0f1a" />
      {/* WON'T MISS graphic */}
      <path d="M26 96 L34 83 L42 96" fill="none" stroke="#1D6FA4" strokeWidth="1.6" />
      <path d="M35 96 L44 86 L53 96" fill="none" stroke="#1D6FA4" strokeWidth="1.6" />
      <text x="23" y="106" fontSize="4.2" fill="#E91E8C" fontWeight="bold">WON'T MISS</text>
      {/* Choker */}
      <rect x="43" y="65" width="14" height="3" rx="1.5" fill="#222" />
      <circle cx="50" cy="66.5" r="1.5" fill="#C0C0C0" />

      {/* ── YELLOW SKIRT ── */}
      <path d="M23 110 Q50 123 77 110 L80 142 Q50 154 20 142Z" fill="#EAB308" />
      <path d="M30 122 Q50 130 70 122" stroke="#FDE047" strokeWidth="1.5" fill="none" opacity="0.7" />
      {/* Belt */}
      <rect x="23" y="108" width="54" height="5" rx="2.5" fill="#CA8A04" />
      <rect x="47" y="107" width="6"  height="7" rx="1"   fill="#CA8A04" />

      {/* ── ARMS ── */}
      <path d="M20 78 Q6 92 4 108 Q11 111 17 107 Q18 93 26 87Z" fill="#1a1a2e" />
      <circle cx="5"  cy="109" r="6.5" fill="#F5CBA7" />
      <path d="M80 78 Q94 92 96 108 Q89 111 83 107 Q82 93 74 87Z" fill="#1a1a2e" />
      <circle cx="95" cy="109" r="6.5" fill="#F5CBA7" />

      {/* ── LEGS & BOOTS ── */}
      <rect x="35" y="139" width="12" height="12" rx="3" fill="#F5CBA7" />
      <rect x="53" y="139" width="12" height="12" rx="3" fill="#F5CBA7" />
      <rect x="31" y="146" width="20" height="9"  rx="4" fill="#1a1a2e" />
      <rect x="49" y="146" width="20" height="9"  rx="4" fill="#1a1a2e" />
    </svg>
  )
}

function ZoeySVG({ size, animClass }) {
  return (
    <svg
      width={size}
      height={size * 1.6}
      viewBox="0 0 100 160"
      className={animClass}
      style={{ transformOrigin: 'bottom center', display: 'block', animationDelay: '0.36s' }}
    >
      {/* ── HAIR BACK ── */}
      <ellipse cx="50" cy="48" rx="25" ry="28" fill="#0C2E42" />
      {/* Space buns */}
      <circle cx="31" cy="26" r="13" fill="#0C2E42" />
      <circle cx="69" cy="26" r="13" fill="#0C2E42" />
      <path d="M22 26 Q31 16 40 26" stroke="#1A4D6E" strokeWidth="2.2" fill="none" />
      <path d="M60 26 Q69 16 78 26" stroke="#1A4D6E" strokeWidth="2.2" fill="none" />
      {/* Bun ties */}
      <circle cx="31" cy="37" r="4"   fill="#38BDF8" />
      <circle cx="69" cy="37" r="4"   fill="#38BDF8" />
      <circle cx="31" cy="37" r="1.8" fill="#0284C7" />
      <circle cx="69" cy="37" r="1.8" fill="#0284C7" />

      {/* ── FACE ── */}
      <circle cx="50" cy="48" r="23" fill="#FDBCB4" />

      {/* ── MICRO BANGS ── */}
      <path d="M28 44 Q38 29 50 27 Q62 29 72 44 Q64 33 50 32 Q36 33 28 44Z" fill="#0C2E42" />
      <path d="M28 44 Q24 52 26 58" stroke="#0C2E42" strokeWidth="4" fill="none" strokeLinecap="round" />
      <path d="M72 44 Q76 52 74 58" stroke="#0C2E42" strokeWidth="4" fill="none" strokeLinecap="round" />

      {/* ── EYES (monolid, cute) ── */}
      <ellipse cx="41" cy="46" rx="6"   ry="5.5" fill="white" />
      <ellipse cx="59" cy="46" rx="6"   ry="5.5" fill="white" />
      <ellipse cx="41" cy="47" rx="4.2" ry="4.5" fill="#6B4423" />
      <ellipse cx="59" cy="47" rx="4.2" ry="4.5" fill="#6B4423" />
      <circle  cx="42" cy="47" r="2.4"  fill="#1a0a00" />
      <circle  cx="60" cy="47" r="2.4"  fill="#1a0a00" />
      <circle  cx="43.5" cy="45" r="1.1" fill="white" />
      <circle  cx="61.5" cy="45" r="1.1" fill="white" />
      {/* Monolid fold */}
      <path d="M35 43 Q41 39 47 43" stroke="#0C2E42" strokeWidth="1.1" fill="none" />
      <path d="M53 43 Q59 39 65 43" stroke="#0C2E42" strokeWidth="1.1" fill="none" />

      {/* ── NOSE & MOUTH ── */}
      <path d="M47 56 Q50 59 53 56" stroke="#F4A0A0" strokeWidth="1.3" fill="none" />
      <path d="M42 63 Q50 71 58 63" stroke="#E05060" strokeWidth="2"   fill="#FFB5C0" strokeLinecap="round" />

      {/* ── CHEEKS ── */}
      <circle cx="30" cy="59" r="8" fill="#FFB5C8" opacity="0.38" />
      <circle cx="70" cy="59" r="8" fill="#FFB5C8" opacity="0.38" />

      {/* ── STAR EARRINGS ── */}
      <text x="20" y="60" fontSize="8" fill="#FFD700">★</text>
      <text x="72" y="60" fontSize="8" fill="#FFD700">★</text>

      {/* ── NECK ── */}
      <rect x="43" y="69" width="14" height="8" rx="2" fill="#FDBCB4" />

      {/* ── OUTFIT: teal jacket ── */}
      <path d="M20 78 L37 68 L50 78 L63 68 L80 78 L76 116 L24 116Z" fill="#0E7490" />
      <path d="M39 68 L50 78 L61 68" fill="#0284C7" />
      <path d="M35 80 L37 80" stroke="#FFD700" strokeWidth="2.5" strokeLinecap="round" />
      <path d="M63 80 L65 80" stroke="#FFD700" strokeWidth="2.5" strokeLinecap="round" />
      {/* Lotus design */}
      <text x="44" y="99" fontSize="9" fill="#FDA4AF" opacity="0.82">✿</text>
      {/* Jacket zippers */}
      <path d="M50 78 L50 112" stroke="#FFD700" strokeWidth="1" opacity="0.4" strokeDasharray="2 3" />

      {/* ── DARK PARACHUTE PANTS ── */}
      <path d="M24 116 Q50 126 76 116 L79 152 Q50 160 21 152Z" fill="#1e1b4b" />
      {/* Geometric details */}
      <path d="M30 130 Q37 125 44 130" stroke="#EAB308" strokeWidth="1.6" fill="none" />
      <path d="M56 132 Q63 127 70 132" stroke="#EAB308" strokeWidth="1.6" fill="none" />
      {/* Belt */}
      <rect x="24" y="114" width="52" height="5" rx="2.5" fill="#312e81" />

      {/* ── ARMS (left empty, right with mic) ── */}
      <path d="M20 80 Q6 94 4 110 Q11 113 17 109 Q18 95 26 89Z" fill="#0E7490" />
      <circle cx="5"  cy="111" r="6.5" fill="#FDBCB4" />
      <path d="M80 80 Q94 94 96 110 Q89 113 83 109 Q82 95 74 89Z" fill="#0E7490" />
      <circle cx="95" cy="111" r="6.5" fill="#FDBCB4" />
      {/* Microphone */}
      <rect  x="92"  y="113" width="5.5" height="13" rx="2"   fill="#555" />
      <ellipse cx="94.75" cy="112" rx="4.5" ry="4.5" fill="#333" />
      <rect  x="93"  cy="110" width="3.5" height="5"  rx="1.2" fill="#777" />

      {/* ── CHUNKY SNEAKERS ── */}
      <rect x="34" y="149" width="12" height="12" rx="3" fill="#FDBCB4" />
      <rect x="54" y="149" width="12" height="12" rx="3" fill="#FDBCB4" />
      <rect x="30" y="156" width="22" height="9" rx="4.5" fill="#0369A1" />
      <rect x="48" y="156" width="22" height="9" rx="4.5" fill="#0369A1" />
      <rect x="32" y="157" width="16" height="3.5" rx="1.8" fill="#EAB308" opacity="0.85" />
      <rect x="50" y="157" width="16" height="3.5" rx="1.8" fill="#EAB308" opacity="0.85" />
    </svg>
  )
}

function CharSVG({ char, size, animClass }) {
  if (char.id === 'rumi') return <RumiSVG size={size} animClass={animClass} />
  if (char.id === 'mira') return <MiraSVG size={size} animClass={animClass} />
  return <ZoeySVG size={size} animClass={animClass} />
}

/* ═══════════════════════════════════════════════════════════
   TITLE SCREEN
═══════════════════════════════════════════════════════════ */
function TitleScreen({ onStart }) {
  const bgStars = useRef(
    Array.from({ length: 24 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: 10 + Math.random() * 18,
      color: ['#C084FC', '#FB7185', '#38BDF8', '#FFD700'][i % 4],
      dur: 1.8 + Math.random() * 2.8,
      delay: Math.random() * 3,
    }))
  )

  return (
    <div style={{
      position: 'fixed', inset: 0,
      background: 'linear-gradient(160deg, #0a0320 0%, #180840 45%, #0d1535 100%)',
      display: 'flex', flexDirection: 'column', alignItems: 'center',
      justifyContent: 'center', overflow: 'hidden', padding: '1rem',
    }}>
      {/* Background sparkles */}
      {bgStars.current.map(s => (
        <div key={s.id} style={{
          position: 'absolute',
          left: `${s.x}%`, top: `${s.y}%`,
          fontSize: `${s.size}px`,
          color: s.color,
          animation: `starTwinkle ${s.dur}s ease-in-out infinite`,
          animationDelay: `${s.delay}s`,
          pointerEvents: 'none',
          userSelect: 'none',
        }}>✦</div>
      ))}

      {/* Netflix + KPop badge */}
      <div style={{
        color: '#E50914', fontSize: '1.1rem', letterSpacing: '0.15em',
        fontWeight: '900', marginBottom: '0.5rem', zIndex: 1,
        textShadow: '0 2px 8px rgba(229,9,20,0.5)',
      }}>
        NETFLIX ✦ KPOP
      </div>

      {/* Title */}
      <div style={{
        animation: 'titleFloat 3s ease-in-out infinite',
        textAlign: 'center', zIndex: 1, marginBottom: '1.5rem',
      }}>
        <h1 style={{
          fontSize: 'clamp(2rem, 9vw, 4.5rem)',
          fontWeight: '900', lineHeight: 1.05,
          background: 'linear-gradient(135deg, #F0ABFC 0%, #818CF8 40%, #38BDF8 70%, #C084FC 100%)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          animation: 'titleGlow 2.5s ease-in-out infinite',
          letterSpacing: '0.02em',
        }}>
          デーモン<br />ハンターズ
        </h1>
        <div style={{
          color: '#94A3B8', fontSize: 'clamp(0.8rem, 2.5vw, 1rem)',
          letterSpacing: '0.3em', marginTop: '0.4rem',
        }}>
          ★ DEMON HUNTERS ★ STAR CATCH ★
        </div>
      </div>

      {/* Character trio */}
      <div style={{
        display: 'flex', gap: 'clamp(0.5rem, 3vw, 1.5rem)',
        alignItems: 'flex-end', marginBottom: '2rem', zIndex: 1,
      }}>
        {CHARS.map((c, i) => (
          <div key={c.id} style={{
            filter: `drop-shadow(0 0 16px ${c.color}99)`,
            animationDelay: `${i * 0.2}s`,
          }}>
            <CharSVG char={c} size={72} animClass="charIdle" />
            <div style={{
              textAlign: 'center', color: c.color,
              fontSize: '0.85rem', fontWeight: '700', marginTop: '2px',
            }}>{c.name}</div>
          </div>
        ))}
      </div>

      {/* Start button */}
      <button
        onClick={onStart}
        style={{
          padding: 'clamp(0.9rem, 3vw, 1.2rem) clamp(2rem, 6vw, 3.5rem)',
          fontSize: 'clamp(1.2rem, 4vw, 1.6rem)',
          fontWeight: '900', border: 'none', borderRadius: '100px',
          background: 'linear-gradient(135deg, #C084FC 0%, #818CF8 50%, #38BDF8 100%)',
          color: 'white', cursor: 'pointer',
          animation: 'btnPulse 2s ease-in-out infinite',
          letterSpacing: '0.08em', zIndex: 1,
          boxShadow: '0 8px 32px rgba(192,132,252,0.5)',
        }}
      >
        ▶ あそぼう！
      </button>

      <div style={{ color: '#475569', fontSize: '0.8rem', marginTop: '0.8rem', zIndex: 1 }}>
        タップしてはじめる
      </div>
    </div>
  )
}

/* ═══════════════════════════════════════════════════════════
   CHARACTER SELECT SCREEN
═══════════════════════════════════════════════════════════ */
function SelectScreen({ onSelect }) {
  const [hovered, setHovered] = useState(null)

  return (
    <div style={{
      position: 'fixed', inset: 0,
      background: 'linear-gradient(160deg, #0a0320 0%, #180840 100%)',
      display: 'flex', flexDirection: 'column',
      alignItems: 'center', justifyContent: 'center',
      padding: 'clamp(0.5rem, 2vw, 1.5rem)',
      overflow: 'hidden',
    }}>
      <h2 style={{
        color: '#F0ABFC', fontWeight: '700', textAlign: 'center',
        fontSize: 'clamp(1.2rem, 5vw, 2.2rem)',
        marginBottom: 'clamp(1rem, 3vw, 2rem)',
        animation: 'titleFloat 3s ease-in-out infinite',
      }}>
        ✨ だれといっしょにあそぶ？ ✨
      </h2>

      <div style={{
        display: 'flex', gap: 'clamp(0.5rem, 2vw, 1.2rem)',
        flexWrap: 'wrap', justifyContent: 'center',
        alignItems: 'stretch', maxWidth: '960px',
      }}>
        {CHARS.map(c => (
          <button
            key={c.id}
            onClick={() => onSelect(c)}
            onMouseEnter={() => setHovered(c.id)}
            onMouseLeave={() => setHovered(null)}
            onPointerDown={() => setHovered(c.id)}
            onPointerUp={() => setHovered(null)}
            style={{
              background: hovered === c.id
                ? `linear-gradient(160deg, ${c.dark}cc, ${c.color}33)`
                : 'rgba(255,255,255,0.04)',
              border: `2.5px solid ${hovered === c.id ? c.color : 'rgba(255,255,255,0.1)'}`,
              borderRadius: '28px',
              padding: 'clamp(1rem, 3vw, 1.8rem) clamp(0.8rem, 2vw, 1.4rem)',
              cursor: 'pointer',
              transition: 'all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)',
              display: 'flex', flexDirection: 'column',
              alignItems: 'center', gap: '0.5rem',
              minWidth: 'clamp(140px, 25vw, 240px)',
              transform: hovered === c.id ? 'translateY(-10px) scale(1.04)' : 'translateY(0) scale(1)',
              boxShadow: hovered === c.id ? `0 20px 56px ${c.color}44` : '0 4px 20px rgba(0,0,0,0.3)',
              animation: hovered !== c.id ? 'cardGlow 3s ease-in-out infinite' : 'none',
            }}
          >
            <div style={{ filter: `drop-shadow(0 0 12px ${c.color}88)` }}>
              <CharSVG char={c} size={90} animClass={hovered === c.id ? 'charDance' : 'charIdle'} />
            </div>
            <div style={{ color: c.color, fontSize: 'clamp(1.4rem, 5vw, 2rem)', fontWeight: '900' }}>
              {c.name}
            </div>
            <div style={{
              background: c.color, color: 'white',
              padding: '0.25rem 0.9rem', borderRadius: '100px',
              fontSize: 'clamp(0.7rem, 2vw, 0.85rem)', fontWeight: '700',
            }}>
              {c.emoji} {c.role}
            </div>
            <div style={{
              color: 'rgba(255,255,255,0.68)',
              fontSize: 'clamp(0.75rem, 2vw, 0.9rem)',
              textAlign: 'center', whiteSpace: 'pre-line', lineHeight: 1.55,
            }}>
              {c.desc}
            </div>
          </button>
        ))}
      </div>
    </div>
  )
}

/* ═══════════════════════════════════════════════════════════
   FALLING ITEM
═══════════════════════════════════════════════════════════ */
function FallingItem({ item, onCatch }) {
  const handledRef = useRef(false)

  function handleCatch(e) {
    if (handledRef.current) return
    handledRef.current = true
    e.stopPropagation()
    const cx = e.clientX ?? e.touches?.[0]?.clientX ?? item.x + item.size / 2
    const cy = e.clientY ?? e.touches?.[0]?.clientY ?? item.y + item.size / 2
    onCatch(item.id, item.pts, cx, cy, item.special)
  }

  return (
    <div
      onPointerDown={handleCatch}
      style={{
        position: 'absolute',
        left: item.x,
        top: item.y,
        width:  item.size,
        height: item.size,
        fontSize: `${item.size * 0.66}px`,
        lineHeight: `${item.size}px`,
        textAlign: 'center',
        cursor: 'pointer',
        animation: `itemSpin ${1.2 + Math.random() * 0.6}s ease-in-out infinite`,
        filter: `drop-shadow(0 0 10px ${item.glow})`,
        zIndex: 10,
        touchAction: 'none',
        userSelect: 'none',
        pointerEvents: 'all',
      }}
    >
      {item.emoji}
      {item.special && (
        <div style={{
          position: 'absolute', top: '-6px', right: '-6px',
          fontSize: '14px', lineHeight: '14px',
          animation: 'comboFlash 0.4s ease-in-out infinite',
        }}>✨</div>
      )}
    </div>
  )
}

/* ═══════════════════════════════════════════════════════════
   SCORE PARTICLE
═══════════════════════════════════════════════════════════ */
function ScoreParticle({ p }) {
  return (
    <div style={{
      position: 'fixed',
      left: p.x - 40, top: p.y - 20,
      color: p.color,
      fontSize: p.big ? '1.9rem' : '1.4rem',
      fontWeight: '900',
      pointerEvents: 'none',
      animation: 'floatUp 0.85s ease-out forwards',
      textShadow: '0 2px 10px rgba(0,0,0,0.9)',
      zIndex: 200,
      whiteSpace: 'nowrap',
    }}>
      {p.text}
    </div>
  )
}

/* ═══════════════════════════════════════════════════════════
   CONFETTI
═══════════════════════════════════════════════════════════ */
function Confetti() {
  const pieces = useRef(
    Array.from({ length: 60 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      color: ['#C084FC', '#FB7185', '#38BDF8', '#FFD700', '#4ADE80', '#FB923C', '#F472B6'][i % 7],
      size: 7 + Math.random() * 11,
      dur: 2.2 + Math.random() * 2.8,
      delay: Math.random() * 1.8,
      shape: Math.random() > 0.5,
    }))
  )
  return (
    <div style={{ position: 'fixed', inset: 0, pointerEvents: 'none', overflow: 'hidden', zIndex: 0 }}>
      {pieces.current.map(p => (
        <div key={p.id} style={{
          position: 'absolute',
          left: `${p.x}%`, top: '-20px',
          width: p.size, height: p.size,
          background: p.color,
          borderRadius: p.shape ? '50%' : '2px',
          animation: `confettiFall ${p.dur}s ease-in ${p.delay}s infinite`,
        }} />
      ))}
    </div>
  )
}

/* ═══════════════════════════════════════════════════════════
   GAME SCREEN
═══════════════════════════════════════════════════════════ */
function GameScreen({ char, score, timeLeft, items, combo, particles, charAnim, showTap, onCatch }) {
  const urgent = timeLeft <= 10
  const progress = timeLeft / GAME_SECS

  return (
    <div style={{
      position: 'fixed', inset: 0,
      background: char.bg,
      overflow: 'hidden',
    }}>
      {/* Ambient background accents */}
      {char.bgAccents.map((acc, i) => (
        <div key={i} style={{
          position: 'absolute',
          left: `${(i * 22 + 5) % 95}%`,
          top:  `${(i * 19 + 8) % 55}%`,
          fontSize: '16px', opacity: 0.12,
          animation: `starTwinkle ${2.5 + i * 0.4}s ease-in-out infinite`,
          animationDelay: `${i * 0.5}s`,
          pointerEvents: 'none',
        }}>{acc}</div>
      ))}

      {/* ── TOP HUD ── */}
      <div style={{
        position: 'absolute', top: 0, left: 0, right: 0,
        padding: '0.6rem 0.9rem',
        display: 'flex', alignItems: 'center', gap: '0.8rem',
        background: 'rgba(0,0,0,0.45)',
        backdropFilter: 'blur(8px)',
        zIndex: 30,
      }}>
        {/* Score */}
        <div style={{ flex: 1 }}>
          <div style={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.65rem', marginBottom: '1px' }}>スコア</div>
          <div style={{
            color: '#FFD700',
            fontSize: 'clamp(1.4rem, 5vw, 2.2rem)',
            fontWeight: '900', lineHeight: 1,
          }}>
            {score.toLocaleString()}
          </div>
        </div>

        {/* Character badge */}
        <div style={{ textAlign: 'center', flexShrink: 0 }}>
          <div style={{ fontSize: '1.6rem' }}>{char.emoji}</div>
          <div style={{ color: char.color, fontSize: '0.75rem', fontWeight: '700' }}>{char.name}</div>
        </div>

        {/* Timer */}
        <div style={{ flex: 1, textAlign: 'right' }}>
          <div style={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.65rem', marginBottom: '1px' }}>のこり</div>
          <div style={{
            color: urgent ? '#F87171' : 'white',
            fontSize: 'clamp(1.4rem, 5vw, 2.2rem)',
            fontWeight: '900', lineHeight: 1,
            animation: urgent ? 'urgentPulse 0.5s ease-in-out infinite' : 'none',
          }}>
            {timeLeft}
          </div>
        </div>
      </div>

      {/* Timer bar */}
      <div style={{
        position: 'absolute', top: '56px', left: 0, right: 0,
        height: '5px', background: 'rgba(255,255,255,0.1)', zIndex: 30,
      }}>
        <div style={{
          width: `${progress * 100}%`, height: '100%',
          background: urgent
            ? 'linear-gradient(90deg, #EF4444, #F87171)'
            : `linear-gradient(90deg, ${char.dark}, ${char.color})`,
          transition: 'width 1s linear',
          boxShadow: `0 0 10px ${char.color}88`,
        }} />
      </div>

      {/* Combo display */}
      {combo >= 2 && (
        <div style={{
          position: 'absolute', top: '68px', left: '50%',
          transform: 'translateX(-50%)',
          background: `${char.color}25`,
          border: `1.5px solid ${char.color}88`,
          borderRadius: '100px',
          padding: '0.2rem 1rem',
          color: char.color, fontSize: '0.88rem', fontWeight: '700',
          zIndex: 30, whiteSpace: 'nowrap',
          animation: 'comboFlash 0.35s ease-in-out infinite',
        }}>
          {combo} コンボ！✨
        </div>
      )}

      {/* Tap hint for first 3 seconds */}
      {showTap && (
        <div style={{
          position: 'absolute', top: '40%', left: '50%',
          transform: 'translate(-50%, -50%)',
          color: 'white', fontSize: 'clamp(1.5rem, 6vw, 2.5rem)',
          fontWeight: '900', textAlign: 'center',
          pointerEvents: 'none', zIndex: 25,
          textShadow: `0 0 20px ${char.color}`,
          animation: 'comboFlash 0.6s ease-in-out infinite',
        }}>
          ⬇ タップして！ ⬇
        </div>
      )}

      {/* Falling items */}
      {items.map(item => (
        <FallingItem key={item.id} item={item} onCatch={onCatch} />
      ))}

      {/* Score particles */}
      {particles.map(p => (
        <ScoreParticle key={p.id} p={p} />
      ))}

      {/* Character at bottom */}
      <div style={{
        position: 'absolute', bottom: 0,
        left: '50%', transform: 'translateX(-50%)',
        zIndex: 5,
        filter: `drop-shadow(0 0 24px ${char.color}66)`,
      }}>
        <CharSVG char={char} size={120} animClass={charAnim} />
      </div>
    </div>
  )
}

/* ═══════════════════════════════════════════════════════════
   RESULT SCREEN
═══════════════════════════════════════════════════════════ */
function ResultScreen({ score, highScore, char, onReplay }) {
  const stars = score >= 700 ? 3 : score >= 350 ? 2 : 1
  const msgs = ['がんばった！', 'すごい！！', 'かんぺき！！✨']
  const msg  = msgs[stars - 1]

  return (
    <div style={{
      position: 'fixed', inset: 0,
      background: char.bg,
      display: 'flex', flexDirection: 'column',
      alignItems: 'center', justifyContent: 'center',
      zIndex: 1, overflow: 'hidden',
    }}>
      <Confetti />

      <div style={{
        position: 'relative', zIndex: 10,
        display: 'flex', flexDirection: 'column',
        alignItems: 'center', textAlign: 'center',
        gap: '0.9rem', padding: '1rem',
        animation: 'slideInUp 0.5s ease-out',
      }}>
        {/* All 3 characters celebrating */}
        <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'flex-end' }}>
          {CHARS.map(c => (
            <div key={c.id} style={{
              filter: c.id === char.id
                ? `drop-shadow(0 0 20px ${c.color}dd)`
                : `drop-shadow(0 0 8px ${c.color}44)`,
              transform: c.id === char.id ? 'scale(1.15)' : 'scale(0.85)',
              transition: 'transform 0.3s',
            }}>
              <CharSVG char={c} size={c.id === char.id ? 120 : 90} animClass="charCelebrate" />
            </div>
          ))}
        </div>

        {/* Star rating */}
        <div style={{ fontSize: 'clamp(2rem, 8vw, 3rem)', letterSpacing: '0.4rem' }}>
          {Array.from({ length: 3 }, (_, i) => (
            <span key={i} style={{
              opacity: i < stars ? 1 : 0.18,
              filter: i < stars ? 'drop-shadow(0 0 8px #FFD700)' : 'none',
            }}>⭐</span>
          ))}
        </div>

        {/* Message */}
        <div style={{
          color: 'white',
          fontSize: 'clamp(1.8rem, 7vw, 3rem)',
          fontWeight: '900',
          animation: 'titleFloat 2s ease-in-out infinite',
          textShadow: `0 0 24px ${char.color}`,
        }}>
          {msg}
        </div>

        {/* Score card */}
        <div style={{
          background: 'rgba(255,255,255,0.08)',
          borderRadius: '24px',
          padding: '1rem 2rem',
          border: `2px solid ${char.color}44`,
          backdropFilter: 'blur(8px)',
        }}>
          <div style={{ color: 'rgba(255,255,255,0.55)', fontSize: '0.8rem', marginBottom: '4px' }}>
            スコア
          </div>
          <div style={{
            color: '#FFD700',
            fontSize: 'clamp(2.2rem, 9vw, 4rem)',
            fontWeight: '900', lineHeight: 1,
          }}>
            {score.toLocaleString()}
          </div>
          {highScore > 0 && (
            <div style={{ color: char.color, fontSize: '0.82rem', marginTop: '4px' }}>
              {score >= highScore ? '🏆 新記録！' : `ハイスコア: ${highScore.toLocaleString()}`}
            </div>
          )}
        </div>

        {/* Replay button */}
        <button
          onClick={onReplay}
          style={{
            padding: 'clamp(0.85rem, 3vw, 1.1rem) clamp(2rem, 6vw, 3rem)',
            fontSize: 'clamp(1.1rem, 4vw, 1.4rem)',
            fontWeight: '900', border: 'none',
            borderRadius: '100px',
            background: `linear-gradient(135deg, ${char.color}, ${char.dark})`,
            color: 'white', cursor: 'pointer',
            animation: 'btnPulse 2s ease-in-out infinite',
            letterSpacing: '0.05em',
            marginTop: '0.3rem',
            boxShadow: `0 8px 32px ${char.color}55`,
          }}
        >
          🔄 もう一度あそぶ！
        </button>
      </div>
    </div>
  )
}

/* ═══════════════════════════════════════════════════════════
   MAIN APP
═══════════════════════════════════════════════════════════ */
export default function DemonHuntersGame() {
  const [screen,   setScreen]   = useState('title')
  const [char,     setChar]     = useState(null)
  const [score,    setScore]    = useState(0)
  const [timeLeft, setTimeLeft] = useState(GAME_SECS)
  const [items,    setItems]    = useState([])
  const [combo,    setCombo]    = useState(0)
  const [highScore,setHighScore]= useState(0)
  const [particles,setParticles]= useState([])
  const [charAnim, setCharAnim] = useState('charIdle')
  const [showTap,  setShowTap]  = useState(false)

  // Refs — values used inside rAF / setTimeout without stale closure
  const audioRef     = useRef(null)
  const rafRef       = useRef(null)
  const timerRef     = useRef(null)
  const spawnRef     = useRef(null)
  const itemsRef     = useRef([])
  const scoreRef     = useRef(0)
  const comboRef     = useRef(0)
  const timeRef      = useRef(GAME_SECS)
  const nextIdRef    = useRef(0)
  const dancingRef   = useRef(false)
  const gameActiveRef= useRef(false)

  // Init audio
  useEffect(() => {
    audioRef.current = makeAudio()
    return () => audioRef.current?.stop()
  }, [])

  // ── endGame (stable: uses only refs & stable setters) ──
  const endGame = useCallback(() => {
    if (!gameActiveRef.current) return
    gameActiveRef.current = false

    audioRef.current?.stop()

    cancelAnimationFrame(rafRef.current)
    clearTimeout(spawnRef.current)
    clearInterval(timerRef.current)

    const finalScore = scoreRef.current
    setHighScore(prev => {
      const next = Math.max(prev, finalScore)
      return next
    })
    setItems([])
    itemsRef.current = []

    // Small delay then game-over fanfare
    setTimeout(() => {
      audioRef.current?.sfxGameOver()
      setScreen('result')
    }, 120)
  }, [])

  // ── Animation loop ──
  useEffect(() => {
    if (screen !== 'game') {
      cancelAnimationFrame(rafRef.current)
      return
    }

    const H = window.innerHeight

    function loop() {
      if (!gameActiveRef.current) return
      itemsRef.current = itemsRef.current
        .map(item => ({ ...item, y: item.y + item.speed }))
        .filter(item => item.y < H + ITEM_BASE + 20)
      setItems([...itemsRef.current])
      rafRef.current = requestAnimationFrame(loop)
    }

    rafRef.current = requestAnimationFrame(loop)
    return () => cancelAnimationFrame(rafRef.current)
  }, [screen])

  // ── Game timer ──
  useEffect(() => {
    if (screen !== 'game') {
      clearInterval(timerRef.current)
      return
    }

    timerRef.current = setInterval(() => {
      const next = timeRef.current - 1
      timeRef.current = next
      setTimeLeft(next)
      if (next <= 0) {
        clearInterval(timerRef.current)
        endGame()
      }
    }, 1000)

    return () => clearInterval(timerRef.current)
  }, [screen, endGame])

  // ── Item spawner ──
  useEffect(() => {
    if (screen !== 'game') {
      clearTimeout(spawnRef.current)
      return
    }

    function spawn() {
      if (!gameActiveRef.current) return
      const progress  = 1 - timeRef.current / GAME_SECS
      const spawnRate = Math.max(SPAWN_FAST, SPAWN_SLOW - progress * (SPAWN_SLOW - SPAWN_FAST))
      const isSpecial = Math.random() < 0.08
      const pool      = isSpecial ? SPECIAL_ITEMS : DROP_ITEMS
      const pick      = pool[Math.floor(Math.random() * pool.length)]
      const size      = isSpecial ? ITEM_BASE + 18 : ITEM_BASE + Math.random() * 14
      const spd       = SPEED_SLOW + progress * (SPEED_FAST - SPEED_SLOW) + Math.random() * 0.5

      const W = window.innerWidth
      const item = {
        id:      nextIdRef.current++,
        x:       Math.max(0, Math.random() * (W - size - 8)),
        y:       -size - 10,
        size,
        emoji:   pick.emoji,
        pts:     pick.pts,
        glow:    pick.glow,
        speed:   spd,
        special: isSpecial,
      }

      itemsRef.current = [...itemsRef.current, item]
      spawnRef.current = setTimeout(spawn, spawnRate)
    }

    spawnRef.current = setTimeout(spawn, 600)
    return () => clearTimeout(spawnRef.current)
  }, [screen])

  // ── Catch handler ──
  const catchItem = useCallback((id, pts, cx, cy, isSpecial) => {
    // Guard: item must still exist
    if (!itemsRef.current.find(i => i.id === id)) return

    itemsRef.current = itemsRef.current.filter(i => i.id !== id)
    setItems([...itemsRef.current])

    const newCombo = comboRef.current + 1
    comboRef.current = newCombo
    setCombo(newCombo)

    const mult   = newCombo >= 5 ? 3 : newCombo >= 3 ? 2 : 1
    const earned = pts * mult
    scoreRef.current += earned
    setScore(scoreRef.current)

    // Particle
    const pid = Date.now() + Math.random()
    const particle = {
      id:    pid,
      x:     cx,
      y:     cy,
      text:  newCombo >= 3 ? `+${earned} コンボ！！` : `+${earned}`,
      color: isSpecial ? '#FFD700' : newCombo >= 5 ? '#FFD700' : newCombo >= 3 ? '#FB923C' : 'white',
      big:   newCombo >= 3 || isSpecial,
    }
    setParticles(prev => [...prev, particle])
    setTimeout(() => setParticles(prev => prev.filter(p => p.id !== pid)), 900)

    // Character dance
    if (!dancingRef.current) {
      dancingRef.current = true
      setCharAnim('charDance')
      setTimeout(() => {
        setCharAnim('charIdle')
        dancingRef.current = false
      }, 650)
    }

    // Sound
    if (isSpecial)       audioRef.current?.sfxSpecial()
    else if (newCombo >= 3) audioRef.current?.sfxCombo()
    else                 audioRef.current?.sfxCatch()
  }, [])

  // ── Start game ──
  const startGame = useCallback((selectedChar) => {
    // Reset
    scoreRef.current   = 0
    comboRef.current   = 0
    timeRef.current    = GAME_SECS
    nextIdRef.current  = 0
    itemsRef.current   = []
    gameActiveRef.current = true

    setChar(selectedChar)
    setScore(0)
    setCombo(0)
    setTimeLeft(GAME_SECS)
    setItems([])
    setParticles([])
    setCharAnim('charIdle')
    setShowTap(true)
    setScreen('game')

    // Tap hint disappears after 3 s
    setTimeout(() => setShowTap(false), 3000)

    // Start music (user interaction context → safe)
    audioRef.current?.start()
  }, [])

  // ── Go to select ──
  const goToSelect = useCallback(() => {
    gameActiveRef.current = false
    itemsRef.current = []
    setItems([])
    setParticles([])
    setScreen('select')
  }, [])

  /* ── RENDER ── */
  if (screen === 'title')  return <TitleScreen onStart={() => setScreen('select')} />
  if (screen === 'select') return <SelectScreen onSelect={startGame} />
  if (screen === 'game')   return (
    <GameScreen
      char={char}
      score={score}
      timeLeft={timeLeft}
      items={items}
      combo={combo}
      particles={particles}
      charAnim={charAnim}
      showTap={showTap}
      onCatch={catchItem}
    />
  )
  if (screen === 'result') return (
    <ResultScreen
      score={score}
      highScore={highScore}
      char={char}
      onReplay={goToSelect}
    />
  )
  return null
}
