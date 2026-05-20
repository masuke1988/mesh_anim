import { PerspectiveCamera, Scene, AmbientLight, DirectionalLight, WebGPURenderer, Color } from 'three/webgpu'

class WebGL {
  camera: PerspectiveCamera
  scene: Scene
  renderer: WebGPURenderer

  constructor() {
    const { width, height, aspect } = this.size

    // シーン
    this.scene = new Scene()
    this.scene.background = new Color("#f0f0f0")

    // カメラ
    this.camera = new PerspectiveCamera(75, aspect, 0.01, 1000)
    this.camera.position.set(2, 1, 3)
    this.camera.updateProjectionMatrix()
    this.scene.add(this.camera)
    
    // レンダラー
    this.renderer = new WebGPURenderer({ antialias: true, alpha: true})
    this.renderer.setSize(width, height)
    this.renderer.setPixelRatio(window.devicePixelRatio)
    
    document.body.appendChild(this.renderer.domElement)
    
    this.init()
  }

  init() {
    this._light()
    this._renderer()
  }

  /**
   * ライトの設定
   */
  private _light() {
    const amlight = new AmbientLight(0xffffff, 1.0);
    this.scene.add(amlight)

    const dirLight = new DirectionalLight(0xff0000, 3.0);
    dirLight.position.set(100, 200, 100);
    this.scene.add(dirLight)

    const fillLight = new DirectionalLight(0xffffff, 1.5);
    fillLight.position.set(-200, 100, -200);
    this.scene.add(fillLight)
  }

  /**
   * レンダラーの設定
   */
  private _renderer() {
    this.renderer.renderAsync(this.scene, this.camera)
  }

  /**
   * サイズのゲッター
   */
  get size() { 
    const { innerWidth: width, innerHeight: height } = window
    return { width, height, aspect: width / height }
  }
}

export const gl = new WebGL()
