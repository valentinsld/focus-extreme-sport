precision highp float;


varying float vMaxAlpha;
varying float vAlpha;
varying vec3 vInstanceColor;

void main() {

	gl_FragColor = vec4(vInstanceColor, vAlpha);

}
