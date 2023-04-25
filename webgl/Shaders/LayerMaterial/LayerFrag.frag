precision highp float;

uniform vec2 res;
uniform sampler2D noiseTex;
uniform float progress;
uniform float threshold;

varying vec3 vNormal;

void main() {
	vec2 mainUV = gl_FragCoord.xy/res;

	vec4 noise = texture2D(noiseTex, mainUV);

	vec4 t1 = vec4(0.95,0.95,0.95, 1.) ;
  	vec4 t2 = vec4(0.0, 0.0, 0.0, 0.0);

	float r = progress * (1.0 + threshold * 2.0) - threshold;
	float mixf=clamp((noise.r - r)*(2.0/threshold), 0.0, 1.0);

	gl_FragColor = mix(t1, t2, mixf);
	// gl_FragColor = vec4(color, 1.);
}
