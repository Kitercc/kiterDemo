import * as THREE from 'three'
import * as TWEEN from '@tweenjs/tween.js'
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer'
import { isEqual } from 'lodash'
import { CSS3DRenderer } from 'three/examples/jsm/renderers/CSS3DRenderer'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'
import Stats from 'three/examples/jsm/libs/stats.module.js'
import { CSS2DRenderer, CSS2DObject } from 'three/examples/jsm/renderers/CSS2DRenderer'
import { message } from 'antd'
import { createAreaMapMesh, formatColor, getOffsetAndSclae, removeComponents, removeMaterial, resetFloatArea } from '.'

interface CreateThreeMapProps {
  el: HTMLDivElement
}

type MaterialObj = {
  sideMaterial: THREE.MeshPhongMaterial
  frontMaterial: THREE.MeshPhongMaterial
  justAreaLineMaterial: THREE.LineBasicMaterial
  backAreaLineMaterial: THREE.LineBasicMaterial
  subSideMaterial?: THREE.MeshPhongMaterial
  subFrontMaterial?: THREE.MeshPhongMaterial
  subJustAreaLineMaterial?: THREE.LineBasicMaterial
  subBackAreaLineMaterial?: THREE.LineBasicMaterial
}

export default class CreateThreeMap {
  el: HTMLDivElement
  width = 0
  height = 0
  mapData: any
  mapCache: Map<string, any>
  materialObj?: MaterialObj
  controllerChangeFn = this.cssRenderer.bind(this, 'controller')
  // threejs
  renderer?: THREE.WebGLRenderer // 渲染器
  scene?: THREE.Scene // 场景
  camera?: THREE.PerspectiveCamera // 相机
  controller?: OrbitControls // 控制器
  composer?: EffectComposer // 用作地图边界发光
  mapObj = new THREE.Object3D() // 地图容器  内含有  区块 区线 区标签
  mapGroud: THREE.Group = new THREE.Group() // 整个大容器  内涵子组件
  stats?: Stats // 性能监控
  selectObj?: THREE.Object3D // 鼠标移入选中
  css2dRenderer?: CSS2DRenderer // css 2d 渲染器
  css3dRenderer?: CSS3DRenderer
  clock = new THREE.Clock()
  animateConfig = { FPS: 30, time: 0, first: true }
  labelArr: HTMLDivElement[] = [] // 地区标签数组 用作切换地图时销毁 标签组件
  animateId?: number
  offset = { x: 0, y: 0 }
  scale = { x: 1, y: 1 }
  childComponentUpdataFn: { [key: string]: { fn: () => void; target: any } } = {}
  preAdcode: number | string = ''
  hasChildCom = {} // 保存显示的子组件 防止底图渲染不同步的问题
  isRIHRunning = true
  appearanceAnimate?: TWEEN.Tween<THREE.Vector3>
  isDestroy = false
  // 点击悬浮区域块
  floatAreaAnimate?: TWEEN.Tween<any>
  floatChilds: THREE.Object3D[] = []
  floatCode = ''
  ambientLight: any

  constructor(options: CreateThreeMapProps) {
    this.el = options.el
    this.width = 900
    this.height = 900
    this.mapCache = new Map()
    this.init()
  }
  async init() {
    this.initMaterial()
    await this.getMapInfo()

    // 渲染器
    this.renderer =
      this.renderer ||
      new THREE.WebGLRenderer({
        antialias: true,
        alpha: true,
        logarithmicDepthBuffer: true,
        precision: 'highp',
        preserveDrawingBuffer: false
      })
    this.renderer.setPixelRatio(window.devicePixelRatio)
    this.renderer.setSize(this.width, this.height)

    this.el.appendChild(this.renderer.domElement)

    this.renderer.setClearColor(0x000000, 0)

    // 场景
    this.scene = new THREE.Scene()

    this.buildAuxSystem()
    // 相机
    this.setCamera()
    //平行光
    this.setDirectionalLight()
    //控制器
    this.setController()
    //绘制地图
    this.drawMap()

    this.mapGroud.add(this.mapObj)

    this.scene.add(this.mapGroud)

    this.mapGroud.rotateX(-Math.PI / 2)
    console.log(this.scene)

    if (this.camera) this.renderer.render(this.scene, this.camera)
  }
  //相机
  setCamera() {
    if (this.scene) {
      const camera = this.camera || new THREE.PerspectiveCamera(60, this.width / this.height, 1, 2000)
      camera.position.set(0, 70, 40)
      camera.lookAt(this.scene.position)
      this.camera = camera
      this.camera.updateProjectionMatrix()
    }
  }
  //控制器
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

