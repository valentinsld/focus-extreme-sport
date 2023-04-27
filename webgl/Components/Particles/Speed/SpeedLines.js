import { Object3D, MathUtils, Vector3 } from 'three';

import Sizes from '~~/webgl/Utils/Sizes';
import { lerp } from '~~/webgl/Utils/Lerp';

export default class SpeedLine {
	constructor(_options = {}) {

		this.screenSize = new Sizes()

		this.time = _options.time
		this.count = _options.count
		this.size = _options.size
		this.speed = _options.speed
		this.scale = new Vector3(1,1,1)

		this.init()
	}

	init() {
		this.particle = new Object3D()

		this.cspeed = MathUtils.clamp(this.speed, 0, 1);
		this.size = MathUtils.randFloat(2, 4.5) * lerp(0.8, 1.2, this.cspeed);
		this.ang = MathUtils.randFloat(0, Math.PI * 2);
		this.radius = 0.29;
		this.ratio = this.screenSize.ratio;
		// let x = Math.cos(this.ang) * this.radius * this.ratio;
		// let y = Math.sin(this.ang) * this.radius;

		// this.particle.position.set(x, y, -1);
	}

	update(time) {
		// this.particle.rotation.x += time;
		// this.particle.rotation.y += time * .8;
	}

}
