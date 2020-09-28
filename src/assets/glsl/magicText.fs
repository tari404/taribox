uniform sampler2D tDiffuse;
uniform float uTime;
uniform float uAnimate;
varying vec2 vUv;

#pragma glslify: noise = require('glsl-noise/simplex/3d')

float aastep(float threshold, float value) {
  float afwidth = length(vec2(dFdx(value), dFdy(value))) * 0.70710678118654757;
  return smoothstep(threshold-afwidth, threshold+afwidth, value);
}

void main() {
  vec4 texColor = texture2D(tDiffuse, vUv);
  float sdf = 1.0 - texColor.r;
  
  float alpha = 0.0;
  float animValue = pow(abs(uAnimate * 2.0 - 1.0), 5.0);
  float threshold = animValue * 0.7 + 0.5;
  alpha += 0.22 * aastep(threshold, sdf + 0.5 * noise(vec3(vUv * 10.0, uTime)));
  alpha += 0.35 * aastep(threshold, sdf + 0.1 * noise(vec3(vUv * 40.0, uTime)));
  alpha += 0.13 * aastep(threshold, sdf);

  gl_FragColor = vec4(vec3(0.0), alpha);
}
