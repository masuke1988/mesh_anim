import { GUI } from "dat.gui"

export function initGUI(gl: { camera: { position: any } }, params: { minDistance: number }) { 
  const gui = new GUI()

  gui.add(gl.camera.position, "x", -3, 3, 0.01).name("Camera X")
  gui.add(gl.camera.position, "y", -3, 3, 0.01).name("Camera Y")
  gui.add(gl.camera.position, "z", -3, 3, 0.01).name("Camera Z")

  return gui 
}