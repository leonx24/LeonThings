import * as THREE from "three"
import godraysFrag from "../shaders/godrays.frag"

const GODRAYS_VERT = `
varying vec2 vUv;
void main() {
  vUv = uv;
  gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}
`

function createBubbleTexture(): THREE.CanvasTexture {
  const canvas = document.createElement("canvas")
  canvas.width = 64
  canvas.height = 64
  const ctx = canvas.getContext("2d")
  if (ctx) {
    const grad = ctx.createRadialGradient(32, 32, 2, 32, 32, 30)
    grad.addColorStop(0, "rgba(218, 250, 255, 0.95)")
    grad.addColorStop(0.35, "rgba(126, 232, 250, 0.55)")
    grad.addColorStop(1, "rgba(126, 232, 250, 0)")
    ctx.fillStyle = grad
    ctx.fillRect(0, 0, 64, 64)
  }
  const tex = new THREE.CanvasTexture(canvas)
  tex.colorSpace = THREE.SRGBColorSpace
  return tex
}

export class CausticsEffect {
  public readonly group: THREE.Group

  private readonly raysGeo: THREE.PlaneGeometry
  private readonly raysMat: THREE.ShaderMaterial
  private readonly raysMesh: THREE.Mesh

  private readonly particleCount = 150
  private readonly particlesGeo: THREE.BufferGeometry
  private readonly particlesMat: THREE.PointsMaterial
  private readonly particlesPoints: THREE.Points
  private readonly bubbleTexture: THREE.CanvasTexture
  private readonly speeds: Float32Array
  private readonly driftSeeds: Float32Array

  constructor() {
    this.group = new THREE.Group()

    // 1. Volumetric diagonal underwater god-rays plane (Z = -2.2)
    this.raysGeo = new THREE.PlaneGeometry(38, 13.5)
    this.raysMat = new THREE.ShaderMaterial({
      vertexShader: GODRAYS_VERT,
      fragmentShader: godraysFrag,
      transparent: true,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
      uniforms: {
        uTime: { value: 0 },
        uRayColor: { value: new THREE.Color("#7ee8fa") },
        uOpacity: { value: 1.0 },
      },
    })
    this.raysMesh = new THREE.Mesh(this.raysGeo, this.raysMat)
    this.raysMesh.position.set(0, -6.2, -2.2)
    this.raysMesh.renderOrder = 2
    this.group.add(this.raysMesh)

    // 2. Underwater suspended caustics dust & rising ocean bubbles
    this.bubbleTexture = createBubbleTexture()
    const positions = new Float32Array(this.particleCount * 3)
    this.speeds = new Float32Array(this.particleCount)
    this.driftSeeds = new Float32Array(this.particleCount)

    for (let i = 0; i < this.particleCount; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 30
      positions[i * 3 + 1] = -0.35 - Math.random() * 11.4
      positions[i * 3 + 2] = -4.2 + Math.random() * 5.8
      this.speeds[i] = 0.16 + Math.random() * 0.34
      this.driftSeeds[i] = Math.random() * Math.PI * 2
    }

    this.particlesGeo = new THREE.BufferGeometry()
    this.particlesGeo.setAttribute(
      "position",
      new THREE.BufferAttribute(positions, 3)
    )

    this.particlesMat = new THREE.PointsMaterial({
      map: this.bubbleTexture,
      color: "#9ef2ff",
      size: 0.16,
      transparent: true,
      opacity: 0.52,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
      sizeAttenuation: true,
    })

    this.particlesPoints = new THREE.Points(
      this.particlesGeo,
      this.particlesMat
    )
    this.particlesPoints.renderOrder = 4
    this.group.add(this.particlesPoints)
  }

  public setUnderwaterVisibility(factor: number): void {
    const clamped = Math.max(0.15, Math.min(1.0, factor))
    this.raysMat.uniforms.uOpacity.value = clamped
    this.particlesMat.opacity = 0.25 + clamped * 0.38
  }

  public update(elapsed: number, delta: number): void {
    this.raysMat.uniforms.uTime.value = elapsed

    const posAttr = this.particlesGeo.getAttribute(
      "position"
    ) as THREE.BufferAttribute
    const arr = posAttr.array as Float32Array
    const dt = Math.min(delta, 0.05)

    for (let i = 0; i < this.particleCount; i++) {
      const idx = i * 3
      arr[idx + 1] += this.speeds[i] * dt
      arr[idx] += Math.sin(elapsed * 0.8 + this.driftSeeds[i]) * 0.004

      // Respawn at seabed once bubble nears waterline Y = -0.25
      if (arr[idx + 1] > -0.25) {
        arr[idx + 1] = -11.75
        arr[idx] = (Math.random() - 0.5) * 30
      }
    }
    posAttr.needsUpdate = true
  }

  public dispose(): void {
    this.raysGeo.dispose()
    this.raysMat.dispose()
    this.particlesGeo.dispose()
    this.particlesMat.dispose()
    this.bubbleTexture.dispose()
  }
}
