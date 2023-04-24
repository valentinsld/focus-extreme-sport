precision highp float;
uniform float time;
uniform vec2 res;
uniform float radius;
uniform vec3 color1;

uniform vec3 color2;
uniform vec3 color3;
uniform sampler2D noiseTex;
uniform float inProgress;
uniform float outProgress;

float sdRoundBox( in vec2 p, in vec2 b, in vec4 r )
{
    r.xy = (p.x>0.0)?r.xy : r.zw;
    r.x  = (p.y>0.0)?r.x  : r.y;
    vec2 q = abs(p)-b+r.x;
    return min(max(q.x,q.y),0.0) + length(max(q,0.0)) - r.x;
}

void main() {
	vec2 mainUV = gl_FragCoord.xy/res;
	vec2 uv = (gl_FragCoord.xy / res -.5)*2.;
	uv.x *= res.x/res.y;
	float count = 3.;
	vec2 grid = vec2(fract(uv.x*count), fract(uv.y*count));

	// float timer = 0.;
	vec2 id = vec2(floor(count*uv.x)/count + 1./6.,(ceil(count*(uv.y))/count +1.)/2. );
	float maxTime = 2.5;
	float timeTest =mod(time/300., maxTime*2.);
	// float timer =clamp( timeTest, 0., maxTime);
	float timer =inProgress;

	// timer -= id.x/10.;

	// timer = .5;
	// timer = 3.;
	timer -= abs(id.x/2.);
	// float timer2 = clamp( timeTest, maxTime, maxTime*2.) - maxTime;
	float timer2 = outProgress;
	timer2 -= abs(id.x/2.);

	vec2 noiseUV = ((id+1.)/2.);
	float noise = texture2D(noiseTex, vec2(mod(noiseUV.x, 1.), mod(noiseUV.y, 1.))).x;
	float dist = 1.-smoothstep(-1.+timer, 0.+timer, id.y);
	float alpha =1.- smoothstep(.0, .01, sdRoundBox(grid-.5, vec2(dist)/2., vec4((1.-smoothstep(0.98, 1., dist)))*.1));
	float dist2 = 1.-smoothstep(-1.+timer2, 0.+timer2, id.y);
	alpha *= 1.-smoothstep(.0, .01, sdRoundBox(grid-.5, vec2(1.-dist2)/2., vec4((1.-smoothstep(0.98, 1., 1.-dist2)))*.1));
	// alpha = dist;
	vec3 color = mix(color1, color2, step(.3,noise));
	color = mix(color, color3, step(.5,noise));
	color = mix(color, color1, smoothstep(.5, 1., dist*1.-dist2));
	color = mix(color, color+color*.3, mainUV.x);
	// color = vec3(id.y);
	gl_FragColor = vec4(color, alpha);
	// gl_FragColor = vec4(vec3(alpha), 1.);
	// gl_FragColor.xyzw = vec4(1.);

}
