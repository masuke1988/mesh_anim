import { gl } from "./core/WebGL";
import { boxMesh } from "./mesh/boxMesh";
import { initGUI } from "./utils/gui";
import { axisHelper } from "./utils/axisHelper";
import { AnimationMixer, Clock, Box3, Vector3 } from "three/webgpu";
import type { AnimationAction } from "three";
import Lenis from "lenis";

export class App {
  cube: any;
  mixer: AnimationMixer | null = null;
  actions: AnimationAction[] = [];
  durations: number[] = [];
  lenis: Lenis;
  clock = new Clock();
  private _trackBox = new Box3();
  private _trackCenter = new Vector3();

  constructor() {
    gl.init();
    this.lenis = new Lenis();
    this._mesh();
    this._helper();
    this._setupSnap();
    this._init();

    initGUI(gl);
  }

  _init() {
    this._animate();
  }

  private async _mesh() {
    const { mesh, mixer, actions, durations } = await boxMesh();

    this.cube = mesh;
    this.mixer = mixer;
    this.actions = actions;
    this.durations = durations;
    gl.scene.add(this.cube);
    this._setupSectionAnimation();
  }

  // IntersectionObserver でセクションの進入を検知してアニメーションを切り替える
  private _setupSectionAnimation() {
    const sections = Array.from(
      document.querySelectorAll<HTMLElement>(".section"),
    );
    if (!sections.length || !this.actions.length) return;

    // ページロード時は最初のセクションを再生
    this._playAnimation(0);

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const idx = sections.indexOf(entry.target as HTMLElement);
            if (idx !== -1) this._playAnimation(idx);
          }
        });
      },
      { threshold: 0.5 },
    ); // セクションが50%以上見えたら発火

    sections.forEach((s) => observer.observe(s));
  }

  // 指定インデックスのアニメーションを先頭から再生（他は停止）
  private _playAnimation(idx: number) {
    if (!this.actions[idx]) return;
    this.actions.forEach((a) => a.stop());
    this.actions[idx].reset().play();
  }

  private _setupSnap() {
    const sections = Array.from(
      document.querySelectorAll<HTMLElement>(".section"),
    );
    if (!sections.length) return;

    // デバウンス処理用
    let snapTimer: ReturnType<typeof setTimeout> | null = null;

    this.lenis.on("scroll", () => {
      // スクロール中はタイマーをリセット
      if (snapTimer) clearTimeout(snapTimer);

      // スクロールが100ms止まったら最寄りセクションへスナップ
      snapTimer = setTimeout(() => {
        const scrollY = window.scrollY;
        const nearest = sections.reduce((prev, curr) =>
          Math.abs(curr.offsetTop - scrollY) <
          Math.abs(prev.offsetTop - scrollY)
            ? curr
            : prev,
        );
        this.lenis.scrollTo(nearest, { duration: 0.8 });
      }, 100);
    });
  }

  private _helper() {
    const helper = axisHelper();
    gl.scene.add(helper);
  }

  _update() {}

  _animate(time: number = 0) {
    requestAnimationFrame((t) => this._animate(t));
    this.lenis.raf(time);
    // 自動再生のため delta で mixer を更新
    const delta = this.clock.getDelta();
    this.mixer?.update(delta);
    // if (this.cube) {
    //   this.cube.updateMatrixWorld(true);
    //   this._trackBox.setFromObject(this.cube);
    //   this._trackBox.getCenter(this._trackCenter);
    //   gl.camera.lookAt(this._trackCenter);
    // }
    gl.renderer.renderAsync(gl.scene, gl.camera);
  }

  _resize() {
    const { width, height, aspect } = gl.size;
    gl.camera.aspect = aspect;
    gl.camera.updateProjectionMatrix();
    gl.renderer.setSize(width, height);
  }
}

export const app = new App();

window.addEventListener("resize", () => app._resize());
