precision highp float;


varying float vMaxAlpha;
varying float vAlpha;

void main() {

	gl_FragColor = vec4(1.0, 1.0, 1.0, vAlpha * vMaxAlpha);

}