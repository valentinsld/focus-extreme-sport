import { PerspectiveCamera, Object3D, CurvePath, CubicBezierCurve3, Vector3, LineBasicMaterial, BufferGeometry, Line, Vector2, CubicBezierCurve } from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import WebGL from './index.js'
import InstanciedSpeed from './Components/Particles/Speed/InstanciedSpeed.js'

const CURVE_BEZIER_PERCENT = 0.75

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

    if (name === 'fpv') {
      this.speedLine.showLines()
    } else {
      this.speedLine.hideLines()
    }

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
    this.positionLengthPoints = []
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

    const newDatas = []

    for (let i = 0; i < data.length; i++) {
      newDatas.push({
        p: {
          x: this.positionLengthPoints[i],
          y: data[i][type]
        }
      })
    }

    // calculate handle poinnts
    const lengthNewData = newDatas.length - 1
    for (let i = 1; i < lengthNewData; i++) {
      const previousPoint = newDatas[i - 1].p
      const currentPoint = newDatas[i].p
      const nextPoint = newDatas[i + 1].p

      // 1. calculate vector previous and next point
      const vector = {
        x: previousPoint.x - nextPoint.x,
        y: previousPoint.y - nextPoint.y
      }
      vector.x *= CURVE_BEZIER_PERCENT
      vector.y *= CURVE_BEZIER_PERCENT

      // 2. apply vector to current point
      const distancepn = nextPoint.x - previousPoint.x
      const distancelp = (currentPoint.x - previousPoint.x) / distancepn
      const distanceln = (nextPoint.x - currentPoint.x) / distancepn
      newDatas[i].l = {
        x: currentPoint.x + vector.x * distancelp,
        y: currentPoint.y + vector.y * distancelp
      }
      newDatas[i].r = {
        x: currentPoint.x - vector.x * distanceln,
        y: currentPoint.y - vector.y * distanceln
      }
    }

    // add handle to fisrt point and last point
    newDatas[0].l = {...newDatas[0].p}
    newDatas[0].r = {...newDatas[0].p}
    newDatas[lengthNewData].l = {...newDatas[lengthNewData].p}
    newDatas[lengthNewData].r = {...newDatas[lengthNewData].p}

    // createCurve
    for (let i = 0; i < lengthNewData; i++) {
      const p1 = newDatas[i];
      const p2 = newDatas[i + 1];
      curve.add(new CubicBezierCurve(
        new Vector2(p1.p.x, p1.p.y),
        new Vector2(p1.r.x, p1.r.y),
        new Vector2(p2.l.x, p2.l.y),
        new Vector2(p2.p.x, p2.p.y),
      ))
    }
  }
  setCurveSpeed(curve, data, type = "sp") {
    curve.curves = []

    // new datas
    const newDatas = []

    // calculate points
    const maxLength = this.positionLengthPoints[this.positionLengthPoints.length - 1]
    for (let i = 0; i < data.length; i++) {
      newDatas.push({
        p: {
          x: this.positionLengthPoints[i] / maxLength,
          y: data[i][type],
        }
      })
    }

    // calculate handle poinnts
    const lengthNewData = newDatas.length - 1
    for (let i = 1; i < lengthNewData; i++) {
      const previousPoint = newDatas[i - 1].p
      const currentPoint = newDatas[i].p
      const nextPoint = newDatas[i + 1].p

      // 1. calculate vector previous and next point
      const vector = {
        x: previousPoint.x - nextPoint.x,
        y: previousPoint.y - nextPoint.y
      }
      vector.x *= CURVE_BEZIER_PERCENT
      vector.y *= CURVE_BEZIER_PERCENT

      // 2. apply vector to current point
      const distancepn = nextPoint.x - previousPoint.x
      const distancelp = (currentPoint.x - previousPoint.x) / distancepn
      const distanceln = (nextPoint.x - currentPoint.x) / distancepn
      newDatas[i].l = {
        x: currentPoint.x + vector.x * distancelp,
        y: currentPoint.y + vector.y * distancelp
      }
      newDatas[i].r = {
        x: currentPoint.x - vector.x * distanceln,
        y: currentPoint.y - vector.y * distanceln
      }

    }

    // add handle to fisrt point and last point
    newDatas[0].l = {...newDatas[0].p}
    newDatas[0].r = {...newDatas[0].p}
    newDatas[lengthNewData].l = {...newDatas[lengthNewData].p}
    newDatas[lengthNewData].r = {...newDatas[lengthNewData].p}

    // create curve

    for (let i = 0; i < lengthNewData; i++) {
      const p1 = newDatas[i];
      const p2 = newDatas[i + 1];
      curve.add(new CubicBezierCurve(
        new Vector2(p1.p.x, p1.p.y),
        new Vector2(p1.r.x, p1.r.y),
        new Vector2(p2.l.x, p2.l.y),
        new Vector2(p2.p.x, p2.p.y),
      ))
    }
  }
  getSpeed(percent = 0) {
    return  this.curveSpeed.getPointAt(percent).y
  }

  setTracking (percent, object = this.current) {
    // set tracking percent
    this.tracking = percent

    // set position for camera on curve
    this.curveCam.getPointAt(this.tracking, object.position)
    // set position for target on curve
    this.curveTrack.getPointAt(this.tracking, this.target)

    // set rotation for camera on curve
    object.lookAt(this.curveCam.getPointAt(Math.min(this.tracking + 0.01, 1)))
    this.rotationCam = this.curveRotation.getPointAt(this.tracking).y
    object.rotation.z += this.rotationCam
  }


  //
  // Events
  //
  setSpeedLines() {
    console.log('set speedlines');
    this.speedLine = new InstanciedSpeed({
      assets: this.assets,
      camera: this.current,
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

  update(dt) {
    this.orbitControls.update()
    this.listCamera.fpv.rotation.z -= this.rotationCam

    if(this.speedLine) this.speedLine.updateParticles(dt)
  }

  destroy() {
    this.orbitControls.destroy()
  }
}
