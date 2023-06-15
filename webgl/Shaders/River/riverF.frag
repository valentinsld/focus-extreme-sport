#include <common>
#include <packing>
#include <fog_pars_fragment>

uniform float uTime;
uniform vec2 uResolution;
uniform vec3 uColorA;
uniform vec3 uColorB;

// uniform anim
uniform vec3 uLineColor;

varying vec2 vUv;
varying float vElevation;

//	Classic Perlin 3D Noiseintensity
//	by Stefan Gustavson
//
vec4 permute(vec4 x){return mod(((x*34.0)+1.0)*x, 289.0);}
vec4 taylorInvSqrt(vec4 r){return 1.79284291400159 - 0.85373472095314 * r;}
vec3 fade(vec3 t) {return t*t*t*(t*(t*6.0-15.0)+10.0);}

vec2 random2( vec2 p ) {
    return fract(sin(vec2(dot(p,vec2(127.1,311.7)),dot(p,vec2(269.5,183.3))))*43758.5453);
}

float cnoise(vec3 P){
	vec3 Pi0 = floor(P); // Integer part for indexing
	vec3 Pi1 = Pi0 + vec3(1.0); // Integer part + 1
	Pi0 = mod(Pi0, 289.0);
	Pi1 = mod(Pi1, 289.0);
	vec3 Pf0 = fract(P); // Fractional part for interpolation
	vec3 Pf1 = Pf0 - vec3(1.0); // Fractional part - 1.0
	vec4 ix = vec4(Pi0.x, Pi1.x, Pi0.x, Pi1.x);
	vec4 iy = vec4(Pi0.yy, Pi1.yy);
	vec4 iz0 = Pi0.zzzz;
	vec4 iz1 = Pi1.zzzz;

	vec4 ixy = permute(permute(ix) + iy);
	vec4 ixy0 = permute(ixy + iz0);
	vec4 ixy1 = permute(ixy + iz1);

	vec4 gx0 = ixy0 / 7.0;
	vec4 gy0 = fract(floor(gx0) / 7.0) - 0.5;
	gx0 = fract(gx0);
	vec4 gz0 = vec4(0.5) - abs(gx0) - abs(gy0);
	vec4 sz0 = step(gz0, vec4(0.0));
	gx0 -= sz0 * (step(0.0, gx0) - 0.5);
	gy0 -= sz0 * (step(0.0, gy0) - 0.5);

	vec4 gx1 = ixy1 / 7.0;
	vec4 gy1 = fract(floor(gx1) / 7.0) - 0.5;
	gx1 = fract(gx1);
	vec4 gz1 = vec4(0.5) - abs(gx1) - abs(gy1);
	vec4 sz1 = step(gz1, vec4(0.0));
	gx1 -= sz1 * (step(0.0, gx1) - 0.5);
	gy1 -= sz1 * (step(0.0, gy1) - 0.5);

	vec3 g000 = vec3(gx0.x,gy0.x,gz0.x);
	vec3 g100 = vec3(gx0.y,gy0.y,gz0.y);
	vec3 g010 = vec3(gx0.z,gy0.z,gz0.z);
	vec3 g110 = vec3(gx0.w,gy0.w,gz0.w);
	vec3 g001 = vec3(gx1.x,gy1.x,gz1.x);
	vec3 g101 = vec3(gx1.y,gy1.y,gz1.y);
	vec3 g011 = vec3(gx1.z,gy1.z,gz1.z);
	vec3 g111 = vec3(gx1.w,gy1.w,gz1.w);

	vec4 norm0 = taylorInvSqrt(vec4(dot(g000, g000), dot(g010, g010), dot(g100, g100), dot(g110, g110)));
	g000 *= norm0.x;
	g010 *= norm0.y;
	g100 *= norm0.z;
	g110 *= norm0.w;
	vec4 norm1 = taylorInvSqrt(vec4(dot(g001, g001), dot(g011, g011), dot(g101, g101), dot(g111, g111)));
	g001 *= norm1.x;
	g011 *= norm1.y;
	g101 *= norm1.z;
	g111 *= norm1.w;

	float n000 = dot(g000, Pf0);
	float n100 = dot(g100, vec3(Pf1.x, Pf0.yz));
	float n010 = dot(g010, vec3(Pf0.x, Pf1.y, Pf0.z));
	float n110 = dot(g110, vec3(Pf1.xy, Pf0.z));
	float n001 = dot(g001, vec3(Pf0.xy, Pf1.z));
	float n101 = dot(g101, vec3(Pf1.x, Pf0.y, Pf1.z));
	float n011 = dot(g011, vec3(Pf0.x, Pf1.yz));
	float n111 = dot(g111, Pf1);

	vec3 fade_xyz = fade(Pf0);
	vec4 n_z = mix(vec4(n000, n100, n010, n110), vec4(n001, n101, n011, n111), fade_xyz.z);
	vec2 n_yz = mix(n_z.xy, n_z.zw, fade_xyz.y);
	float n_xyz = mix(n_yz.x, n_yz.y, fade_xyz.x);
	return 2.2 * n_xyz;
}

