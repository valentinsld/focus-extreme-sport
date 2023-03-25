import * as THREE from 'three'
import { FontLoader } from 'three/examples/jsm/loaders/FontLoader.js'
import anime from 'animejs'
import Raf from '../Utils/Raf.js'
import { getPositionOutOfScreen } from '../Utils/index.js'

import WebGL from '../index.js'
import Sizes from '../Utils/Sizes.js'

export default class SceneError {
  static singleton

  constructor(text = '404') {
    if (SceneError.singleton) {
      return SceneError.singleton
    }
    SceneError.singleton = this

    this.inView = false
    this.WebGL = new WebGL()
    this.Raf = new Raf()
    this.Sizes = new Sizes()
    this.scene = this.WebGL.scene

    this.text = text.toString()

    this.init()
    this.resize()
    this.Sizes.on('resize', this.resize.bind(this))
  }

  init() {
    this.instance = new THREE.Group()
    this.instance.scale.set(0.1, 0.1, 0.1)

    this.scene.add(this.instance)

    const color = 0x00dc82

    const loader = new FontLoader()
    loader.load('./fonts/DM-Serif-Display_Regular.json', (font) => {
      //
      // Add error num
      //
      const matDark = new THREE.LineBasicMaterial({
        color,
        side: THREE.FrontSide,
      })

      const shapes = font.generateShapes(this.text, 10)
      const geometry = new THREE.ShapeGeometry(shapes)
      geometry.computeBoundingBox()
      const xMid =
        -0.5 * (geometry.boundingBox.max.x - geometry.boundingBox.min.x)

      // make line shape ( N.B. edge view remains visible )
      const holeShapes = []

      for (let i = 0; i < shapes.length; i++) {
        const shape = shapes[i]

        if (shape.holes && shape.holes.length > 0) {
          for (let j = 0; j < shape.holes.length; j++) {
            const hole = shape.holes[j]
            holeShapes.push(hole)
          }
        }
      }

      shapes.push.apply(shapes, holeShapes)

      this.textErrorNum = new THREE.Object3D()
      for (let i = 0; i < shapes.length; i++) {
        const shape = shapes[i]

        const points = shape.getPoints()
        const geometry = new THREE.BufferGeometry().setFromPoints(points)

        geometry.translate(xMid, 0, 0)

        const lineMesh = new THREE.Line(geometry, matDark)
        this.textErrorNum.add(lineMesh)
      }

      this.instance.add(this.textErrorNum)

      //
      // Text error
      //
      const matLite = new THREE.MeshBasicMaterial({
        color,
        transparent: true,
        opacity: 0.4,
        side: THREE.FrontSide,
      })

      const shapesError = font.generateShapes('ERROR', 3)
      const geometryError = new THREE.ShapeGeometry(shapesError)
      this.textError = new THREE.Mesh(geometryError, matLite)
      geometryError.computeBoundingBox()
      const xMidTextError =
        -0.5 *
        (geometryError.boundingBox.max.x - geometryError.boundingBox.min.x)
      this.textError.position.set(xMidTextError, -6, 0)
      this.instance.add(this.textError)
    })
  }

  resize() {
    this.instance.position.y = -getPositionOutOfScreen().y * 1.5
    if (this.inView) this.centerCamera(0)
  }

  //
  // Animation
  //
  entered() {
    this.inView = true
  }

  exit() {
    this.inView = false
  }

  //
  // centerCamera
  //
  centerCamera(duration = 1500) {
    const camera = this.WebGL.camera.instance
    const orbitControls = this.WebGL.camera.orbitControls

    anime({
      targets: camera.position,
      x: this.instance.position.x,
      y: -7,
      z: 10,
      easing: 'easeOutQuart',
      duration,
    })
    anime({
      targets: orbitControls.target,
      ...this.instance.position,
      easing: 'easeOutQuart',
      duration,
    })
  }
}
