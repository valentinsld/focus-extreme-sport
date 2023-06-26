precision highp float;

varying float vMaxAlpha;
varying float vAlpha;
varying vec3 vInstanceColor;

#include <logdepthbuf_pars_fragment>

void main() {
	#include <logdepthbuf_fragment>

	gl_FragColor = vec4(vInstanceColor, vAlpha);
}
