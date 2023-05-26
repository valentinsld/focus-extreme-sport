void main() {
  float dist = distance(gl_PointCoord, vec2(0.5));
  float alpha = (1.0 - smoothstep(-0.8, 0.33, dist)) * 0.11;

  gl_FragColor = vec4( vec3(1.0) , alpha );
}
