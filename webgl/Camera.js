import { PerspectiveCamera, Object3D, CurvePath, CubicBezierCurve3, Vector3, LineBasicMaterial, BufferGeometry, Line, LineCurve, Vector2 } from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import WebGL from './index.js'
import InstanciedSpeedBis from './Components/Particles/Speed/InstanciedSpeedBis.js'
// import SpeedLine from './Components/Particles/Speed/SpeedLines.js'

export default class Camera {
  constructor() {
    // Options
    this.WebGL = new WebGL()
    this.debug = this.WebGL.debug
    this.sizes = this.WebGL.sizes
    this.scene = this.WebGL.currentScene
    this.assets = this.WebGL.assets

    this.container = new Object3D()
    this.container.name = "CameraContainer"

    this.initPosition = {
      x: 0,
      y: 7,
      z: 7,
    }

    this.curveCam = new CurvePath()
    this.curveTrack = new CurvePath()
    this.positionLengthPoints = []
    this.curveRotation = new CurvePath()
    this.rotationCam = 0
    this.curveSpeed = new CurvePath()
    this.tracking = 0

    this.current = null
    this.listCamera = {}

    this.initCameras()
    this.setOrbitControls()
  }

  //
  // Cameras
  //
  initCameras() {
    // Camera FPV
    this.current = this.initCamera('fpv')

    // Camera 3P
    this.initCamera('3p')

    // Camera debug
    if (this.WebGL.debug) {
      this.initCamera('debug')

      this.debugFolder = this.debug.addFolder({ title: 'Cameras', expanded: false })

      this.debugFolder.addButton({
        title: 'Use Debug Camera',
      }).on('click', () => {
        const pos = new Vector3()
        this.current.getWorldPosition(pos)
        const target = (new Vector3()).copy(this.orbitControls.target)
        this.setCamera('debug', pos, target)
      })

      this.debugFolder.addSeparator();
    }
  }

  initCamera(name = 'fpv') {
    this.listCamera[name] = new PerspectiveCamera(
      90,
      this.sizes.width / this.sizes.height,
      0.01,
      20
    )
    this.listCamera[name].name = name
    this.listCamera[name].rotation.reorder('YXZ')
    this.listCamera[name].position.copy(this.initPosition)

    return this.listCamera[name]
  }

  setCamera(name = 'fpv', position, target = undefined) {
    this.current = this.listCamera[name]

    if (position) {
      this.current.position.copy(position)
      this.current.rotation.x = 0
      this.current.rotation.y = 0
      this.current.rotation.z = 0
    }

    this.orbitControls.object = this.current
    this.orbitControls.target = target || this.target
    this.orbitControls.update()

    this.orbitControls.enabled = (name === 'debug')

    return this.current
  }

  setOrbitControls() {
    this.orbitControls = new OrbitControls(this.current, this.WebGL.canvas)
    this.orbitControls.enabled = false
    this.orbitControls.screenSpacePanning = true
    this.orbitControls.enableKeys = false
    this.orbitControls.zoomSpeed = 0.25
    this.orbitControls.enableDamping = true
    this.target = new Vector3()
    this.orbitControls.target = this.target
    this.orbitControls.update()
  }

  //
  // Tracking cam
  //
  setCurvesTracking(curveCam, curveTrack) {
    this.setCurve(this.curveCam, curveCam)
    this.setCurveRotation(this.curveRotation, curveCam)
    this.setCurveSpeed(this.curveSpeed, curveCam)
    this.setCurve(this.curveTrack, curveTrack)

    this.setTracking(0)
  }
  setCurve(curve, data) {
    curve.curves = []

    // set position first point of position
    this.positionLengthPoints.push(0)

    for (let i = 0; i < data.length - 1; i++) {
      const p1 = data[i];
      const p2 = data[i+1];

      curve.add(new CubicBezierCurve3(
        new Vector3(p1.x, p1.z, -p1.y),
        new Vector3(p1.xr, p1.zr, -p1.yr),
        new Vector3(p2.xl, p2.zl, -p2.yl),
        new Vector3(p2.x, p2.z, -p2.y),
      ))

      // set position of length for each points
      this.positionLengthPoints.push(curve.getLength())
    }

    // if debug set visual curves
    if (this.debug) {
      const geometry = new BufferGeometry().setFromPoints( curve.getSpacedPoints(200) )
      var material = new LineBasicMaterial({
        color: 0xff0000
      })
      const line = new Line(geometry, material)

      this.WebGL.currentScene.add(line)
    }
  }
  setCurveRotation(curve, data, type = "ro") {
    curve.curves = []

    for (let i = 0; i < data.length - 1; i++) {
      const p1 = data[i][type];
      const p2 = data[i+1][type];

      curve.add(new LineCurve(
        new Vector2(this.positionLengthPoints[i], p1),
        new Vector2(this.positionLengthPoints[i+1], p2),
      ))
    }
  }
  setCurveSpeed(curve, data, type = "sp") {
    curve.curves = []

    const maxLength = this.positionLengthPoints[this.positionLengthPoints.length - 1]
    let lastP2 = 0
    let lastD2 = 0
    for (let i = 0; i < data.length - 1; i++) {
      const d1 = lastD2;
      const d2 = this.positionLengthPoints[i+1] / maxLength;

      const p1 = lastP2;
      const p2 = lastP2 + (this.positionLengthPoints[i+1] - lastP2) * ((data[i+1][type] - 2) * -1);

      curve.add(new LineCurve(
        new Vector2(p1, d1),
        new Vector2(p2, d2),
      ))

      lastP2 = p2
      lastD2 = d2
    }
  }

  setTracking (percent, object = this.current) {
    // get percent of curves with speed
    this.tracking = this.curveSpeed.getPointAt(percent).y

    // set position for camera on curve
    this.curveCam.getPointAt(this.tracking, object.position)
    // set position for target on curve
    this.curveTrack.getPointAt(this.tracking, this.target)

    // set rotation for camera on curve
    object.lookAt(this.curveCam.getPointAt(Math.min(this.tracking + 0.01, 1)))
    this.rotationCam = this.curveRotation.getPointAt(this.tracking).y
    object.rotation.z = Math.PI + this.rotationCam
  }


  //
  // Events
  //
  setSpeedLines() {
    console.log('set speedlines');
    this.speedLine = new InstanciedSpeedBis({
      assets: this.assets,
      camera: this.container,
      debug: this.debug
    })

    this.speedLine.container.position.z = -.05

    this.listCamera['fpv'].add(this.speedLine.container)
  }

  resize() {
    for (const name in this.listCamera) {
        const cam = this.listCamera[name];
        cam.aspect = this.sizes.ratio
        cam.updateProjectionMatrix()
    }
  }

  update() {
    this.orbitControls.update()
    this.listCamera.fpv.rotation.z -= this.rotationCam

    if(this.speedLine) this.speedLine.updateParticles()
  }

  destroy() {
    this.orbitControls.destroy()
  }
}
