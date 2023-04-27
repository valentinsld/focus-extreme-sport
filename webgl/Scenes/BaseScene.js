import RAFManager from '../Utils/RAFManager.js'
import { MathUtils } from 'three'
import WebGL from '../index.js'

export default class BaseScene {
  static singleton

  constructor() {
    this.inView = false
    this.WebGL = new WebGL()
    this.assets = this.WebGL.assets

    this.timelineValue = 0
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
    const uid = MathUtils.generateUUID()

    RAFManager.add(uid, () => {
      if (this.timelineValue > value) {
        callback()
        RAFManager.remove(uid)
      }
    })
  }

  //
  // Event for scene
  //
  startScene() {
    console.log('You start the scene ' + this.scene.name);
  }

  destroyScene() {
    console.log('You destroy the scene ' + this.scene.name);
  }
}
