import Lenis from "lenis"
import gsap from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"
import type { WebGLApp } from "../webgl/WebGLApp"

gsap.registerPlugin(ScrollTrigger)

export type HarborDepthZone = "surface" | "waterline" | "depths" | "abyss"

export interface ScrollChoreographerOptions {
  webglApp: WebGLApp
  trigger?: HTMLElement | string
  onProgress?: (progress: number, zone: HarborDepthZone) => void
}

export function resolveDepthZone(progress: number): HarborDepthZone {
  if (progress < 0.24) return "surface"
  if (progress < 0.44) return "waterline"
  if (progress < 0.78) return "depths"
  return "abyss"
}

export class ScrollChoreographer {
  private readonly lenis: Lenis
  private readonly scrollTrigger: ScrollTrigger
  private readonly tickerCallback: (time: number) => void
  private readonly webglApp: WebGLApp
  private readonly onProgress?: (
    progress: number,
    zone: HarborDepthZone
  ) => void

  private progress = 0
  private disposed = false

  constructor(options: ScrollChoreographerOptions) {
    this.webglApp = options.webglApp
    this.onProgress = options.onProgress

    this.lenis = new Lenis({
      duration: 1.25,
      easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      orientation: "vertical",
      gestureOrientation: "vertical",
      smoothWheel: true,
      wheelMultiplier: 0.95,
      touchMultiplier: 1.8,
      infinite: false,
    })

    this.lenis.on("scroll", ScrollTrigger.update)

    this.tickerCallback = (time: number) => {
      if (!this.disposed) {
        this.lenis.raf(time * 1000)
      }
    }

    gsap.ticker.add(this.tickerCallback)
    gsap.ticker.lagSmoothing(0)

    this.scrollTrigger = ScrollTrigger.create({
      trigger: options.trigger ?? document.documentElement,
      start: "top top",
      end: "bottom bottom",
      scrub: 0.6,
      onUpdate: (self) => {
        if (this.disposed) return
        this.progress = self.progress
        this.webglApp.setScrollProgress(self.progress)
        this.onProgress?.(self.progress, resolveDepthZone(self.progress))
      },
    })
  }

  public getProgress(): number {
    return this.progress
  }

  public getLenis(): Lenis {
    return this.lenis
  }

  public scrollTo(
    target: string | number | HTMLElement,
    options?: { offset?: number; duration?: number; immediate?: boolean }
  ): void {
    if (this.disposed) return
    this.lenis.scrollTo(target, options)
  }

  public refresh(): void {
    if (!this.disposed) {
      ScrollTrigger.refresh()
    }
  }

  public dispose(): void {
    if (this.disposed) return
    this.disposed = true

    this.scrollTrigger.kill()
    gsap.ticker.remove(this.tickerCallback)
    this.lenis.destroy()
  }
}
