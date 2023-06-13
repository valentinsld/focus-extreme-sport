uniform sampler2D tDiffuse;

uniform sampler2D uNoise;
uniform vec2 uRes;
uniform float uDpi;
uniform float uProgress;
uniform float uThreshold;

uniform vec2 uK0;
uniform vec2 uCc;
uniform vec2 uFc;
uniform float uAlpha_c;

uniform float uAmount;
uniform float uAngle;

uniform float uOffset;
uniform float uDarkness;

varying vec2 vUv;

float rand( vec2 seed ){

	// get pseudo-random number
	return fract( sin( dot( seed.xy, vec2( 12.9898, 78.233 ) ) ) * 43758.5453 );

}

vec3 dithering( vec3 colImg ) {
	//Calculate grid position
	float grid_position = rand( gl_FragCoord.xy );

	//Shift the individual colors differently, thus making it even harder to see the dithering pattern
	vec3 dither_shift_RGB = vec3( 0.25 / 255.0, -0.25 / 255.0, 0.25 / 255.0 );

	//modify shift according to grid position.
	dither_shift_RGB = mix( 2.0 * dither_shift_RGB, -2.0 * dither_shift_RGB, grid_position );

	//shift the color by dither_shift
	return colImg + dither_shift_RGB;
}

void main() {
	vec2 mainUv = vUv;

	// Distortion
	vec2 Xn = 2. * ( vUv.st - .5 ); // -1..1
	vec3 Xd = vec3(( 1. + uK0 * dot( Xn, Xn ) ) * Xn, 1.); // distorted
	mat3 KK = mat3(
		vec3(uFc.x, 0., 0.),
		vec3(uAlpha_c * uFc.x, uFc.y, 0.),
		vec3(uCc.x, uCc.y, 1.)
	);
	vec2 Xp = ( KK * Xd ).xy * .5 + .5; // projected; into 0..1

	// Chromatic
	vec2 offset = uAmount * vec2( cos(uAngle), sin(uAngle)) * distance(vec2(.5),vUv);
	vec4 cr = texture2D(tDiffuse, Xp + offset);
	vec4 cga = texture2D(tDiffuse, Xp);
	vec4 cb = texture2D(tDiffuse, Xp - offset);

	vec4 diffuse = vec4(cr.r, cga.g, cb.b, cga.a);

	//Vignette
	float vignette = distance( vUv, vec2( 0.5 ) );
	diffuse.rgb *= smoothstep( 0.8, uOffset * 0.2, vignette *( uDarkness + uOffset ) );

	vec4 diffuseDither = vec4(dithering(diffuse.rgb), diffuse.a);

	// Transi layout
	vec4 noise = texture2D(uNoise, vUv);
	vec4 whitePanel = vec4(1., 1., 1., 1.);

	float r = (uProgress * (1.0 + uThreshold * 2.0) - uThreshold);
	float mixf=clamp((noise.r - r)*(2.0/uThreshold), 0.0, 1.0);

	vec4 render = mix(whitePanel, diffuse, mixf);

	gl_FragColor = LinearTosRGB(render);
}
