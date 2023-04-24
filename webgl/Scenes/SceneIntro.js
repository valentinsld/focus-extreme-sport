import { Group, Mesh, BoxGeometry, MeshPhysicalMaterial, PointLight, CurvePath, CubicBezierCurve3, Vector3, LineBasicMaterial, BufferGeometry, Line, AxesHelper } from 'three'
import WebGL from '../index.js'

import TRAC_CAM from '@/assets/modelsCurves/river.json'

export default class SceneIntro {
  static singleton

  constructor() {
    if (SceneIntro.singleton) {
      return SceneIntro.singleton
    }
    SceneIntro.singleton = this

    this.inView = false
    this.WebGL = new WebGL()
    this.scene = this.WebGL.sceneIntro
    this.assets = this.WebGL.assets

    this.init()
  }

  init() {
    this.instance = new Group()

    this.cube = new Mesh(
      new BoxGeometry(0.5, 0.5, 0.5),
      new MeshPhysicalMaterial({
        color: 0x00dc82,
        wireframe: true,
      })
    )
    // this.cube.position.set(-2.1048, 0.999047, -4.93115) // global position
    this.cube.position.set(-1.942, 0.903, -1 * -5.704) // local  position : x, z, -y
    this.map = this.assets.models["river"].scene

    this.light = new PointLight(0xffffff, 14, 12, 1)
    this.light.position.copy(this.WebGL.camera.initPosition)

    this.instance.add(...[this.light, this.map, this.cube])
    this.scene.add(this.instance)


    var curves = new CurvePath()

    const curve = TRAC_CAM["KAYAK_CURVE"]
    for (let i = 0; i < curve.length - 1; i++) {
      const p1 = curve[i];
      const p2 = curve[i+1];

      curves.add(new CubicBezierCurve3(
        new Vector3(p1.x, p1.z, -p1.y),
        new Vector3(p1.x, p1.z, -p1.y),
        // new Vector3(p1.xr, p1.yr, p1.zr),
        // new Vector3(p2.xl, p2.yl, p2.zl),
        new Vector3(p2.x, p2.z, -p2.y),
        new Vector3(p2.x, p2.z, -p2.y),
      ))
    }

    console.log(TRAC_CAM)

    const geometry = new BufferGeometry().setFromPoints( curves.getSpacedPoints() );
    var material = new LineBasicMaterial({
      color: 0xff0000
    })
    const line = new Line(geometry, material)

    this.instance.add(line)

    console.log(this.instance)

    // three js add helper lines
    const axesHelper = new AxesHelper(5);
    this.instance.add(axesHelper);
  }

  startScene() {
    //TODO : add function to start the scene (spline, RAFadd, etc..)
    console.log('You start the scene ' + this.scene.name);
  }

  destroyScene() {
    //TODO : add function to destroy the scene (spline, RAFremove, etc..)
    console.log('You destroy the scene ' + this.scene.name);
  }
}