#define ANIMATE
vec3 voronoi( in vec2 x, float rnd ) {
    vec2 n = floor(x);
    vec2 f = fract(x);

    // first pass: regular voronoi
    vec2 mg, mr;
    float md = 8.0;
    for (int j=-1; j<=1; j++ ) {
        for (int i=-1; i<=1; i++ ) {
            vec2 g = vec2(float(i),float(j));
            vec2 o = random2( n + g )*rnd;
            #ifdef ANIMATE
            o = 0.5 + 0.5*sin( uTime + 6.2831*o );
            #endif
            vec2 r = g + o - f;
            float d = dot(r,r);

            if( d<md ) {
                md = d;
                mr = r;
                mg = g;
            }
        }
    }

    // second pass: distance to borders
    md = 8.0;
    for (int j=-2; j<=2; j++ ) {
        for (int i=-2; i<=2; i++ ) {
            vec2 g = mg + vec2(float(i),float(j));
            vec2 o = random2(n + g)*rnd;
            #ifdef ANIMATE
            o = 0.5 + 0.5*sin( uTime + 6.2831*o );
            #endif
            vec2 r = g + o - f;

            if( dot(mr-r,mr-r)>0.00001 )
            md = min( md, dot( 0.5*(mr+r), normalize(r-mr) ) );
        }
    }
    return vec3( md, mr );
}

vec2 rotate(vec2 st, float a) {
	st = mat2(cos(a), -sin(a), sin(a), cos(a)) * (st - .5);
	return st + .5;
}

// float getDepth( const in vec2 screenPosition ) {
// 	#if DEPTH_PACKING == 1
// 		return unpackRGBAToDepth( texture2D( tDepth, screenPosition ) );
// 	#else
// 		return texture2D( tDepth, screenPosition ).x;
// 	#endif
// }

// float getViewZ( const in float depth ) {
// 	#if ORTHOGRAPHIC_CAMERA == 1
// 		return orthographicDepthToViewZ( depth, cameraNear, cameraFar );
// 	#else
// 		return perspectiveDepthToViewZ( depth, cameraNear, cameraFar );
// 	#endif
// }

// const float strength = 1.0;

void main()
{
	vec2 st = rotate(vUv, radians(-45.));
	vec2 voroUv = vUv;

	// layer bkg
	vec2 coord = st.xy * 20.;
	coord.y *= 4.;
	coord.x *= 2.;
	coord.x += -uTime * .5;

	float noise = cnoise(vec3(coord, uTime));
	vec3 color = mix(uColorA, uColorB, noise + (vElevation));

	// VORONOI LAYER
	vec2 voroSt = voroUv * 50.;
    voroSt = (voroSt-.5)*.75+.5;

	vec3 voroColor = vec3(0.);
	float d = dot(voroSt-.5,voroSt-.5);
    vec3 c = voronoi( voroSt * .95 , pow(d,.6) );

	// vec3 lineColor = mix(color, vec3(1.), cnoise(vec3(voroSt * 20., uTime * .5)));
	 // borders
    voroColor = mix( uLineColor, color, smoothstep( 0., .01, c.x ));


	// FOAM WATER
	// float fragmentLinearEyeDepth = getViewZ( gl_FragCoord.z );
	// float linearEyeDepth = getViewZ( getDepth( vUv ) );

	// float diff = saturate( fragmentLinearEyeDepth - linearEyeDepth );

	// vec2 displacement = texture2D( tDudv, ( vUv * 2.0 ) - uTime * 0.05 ).rg;
	// displacement = ( ( displacement * 2.0 ) - 1.0 ) * strength;
	// diff += displacement.x;

	// vec3 foamColor = mix( vec3(1.), voroColor, step( threshold, diff ) );

	gl_FragColor = vec4(voroColor, 1.0);

	#include <tonemapping_fragment>
	// #include <encodings_fragment>
	#include <fog_fragment>
}
