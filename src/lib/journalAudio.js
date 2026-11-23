// Web Audio Synthesizer for Vintage Journal SFX & Cozy Rain Study Ambience
// Zero external audio files — 100% procedural Web Audio API

class JournalAudioEngine {
  constructor() {
    this.ctx = null
    this.muted = false
    this.rainActive = false
    this.rainNodes = null
    this.crackleTimer = null
  }

  init() {
    if (this.ctx) return
    const AudioCtx = window.AudioContext || window.webkitAudioContext
    if (AudioCtx) {
      this.ctx = new AudioCtx()
    }
  }

  ensureContext() {
    if (this.muted) return false
    if (!this.ctx) this.init()
    if (!this.ctx) return false
    if (this.ctx.state === "suspended") {
      this.ctx.resume().catch(() => {})
    }
    return true
  }

  setMuted(val) {
    this.muted = Boolean(val)
    if (this.rainNodes && this.ctx) {
      const now = this.ctx.currentTime
      const target = this.muted ? 0.0001 : 0.16
      this.rainNodes.masterGain.gain.cancelScheduledValues(now)
      this.rainNodes.masterGain.gain.setTargetAtTime(target, now, 0.18)
    }
  }

  isMuted() {
    return this.muted
  }

  isRainPlaying() {
    return this.rainActive
  }

  // Toggle soothing night rain & warm study ambience
  toggleRainAmbience() {
    if (this.rainActive) {
      this.stopRainAmbience()
      return false
    } else {
      this.startRainAmbience()
      return true
    }
  }

  startRainAmbience() {
    if (this.rainActive) return
    if (!this.ctx) this.init()
    if (!this.ctx) return
    if (this.ctx.state === "suspended") {
      this.ctx.resume().catch(() => {})
    }

    try {
      const sr = this.ctx.sampleRate
      const length = sr * 4 // 4-second seamless pink-noise loop
      const buffer = this.ctx.createBuffer(1, length, sr)
      const output = buffer.getChannelData(0)

      // Paul Kellet pink noise approximation for warm natural rain texture
      let b0 = 0,
        b1 = 0,
        b2 = 0,
        b3 = 0,
        b4 = 0,
        b5 = 0,
        b6 = 0
      for (let i = 0; i < length; i++) {
        const white = Math.random() * 2 - 1
        b0 = 0.99886 * b0 + white * 0.0555179
        b1 = 0.99332 * b1 + white * 0.0750759
        b2 = 0.969 * b2 + white * 0.153852
        b3 = 0.8665 * b3 + white * 0.3104856
        b4 = 0.55 * b4 + white * 0.5329522
        b5 = -0.7616 * b5 - white * 0.016898
        const pink =
          (b0 + b1 + b2 + b3 + b4 + b5 + b6 + white * 0.5362) * 0.045
        b6 = white * 0.115926

        // Crossfade edges slightly for clickless loop
        output[i] = pink
      }

      const rainSrc = this.ctx.createBufferSource()
      rainSrc.buffer = buffer
      rainSrc.loop = true

      // Muffled window-pane lowpass filter
      const lowpass = this.ctx.createBiquadFilter()
      lowpass.type = "lowpass"
      lowpass.frequency.value = 920
      lowpass.Q.value = 0.7

      // Slow LFO gently breathing the rain intensity
      const lfo = this.ctx.createOscillator()
      const lfoGain = this.ctx.createGain()
      lfo.type = "sine"
      lfo.frequency.value = 0.11
      lfoGain.gain.value = 180
      lfo.connect(lfoGain)
      lfoGain.connect(lowpass.frequency)

      const masterGain = this.ctx.createGain()
      const now = this.ctx.currentTime
      masterGain.gain.setValueAtTime(0.0001, now)
      masterGain.gain.linearRampToValueAtTime(
        this.muted ? 0.0001 : 0.16,
        now + 0.9
      )

      rainSrc.connect(lowpass)
      lowpass.connect(masterGain)
      masterGain.connect(this.ctx.destination)

      rainSrc.start(now)
      lfo.start(now)

      this.rainNodes = { rainSrc, lfo, masterGain }
      this.rainActive = true

      // Subtle cozy raindrop / fireplace micro-patter
      this.crackleTimer = setInterval(() => {
        if (!this.rainActive || this.muted || !this.ctx) return
        if (Math.random() > 0.55) return
        try {
          const t = this.ctx.currentTime
          const osc = this.ctx.createOscillator()
          const g = this.ctx.createGain()
          osc.type = "sine"
          osc.frequency.setValueAtTime(220 + Math.random() * 260, t)
          osc.frequency.exponentialRampToValueAtTime(90, t + 0.035)
          g.gain.setValueAtTime(0.012, t)
          g.gain.exponentialRampToValueAtTime(0.0001, t + 0.04)
          osc.connect(g)
          g.connect(this.ctx.destination)
          osc.start(t)
          osc.stop(t + 0.045)
        } catch {
          // Ignore
        }
      }, 650)
    } catch {
      // Ignore autoplay restriction errors
    }
  }

