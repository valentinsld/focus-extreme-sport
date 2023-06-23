/**
 *  RAFManager requestAnimationFrame Manager
 *
 *  Simple package from here :
 *  https://github.com/drawcall/RAFManager/blob/master/src/RAFManager.js
 *
 *  CODE:
 *
 * 		// Add to
 *  	-- RAFManager.add("name", func);
 *
 *   	// Add and carry parameters
 *  	-- const func = data =>{ console.log(data) };
 *  	-- RAFManager.add("name", func, { msg:'hello world!' });
 *
 * 		// remove
 *  	-- RAFManager.remove("name");
 *  	-- RAFManager.stop();
*/

import { lerp } from './Lerp';
import store from './Store';

// simple polyfill by https://gist.github.com/paulirish/1579671
// (function () {
// 	let lastTime = 0;
// 	let vendors = ['ms', 'moz', 'webkit', 'o'];
// 	for (let x = 0; x < vendors.length && !window.requestAnimationFrame; ++x) {
// 		window.requestAnimationFrame = window[vendors[x] + 'RequestAnimationFrame'];
// 		window.cancelAnimationFrame = window[vendors[x] + 'CancelAnimationFrame']
// 			|| window[vendors[x] + 'CancelRequestAnimationFrame'];
// 	}
// }());

const LERP = 0.025;

const RAFManager = {
	timer: null,
	time: new Date(),
	startTime: new Date(),
	lastTime: new Date(),
	currentTime: 0,
	dt: 0,
	elapsedTime: 0,
	speed: 1,
	targetSpeed: store.targetSpeed,
	state: 'stop',
	animations: [],

	has(name) {
		return this.animations[name] ? true : false
	},

	add(name, callback, param = null) {
		if (!name || !callback) {
			console.error('RAFManager.add: name or callback is null', { name, callback });
			return
		}
		const aniData = { callback, param };
		this.animations[name] = aniData;

		if (Object.keys(this.animations).length >= 1) this.start();

		return this;
	},

	remove(name) {
		if (this.animations[name]) {
			delete this.animations[name]
		}
	},


	start() {
		if (this.state === 'start') return;

		this.state = 'start';
		this.startTime = new Date();
		this.tick();
		return this;
	},

	stop() {
		if (this.state === 'stop') return;

		this.state = 'stop';
		cancelAnimationFrame(this.timer);
		return this;
	},

	setSpeed(speed) {
		this.targetSpeed = speed;

		return this;
	},

	tick() {
		this.timer = requestAnimationFrame(() => { this.tick(); })
		this.lastTime = this.time
		this.time = new Date()

		this.speed = lerp(this.speed, this.targetSpeed, LERP)

		this.realDt = (this.time - this.lastTime) / 1000
		this.dt = this.realDt * this.speed
		// this.elapsedTime = (this.time - this.startTime) / 1000;

		this.currentTime += this.dt;

		for (const name in this.animations) {
			const aniData = this.animations[name]

			aniData.callback(this.currentTime, this.dt, this.realDt, aniData.param)
		}
	}
}

export default RAFManager;