      const minDistance = 400,
        maxDistance = 300
      let min = minDistance,
        max = maxDistance
      if (minDistance > maxDistance) (min = maxDistance), (max = minDistance)
      // 向内缩放最小距离
      controller.minDistance = min
      // 向外缩放最大距离
      controller.maxDistance = max

      this.controller = controller

      this.controller.addEventListener('change', this.controllerChangeFn)
    }
  }
  //平行光
  setDirectionalLight() {
    if (this.scene) {
      const g = new THREE.DirectionalLight('#ffffff', 1)
      g.position.x = 60
      g.position.y = 60
      g.position.z = 100
      this.scene.add(g)
      const _ = new THREE.DirectionalLight('#ffffff', 0.4)
      _.position.x = -60
      _.position.y = 60
      _.position.z = 100
      _.rotateX(-Math.PI / 2)
      this.scene.add(_)
      const v = new THREE.AmbientLight('#ffffff', 0.3)
      this.scene.add(v)
    }
  }

  // 性能检测器
  initStats() {
    const stats = new Stats()
    document.body.appendChild(stats.dom)
  }

  //坐标系
  buildAuxSystem() {
    const axisHelper = new THREE.AxesHelper(2000)
    this.scene?.add(axisHelper)
    // const gridHelper = new THREE.GridHelper(600, 60)
    // this.scene?.add(gridHelper)
  }

  // 获取geojson数据
  async getMapInfo() {
    try {
      this.mapData = await this.getData(`https://easyv.assets.dtstack.com/components/area/100000.json`)
    } catch (error) {
      message.error({
        content: 'adcode 错误',
        className: 'lcz-notice'
      })
    }
  }

  getData(url: string) {
    return new Promise((resolve, reject) => {
      if (this.mapCache.has(url)) {
        resolve(this.mapCache.get(url))
      } else {
        fetch(url)
          .then(request => request.json())
          .then(res => {
            this.mapCache.set(url, res)
            resolve(res)
          })
          .catch(error => reject(error))
      }
    })
  }

  drawMap(updataCamera = true) {
    try {
      if (this.mapData) {
        removeComponents(this.labelArr)
        this.labelArr = []
        if (!this.materialObj) this.initMaterial()

        // 建一个空对象存放对象
        if (this.mapObj.children.length) {
          const label = this.mapObj.getObjectByName('区标签')
          label && label.remove(...label.children)
          this.mapObj.remove(...this.mapObj.children)
          this.mapObj.clear()
        }

        const { offset, scale } = getOffsetAndSclae(this.mapData, this.width, this.height),
          areaBlockObj = this.mapObj.getObjectByName('区块') || new THREE.Object3D(),
          justAreaLineObj = this.mapObj.getObjectByName('正区线') || new THREE.Object3D(), // 正区线
          backAreaLineObj = this.mapObj.getObjectByName('反区线') || new THREE.Object3D(), // 反区线
          labelObj = this.mapObj.getObjectByName('区标签') || new THREE.Object3D(),
          depth = 1,
          showAreaLine: any = {}

        // 清理边线
        areaBlockObj.children.length && (areaBlockObj.remove(...areaBlockObj.children), areaBlockObj.clear())
        justAreaLineObj.children.length &&
          (justAreaLineObj.remove(...justAreaLineObj.children), justAreaLineObj.clear())
        backAreaLineObj.children.length &&
          (backAreaLineObj.remove(...backAreaLineObj.children), backAreaLineObj.clear())

        // 清除悬浮块
        resetFloatArea.call(this)

        // 控制上下边界的显示i
        showAreaLine.justAreaLineObj = justAreaLineObj

        showAreaLine.backAreaLineObj = backAreaLineObj

        this.offset = offset
        this.scale = scale

        const { sideMaterial, frontMaterial, justAreaLineMaterial, backAreaLineMaterial } =
          this.materialObj || ({} as MaterialObj)
        const lineMaterial: any = {
          justAreaLineMaterial,
          backAreaLineMaterial
        }

        for (let i = 0; i < this.mapData.features.length; i++) {
          const elem = this.mapData.features[i]
          // 定一个省份3D对象
          // 每个的 坐标 数组
          const properties = elem.properties || {},
            adcode = properties.adcode || properties.code

          if (!properties.name || (!properties.center && !properties.centroid)) continue

          const BufferGeometry = createAreaMapMesh.call(this, elem, {
            scale,
            depth,
            showAreaLine,
            lineMaterial
          })

          const mesh = new THREE.Mesh(BufferGeometry, [sideMaterial.clone(), frontMaterial.clone()])
          mesh.name = adcode
          mesh.castShadow = true
          mesh.receiveShadow = true
          mesh.layers.enable(1)
          Object.assign(mesh.userData, properties || {})

          areaBlockObj.add(mesh)
        }

        areaBlockObj.name = '区块'
        justAreaLineObj.name = '正区线'
        backAreaLineObj.name = '反区线'
        labelObj.name = '区标签'

        this.mapObj.add(areaBlockObj, justAreaLineObj, backAreaLineObj, labelObj)
        this.mapObj.position.x = offset.x * scale.x
        this.mapObj.position.y = offset.y * scale.y
      }
    } catch (error) {
      console.log('地图创建失败', error)
    }
  }

  initMaterial() {
    removeMaterial(this.materialObj || {})

    const sideMaterialOption: THREE.MeshPhongMaterialParameters = {
      color: formatColor('rgba(255,255,255,1)').color,
      transparent: true,
      opacity: 1
    }

    const sideMaterial = new THREE.MeshPhongMaterial(sideMaterialOption),
      frontMaterial = new THREE.MeshPhongMaterial({
        // 地图拉伸部分材质
        color: formatColor('rgba(255,255,255,1)').color,
        transparent: true,
        opacity: formatColor('rgba(255,255,255,1)').opacity
      }),
      justAreaLineMaterial = new THREE.LineBasicMaterial({
        // 正面线条材质
        color: formatColor('rgba(255,255,255,1)').color,
        transparent: true,
        linewidth: 1,
        opacity: formatColor('rgba(255,255,255,1)').opacity
      }),
      backAreaLineMaterial = new THREE.LineBasicMaterial({
        // 反面线条材质
        color: formatColor('rgba(255,255,255,1)').color,
        transparent: true,
        linewidth: 1,
        opacity: formatColor('rgba(255,255,255,1)').opacity
      })

    const materialObj: MaterialObj = {
      sideMaterial,
      frontMaterial,
      justAreaLineMaterial,
      backAreaLineMaterial
    }

    this.materialObj = materialObj
  }

  // 视图重新渲染
  LoadRenderer() {
    if (this.scene && this.camera && this.renderer) {
      this.controller && this.controller.update()
      this.camera && this.camera.updateMatrixWorld(true)
      this.renderer.setRenderTarget(null)
      this.renderer.clear()
      this.renderer.render(this.scene, this.camera)
      this.composer && this.composer.render()
    }
  }

  cssRenderer(up = 'all') {
    try {
      if (Object.keys(this.childComponentUpdataFn).length > 0 && (up === 'all' || up === 'controller')) return false

      const T = this.clock.getDelta()
      this.animateConfig.time = this.animateConfig.time + T
      if (up == 'all' || this.animateConfig.first || this.animateConfig.time > 1 / this.animateConfig.FPS) {
        setTimeout(() => {
          // 出场动画完成时
          if (this.appearanceAnimate?.isPlaying()) return false
          if (this.scene && this.camera) {
            this.css2dRenderer && this.css2dRenderer.render(this.scene, this.camera)
            this.css3dRenderer && this.css3dRenderer.render(this.scene, this.camera)
          }
          this.LoadRenderer()
          this.animateConfig.first = false
        })
        this.animateConfig.time = 0
        this.stats && this.stats.update()
      }
    } catch (error) {
      console.warn(error)
    }
  }
}
