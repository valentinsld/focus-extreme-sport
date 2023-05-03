attribute vec3 position;
attribute mat4 instanceMatrix;
uniform mat4 modelViewMatrix;
uniform mat4 projectionMatrix;


attribute float aAlpha;
varying float vAlpha;

attribute float aMaxAlpha;
varying float vMaxAlpha;

void main() {
    vAlpha = aAlpha;
    vMaxAlpha = aMaxAlpha;

    gl_Position = projectionMatrix * modelViewMatrix * instanceMatrix * vec4( position, 1.0 );
}
