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

const RAFManager = {
	timer: 0,
	state: 'stop',
	animations: [],

	add(name, callback, param = null) {
		if (!name || !callback) {
			console.error('RAFManager.add: name or callback is null');
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
		this.tick();
		return this;
	},

	stop() {
		if (this.state === 'stop') return;

		this.state = 'stop';
		cancelAnimationFrame(this.timer);
		return this;
	},

	tick() {
		this.lastTime = this.timer;
		this.timer = requestAnimationFrame(() => { this.tick(); }) / 100;

		for (const name in this.animations) {
			const aniData = this.animations[name];
			const callback = aniData.callback;
			const param = aniData.param;

			callback(this.timer, this.timer - this.lastTime, param);
		}
	}
}

export default RAFManager;
