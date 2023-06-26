attribute vec3 position;
attribute mat4 instanceMatrix;
uniform mat4 modelViewMatrix;
uniform mat4 projectionMatrix;


attribute float aAlpha;
varying float vAlpha;

attribute float aMaxAlpha;
varying float vMaxAlpha;

bool isPerspectiveMatrix( mat4 m ) {
	return m[ 2 ][ 3 ] == - 1.0;
}
#include <logdepthbuf_pars_vertex>

void main() {
    vAlpha = aAlpha;
    vMaxAlpha = aMaxAlpha;

    gl_Position = projectionMatrix * modelViewMatrix * instanceMatrix * vec4( position, 1.0 );
    #include <logdepthbuf_vertex>
}
