uniform float uTime;
varying vec2 vUv;

void main() {
  vUv = uv;
  vec3 pos = position;

  // Subtle surface wave displacement near the waterline crest
  float crestFactor = smoothstep(0.65, 1.0, uv.y);
  float swell = sin(uv.x * 12.0 + uTime * 1.3) * 0.06
              + cos(uv.x * 23.0 - uTime * 0.95) * 0.03;
  pos.y += swell * crestFactor;

  gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
}
