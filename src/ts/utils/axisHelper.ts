import { AxesHelper } from "three/webgpu"

export function axisHelper() {
  const helper = new AxesHelper(5)
  return helper
}