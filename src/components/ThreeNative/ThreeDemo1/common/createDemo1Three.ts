import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'
import Stats from 'three/examples/jsm/libs/stats.module.js'

import * as GeometryUtils from 'three/examples/jsm/utils/GeometryUtils.js'

interface CreateThreeMapProps {
  el: HTMLDivElement
}

export default class CreateDemo1Three {
  el: HTMLDivElement
  width = 0
  height = 0
  controllerChangeFn = this.cssRenderer.bind(this) //change
  objects: any[] = []
  renderer?: THREE.WebGLRenderer // 渲染器
  scene?: THREE.Scene // 场景
  camera?: THREE.PerspectiveCamera // 相机
  controller?: OrbitControls // 控制器
  stats?: Stats

  constructor(options: CreateThreeMapProps) {
    this.el = options.el
    this.width = 1200
    this.height = 900
    this.init()
  }
  async init() {
    //渲染器
    this.setRenderer()
    // 场景
    this.setScene()
    //相机
    this.setCamera()

    //视图渲染
    this.LoadRenderer()
    //控制器
    this.setController()
  }

  setRenderer() {
    this.renderer =
      this.renderer ||
      new THREE.WebGLRenderer({
        antialias: true,
        alpha: true,
        logarithmicDepthBuffer: true,
        precision: 'highp'
      })
    this.renderer.setPixelRatio(window.devicePixelRatio)
    this.renderer.setSize(this.width, this.height)
    this.el.appendChild(this.renderer.domElement)
    this.renderer.setClearColor(0x000000, 0)

    //监听器
    this.stats = new Stats()
    this.el.appendChild(this.stats.dom)
  }

  setScene() {
    this.scene = this.scene || new THREE.Scene()
    this.scene.background = new THREE.Color(0x111111) //背景

    // //创建一个长方体几何对象Geometry
    // const geometry = new THREE.BoxGeometry(100, 100, 100)

    // const material = new THREE.MeshBasicMaterial({
    //   color: 0xff0000 //0xff0000设置材质颜色为红色
    // })

    // const mesh = new THREE.Mesh(geometry, material) //网格模型对象Mesh

    // //设置网格模型在三维空间中的位置坐标，默认是坐标原点
    // mesh.position.set(0, 10, 0)

    // this.scene.add(mesh)

    this.scene.add(new THREE.AmbientLight(0x999999))

    const subdivisions = 6
    const recursion = 1

    const points = GeometryUtils.hilbert3D(new THREE.Vector3(0, 0, 0), 25.0, recursion, 0, 1, 2, 3, 4, 5, 6, 7)
    const spline = new THREE.CatmullRomCurve3(points)

    const samples = spline.getPoints(points.length * subdivisions)
    const geometrySpline = new THREE.BufferGeometry().setFromPoints(samples)

    const line = new THREE.Line(
      geometrySpline,
      new THREE.LineDashedMaterial({ color: 0xffffff, dashSize: 1, gapSize: 0.5 })
    )
    line.computeLineDistances()

    this.objects.push(line)
    this.scene.add(line)
    const geometryBox = this.box(50, 50, 50)

    const lineSegments = new THREE.LineSegments(
      geometryBox,
      new THREE.LineDashedMaterial({ color: 0xffaa00, dashSize: 3, gapSize: 1 })
    )
    lineSegments.computeLineDistances()

    this.objects.push(lineSegments)
    this.scene.add(lineSegments)

    const time = Date.now() * 0.001
    this.scene.traverse(function (object: any) {
      if (object.isLine) {
        object.rotation.x = 0.25 * time
        object.rotation.y = 0.25 * time
      }
    })
  }

  setCamera() {
    if (this.scene) {
      const camera = this.camera || new THREE.PerspectiveCamera(60, this.width / this.height, 1, 3000)
      camera.position.set(100, 100, 100)
      camera.lookAt(this.scene.position)
      this.camera = camera
      this.camera.updateProjectionMatrix()
    }
  }

  setController() {
    if (this.camera && this.renderer) {
      this.controller && this.controller.removeEventListener('change', this.controllerChangeFn)
      const controller = this.controller || new OrbitControls(this.camera, this.renderer.domElement)

      // 是否可拖动
      controller.enableRotate = true
      controller.rotateSpeed = 2
      controller.maxPolarAngle = Math.PI / 2

      // 鼠标滚轮放大缩小
      controller.enableZoom = true

      this.controller = controller
      this.controller.addEventListener('change', this.controllerChangeFn)
    }
  }

  cssRenderer() {
    this.LoadRenderer()
  }

  LoadRenderer() {
    if (this.scene && this.camera && this.renderer && this.stats) {
      this.camera && this.camera.updateMatrixWorld(true)
      this.renderer.setRenderTarget(null)
      this.renderer.clear()

      this.renderer.render(this.scene, this.camera)
      this.stats.update()
    }
  }

  destroyed() {
    // 控制器 渲染器清除
    this.camera?.clear()
    this.controller?.dispose()
    this.camera?.remove()

    this.scene?.remove()
    if (this.renderer) {
      this.renderer.forceContextLoss()
      this.renderer.dispose()
      this.renderer.domElement.remove()
      // @ts-ignore
      this.renderer.domElement = this.renderer = null
    }
  }

  box(width: number, height: number, depth: number) {
    ;(width = width * 0.5), (height = height * 0.5), (depth = depth * 0.5)

    const geometry = new THREE.BufferGeometry()
    const position = []

    position.push(
      -width,
      -height,
      -depth,
      -width,
      height,
      -depth,

      -width,
      height,
      -depth,
      width,
      height,
      -depth,

      width,
      height,
      -depth,
      width,
      -height,
      -depth,

      width,
      -height,
      -depth,
      -width,
      -height,
      -depth,

      -width,
      -height,
      depth,
      -width,
      height,
      depth,

      -width,
      height,
      depth,
      width,
      height,
      depth,

      width,
      height,
      depth,
      width,
      -height,
      depth,

      width,
      -height,
      depth,
      -width,
      -height,
      depth,

      -width,
      -height,
      -depth,
      -width,
      -height,
      depth,

      -width,
      height,
      -depth,
      -width,
      height,
      depth,

      width,
      height,
      -depth,
      width,
      height,
      depth,

      width,
      -height,
      -depth,
      width,
      -height,
      depth
    )

    geometry.setAttribute('position', new THREE.Float32BufferAttribute(position, 3))

    return geometry
  }
}
