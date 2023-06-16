import { Group, CurvePath, CubicBezierCurve3, Vector3, LineBasicMaterial, BufferGeometry, Line, Vector2, CubicBezierCurve, AxesHelper, AnimationMixer, LoopOnce } from 'three'
import RAFManager from '../Utils/RAFManager.js'
import { MathUtils } from 'three'
import WebGL from '../index.js'
import useStore from '~~/stores/index.js'
import AudioManager from '~~/webgl/Managers/AudioManager';

const CURVE_BEZIER_PERCENT = 0.75
const normliaze = (value, min, max) => ((value - min) / (max - min))

export default class BaseScene {
  static singleton

  constructor() {
    this.store = useStore()

    this.inView = false
    this.WebGL = new WebGL()
    this.assets = this.WebGL.assets
    this.audioManager = new AudioManager()

    this.timelineValue = 0
    this.timelineEvents = []
    this.timelineEventsUid = MathUtils.generateUUID()

    // curves
    this.curveCam = new CurvePath()
    this.curveTrack = new CurvePath()
    this.positionLengthPoints = []
    this.curveRotation = new CurvePath()
    this.rotationCam = 0
    this.curveSpeed = new CurvePath()
    this.tracking = 0

    this.objectTarget = new Vector3()

    this.instance = new Group()
  }

  //
  // Timeline
  //
  setEventsTimeline({ start, end }) {
    if (!start) return console.error('No start value')
    this.setEventTimeline(start.value, start.callback)

    if (end) {
      this.setEventTimeline(end.value, end.callback)
    }
  }
  setEventTimeline(value, callback) {
    this.timelineEvents.push({ value, callback })

    // reorder this.timelineEvents by value
    this.timelineEvents.sort((a, b) => {
      return a.value - b.value
    })

    if (RAFManager.has(this.timelineEventsUid)) return
    RAFManager.add(this.timelineEventsUid, () => {
      if (this.timelineValue > this.timelineEvents[0].value) {
        this.timelineEvents[0].callback()
        this.timelineEvents.shift()

        if (this.timelineEvents.length === 0) RAFManager.remove(this.timelineEventsUid)
      }
    })
  }

  //
  // Tracking cam
  //
  setCurvesTracking(curveCam, curveTrack, altimeterTop, altimeterBottom) {
    this.altimeter = altimeterTop
    this.altimeterTop = altimeterTop
    this.altimeterBottom = altimeterBottom

    this.positionLengthPoints = []
    this.setCurve(this.curveCam, curveCam)
    this.setCurveRotation(this.curveRotation, curveCam)
    this.setCurveSpeed(this.curveSpeed, curveCam)
    this.setCurve(this.curveTrack, curveTrack)

    // calculate altimeter Min & Max
    this.altimeterMin = this.curveTrack.getPointAt(0).y
    this.altimeterMax = this.curveTrack.getPointAt(1).y

    this.setTracking(0)

    if (this.WebGL.debug) {
      const target = new AxesHelper(0.3)
      this.scene.add(target)

      RAFManager.add('debug-target'+Math.random(), () => {
        target.position.copy(this.WebGL.camera.target)
      })
    }
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
    if (this.WebGL.debug) {
      const geometry = new BufferGeometry().setFromPoints( curve.getSpacedPoints(200) )
      var material = new LineBasicMaterial({
        color: 0xff0000
      })
      const line = new Line(geometry, material)

      this.scene.add(line)
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

  setTracking (percent, object = this.WebGL.camera.current) {
    // set tracking percent
    this.tracking = percent

    // set position for camera on curve
    this.curveCam.getPointAt(this.tracking, object.position)
    // set position for target on curve
    this.curveTrack.getPointAt(this.tracking, this.WebGL.camera.target)

    // set rotation for camera on curve
    this.curveCam.getTangentAt(this.tracking, this.objectTarget)
    this.objectTarget.add(object.position)

    object.lookAt(this.objectTarget)
    this.rotationCam = this.curveRotation.getPointAt(this.tracking).y
    this.WebGL.camera.rotationCam = this.rotationCam
    object.rotation.z += this.rotationCam

    // altimeter
    this.altimeter = Math.round(normliaze(this.curveCam.getPointAt(this.tracking).y, this.altimeterMax, this.altimeterMin) * (this.altimeterTop - this.altimeterBottom) + this.altimeterBottom)
    this.store.state.altimetre.altitude = this.altimeter
  }

  //
  // Animation
  //
  setAnimation(character, idle, end, camPos = null, camPosTransate = null) {
    this.mixer = new AnimationMixer(character);

    this.animationIdle = idle
    this.animationEnd = end
    this.animationCamPos = camPos
    this.animationCamPosTranslate = camPosTransate

  }

  startAnimation() {
    this.startAnimationV = RAFManager.currentTime
    this.currentAnim = this.mixer.clipAction(this.animationIdle).play()
  }

  setAnimationEnd(fade = 1, duration = null) {
    this.currentAnim.fadeOut(fade)
    setTimeout(() => {
      this.currentAnim = this.mixer.clipAction(this.animationEnd).play()
      if (duration) this.currentAnim.setDuration(duration)
      this.currentAnim.setLoop(LoopOnce, 1);
      this.currentAnim.clampWhenFinished = true;
    }, fade * 2000);

  }

  updateAnimation (time, dt) {
    this.WebGL.camera.listCamera.fpv.position.copy(this.animationCamPos)

    // anim left
    const percent = Math.sin(
      ((time - this.startAnimationV) * Math.PI * 2) / this.animationIdle.duration
    )
    this.WebGL.camera.listCamera.fpv.position.x += this.animationCamPosTranslate.x * percent
    this.WebGL.camera.listCamera.fpv.position.y += this.animationCamPosTranslate.y * percent
    this.WebGL.camera.listCamera.fpv.position.z += Math.abs(this.animationCamPosTranslate.z * percent)

    this.mixer.update(dt)
  }

  //
  // Event for scene
  //
  startSceneMain() {
    console.log('You start the scene ' + this.scene.name);

    if (this.startScene) this.startScene()
  }

  destroySceneMain() {
    console.log('You destroy the scene ' + this.scene.name);

    RAFManager.setSpeed(1) // reset RAF speed
    RAFManager.remove(this.timelineEventsUid) // remove timeline events
    this.WebGL.camera.setCamera() // reset FPV camera

    if (this.destroyScene) this.destroyScene()
  }
}