  stopRainAmbience() {
    this.rainActive = false
    if (this.crackleTimer) {
      clearInterval(this.crackleTimer)
      this.crackleTimer = null
    }
    if (this.rainNodes && this.ctx) {
      try {
        const { rainSrc, lfo, masterGain } = this.rainNodes
        const now = this.ctx.currentTime
        masterGain.gain.cancelScheduledValues(now)
        masterGain.gain.setTargetAtTime(0.0001, now, 0.15)
        setTimeout(() => {
          try {
            rainSrc.stop()
            lfo.stop()
          } catch {
            // Ignore
          }
        }, 550)
      } catch {
        // Ignore
      }
      this.rainNodes = null
    }
  }

  // Realistic paper page flip sound using shaped noise + bandpass sweep
  playPaperFlip(direction = 1) {
    if (!this.ensureContext()) return
    try {
      const now = this.ctx.currentTime
      const duration = 0.34

      const bufferSize = Math.floor(this.ctx.sampleRate * duration)
      const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate)
      const data = buffer.getChannelData(0)

      for (let i = 0; i < bufferSize; i++) {
        const t = i / bufferSize
        const env = Math.sin(Math.PI * Math.pow(t, 0.75)) * (1 - 0.3 * t)
        const crinkle = 0.85 + 0.15 * Math.sin(t * 190)
        data[i] = (Math.random() * 2 - 1) * env * crinkle * 0.28
      }

      const noise = this.ctx.createBufferSource()
      noise.buffer = buffer

      const filter = this.ctx.createBiquadFilter()
      filter.type = "bandpass"
      const startFreq = direction >= 0 ? 750 : 1200
      const peakFreq = direction >= 0 ? 1950 : 1650
      const endFreq = direction >= 0 ? 950 : 720

      filter.frequency.setValueAtTime(startFreq, now)
      filter.frequency.exponentialRampToValueAtTime(
        peakFreq,
        now + duration * 0.45
      )
      filter.frequency.exponentialRampToValueAtTime(endFreq, now + duration)
      filter.Q.setValueAtTime(1.6, now)

      const warmth = this.ctx.createBiquadFilter()
      warmth.type = "lowpass"
      warmth.frequency.setValueAtTime(3400, now)

      const gain = this.ctx.createGain()
      gain.gain.setValueAtTime(0.01, now)
      gain.gain.linearRampToValueAtTime(0.24, now + 0.06)
      gain.gain.exponentialRampToValueAtTime(0.001, now + duration)

      noise.connect(filter)
      filter.connect(warmth)
      warmth.connect(gain)
      gain.connect(this.ctx.destination)

      noise.start(now)
      noise.stop(now + duration)
    } catch {
      // Ignore
    }
  }

  // Deep leather hardcover thud + paper rustle
  playBookThud(isOpening = true) {
    if (!this.ensureContext()) return
    try {
      const now = this.ctx.currentTime
      const osc = this.ctx.createOscillator()
      const oscGain = this.ctx.createGain()

      osc.type = "triangle"
      osc.frequency.setValueAtTime(isOpening ? 115 : 95, now)
      osc.frequency.exponentialRampToValueAtTime(36, now + 0.22)

      oscGain.gain.setValueAtTime(0.26, now)
      oscGain.gain.exponentialRampToValueAtTime(0.001, now + 0.24)

      osc.connect(oscGain)
      oscGain.connect(this.ctx.destination)

      osc.start(now)
      osc.stop(now + 0.25)

      setTimeout(() => {
        this.playPaperFlip(isOpening ? 1 : -1)
      }, 65)
    } catch {
      // Ignore
    }
  }

  // Tactile vintage stamp / button click
  playStampClick() {
    if (!this.ensureContext()) return
    try {
      const now = this.ctx.currentTime
      const osc = this.ctx.createOscillator()
      const gain = this.ctx.createGain()

      osc.type = "sine"
      osc.frequency.setValueAtTime(520, now)
      osc.frequency.exponentialRampToValueAtTime(140, now + 0.045)

      gain.gain.setValueAtTime(0.12, now)
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.05)

      osc.connect(gain)
      gain.connect(this.ctx.destination)

      osc.start(now)
      osc.stop(now + 0.055)
    } catch {
      // Ignore
    }
  }

  // Gentle porcelain coffee cup clink when clicking the 3D espresso cup
  playCeramicClink() {
    if (!this.ensureContext()) return
    try {
      const now = this.ctx.currentTime
      ;[1480, 2210].forEach((freq, idx) => {
        const osc = this.ctx.createOscillator()
        const gain = this.ctx.createGain()
        osc.type = "sine"
        osc.frequency.setValueAtTime(freq, now)
        gain.gain.setValueAtTime(idx === 0 ? 0.08 : 0.045, now)
        gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.22)
        osc.connect(gain)
        gain.connect(this.ctx.destination)
        osc.start(now)
        osc.stop(now + 0.24)
      })
    } catch {
      // Ignore
    }
  }
}

export const journalAudio = new JournalAudioEngine()
