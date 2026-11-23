uniform float uTime;
uniform vec3 uRayColor;
uniform float uOpacity;
varying vec2 vUv;

void main() {
  float diagonal = vUv.x * 1.4 + vUv.y * 0.35;

  float rays = sin(diagonal * 18.0 + uTime * 0.5) * 0.5 + 0.5;
  rays *= sin(diagonal * 31.0 - uTime * 0.3) * 0.5 + 0.5;
  rays = pow(rays, 2.5);

  float horizontalMask = smoothstep(0.0, 0.25, vUv.x) * smoothstep(1.0, 0.75, vUv.x);
  float verticalFade = smoothstep(0.0, 0.95, vUv.y);

  float alpha = rays * horizontalMask * verticalFade * 0.28 * uOpacity;
  gl_FragColor = vec4(uRayColor, alpha);
}
