import * as THREE from "three"
import { WaterlineMesh } from "./WaterlineMesh"
import { CausticsEffect } from "./CausticsEffect"

function createAbyssBackdropTexture(): THREE.CanvasTexture {
  const canvas = document.createElement("canvas")
  canvas.width = 64
  canvas.height = 512
  const ctx = canvas.getContext("2d")
  if (ctx) {
    const grad = ctx.createLinearGradient(0, 0, 0, 512)
    grad.addColorStop(0, "#1e5d78")
    grad.addColorStop(0.35, "#164e6b")
    grad.addColorStop(0.75, "#0d2e42")
    grad.addColorStop(1, "#091d2c")
    ctx.fillStyle = grad
    ctx.fillRect(0, 0, 64, 512)
  }
  const tex = new THREE.CanvasTexture(canvas)
  tex.colorSpace = THREE.SRGBColorSpace
  return tex
}

function createLanternGlowTexture(): THREE.CanvasTexture {
  const canvas = document.createElement("canvas")
  canvas.width = 128
  canvas.height = 128
  const ctx = canvas.getContext("2d")
  if (ctx) {
    const grad = ctx.createRadialGradient(64, 64, 2, 64, 64, 62)
    grad.addColorStop(0, "rgba(255, 244, 200, 0.9)")
    grad.addColorStop(0.32, "rgba(255, 210, 125, 0.45)")
    grad.addColorStop(0.72, "rgba(255, 180, 100, 0.12)")
    grad.addColorStop(1, "rgba(255, 210, 125, 0)")
    ctx.fillStyle = grad
    ctx.fillRect(0, 0, 128, 128)
  }
  const tex = new THREE.CanvasTexture(canvas)
  tex.colorSpace = THREE.SRGBColorSpace
  return tex
}

interface ParallaxLayer {
  object: THREE.Object3D
  baseY: number
  parallax: number
}

export class SceneBuilder {
  private readonly scene: THREE.Scene
  private readonly loader: THREE.TextureLoader
  private readonly fog: THREE.FogExp2
  private readonly bgColor: THREE.Color

  private readonly skyTopColor = new THREE.Color("#1e315c")
  private readonly midWaterColor = new THREE.Color("#164e6b")
  private readonly abyssColor = new THREE.Color("#091d2c")

  private readonly waterline: WaterlineMesh
  private readonly caustics: CausticsEffect
  private readonly lanternSprite: THREE.Sprite

  private readonly parallaxLayers: ParallaxLayer[] = []
  private readonly geometries: THREE.BufferGeometry[] = []
  private readonly materials: THREE.Material[] = []
  private readonly textures: THREE.Texture[] = []

  private scrollProgress = 0
  private pointerX = 0
  private pointerY = 0
  private disposed = false

  constructor(scene: THREE.Scene) {
    this.scene = scene
    this.loader = new THREE.TextureLoader()

    this.bgColor = this.skyTopColor.clone()
    this.scene.background = this.bgColor
    this.fog = new THREE.FogExp2("#1e315c", 0.015)
    this.scene.fog = this.fog

    // 1. Deep underwater vertical gradient backdrop (Z = -20.2, parallax 0.1x)
    const abyssTex = createAbyssBackdropTexture()
    this.textures.push(abyssTex)
    const abyssGeo = new THREE.PlaneGeometry(72, 34)
    const abyssMat = new THREE.MeshBasicMaterial({
      map: abyssTex,
      depthWrite: false,
      fog: false,
    })
    this.geometries.push(abyssGeo)
    this.materials.push(abyssMat)
    const abyssMesh = new THREE.Mesh(abyssGeo, abyssMat)
    abyssMesh.position.set(0, -10.5, -20.2)
    abyssMesh.renderOrder = -2
    this.scene.add(abyssMesh)
    this.parallaxLayers.push({ object: abyssMesh, baseY: -10.5, parallax: 0.1 })

    // 2. Sky sunset 2.5D backdrop (Z = -20, parallax 0.1x)
    const skyMesh = this.createImagePlane(
      "/assets/harbor/sky-sunset.webp",
      66,
      37.125,
      0,
      7.2,
      -20,
      -1,
      false
    )
    this.parallaxLayers.push({ object: skyMesh, baseY: 7.2, parallax: 0.1 })

    // 3. Pier & Lighthouse hero sprite layer (Z = -6, parallax 0.6x)
    const pierMesh = this.createImagePlane(
      "/assets/harbor/pier-lighthouse.webp",
      28.8,
      16.2,
      0,
      4.55,
      -6,
      1,
      true
    )
    this.parallaxLayers.push({ object: pierMesh, baseY: 4.55, parallax: 0.6 })

    // Warm animated lighthouse lantern bloom sprite matching lighthouse lantern coords
    const lanternTex = createLanternGlowTexture()
    this.textures.push(lanternTex)
    const lanternMat = new THREE.SpriteMaterial({
      map: lanternTex,
      transparent: true,
      opacity: 0.8,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    })
    this.materials.push(lanternMat)
    this.lanternSprite = new THREE.Sprite(lanternMat)
    // Lighthouse lantern center sits ~13% right of image center & ~26% up from center
    this.lanternSprite.position.set(3.75, 8.75, -5.85)
    this.lanternSprite.scale.set(5.4, 5.4, 1)
    this.lanternSprite.renderOrder = 2
    this.scene.add(this.lanternSprite)
    this.parallaxLayers.push({
      object: this.lanternSprite,
      baseY: 8.75,
      parallax: 0.6,
    })

    // 4. Waterline Cross-Section Shader Mesh (Z = 0, surface crest Y = 0, parallax 1.0x)
    this.waterline = new WaterlineMesh()
    this.scene.add(this.waterline.mesh)

    // 5. Underwater Romanesque Stone Ruins (Z = -6, parallax 0.6x)
    const ruinsMesh = this.createImagePlane(
      "/assets/harbor/underwater-ruins.webp",
      28.8,
      16.2,
      0,
      -5.3,
      -6,
      1,
      true
    )
    this.parallaxLayers.push({ object: ruinsMesh, baseY: -5.3, parallax: 0.6 })

    // 6. God Rays & Underwater Bubbles (Z = -2.2)
    this.caustics = new CausticsEffect()
    this.scene.add(this.caustics.group)
    this.parallaxLayers.push({
      object: this.caustics.group,
      baseY: 0,
      parallax: 0.85,
    })

    // 7. Foreground Tilted Anchor, Chain & Abyssal Kelp (Z = +3, parallax 1.3x)
    const fgMesh = this.createImagePlane(
      "/assets/harbor/foreground-anchor.webp",
      16.4,
      9.225,
      0,
      -7.1,
      3,
      5,
      true
    )
    this.parallaxLayers.push({ object: fgMesh, baseY: -7.1, parallax: 1.3 })
  }

