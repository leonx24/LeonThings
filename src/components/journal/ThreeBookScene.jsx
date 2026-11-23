import { useEffect, useRef, useState } from "react"
import { createPortal } from "react-dom"
import * as THREE from "three"
import {
  CSS3DRenderer,
  CSS3DObject,
} from "three/examples/jsm/renderers/CSS3DRenderer.js"
import { PAGE_PX_W, PAGE_PX_H, COVER_PX_W, COVER_PX_H } from "./JournalSpreads"
import { journalAudio } from "../../lib/journalAudio"

// Exact 1:1 world-to-pixel scale: 560px -> 3.50 world units, 720px -> 4.50 world units
const UNIT_PER_PX = 3.5 / PAGE_PX_W // 0.00625 exact
const PAGE_W = PAGE_PX_W * UNIT_PER_PX // 3.50
const PAGE_H = PAGE_PX_H * UNIT_PER_PX // 4.50
const COVER_W = COVER_PX_W * UNIT_PER_PX // 3.675
const COVER_H = COVER_PX_H * UNIT_PER_PX // 4.725
const TABS_PX_W = 156
const TABS_W = TABS_PX_W * UNIT_PER_PX // 0.975

function createPortalSlots() {
  const makeSlot = (w, h) => {
    const el = document.createElement("div")
    el.style.width = `${w}px`
    el.style.height = `${h}px`
    el.style.backfaceVisibility = "hidden"
    el.style.webkitBackfaceVisibility = "hidden"
    el.style.pointerEvents = "auto"
    el.style.willChange = "transform"
    return el
  }

  return {
    frontCover: makeSlot(COVER_PX_W, COVER_PX_H),
    backCover: makeSlot(COVER_PX_W, COVER_PX_H),
    leftPage: makeSlot(PAGE_PX_W, PAGE_PX_H),
    rightPage: makeSlot(PAGE_PX_W, PAGE_PX_H),
    flipFront: makeSlot(PAGE_PX_W, PAGE_PX_H),
    flipBack: makeSlot(PAGE_PX_W, PAGE_PX_H),
    tabs: makeSlot(TABS_PX_W, 360),
  }
}

function createDeskTexture() {
  const canvas = document.createElement("canvas")
  canvas.width = 1024
  canvas.height = 1024
  const ctx = canvas.getContext("2d")

  const grad = ctx.createRadialGradient(512, 512, 90, 512, 512, 740)
  grad.addColorStop(0, "#2f1e14")
  grad.addColorStop(0.55, "#1c110b")
  grad.addColorStop(1, "#0b0604")
  ctx.fillStyle = grad
  ctx.fillRect(0, 0, 1024, 1024)

  ctx.strokeStyle = "rgba(255, 205, 148, 0.035)"
  ctx.lineWidth = 1.4
  for (let i = 0; i < 220; i++) {
    const y = (i / 220) * 1024
    ctx.beginPath()
    ctx.moveTo(0, y)
    for (let x = 0; x <= 1024; x += 48) {
      ctx.lineTo(x, y + Math.sin(x * 0.012 + i * 0.7) * 4.5)
    }
    ctx.stroke()
  }

  // Inset antique desk blotter mat
  ctx.fillStyle = "rgba(18, 12, 8, 0.55)"
  ctx.fillRect(100, 140, 824, 744)

  ctx.strokeStyle = "rgba(218, 178, 76, 0.24)"
  ctx.lineWidth = 2
  ctx.strokeRect(114, 154, 796, 716)
  ctx.strokeStyle = "rgba(218, 178, 76, 0.1)"
  ctx.lineWidth = 1
  ctx.strokeRect(122, 162, 780, 700)

  ctx.strokeStyle = "rgba(218, 178, 76, 0.07)"
  ctx.beginPath()
  ctx.arc(512, 512, 350, 0, Math.PI * 2)
  ctx.stroke()

  const tex = new THREE.CanvasTexture(canvas)
  tex.colorSpace = THREE.SRGBColorSpace
  tex.anisotropy = 4
  return tex
}

function createLeatherTextures(baseHex = "#29170f") {
  const canvas = document.createElement("canvas")
  canvas.width = 512
  canvas.height = 512
  const ctx = canvas.getContext("2d")

  ctx.fillStyle = baseHex
  ctx.fillRect(0, 0, 512, 512)

  for (let i = 0; i < 9000; i++) {
    const x = Math.random() * 512
    const y = Math.random() * 512
    const r = 0.8 + Math.random() * 1.8
    ctx.fillStyle =
      i % 2 === 0 ? "rgba(255, 225, 190, 0.045)" : "rgba(0, 0, 0, 0.18)"
    ctx.beginPath()
    ctx.arc(x, y, r, 0, Math.PI * 2)
    ctx.fill()
  }

  ctx.strokeStyle = "rgba(218, 178, 76, 0.48)"
  ctx.lineWidth = 3
  ctx.strokeRect(14, 14, 484, 484)

  const map = new THREE.CanvasTexture(canvas)
  map.colorSpace = THREE.SRGBColorSpace
  return map
}

