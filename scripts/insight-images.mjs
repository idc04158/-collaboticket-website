import { imageAt, INSIGHT_IMAGE_POOL } from "./insight-image-pool.mjs"

/** @deprecated use insight-image-pool.mjs */
export const INSIGHT_IMAGES = INSIGHT_IMAGE_POOL

export function imageForIndex(index) {
  return imageAt(index)
}
