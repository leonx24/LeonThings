import * as THREE from "three"
import { SceneBuilder } from "./SceneBuilder"

export function isWebGLAvailable(): boolean {
  if (typeof window === "undefined" || typeof document === "undefined") {
    return false
  }
  try {
    const canvas = document.createElement("canvas")
    return Boolean(
      window.WebGLRenderingContext &&
        (canvas.getContext("webgl2") || canvas.getContext("webgl"))
    )
  } catch {
    return false
  }
}

export class WebGLApp {
  private readonly container: HTMLElement
  private renderer: THREE.WebGLRenderer | null = null
  private scene: THREE.Scene | null = null
  private camera: THREE.PerspectiveCamera | null = null
  private sceneBuilder: SceneBuilder | null = null
  private fallbackEl: HTMLDivElement | null = null

  private readonly clock = new THREE.Clock()
  private rafId: number | null = null
  private disposed = false
  private usingFallback = false

  private targetProgress = 0
  private smoothProgress = 0
  private targetPointerX = 0
  private targetPointerY = 0
  private smoothPointerX = 0
  private smoothPointerY = 0
  private baseCameraX = 0

  constructor(container: HTMLElement) {
    this.container = container
    this.init()
  }

  private init(): void {
    if (!isWebGLAvailable()) {
      this.activateCssFallback()
      return
    }

    try {
      const width = this.container.clientWidth || window.innerWidth
      const height = this.container.clientHeight || window.innerHeight

      this.renderer = new THREE.WebGLRenderer({
        antialias: true,
        alpha: true,
        powerPreference: "high-performance",
      })
      this.renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2))
      this.renderer.setSize(width, height)
      this.renderer.outputColorSpace = THREE.SRGBColorSpace
      this.renderer.domElement.style.display = "block"
      this.renderer.domElement.style.width = "100%"
      this.renderer.domElement.style.height = "100%"
      this.renderer.domElement.style.pointerEvents = "none"

      this.container.appendChild(this.renderer.domElement)

      this.scene = new THREE.Scene()
      const isMobile = width < 768
      this.baseCameraX = isMobile ? 1.2 : 0
      this.camera = new THREE.PerspectiveCamera(
        isMobile ? 58 : 45,
        width / Math.max(height, 1),
        0.1,
        100
      )
      this.camera.position.set(this.baseCameraX, 4.6, 12)

      this.sceneBuilder = new SceneBuilder(this.scene)

      this.renderer.domElement.addEventListener(
        "webglcontextlost",
        this.handleContextLost
      )
      window.addEventListener("resize", this.handleResize)
      window.addEventListener("mousemove", this.handleMouseMove, {
        passive: true,
      })
      document.addEventListener("visibilitychange", this.handleVisibilityChange)