function createPageStackEdgeTexture() {
  const canvas = document.createElement("canvas")
  canvas.width = 256
  canvas.height = 256
  const ctx = canvas.getContext("2d")

  ctx.fillStyle = "#eadcc3"
  ctx.fillRect(0, 0, 256, 256)

  for (let y = 0; y < 256; y += 2) {
    ctx.fillStyle =
      y % 4 === 0 ? "rgba(95, 70, 42, 0.24)" : "rgba(255, 250, 240, 0.38)"
    ctx.fillRect(0, y, 256, 1)
  }

  const tex = new THREE.CanvasTexture(canvas)
  tex.colorSpace = THREE.SRGBColorSpace
  tex.wrapS = THREE.RepeatWrapping
  tex.wrapT = THREE.RepeatWrapping
  tex.repeat.set(2, 3)
  return tex
}

// Soft radial glow sprite for rising coffee steam wisps
function createSteamPuffTexture() {
  const canvas = document.createElement("canvas")
  canvas.width = 64
  canvas.height = 64
  const ctx = canvas.getContext("2d")
  const grad = ctx.createRadialGradient(32, 32, 2, 32, 32, 30)
  grad.addColorStop(0, "rgba(255, 246, 232, 0.45)")
  grad.addColorStop(0.5, "rgba(245, 232, 210, 0.18)")
  grad.addColorStop(1, "rgba(245, 232, 210, 0)")
  ctx.fillStyle = grad
  ctx.fillRect(0, 0, 64, 64)

  const tex = new THREE.CanvasTexture(canvas)
  return tex
}

