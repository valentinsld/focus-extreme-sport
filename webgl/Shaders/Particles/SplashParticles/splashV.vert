attribute vec3 position;
attribute mat4 instanceMatrix;
uniform mat4 modelViewMatrix;
uniform mat4 projectionMatrix;


attribute float aAlpha;
varying float vAlpha;

attribute float aMaxAlpha;
varying float vMaxAlpha;

attribute vec3 instanceColor;
varying vec3 vInstanceColor;

void main() {
    vAlpha = aAlpha;
    vMaxAlpha = aMaxAlpha;
    vInstanceColor = instanceColor;

    //
    // CE SHADER N'EST PAS UTILISE, DIRECTEMENT DANS LE FICHIER InstancesSplash.js
    //
    gl_Position = projectionMatrix * modelViewMatrix * instanceMatrix * vec4( position, 1.0 );
}
