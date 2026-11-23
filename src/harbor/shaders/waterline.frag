uniform float uTime;
uniform vec3 uSurfaceColor;
uniform vec3 uDeepColor;
varying vec2 vUv;

void main() {
  float wave1 = sin(vUv.x * 10.0 + uTime * 1.4) * 0.012;
  float wave2 = cos(vUv.x * 22.0 - uTime * 0.9) * 0.006;
  float surfaceLine = 0.85 + wave1 + wave2;

  if (vUv.y > surfaceLine) {
    discard;
  }

  float distToSurface = surfaceLine - vUv.y;
  float meniscus = smoothstep(0.035, 0.0, distToSurface);

  vec3 waterGrad = mix(uDeepColor, uSurfaceColor, smoothstep(0.0, 0.85, vUv.y));
  vec3 finalColor = mix(waterGrad, vec3(0.85, 0.95, 1.0), meniscus * 0.65);

  float bottomFade = smoothstep(0.0, 0.25, vUv.y);
  gl_FragColor = vec4(finalColor, 0.88 * bottomFade + meniscus * 0.12);
}