export default function ThreeBookScene({
  currentSpread,
  maxSpread = 5,
  leatherColor = "#29170f",
  transitionState,
  inspectMode,
  lampMode = "study",
  mobileSide,
  onLoupeClick,
  onInkClick,
  frontCoverNode,
  backCoverNode,
  leftPageNode,
  rightPageNode,
  flipFrontNode,
  flipBackNode,
  tabsNode,
}) {
  const webglMountRef = useRef(null)
  const cssMountRef = useRef(null)
  const [slots] = useState(() => createPortalSlots())
  const [hoveredPropLabel, setHoveredPropLabel] = useState(null)

  const liveRef = useRef({
    currentSpread,
    maxSpread,
    transitionState,
    inspectMode,
    lampMode,
    mobileSide,
    onLoupeClick,
    onInkClick,
    mouseX: 0,
    mouseY: 0,
    steamBoost: 0,
    hoveredProp: null,
    isNarrow: typeof window !== "undefined" ? window.innerWidth < 960 : false,
  })

  useEffect(() => {
    liveRef.current.currentSpread = currentSpread
    liveRef.current.maxSpread = maxSpread
    liveRef.current.transitionState = transitionState
    liveRef.current.inspectMode = inspectMode
    liveRef.current.lampMode = lampMode
    liveRef.current.mobileSide = mobileSide
    liveRef.current.onLoupeClick = onLoupeClick
    liveRef.current.onInkClick = onInkClick
  }, [
    currentSpread,
    maxSpread,
    transitionState,
    inspectMode,
    lampMode,
    mobileSide,
    onLoupeClick,
    onInkClick,
  ])

  useEffect(() => {
    const webglContainer = webglMountRef.current
    const cssContainer = cssMountRef.current
    if (!webglContainer || !cssContainer) return

    const width = webglContainer.clientWidth
    const height = webglContainer.clientHeight

    // 1. Shared Perspective Camera
    const camera = new THREE.PerspectiveCamera(34, width / height, 0.1, 100)
    camera.up.set(0, 1, 0)
    camera.position.set(0, -1.6, 8.8)
    camera.lookAt(0, 0.02, 0.22)

    // 2. Scenes
    const webglScene = new THREE.Scene()
    webglScene.background = new THREE.Color("#0d0805")
    webglScene.fog = new THREE.FogExp2("#0d0805", 0.028)

    const cssScene = new THREE.Scene()

    // 3. Renderers
    const webglRenderer = new THREE.WebGLRenderer({
      antialias: true,
      powerPreference: "high-performance",
    })
    webglRenderer.setSize(width, height)
    webglRenderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5))
    webglRenderer.shadowMap.enabled = true
    webglRenderer.shadowMap.type = THREE.PCFShadowMap
    webglRenderer.toneMapping = THREE.ACESFilmicToneMapping
    webglRenderer.toneMappingExposure = 1.14
    webglContainer.innerHTML = ""
    webglContainer.appendChild(webglRenderer.domElement)

    const cssRenderer = new CSS3DRenderer()
    cssRenderer.setSize(width, height)
    cssRenderer.domElement.style.position = "absolute"
    cssRenderer.domElement.style.inset = "0"
    cssRenderer.domElement.style.pointerEvents = "none"
    cssContainer.innerHTML = ""
    cssContainer.appendChild(cssRenderer.domElement)

    // 4. Lighting
    const ambientLight = new THREE.AmbientLight("#f7e2c1", 0.72)
    webglScene.add(ambientLight)

    const deskLamp = new THREE.SpotLight("#ffd494", 58)
    deskLamp.position.set(-3.4, 3.2, 7.8)
    deskLamp.angle = Math.PI / 2.5
    deskLamp.penumbra = 0.88
    deskLamp.decay = 1.35
    deskLamp.distance = 26
    deskLamp.castShadow = true
    deskLamp.shadow.mapSize.width = 1024
    deskLamp.shadow.mapSize.height = 1024
    deskLamp.shadow.bias = -0.0004
    webglScene.add(deskLamp)

    const warmCandleRim = new THREE.PointLight("#e88c3d", 9, 14)
    warmCandleRim.position.set(4.8, 2.5, 3.2)
    webglScene.add(warmCandleRim)

    const coolFill = new THREE.DirectionalLight("#cbd8ea", 0.3)
    coolFill.position.set(1.5, -4.0, 6.0)
    webglScene.add(coolFill)

    // 5. Study Desk Surface
    const deskTex = createDeskTexture()
    const deskMesh = new THREE.Mesh(
      new THREE.PlaneGeometry(22, 16),
      new THREE.MeshStandardMaterial({
        map: deskTex,
        roughness: 0.72,
        metalness: 0.08,
      })
    )
    deskMesh.receiveShadow = true
    webglScene.add(deskMesh)

    // ========================================================================
    // 6. INTERACTIVE 3D DESK PROPS (Loupe, Steaming Coffee Cup, Inkwell & Pen)
    // ========================================================================
    const brassMat = new THREE.MeshStandardMaterial({
      color: "#d4a849",
      roughness: 0.28,
      metalness: 0.86,
    })
    const darkWoodMat = new THREE.MeshStandardMaterial({
      color: "#22120a",
      roughness: 0.52,
      metalness: 0.1,
    })
    const porcelainMat = new THREE.MeshStandardMaterial({
      color: "#f4ead7",
      roughness: 0.22,
      metalness: 0.05,
    })

    // 6a. Interactive Brass Magnifying Loupe (Top-Left — Click to Zoom!)
    const loupeGroup = new THREE.Group()
    loupeGroup.position.set(-4.72, 1.55, 0.09)
    loupeGroup.rotation.z = -0.48
    loupeGroup.userData = { propId: "loupe" }

    const loupeRing = new THREE.Mesh(
      new THREE.TorusGeometry(0.45, 0.055, 16, 40),
      brassMat
    )
    loupeRing.castShadow = true
    loupeGroup.add(loupeRing)

    const loupeGlass = new THREE.Mesh(
      new THREE.CylinderGeometry(0.43, 0.43, 0.03, 32),
      new THREE.MeshStandardMaterial({
        color: "#dceef2",
        transparent: true,
        opacity: 0.3,
        roughness: 0.08,
        metalness: 0.2,
      })
    )
    loupeGlass.rotation.x = Math.PI / 2
    loupeGroup.add(loupeGlass)

    const loupeHandle = new THREE.Mesh(
      new THREE.CylinderGeometry(0.055, 0.075, 1.05, 16),
      darkWoodMat
    )
    loupeHandle.position.set(0, -0.96, 0)
    loupeHandle.castShadow = true
    loupeGroup.add(loupeHandle)
    webglScene.add(loupeGroup)

    // 6b. Interactive Porcelain Espresso Cup + Saucer + Rising 3D Steam (Lower-Left!)
    const coffeeGroup = new THREE.Group()
    coffeeGroup.position.set(-4.78, -1.25, 0)
    coffeeGroup.userData = { propId: "coffee" }

    // Saucer plate
    const saucerMesh = new THREE.Mesh(
      new THREE.CylinderGeometry(0.68, 0.52, 0.08, 32),
      porcelainMat
    )
    saucerMesh.rotation.x = Math.PI / 2
    saucerMesh.position.z = 0.04
    saucerMesh.castShadow = true
    saucerMesh.receiveShadow = true
    coffeeGroup.add(saucerMesh)

    // Gold rim on saucer
    const saucerRim = new THREE.Mesh(
      new THREE.TorusGeometry(0.66, 0.016, 10, 36),
      brassMat
    )
    saucerRim.position.z = 0.08
    coffeeGroup.add(saucerRim)

    // Cup body
    const cupMesh = new THREE.Mesh(
      new THREE.CylinderGeometry(0.42, 0.31, 0.48, 32),
      porcelainMat
    )
    cupMesh.rotation.x = Math.PI / 2
    cupMesh.position.z = 0.28
    cupMesh.castShadow = true
    coffeeGroup.add(cupMesh)

    // Gold rim on cup
    const cupRim = new THREE.Mesh(
      new THREE.TorusGeometry(0.42, 0.018, 10, 32),
      brassMat
    )
    cupRim.position.z = 0.52
    coffeeGroup.add(cupRim)

    // Cup ear handle
    const cupHandle = new THREE.Mesh(
      new THREE.TorusGeometry(0.16, 0.032, 12, 24, Math.PI * 1.15),
      porcelainMat
    )
    cupHandle.rotation.x = Math.PI / 2
    cupHandle.rotation.y = -Math.PI / 2
    cupHandle.position.set(-0.42, -0.05, 0.31)
    cupHandle.castShadow = true
    coffeeGroup.add(cupHandle)

    // Rich dark roast espresso surface
    const coffeeLiquid = new THREE.Mesh(
      new THREE.CylinderGeometry(0.39, 0.39, 0.02, 28),
      new THREE.MeshStandardMaterial({
        color: "#1b0c05",
        roughness: 0.14,
        metalness: 0.12,
      })
    )
    coffeeLiquid.rotation.x = Math.PI / 2
    coffeeLiquid.position.z = 0.47
    coffeeGroup.add(coffeeLiquid)
    webglScene.add(coffeeGroup)

    // Rising Wispy 3D Steam Sprites above Coffee Cup (optimized to 8 sprites)
    const steamTex = createSteamPuffTexture()
    const steamWisps = []
    for (let i = 0; i < 8; i++) {
      const mat = new THREE.SpriteMaterial({
        map: steamTex,
        transparent: true,
        opacity: 0,
        depthWrite: false,
      })
      const sprite = new THREE.Sprite(mat)
      const phase = i / 8
      sprite.userData = {
        phase,
        driftSeed: Math.random() * Math.PI * 2,
        speed: 0.22 + Math.random() * 0.12,
      }
      webglScene.add(sprite)
      steamWisps.push(sprite)
    }

    // 6c. Interactive Inkwell + Fountain Pen (Right of Book)
    const inkwellGroup = new THREE.Group()
    inkwellGroup.position.set(4.85, 1.65, 0)
    inkwellGroup.userData = { propId: "ink" }

    const inkBody = new THREE.Mesh(
      new THREE.CylinderGeometry(0.35, 0.43, 0.42, 8),
      new THREE.MeshStandardMaterial({
        color: "#1b242c",
        roughness: 0.2,
        metalness: 0.35,
      })
    )
    inkBody.rotation.x = Math.PI / 2
    inkBody.position.z = 0.21
    inkBody.castShadow = true
    inkwellGroup.add(inkBody)

    const inkCap = new THREE.Mesh(
      new THREE.CylinderGeometry(0.19, 0.21, 0.16, 16),
      brassMat
    )
    inkCap.rotation.x = Math.PI / 2
    inkCap.position.z = 0.48
    inkCap.castShadow = true
    inkwellGroup.add(inkCap)
    webglScene.add(inkwellGroup)

    const penGroup = new THREE.Group()
    penGroup.position.set(4.65, -1.25, 0.055)
    penGroup.rotation.z = 0.32
    penGroup.userData = { propId: "ink" }

    const penBarrel = new THREE.Mesh(
      new THREE.CylinderGeometry(0.042, 0.052, 1.85, 16),
      darkWoodMat
    )
    penBarrel.castShadow = true
    penGroup.add(penBarrel)
    const penBand = new THREE.Mesh(
      new THREE.CylinderGeometry(0.056, 0.056, 0.09, 16),
      brassMat
    )
    penBand.position.y = 0.55
    penGroup.add(penBand)
    const penNib = new THREE.Mesh(
      new THREE.ConeGeometry(0.042, 0.28, 12),
      brassMat
    )
    penNib.position.y = 1.06
    penNib.castShadow = true
    penGroup.add(penNib)
    webglScene.add(penGroup)

    const interactiveProps = [loupeGroup, coffeeGroup, inkwellGroup, penGroup]

    // ========================================================================
    // 7. UNIFIED 3D BOOK ASSEMBLY
    // ========================================================================
    const webglBookRoot = new THREE.Group()
    webglScene.add(webglBookRoot)

    const cssBookRoot = new THREE.Group()
    cssScene.add(cssBookRoot)

    const leatherMap = createLeatherTextures(leatherColor)
    const leatherMat = new THREE.MeshStandardMaterial({
      map: leatherMap,
      roughness: 0.58,
      metalness: 0.14,
    })
    const innerEndpaperMat = new THREE.MeshStandardMaterial({
      color: "#efe3ca",
      roughness: 0.85,
    })
    const pageEdgeTex = createPageStackEdgeTexture()
    const pageEdgeMat = new THREE.MeshStandardMaterial({
      map: pageEdgeTex,
      roughness: 0.82,
      metalness: 0.02,
    })
    const pageTopMat = new THREE.MeshStandardMaterial({
      color: "#faf4e6",
      roughness: 0.85,
    })
    const stackMaterials = [
      pageEdgeMat,
      pageEdgeMat,
      pageEdgeMat,
      pageEdgeMat,
      pageTopMat,
      pageTopMat,
    ]

    const spineGroup = new THREE.Group()
    webglBookRoot.add(spineGroup)

    const spineShell = new THREE.Mesh(
      new THREE.CylinderGeometry(
        0.22,
        0.22,
        COVER_H + 0.02,
        24,
        1,
        false,
        -Math.PI / 2,
        Math.PI
      ),
      leatherMat
    )
    spineShell.rotation.z = Math.PI
    spineShell.position.set(0, 0, 0.14)
    spineShell.castShadow = true
    spineGroup.add(spineShell)

    for (const yOff of [-1.75, -0.88, 0, 0.88, 1.75]) {
      const hub = new THREE.Mesh(
        new THREE.TorusGeometry(0.228, 0.022, 10, 24, Math.PI),
        brassMat
      )
      hub.rotation.x = Math.PI / 2
      hub.rotation.y = Math.PI
      hub.position.set(0, yOff, 0.14)
      spineGroup.add(hub)
    }

    const ribbonTail = new THREE.Mesh(
      new THREE.BoxGeometry(0.14, 0.72, 0.014),
      new THREE.MeshStandardMaterial({ color: "#8a1c18", roughness: 0.45 })
    )
    ribbonTail.position.set(0, -COVER_H / 2 - 0.26, 0.05)
    ribbonTail.rotation.z = 0.06
    ribbonTail.castShadow = true
    webglBookRoot.add(ribbonTail)

    const boardThickness = 0.1
    const leftCoverGroup = new THREE.Group()
    const rightCoverGroup = new THREE.Group()
    webglBookRoot.add(leftCoverGroup)
    webglBookRoot.add(rightCoverGroup)

    const boardGeo = new THREE.BoxGeometry(COVER_W, COVER_H, boardThickness)
    const leftBoard = new THREE.Mesh(boardGeo, leatherMat)
    leftBoard.position.set(-COVER_W / 2, 0, boardThickness / 2)
    leftBoard.castShadow = true
    leftBoard.receiveShadow = true
    leftCoverGroup.add(leftBoard)

    const rightBoard = new THREE.Mesh(boardGeo, leatherMat)
    rightBoard.position.set(COVER_W / 2, 0, boardThickness / 2)
    rightBoard.castShadow = true
    rightBoard.receiveShadow = true
    rightCoverGroup.add(rightBoard)

    const cornerGeo = new THREE.BoxGeometry(0.32, 0.32, boardThickness + 0.022)
    ;[
      { parent: leftCoverGroup, x: -COVER_W + 0.14, y: COVER_H / 2 - 0.15 },
      { parent: leftCoverGroup, x: -COVER_W + 0.14, y: -COVER_H / 2 + 0.15 },
      { parent: rightCoverGroup, x: COVER_W - 0.14, y: COVER_H / 2 - 0.15 },
      { parent: rightCoverGroup, x: COVER_W - 0.14, y: -COVER_H / 2 + 0.15 },
    ].forEach(({ parent, x, y }) => {
      const c = new THREE.Mesh(cornerGeo, brassMat)
      c.position.set(x, y, boardThickness / 2)
      c.castShadow = true
      parent.add(c)
    })

    const baseStackGeo = new THREE.BoxGeometry(PAGE_W, PAGE_H, 1)
    const leftStackMesh = new THREE.Mesh(baseStackGeo, stackMaterials)
    leftStackMesh.castShadow = true
    leftStackMesh.receiveShadow = true
    webglBookRoot.add(leftStackMesh)

    const rightStackMesh = new THREE.Mesh(baseStackGeo, stackMaterials)
    rightStackMesh.castShadow = true
    rightStackMesh.receiveShadow = true
    webglBookRoot.add(rightStackMesh)

    const closedTopCoverMesh = new THREE.Mesh(boardGeo, leatherMat)
    closedTopCoverMesh.castShadow = true
    closedTopCoverMesh.receiveShadow = true
    webglBookRoot.add(closedTopCoverMesh)

    const webglTurnPivot = new THREE.Group()
    webglBookRoot.add(webglTurnPivot)
    const webglTurnSheet = new THREE.Mesh(
      new THREE.BoxGeometry(PAGE_W, PAGE_H, 0.008),
      innerEndpaperMat
    )
    webglTurnSheet.position.set(PAGE_W / 2, 0, 0)
    webglTurnSheet.castShadow = true
    webglTurnPivot.add(webglTurnSheet)

    const makeCssObj = (el, scale = UNIT_PER_PX) => {
      const obj = new CSS3DObject(el)
      obj.scale.setScalar(scale)
      return obj
    }

    const frontCoverCssObj = makeCssObj(slots.frontCover)
    cssBookRoot.add(frontCoverCssObj)

    const backCoverCssObj = makeCssObj(slots.backCover)
    cssBookRoot.add(backCoverCssObj)

    const leftPageCssObj = makeCssObj(slots.leftPage)
    cssBookRoot.add(leftPageCssObj)

    const rightPageCssObj = makeCssObj(slots.rightPage)
    cssBookRoot.add(rightPageCssObj)

    const tabsCssObj = makeCssObj(slots.tabs)
    cssBookRoot.add(tabsCssObj)

    const cssTurnPivot = new THREE.Group()
    cssBookRoot.add(cssTurnPivot)

    const flipFrontCssObj = makeCssObj(slots.flipFront)
    flipFrontCssObj.position.set(PAGE_W / 2, 0, 0.004)
    flipFrontCssObj.rotation.y = 0
    cssTurnPivot.add(flipFrontCssObj)

    const flipBackCssObj = makeCssObj(slots.flipBack)
    flipBackCssObj.position.set(PAGE_W / 2, 0, -0.004)
    flipBackCssObj.rotation.y = Math.PI
    cssTurnPivot.add(flipBackCssObj)

    // 8. Floating Golden Dust Motes (GPU-transformed group, zero per-frame buffer upload)
    const dustCount = 45
    const dustGeo = new THREE.BufferGeometry()
    const dustPos = new Float32Array(dustCount * 3)
    for (let i = 0; i < dustCount; i++) {
      dustPos[i * 3] = (Math.random() - 0.5) * 12
      dustPos[i * 3 + 1] = (Math.random() - 0.5) * 7.5
      dustPos[i * 3 + 2] = 0.4 + Math.random() * 4.2
    }
    dustGeo.setAttribute("position", new THREE.BufferAttribute(dustPos, 3))
    const dustPoints = new THREE.Points(
      dustGeo,
      new THREE.PointsMaterial({
        color: "#fae09e",
        size: 0.05,
        transparent: true,
        opacity: 0.5,
        blending: THREE.AdditiveBlending,
        depthWrite: false,
      })
    )
    webglScene.add(dustPoints)

    // ========================================================================
    // 8b. RAYCASTER FOR INTERACTIVE 3D DESK PROPS (Throttled to 90ms)
    // ========================================================================
    const raycaster = new THREE.Raycaster()
    const pointerNdc = new THREE.Vector2()
    let lastRaycastMs = 0

    const findPropId = (obj) => {
      let cur = obj
      while (cur) {
        if (cur.userData?.propId) return cur.userData.propId
        cur = cur.parent
      }
      return null
    }

    const handleMouseMove = (e) => {
      const nx = (e.clientX / window.innerWidth) * 2 - 1
      const ny = (e.clientY / window.innerHeight) * 2 - 1
      liveRef.current.mouseX = nx
      liveRef.current.mouseY = ny

      // Only raycast 3D desk props when pointer is directly over the WebGL desk canvas
      if (e.target !== webglRenderer.domElement) {
        if (liveRef.current.hoveredProp !== null) {
          liveRef.current.hoveredProp = null
          setHoveredPropLabel(null)
        }
        return
      }

      const now = performance.now()
      if (now - lastRaycastMs < 90) return
      lastRaycastMs = now

      pointerNdc.set(nx, -ny)
      raycaster.setFromCamera(pointerNdc, camera)
      const hits = raycaster.intersectObjects(interactiveProps, true)
      const hitId = hits.length > 0 ? findPropId(hits[0].object) : null

      if (hitId !== liveRef.current.hoveredProp) {
        liveRef.current.hoveredProp = hitId
        if (hitId === "loupe") {
          setHoveredPropLabel("Magnifying Glass · Click to Toggle Zoom")
        } else if (hitId === "coffee") {
          setHoveredPropLabel("Hot Espresso · Click for Fresh Steam")
        } else if (hitId === "ink") {
          setHoveredPropLabel("Fountain Pen & Ink · Click to Jump to Notes")
        } else {
          setHoveredPropLabel(null)
        }
      }
    }

    const handleWebglClick = (e) => {
      const nx = (e.clientX / window.innerWidth) * 2 - 1
      const ny = -((e.clientY / window.innerHeight) * 2 - 1)
      pointerNdc.set(nx, ny)
      raycaster.setFromCamera(pointerNdc, camera)
      const hits = raycaster.intersectObjects(interactiveProps, true)
      if (hits.length === 0) return

      const propId = findPropId(hits[0].object)
      if (propId === "loupe") {
        journalAudio.playStampClick()
        liveRef.current.onLoupeClick?.()
      } else if (propId === "coffee") {
        journalAudio.playCeramicClink()
        liveRef.current.steamBoost = 1.0
      } else if (propId === "ink") {
        journalAudio.playStampClick()
        liveRef.current.onInkClick?.()
      }
    }

    window.addEventListener("mousemove", handleMouseMove, { passive: true })
    webglContainer.addEventListener("click", handleWebglClick)

    const handleResize = () => {
      if (!webglContainer) return
      const w = webglContainer.clientWidth
      const h = webglContainer.clientHeight
      liveRef.current.isNarrow = w < 960
      camera.aspect = w / h
      camera.updateProjectionMatrix()
      webglRenderer.setSize(w, h)
      cssRenderer.setSize(w, h)
    }
    window.addEventListener("resize", handleResize)

    // ========================================================================
    // 9. SYNCHRONIZED RENDER LOOP (Zero per-frame allocations)
    // ========================================================================
    let frameId
    const clock = new THREE.Clock()
    const lookTarget = new THREE.Vector3(0, 0.02, 0.22)
    const tempScaleVec = new THREE.Vector3(1, 1, 1)
    const studyLampColor = new THREE.Color("#ffd89e")
    const candleLampColor = new THREE.Color("#ff9f43")

    const animate = () => {
      frameId = requestAnimationFrame(animate)
      const elapsed = clock.getElapsedTime()
      const {
        currentSpread: spread,
        maxSpread: mSpread,
        transitionState: trans,
        inspectMode: inspect,
        lampMode: lMode,
        mobileSide: mSide,
        mouseX,
        mouseY,
        hoveredProp,
        isNarrow,
      } = liveRef.current

      // Decay coffee steam burst smoothly
      if (liveRef.current.steamBoost > 0.01) {
        liveRef.current.steamBoost *= 0.985
      } else {
        liveRef.current.steamBoost = 0
      }
      const boost = liveRef.current.steamBoost

      // Interactive hover float on 3D desk props (reusing tempScaleVec)
      const loupeTargetZ = hoveredProp === "loupe" ? 0.22 : 0.09
      loupeGroup.position.z += (loupeTargetZ - loupeGroup.position.z) * 0.14
      const loupeTargetScale = hoveredProp === "loupe" ? 1.06 : 1.0
      tempScaleVec.setScalar(loupeTargetScale)
      loupeGroup.scale.lerp(tempScaleVec, 0.14)

      const coffeeTargetScale = hoveredProp === "coffee" ? 1.06 : 1.0
      tempScaleVec.setScalar(coffeeTargetScale)
      coffeeGroup.scale.lerp(tempScaleVec, 0.14)

      const penTargetZ = hoveredProp === "ink" ? 0.16 : 0.055
      penGroup.position.z += (penTargetZ - penGroup.position.z) * 0.14

      // Animate rising coffee steam wisps above (-4.78, -1.25, 0.52)
      steamWisps.forEach((sprite) => {
        const { phase, driftSeed, speed } = sprite.userData
        const cycle = (elapsed * speed * (1 + boost * 0.8) + phase) % 1
        const heightZ = 0.52 + cycle * (1.45 + boost * 0.55)
        const swayX = Math.sin(elapsed * 1.4 + driftSeed + cycle * 4) * 0.14 * cycle
        const swayY = Math.cos(elapsed * 1.1 + driftSeed + cycle * 3) * 0.1 * cycle

        sprite.position.set(-4.78 + swayX, -1.25 + swayY, heightZ)
        const scale = 0.24 + cycle * (0.48 + boost * 0.22)
        sprite.scale.set(scale, scale, 1)

        // Smooth fade-in from espresso surface and fade-out into study air
        const alpha =
          Math.sin(cycle * Math.PI) * (0.26 + boost * 0.28)
        sprite.material.opacity = Math.max(0, alpha)
      })

      // Study Lamp vs Candlelight Ambiance
      const isCandle = lMode === "candle"
      const targetLampInt = isCandle
        ? 38 + Math.sin(elapsed * 5.4) * 3.2 + Math.cos(elapsed * 11.3) * 1.8
        : 58 + Math.sin(elapsed * 2.8) * 1.0
      deskLamp.intensity += (targetLampInt - deskLamp.intensity) * 0.1
      deskLamp.color.lerp(isCandle ? candleLampColor : studyLampColor, 0.08)
      ambientLight.intensity +=
        ((isCandle ? 0.44 : 0.74) - ambientLight.intensity) * 0.08
      warmCandleRim.intensity +=
        ((isCandle ? 15 : 8.5) - warmCandleRim.intensity) * 0.08

      const effectiveSpread = trans?.active ? trans.toSpread : spread
      const isClosedFront = effectiveSpread === 0 && !trans?.active
      const isClosedBack = effectiveSpread === mSpread && !trans?.active
      const isOpenState = !isClosedFront && !isClosedBack

      const openStackHeight = 0.22
      const openSurfaceZ = boardThickness + openStackHeight + 0.003

      if (isClosedFront || isClosedBack) {
        leftCoverGroup.visible = isClosedBack
        rightCoverGroup.visible = isClosedFront

        const stackX = isClosedFront ? PAGE_W / 2 : -PAGE_W / 2
        const coverX = isClosedFront ? COVER_W / 2 : -COVER_W / 2

        leftStackMesh.visible = false
        rightStackMesh.visible = true
        rightStackMesh.scale.set(1, 1, 0.34)
        rightStackMesh.position.set(stackX, 0, boardThickness + 0.17)

        closedTopCoverMesh.visible = true
        closedTopCoverMesh.position.set(
          coverX,
          0,
          boardThickness + 0.34 + boardThickness / 2
        )

        frontCoverCssObj.visible = isClosedFront
        frontCoverCssObj.position.set(
          COVER_W / 2,
          0,
          boardThickness * 2 + 0.34 + 0.004
        )

        backCoverCssObj.visible = isClosedBack
        backCoverCssObj.position.set(
          -COVER_W / 2,
          0,
          boardThickness * 2 + 0.34 + 0.004
        )

        leftPageCssObj.visible = false
        rightPageCssObj.visible = false
        tabsCssObj.visible = false
        cssTurnPivot.visible = false
        webglTurnPivot.visible = false
      } else {
        const openingFromFront = trans?.active && trans.fromSpread === 0
        const closingToFront = trans?.active && trans.toSpread === 0
        const closingToBack = trans?.active && trans.toSpread === mSpread
        const openingFromBack = trans?.active && trans.fromSpread === mSpread
        const isCoverSwing =
          openingFromFront || closingToFront || closingToBack || openingFromBack

        leftCoverGroup.visible = !openingFromFront && !closingToFront
        rightCoverGroup.visible = !closingToBack && !openingFromBack
        closedTopCoverMesh.visible = false
        frontCoverCssObj.visible = false
        backCoverCssObj.visible = false

        const transProgress = trans?.active
          ? trans.startTime
            ? Math.min(
                1,
                (performance.now() - trans.startTime) / (trans.duration || 540)
              )
            : trans.progress || 0
          : 0

        const showLeftStack =
          !closingToFront && (!openingFromFront || transProgress > 0.62)
        const showRightStack =
          !closingToBack && (!openingFromBack || transProgress > 0.62)

        leftStackMesh.visible = showLeftStack
        leftStackMesh.scale.set(1, 1, openStackHeight)
        leftStackMesh.position.set(
          -PAGE_W / 2,
          0,
          boardThickness + openStackHeight / 2
        )

        rightStackMesh.visible = showRightStack
        rightStackMesh.scale.set(1, 1, openStackHeight)
        rightStackMesh.position.set(
          PAGE_W / 2,
          0,
          boardThickness + openStackHeight / 2
        )

        leftPageCssObj.visible =
          showLeftStack && !openingFromFront && !closingToFront
        leftPageCssObj.position.set(-PAGE_W / 2, 0, openSurfaceZ)

        rightPageCssObj.visible =
          showRightStack && !closingToBack && !openingFromBack
        rightPageCssObj.position.set(PAGE_W / 2, 0, openSurfaceZ)

        tabsCssObj.visible = showRightStack && !isCoverSwing
        tabsCssObj.position.set(
          PAGE_W + TABS_W / 2 - 0.02,
          0.45,
          openSurfaceZ - 0.006
        )

        if (trans && trans.active) {
          const p = transProgress
          const eased =
            p < 0.5 ? 4 * p * p * p : 1 - Math.pow(-2 * p + 2, 3) / 2
          const leafAngle =
            trans.direction > 0 ? -eased * Math.PI : -(1 - eased) * Math.PI
          const pivotZ = openSurfaceZ + 0.015

          cssTurnPivot.visible = true
          cssTurnPivot.position.set(0, 0, pivotZ)
          cssTurnPivot.rotation.y = leafAngle

          webglTurnPivot.visible = true
          webglTurnPivot.position.set(0, 0, pivotZ)
          webglTurnPivot.rotation.y = leafAngle
          webglTurnSheet.material = isCoverSwing ? leatherMat : innerEndpaperMat
          webglTurnSheet.scale.set(
            isCoverSwing ? COVER_W / PAGE_W : 1,
            isCoverSwing ? COVER_H / PAGE_H : 1,
            isCoverSwing ? 8 : 1
          )

          const showFrontFace = leafAngle > -Math.PI / 2
          flipFrontCssObj.visible = showFrontFace
          flipBackCssObj.visible = !showFrontFace

          slots.leftPage.style.pointerEvents = "none"
          slots.rightPage.style.pointerEvents = "none"
        } else {
          cssTurnPivot.visible = false
          webglTurnPivot.visible = false
          slots.leftPage.style.pointerEvents = "auto"
          slots.rightPage.style.pointerEvents = "auto"
        }
      }

      let targetBookX = 0
      if (isClosedFront) targetBookX = -COVER_W / 2
      else if (isClosedBack) targetBookX = COVER_W / 2

      webglBookRoot.position.x +=
        (targetBookX - webglBookRoot.position.x) * 0.09
      webglBookRoot.position.y = 0.05
      webglBookRoot.position.z = 0.04

      const tiltStrength = inspect ? 0.016 : 0.048
      const targetRotY = mouseX * tiltStrength
      const targetRotX = -mouseY * tiltStrength * 0.7
      webglBookRoot.rotation.y +=
        (targetRotY - webglBookRoot.rotation.y) * 0.08
      webglBookRoot.rotation.x +=
        (targetRotX - webglBookRoot.rotation.x) * 0.08

      cssBookRoot.position.copy(webglBookRoot.position)
      cssBookRoot.rotation.copy(webglBookRoot.rotation)

      const aspect = camera.aspect || 1.6
      const tanHalfFov = Math.tan(THREE.MathUtils.degToRad(camera.fov / 2))

      let desiredWidth = isOpenState ? 8.3 : 4.75
      let baseZ = isOpenState ? 8.85 : 8.55
      let targetCamX = mouseX * (inspect ? 0.1 : 0.22)
      let targetCamY = isOpenState ? -1.18 : -1.62
      let targetLookX = 0

      if (isNarrow && isOpenState) {
        desiredWidth = 4.35
        baseZ = 7.75
        const pageOffset = mSide === "right" ? PAGE_W / 2 : -PAGE_W / 2
        targetCamX = pageOffset
        targetLookX = pageOffset
        targetCamY = -0.6
      } else if (inspect && isOpenState) {
        desiredWidth = 7.35
        baseZ = 7.45
        targetCamY = -0.38
      }

      const minZForWidth = desiredWidth / aspect / (2 * tanHalfFov)
      const targetCamZ = Math.max(baseZ, minZForWidth)

      camera.position.x += (targetCamX - camera.position.x) * 0.08
      camera.position.y += (targetCamY - camera.position.y) * 0.08
      camera.position.z += (targetCamZ - camera.position.z) * 0.08

      lookTarget.x += (targetLookX - lookTarget.x) * 0.09
      lookTarget.y = 0.02
      lookTarget.z = 0.22
      camera.lookAt(lookTarget)

      // Gentle GPU-side drift for dust points (zero BufferAttribute CPU upload)
      dustPoints.position.x = Math.sin(elapsed * 0.25) * 0.18
      dustPoints.position.y = Math.cos(elapsed * 0.2) * 0.12
      dustPoints.position.z = Math.sin(elapsed * 0.35) * 0.08

      webglRenderer.render(webglScene, camera)
      cssRenderer.render(cssScene, camera)
    }

    animate()

    return () => {
      cancelAnimationFrame(frameId)
      window.removeEventListener("mousemove", handleMouseMove)
      webglContainer.removeEventListener("click", handleWebglClick)
      window.removeEventListener("resize", handleResize)
      webglRenderer.dispose()
      deskTex.dispose()
      leatherMap.dispose()
      pageEdgeTex.dispose()
      steamTex.dispose()
    }
  }, [slots, leatherColor])

  return (
    <>
      <div
        ref={webglMountRef}
        className={`fixed inset-0 w-full h-full z-0 ${
          hoveredPropLabel ? "cursor-pointer" : ""
        }`}
        aria-hidden="true"
      />
      <div
        ref={cssMountRef}
        className="pointer-events-none fixed inset-0 w-full h-full z-10"
      />

      {/* Subtle Floating Tooltip when Hovering Interactive 3D Desk Props */}
      {hoveredPropLabel && (
        <div className="pointer-events-none fixed bottom-18 left-1/2 -translate-x-1/2 z-40 px-4 py-1.5 rounded-full bg-[#150c07]/92 border border-[#eab34b]/45 text-[#fae29c] font-book-sans text-[12px] font-medium shadow-xl backdrop-blur-md">
          {hoveredPropLabel}
        </div>
      )}

      {frontCoverNode && createPortal(frontCoverNode, slots.frontCover)}
      {backCoverNode && createPortal(backCoverNode, slots.backCover)}
      {leftPageNode && createPortal(leftPageNode, slots.leftPage)}
      {rightPageNode && createPortal(rightPageNode, slots.rightPage)}
      {flipFrontNode && createPortal(flipFrontNode, slots.flipFront)}
      {flipBackNode && createPortal(flipBackNode, slots.flipBack)}
      {tabsNode && createPortal(tabsNode, slots.tabs)}
    </>
  )
}
