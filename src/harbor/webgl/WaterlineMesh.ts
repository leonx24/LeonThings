import * as THREE from "three"
import waterlineVert from "../shaders/waterline.vert"
import waterlineFrag from "../shaders/waterline.frag"

export class WaterlineMesh {
  public readonly mesh: THREE.Mesh
  private readonly geometry: THREE.PlaneGeometry
  private readonly material: THREE.ShaderMaterial

  constructor() {
    this.geometry = new THREE.PlaneGeometry(52, 12, 96, 12)

    this.material = new THREE.ShaderMaterial({
      vertexShader: waterlineVert,
      fragmentShader: waterlineFrag,
      transparent: true,
      depthWrite: false,
      side: THREE.DoubleSide,
      uniforms: {
        uTime: { value: 0 },
        uSurfaceColor: { value: new THREE.Color("#4fa3b8") },
        uDeepColor: { value: new THREE.Color("#091d2c") },
      },
    })

    this.mesh = new THREE.Mesh(this.geometry, this.material)
    // Position so vUv.y = 0.85 (height offset +0.35 * 12 = +4.2) lands at world Y = 0.0
    this.mesh.position.set(0, -4.2, 0)
    this.mesh.renderOrder = 3
  }

  public update(elapsed: number): void {
    this.material.uniforms.uTime.value = elapsed
  }

  public dispose(): void {
    this.geometry.dispose()
    this.material.dispose()
  }
}
