import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import { DRACOLoader } from "three/examples/jsm/loaders/DRACOLoader.js";
import {
  AnimationMixer,
  AnimationAction,
  LoopRepeat,
  Object3DEventMap,
  Group,
} from "three/webgpu";

/**
 * ボックスメッシュを読み込み、メッシュに設定されたアニメーションを管理する関数
 * @returns { mesh: models, mixer, actions, durations }
 */
export async function boxMesh(): Promise<{
  mesh: Group<Object3DEventMap>;
  mixer: AnimationMixer;
  actions: AnimationAction[];
  durations: number[];
}> {
  // ローダー設定
  const loader = new GLTFLoader();
  const dracoLoader = new DRACOLoader();
  dracoLoader.setDecoderPath("/draco/");
  loader.setDRACOLoader(dracoLoader);

  // モデルの読み込み
  const gltf = await loader.loadAsync("assets/model/anim_test.glb");
  const models = gltf.scene;

  // アニメーションミキサーをインスタンス化
  const mixer = new AnimationMixer(models);

  // 動きを格納しておく配列
  const actions: AnimationAction[] = [];
  // アニメーション時間を格納しておく配列
  const durations: number[] = [];

  // モデルのアニメーション情報を配列に格納
  gltf.animations.forEach((clip) => {
    const action = mixer.clipAction(clip);
    // 各クリップ固有の長さでループ
    action.loop = LoopRepeat;

    // play()はmain.tsのセクション検知で制御する
    actions.push(action);
    durations.push(clip.duration);

    // デバック用
    console.log(actions);
    console.log(`clip: ${clip.name}, duration: ${clip.duration}s`);
  });

  // モデル、mixier、アニメーションに関する情報を返す
  return { mesh: models, mixer, actions, durations };
}
