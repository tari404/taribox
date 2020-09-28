uniform sampler2D tDiffuse;
uniform float uTime;
uniform float uAnimate;
uniform vec3 uColor1;
uniform vec3 uColor2;
uniform vec3 uBackground;
varying vec2 vUv;

#pragma glslify: noise = require('glsl-noise/simplex/3d')

float aastep(float threshold, float value) {
  float afwidth = length(vec2(dFdx(value), dFdy(value))) * 0.70710678118654757;
  return smoothstep(threshold-afwidth, threshold+afwidth, value);
}

void main() {
  float offset = noise(vec3(vUv * 3.0, uTime * 0.6));
  vec2 uv = vUv + offset * vec2(0.0, 0.005);
  vec4 texColor = texture2D(tDiffuse, uv);
  float sdf = 1.0 - texColor.r;
  
  float alpha = 0.0;
  vec3 color = uBackground;
  float animValue = pow(abs(uAnimate * 2.0 - 1.0), 4.0);
  float threshold = animValue * 1.0 + 0.5;
  color += uColor1 * 0.15 * aastep(threshold + 0.05, sdf + 0.5 * noise(vec3(uv * 10.0, uTime)));
  color += uColor1 * 0.3 * aastep(threshold, sdf + 0.1 * noise(vec3(uv * 40.0, uTime)));
  color += uColor2 * 0.3 * aastep(threshold + 0.36, sdf);
  // color = mix(color, uColor2, aastep(threshold + 0.36, sdf));

  gl_FragColor = vec4(color, 1.0);
}
