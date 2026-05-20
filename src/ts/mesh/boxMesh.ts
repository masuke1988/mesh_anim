import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader.js';
import { AnimationMixer, AnimationAction, LoopRepeat } from 'three/webgpu';


export async function boxMesh() {
  const loader = new GLTFLoader()
  const dracoLoader = new DRACOLoader();
  dracoLoader.setDecoderPath( '/draco/' );
  loader.setDRACOLoader( dracoLoader );
  const gltf = await loader.loadAsync("assets/model/anim_test.glb");
  const models = gltf.scene
  const mixer = new AnimationMixer(models);

  const actions: AnimationAction[] = []
  const durations: number[] = []

  gltf.animations.forEach((clip) => {
    const action = mixer.clipAction(clip)
    // 各クリップ固有の長さでループ
    action.loop = LoopRepeat
    // play()はmain.tsのセクション検知で制御する
    actions.push(action)
    durations.push(clip.duration)
    console.log(`clip: ${clip.name}, duration: ${clip.duration}s`)
  })

  return { mesh: models, mixer, actions, durations }
}