  private createImagePlane(
    url: string,
    width: number,
    height: number,
    x: number,
    y: number,
    z: number,
    renderOrder: number,
    fogEnabled: boolean
  ): THREE.Mesh {
    const tex = this.loader.load(url, (loaded) => {
      if (this.disposed) {
        loaded.dispose()
        return
      }
      loaded.colorSpace = THREE.SRGBColorSpace
      loaded.minFilter = THREE.LinearFilter
      loaded.magFilter = THREE.LinearFilter
      loaded.generateMipmaps = false
      loaded.needsUpdate = true
    })
    tex.colorSpace = THREE.SRGBColorSpace
    this.textures.push(tex)

    const geo = new THREE.PlaneGeometry(width, height)
    const mat = new THREE.MeshBasicMaterial({
      map: tex,
      transparent: true,
      depthWrite: false,
      fog: fogEnabled,
    })
    this.geometries.push(geo)
    this.materials.push(mat)

    const mesh = new THREE.Mesh(geo, mat)
    mesh.position.set(x, y, z)
    mesh.renderOrder = renderOrder
    this.scene.add(mesh)
    return mesh
  }

  public setScrollProgress(progress: number): void {
    this.scrollProgress = Math.max(0, Math.min(1, progress))

    // Smooth atmospheric sky -> ocean mid -> abyss fog & background interpolation
    if (this.scrollProgress < 0.42) {
      const t = this.scrollProgress / 0.42
      this.bgColor.copy(this.skyTopColor).lerp(this.midWaterColor, t)
    } else {
      const t = (this.scrollProgress - 0.42) / 0.58
      this.bgColor.copy(this.midWaterColor).lerp(this.abyssColor, t)
    }
    this.scene.background = this.bgColor
    this.fog.color.copy(this.bgColor)
    this.fog.density = 0.014 + this.scrollProgress * 0.018

    // Boost underwater caustics & bubbles once approaching/crossing waterline
    const underwaterFactor = Math.max(
      0.2,
      Math.min(1.0, (this.scrollProgress - 0.08) / 0.35)
    )
    this.caustics.setUnderwaterVisibility(underwaterFactor)
  }

  public setPointer(nx: number, ny: number): void {
    this.pointerX = nx
    this.pointerY = ny
  }

  public update(elapsed: number, delta: number): void {
    this.waterline.update(elapsed)
    this.caustics.update(elapsed, delta)

    // Breathing lighthouse lantern aura
    const pulse = 5.2 + Math.sin(elapsed * 2.1) * 0.35
    this.lanternSprite.scale.set(pulse, pulse, 1)
    ;(this.lanternSprite.material as THREE.SpriteMaterial).opacity =
      0.72 + Math.sin(elapsed * 2.1) * 0.1

    // Apply scroll-coupled parallax offsets per Z depth layer
    const diveOffset = this.scrollProgress * 4.2
    for (const layer of this.parallaxLayers) {
      const parallaxDeltaY = (layer.parallax - 1.0) * diveOffset * 0.45
      layer.object.position.y =
        layer.baseY + parallaxDeltaY - this.pointerY * (layer.parallax * 0.08)
      layer.object.position.x = -this.pointerX * (layer.parallax * 0.14)
    }
  }

  public dispose(): void {
    this.disposed = true
    this.waterline.dispose()
    this.caustics.dispose()

    for (const geo of this.geometries) {
      geo.dispose()
    }
    for (const mat of this.materials) {
      mat.dispose()
    }
    for (const tex of this.textures) {
      tex.dispose()
    }
  }
}
