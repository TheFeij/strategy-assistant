import { useEffect, useRef } from 'react'
import { useStrategy } from '../../state/StrategyContext'

const THEMES = {
  dark: {
    palette: ['129, 140, 248', '45, 212, 191', '96, 165, 250', '148, 163, 184'],
    particleAlpha: [0.45, 0.85],
    lineAlpha: 0.3,
    speed: 34,
    wrapper:
      'bg-gradient-to-br from-[#050814] via-[#0b1330] to-[#04141a]',
    glows: [
      'bg-indigo-500/25',
      'bg-teal-400/15',
      'bg-violet-500/10',
    ],
  },
  light: {
    palette: ['67, 56, 202', '15, 118, 110', '51, 65, 85', '37, 99, 235'],
    particleAlpha: [0.6, 0.95],
    lineAlpha: 0.5,
    speed: 28,
    wrapper: 'bg-gradient-to-br from-slate-100 via-indigo-100 to-teal-100',
    glows: ['bg-indigo-300/40', 'bg-teal-300/35', 'bg-sky-300/25'],
  },
}

const CONNECT_DISTANCE = 130
const CONNECT_DISTANCE_SQ = CONNECT_DISTANCE * CONNECT_DISTANCE
const POINTER_DISTANCE = 190
const MIN_PARTICLES = 90
const MAX_PARTICLES = 190

export default function ParticleBackground() {
  const canvasRef = useRef(null)
  const { theme } = useStrategy()
  const config = THEMES[theme] || THEMES.dark

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    // Motion is part of this background's identity, so reduced-motion users
    // still get drifting particles, just at a much calmer pace.
    const motionScale = window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 0.65 : 1
    const pointer = { x: null, y: null }
    let width = 0
    let height = 0
    let particles = []
    let frameId = null
    let lastTime = 0

    const particleCount = () => {
      const density = Math.round((width * height) / 9200)
      return Math.max(MIN_PARTICLES, Math.min(MAX_PARTICLES, density))
    }

    const createParticle = (x, y) => {
      const angle = Math.random() * Math.PI * 2
      const velocity = (12 + Math.random() * 30) * (config.speed / 34) * motionScale
      return {
        x,
        y,
        vx: Math.cos(angle) * velocity,
        vy: Math.sin(angle) * velocity,
        radius: Math.random() * 1.6 + 0.9,
        color: config.palette[Math.floor(Math.random() * config.palette.length)],
        alpha:
          Math.random() * (config.particleAlpha[1] - config.particleAlpha[0]) + config.particleAlpha[0],
      }
    }

    const buildParticles = () => {
      const count = particleCount()
      particles = Array.from({ length: count }, () =>
        createParticle(Math.random() * width, Math.random() * height),
      )
    }

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2)
      const previousWidth = width
      const previousHeight = height
      width = window.innerWidth
      height = window.innerHeight
      canvas.width = Math.floor(width * dpr)
      canvas.height = Math.floor(height * dpr)
      canvas.style.width = `${width}px`
      canvas.style.height = `${height}px`
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)

      if (!particles.length) {
        buildParticles()
        return
      }

      // Keep the existing field instead of regenerating it on every resize,
      // so the motion never visibly restarts.
      const scaleX = previousWidth ? width / previousWidth : 1
      const scaleY = previousHeight ? height / previousHeight : 1
      for (const particle of particles) {
        particle.x *= scaleX
        particle.y *= scaleY
      }

      const target = particleCount()
      if (target > particles.length) {
        for (let i = particles.length; i < target; i += 1) {
          particles.push(createParticle(Math.random() * width, Math.random() * height))
        }
      } else if (target < particles.length) {
        particles.length = target
      }
    }

    const draw = (delta) => {
      ctx.clearRect(0, 0, width, height)

      for (let i = 0; i < particles.length; i += 1) {
        const a = particles[i]

        for (let j = i + 1; j < particles.length; j += 1) {
          const b = particles[j]
          const dx = a.x - b.x
          const dy = a.y - b.y
          const distanceSq = dx * dx + dy * dy
          if (distanceSq < CONNECT_DISTANCE_SQ) {
            const alpha = (1 - Math.sqrt(distanceSq) / CONNECT_DISTANCE) * config.lineAlpha
            ctx.beginPath()
            ctx.strokeStyle = `rgba(${a.color}, ${alpha})`
            ctx.lineWidth = 1
            ctx.moveTo(a.x, a.y)
            ctx.lineTo(b.x, b.y)
            ctx.stroke()
          }
        }

        if (pointer.x != null) {
          const pdx = a.x - pointer.x
          const pdy = a.y - pointer.y
          const pointerDistance = Math.sqrt(pdx * pdx + pdy * pdy)
          if (pointerDistance < POINTER_DISTANCE) {
            ctx.beginPath()
            ctx.strokeStyle = `rgba(${a.color}, ${(1 - pointerDistance / POINTER_DISTANCE) * config.lineAlpha})`
            ctx.lineWidth = 1
            ctx.moveTo(a.x, a.y)
            ctx.lineTo(pointer.x, pointer.y)
            ctx.stroke()
          }
        }
      }

      for (const particle of particles) {
        particle.x += particle.vx * delta
        particle.y += particle.vy * delta
        if (particle.x < -10) particle.x = width + 10
        if (particle.x > width + 10) particle.x = -10
        if (particle.y < -10) particle.y = height + 10
        if (particle.y > height + 10) particle.y = -10

        ctx.beginPath()
        ctx.fillStyle = `rgba(${particle.color}, ${particle.alpha})`
        ctx.arc(particle.x, particle.y, particle.radius, 0, Math.PI * 2)
        ctx.fill()
      }
    }

    const animate = (time) => {
      const now = time || performance.now()
      const delta = Math.min((now - (lastTime || now)) / 1000, 0.05)
      lastTime = now
      draw(delta)
      frameId = window.requestAnimationFrame(animate)
    }

    const handlePointerMove = (event) => {
      pointer.x = event.clientX
      pointer.y = event.clientY
    }

    const handlePointerLeave = () => {
      pointer.x = null
      pointer.y = null
    }

    const handleVisibility = () => {
      if (document.hidden) {
        if (frameId) window.cancelAnimationFrame(frameId)
        frameId = null
      } else if (!frameId) {
        lastTime = 0
        animate()
      }
    }

    resize()
    animate()

    window.addEventListener('resize', resize)
    window.addEventListener('pointermove', handlePointerMove)
    window.addEventListener('pointerleave', handlePointerLeave)
    document.addEventListener('visibilitychange', handleVisibility)

    return () => {
      if (frameId) window.cancelAnimationFrame(frameId)
      frameId = null
      window.removeEventListener('resize', resize)
      window.removeEventListener('pointermove', handlePointerMove)
      window.removeEventListener('pointerleave', handlePointerLeave)
      document.removeEventListener('visibilitychange', handleVisibility)
    }
  }, [config])

  return (
    <div
      aria-hidden="true"
      className={`pointer-events-none fixed inset-0 z-0 overflow-hidden transition-colors duration-500 ${config.wrapper}`}
    >
      <div className={`absolute -top-40 right-1/4 h-[28rem] w-[28rem] rounded-full blur-3xl ${config.glows[0]}`} />
      <div
        className={`absolute -bottom-48 left-1/5 h-[30rem] w-[30rem] rounded-full blur-3xl ${config.glows[1]}`}
      />
      <div
        className={`absolute left-1/2 top-1/3 h-72 w-72 -translate-x-1/2 rounded-full blur-3xl ${config.glows[2]}`}
      />
      <canvas ref={canvasRef} className="absolute inset-0" />
    </div>
  )
}
