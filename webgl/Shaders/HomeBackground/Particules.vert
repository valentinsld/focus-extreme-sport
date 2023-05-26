uniform float uTime;
uniform float uSize;

attribute float aSize;
attribute float aRandom;

void main() {
  vec3 pos = position;
  pos.y = mod(pos.y - uTime * (0.45 + aRandom * 0.1)  + cos((uTime + aRandom) * 0.1), 0.5);
  pos.x = mod(pos.x + uTime * (0.22 + aRandom * 0.1), 0.5);
  vec4 mvPosition = modelViewMatrix * vec4(pos, 1.0);

  gl_PointSize = uSize * 1. * aSize;
  gl_Position = projectionMatrix * mvPosition;
}
