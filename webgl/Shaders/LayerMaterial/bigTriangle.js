// Create a big triangle for post-processing purpose
// Ref: https://michaldrobot.com/2014/04/01/gcn-execution-patterns-in-full-screen-passes/

import {
	BufferGeometry,
	BufferAttribute
} from 'three';

const positions = new Int8Array([ -1, -1, 4, -1, -1, 4 ]);
const bigTriangleGeometry = new BufferGeometry();
bigTriangleGeometry.setAttribute('position', new BufferAttribute(positions, 2));

const bigTriangleVertexShader = [
	`precision highp float;`,
	`attribute lowp vec2 position;`,
	`varying highp vec2 vUv;`,
	`void main() {`,
	`vUv = position * 0.5 + 0.5;`,
	`gl_Position =  vec4(position, 0., 1);`,
	`}`,
].join('');


export default bigTriangleVertexShader;
export { bigTriangleGeometry, bigTriangleVertexShader };
