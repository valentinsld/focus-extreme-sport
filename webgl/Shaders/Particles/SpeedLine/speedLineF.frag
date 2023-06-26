precision highp float;


varying float vMaxAlpha;
varying float vAlpha;

#include <logdepthbuf_pars_fragment>

void main() {
	#include <logdepthbuf_fragment>

	gl_FragColor = vec4(1.0, 1.0, 1.0, vAlpha * vMaxAlpha);
}