      this.startLoop()
    } catch {
      this.cleanupWebGL()
      this.activateCssFallback()
    }
  }

  private activateCssFallback(): void {
    if (this.fallbackEl) return
    this.usingFallback = true

    const el = document.createElement("div")
    el.setAttribute("aria-hidden", "true")
    el.style.position = "absolute"
    el.style.inset = "0"
    el.style.width = "100%"
    el.style.height = "100%"
    el.style.pointerEvents = "none"
    el.style.backgroundImage = [
      "radial-gradient(circle at 66% 18%, rgba(255, 210, 125, 0.28), transparent 42%)",
      "linear-gradient(180deg, #1e315c 0%, #5e6292 18%, #c59b82 32%, #4fa3b8 42%, #164e6b 65%, #091d2c 100%)",
    ].join(", ")
    el.style.backgroundSize = "100% 240%"
    el.style.backgroundPosition = "50% 0%"
    el.style.transition = "background-position 120ms linear"

    this.container.appendChild(el)
    this.fallbackEl = el
  }

  public isWebGLEnabled(): boolean {
    return !this.usingFallback && this.renderer !== null
  }

  public setScrollProgress(progress: number): void {
    const clamped = Math.max(0, Math.min(1, progress))
    this.targetProgress = clamped

    if (this.usingFallback && this.fallbackEl) {
      this.fallbackEl.style.backgroundPosition = `50% ${(clamped * 100).toFixed(1)}%`
    }
  }

  private handleContextLost = (event: Event): void => {
    event.preventDefault()
    this.stopLoop()
    this.cleanupWebGL()
    this.activateCssFallback()
    this.setScrollProgress(this.targetProgress)
  }

  private handleResize = (): void => {
    if (!this.renderer || !this.camera) return
    const width = this.container.clientWidth || window.innerWidth
    const height = this.container.clientHeight || window.innerHeight
    const isMobile = width < 768

    this.baseCameraX = isMobile ? 1.2 : 0
    this.camera.fov = isMobile ? 58 : 45
    this.camera.aspect = width / Math.max(height, 1)
    this.camera.updateProjectionMatrix()

    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2))
    this.renderer.setSize(width, height)
  }

  private handleMouseMove = (e: MouseEvent): void => {
    const w = window.innerWidth || 1
    const h = window.innerHeight || 1
    this.targetPointerX = (e.clientX / w) * 2 - 1
    this.targetPointerY = -((e.clientY / h) * 2 - 1)
  }

  private handleVisibilityChange = (): void => {
    if (document.hidden) {
      this.stopLoop()
    } else if (!this.disposed && !this.usingFallback) {
      this.clock.getDelta()
      this.startLoop()
    }
  }

  private startLoop(): void {
    if (this.rafId !== null || this.disposed) return
    const tick = (): void => {
      if (this.disposed || this.usingFallback) return
      this.rafId = requestAnimationFrame(tick)
      this.renderFrame()
    }
    this.rafId = requestAnimationFrame(tick)
  }

  private stopLoop(): void {
    if (this.rafId !== null) {
      cancelAnimationFrame(this.rafId)
      this.rafId = null
    }
  }

  private renderFrame(): void {
    if (!this.renderer || !this.scene || !this.camera || !this.sceneBuilder) {
      return
    }

    const delta = this.clock.getDelta()
    const elapsed = this.clock.elapsedTime

    this.smoothProgress += (this.targetProgress - this.smoothProgress) * 0.1
    this.smoothPointerX += (this.targetPointerX - this.smoothPointerX) * 0.06
    this.smoothPointerY += (this.targetPointerY - this.smoothPointerY) * 0.06

    // Dive camera from Y = +4.6 (sky/hero) smoothly across Y = 0 (waterline) down to Y = -7.4 (abyss)
    const baseY = 4.6 - this.smoothProgress * 12.0
    this.camera.position.x = this.baseCameraX + this.smoothPointerX * 0.22
    this.camera.position.y = baseY + this.smoothPointerY * 0.14
    this.camera.lookAt(this.baseCameraX, baseY - 0.15, 0)

    this.sceneBuilder.setScrollProgress(this.smoothProgress)
    this.sceneBuilder.setPointer(this.smoothPointerX, this.smoothPointerY)
    this.sceneBuilder.update(elapsed, delta)

    this.renderer.render(this.scene, this.camera)
  }

  private cleanupWebGL(): void {
    window.removeEventListener("resize", this.handleResize)
    window.removeEventListener("mousemove", this.handleMouseMove)
    document.removeEventListener(
      "visibilitychange",
      this.handleVisibilityChange
    )

    if (this.sceneBuilder) {
      this.sceneBuilder.dispose()
      this.sceneBuilder = null
    }

    if (this.renderer) {
      this.renderer.domElement.removeEventListener(
        "webglcontextlost",
        this.handleContextLost
      )
      this.renderer.dispose()
      if (this.renderer.domElement.parentNode === this.container) {
        this.container.removeChild(this.renderer.domElement)
      }
      this.renderer = null
    }

    this.scene = null
    this.camera = null
  }

  public dispose(): void {
    if (this.disposed) return
    this.disposed = true
    this.stopLoop()
    this.cleanupWebGL()

    if (this.fallbackEl) {
      if (this.fallbackEl.parentNode === this.container) {
        this.container.removeChild(this.fallbackEl)
      }
      this.fallbackEl = null
    }
  }
}
