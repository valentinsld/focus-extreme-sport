attribute vec3 position;
attribute mat4 instanceMatrix;
uniform mat4 modelViewMatrix;
uniform mat4 projectionMatrix;


attribute float aAlpha;
varying float vAlpha;

void main() {
    vAlpha = aAlpha;

    gl_Position = projectionMatrix * modelViewMatrix * instanceMatrix * vec4( position, 1.0 );
}
