import WebGL from '~~/webgl';

export default class Clouds {
	constructor(options) {

		// Call all options
		this.webgl = new WebGL()
		this.assets = options.assets;
		// this.countAll = options.countAll;
		this.camera = options.camera
		this.debug = options.debug


		this.speedLineParams = {...PARAMS}

		// Set up
		this.container = new Object3D();
		this.container.name = 'Particle';

		this.dummy = new Object3D()
		this.count = 0;
		this.properties = []
		this.ages = new Float32Array(this.speedLineParams.count)

		this.init()
		if(this.debug) this.initDebug()
	}
}
